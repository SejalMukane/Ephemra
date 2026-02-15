import io
import os
import sys
import numpy as np
import pandas as pd
import joblib
from fastapi import UploadFile, HTTPException
from scipy.stats.mstats import winsorize

import tensorflow as tf

# =====================================================
# PATH FIX (IMPORTANT FOR UVICORN)
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

# =====================================================
# IMPORT CUSTOM OBJECTS (MUST MATCH TRAINING)
# =====================================================
from geo_transformers import (
    PositionalEncoding,
    TransformerBlock,
    gaussian_nll,
)

# =====================================================
# CONSTANTS
# =====================================================
LOOKBACK = 96
FORECAST = 96
CHUNK = 16
WINSOR_LIMIT = 0.005

MODEL_PATH = os.path.join(BASE_DIR, "models_geo_phase2", "phase2_best.keras")
SCALER_PATH = os.path.join(BASE_DIR, "models_geo_phase2", "scaler.pkl")

# =====================================================
# LOAD MODEL (ONCE AT STARTUP)
# =====================================================
print("🔵 Loading GEO Phase-2 model...")

try:
    model = tf.keras.models.load_model(
        MODEL_PATH,
        custom_objects={
            "PositionalEncoding": PositionalEncoding,
            "TransformerBlock": TransformerBlock,
            "gaussian_nll": gaussian_nll,
        },
        compile=False
    )
    print("✅ GEO model loaded successfully.")
except Exception as e:
    print("❌ GEO model loading failed:")
    raise e

# Load scaler
scaler = joblib.load(SCALER_PATH)

# =====================================================
# PREPROCESSING
# =====================================================
def hampel_filter(series, window=48, n_sigmas=2.5):
    s = pd.Series(series).copy()
    rm = s.rolling(window=window, center=True).median()
    abs_dev = (s - rm).abs()
    rmad = abs_dev.rolling(window=window, center=True).median()
    threshold = n_sigmas * rmad
    s[abs_dev > threshold] = rm[abs_dev > threshold]
    return s.values


def preprocess_geo(df: pd.DataFrame) -> pd.DataFrame:
    if "utc_time" not in df.columns:
        raise HTTPException(status_code=400, detail="CSV must contain utc_time column")

    df["utc_time"] = pd.to_datetime(df["utc_time"])
    df = df.set_index("utc_time").sort_index()

    df15 = (
        df.resample("15min")
        .mean()
        .interpolate(method="time")
        .ffill()
        .bfill()
    )

    for col in df15.columns:
        df15[col] = hampel_filter(df15[col])
        df15[col] = np.asarray(
            winsorize(df15[col], limits=(WINSOR_LIMIT, WINSOR_LIMIT)),
            dtype=float
        )

    return df15


# =====================================================
# AUTOREGRESSIVE FORECASTING
# =====================================================
def autoregressive_geo(last_scaled: np.ndarray, n_feats: int) -> np.ndarray:
    curr = last_scaled.reshape(1, LOOKBACK, n_feats)
    outputs = []

    for _ in range(FORECAST // CHUNK):
        pred = model.predict(curr, verbose=0)
        mu = pred[0, :, :, 0]  # (CHUNK, n_feats)
        outputs.append(mu)

        curr = np.concatenate(
            [curr[:, CHUNK:, :], mu.reshape(1, CHUNK, n_feats)],
            axis=1
        )

    return np.concatenate(outputs, axis=0)


# =====================================================
# FASTAPI ENTRYPOINT
# =====================================================
async def predict_geo_file(file: UploadFile):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file")

    df15 = preprocess_geo(df)

    if len(df15) < LOOKBACK:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum {LOOKBACK} timesteps required"
        )

    features = df15.columns.tolist()
    n_feats = len(features)

    last = df15.values[-LOOKBACK:]
    scaled_last = scaler.transform(last)

    pred_scaled = autoregressive_geo(scaled_last, n_feats)
    pred = scaler.inverse_transform(pred_scaled)

    times = [
        df15.index[-1] + pd.Timedelta(minutes=15 * (i + 1))
        for i in range(FORECAST)
    ]

    out_df = pd.DataFrame(pred, columns=features)
    out_df.insert(0, "utc_time", times)

    return {
        "model": "GEO Phase-2 Transformer",
        "forecast_steps": FORECAST,
        "prediction": out_df.to_dict(orient="records")
    }
