"""
PHASE 2 — FINAL STABLE GEO TRANSFORMER (Keras 3 Safe)

✔ Serializable custom layers
✔ Chunked autoregressive forecasting
✔ Gaussian NLL loss
✔ Compatible with TF 2.16 + Keras 3
"""

# =========================
# IMPORTS
# =========================
import os
import numpy as np
import pandas as pd
import joblib

import tensorflow as tf
from keras.saving import register_keras_serializable
from tensorflow.keras.layers import (
    Dense, Dropout, LayerNormalization,
    MultiHeadAttention, Input, Reshape
)
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.preprocessing import StandardScaler
from scipy.stats.mstats import winsorize

# =========================
# CONFIG
# =========================
CSV_PATH = "../DATA_GEO_Train.csv"   # IMPORTANT FIX
MODEL_DIR = "models_geo_phase2"
os.makedirs(MODEL_DIR, exist_ok=True)

LOOKBACK = 96
FORECAST = 96
CHUNK = 16
D_MODEL = 64
NUM_HEADS = 4
D_FF = 128
NUM_LAYERS = 2
DROP_RATE = 0.25

BATCH_SIZE = 16
EPOCHS = 80
BASE_LR = 1e-3
EPS = 1e-6
WINSOR_LIMIT = 0.005

# =========================
# PREPROCESSING
# =========================
def hampel_filter(series, window=48, n_sigmas=2.5):
    s = pd.Series(series).copy()
    rm = s.rolling(window, center=True).median()
    diff = (s - rm).abs()
    mad = diff.rolling(window, center=True).median()
    threshold = n_sigmas * mad
    s[diff > threshold] = rm[diff > threshold]
    return s.values


def preprocess_data(csv_path):
    print("Loading CSV and preprocessing...")
    df = pd.read_csv(csv_path)
    df["utc_time"] = pd.to_datetime(df["utc_time"])
    df = df.set_index("utc_time").sort_index()

    df15 = df.resample("15min").mean().interpolate("time").ffill().bfill()

    for col in df15.columns:
        df15[col] = hampel_filter(df15[col])
        df15[col] = np.asarray(
            winsorize(df15[col], limits=(WINSOR_LIMIT, WINSOR_LIMIT)),
            dtype=float
        )

    print("Preprocessed shape:", df15.shape)
    return df15


# =========================
# WINDOW CREATION (FIXED)
# =========================
def create_windows_chunk(data, lookback=96, chunk=16):
    X, Y = [], []
    for i in range(len(data) - lookback - chunk + 1):
        X.append(data[i : i + lookback])
        Y.append(data[i + lookback : i + lookback + chunk])
    return np.array(X), np.array(Y)


# =========================
# LOSS
# =========================
def gaussian_nll(y_true, y_pred):
    mu = y_pred[..., 0]
    raw_sigma = y_pred[..., 1]
    sigma = tf.nn.softplus(raw_sigma) + EPS
    var = sigma ** 2
    return tf.reduce_mean(
        0.5 * tf.math.log(2.0 * np.pi * var)
        + (y_true - mu) ** 2 / (2.0 * var)
    )


# =========================
# CUSTOM LAYERS (SERIALIZABLE)
# =========================
@register_keras_serializable()
class PositionalEncoding(tf.keras.layers.Layer):
    def __init__(self, seq_len=LOOKBACK, d_model=D_MODEL, **kwargs):
        super().__init__(**kwargs)
        pos = np.arange(seq_len)[:, None]
        i = np.arange(d_model)[None, :]
        angle_rates = 1 / np.power(10000, (2 * (i // 2)) / np.float32(d_model))
        angles = pos * angle_rates
        angles[:, 0::2] = np.sin(angles[:, 0::2])
        angles[:, 1::2] = np.cos(angles[:, 1::2])
        self.pe = tf.constant(angles[None, ...], dtype=tf.float32)

    def call(self, x):
        return x + self.pe


@register_keras_serializable()
class TransformerBlock(tf.keras.layers.Layer):
    def __init__(self, d_model, num_heads, d_ff, dropout_rate, **kwargs):
        super().__init__(**kwargs)
        self.att = MultiHeadAttention(num_heads=num_heads, key_dim=d_model)
        self.ffn = tf.keras.Sequential([
            Dense(d_ff, activation="relu"),
            Dense(d_model)
        ])
        self.norm1 = LayerNormalization(epsilon=1e-6)
        self.norm2 = LayerNormalization(epsilon=1e-6)
        self.drop = Dropout(dropout_rate)

    def call(self, x, training=False):
        attn = self.att(x, x, training=training)
        x = self.norm1(x + self.drop(attn, training=training))
        ffn = self.ffn(x)
        return self.norm2(x + self.drop(ffn, training=training))


# =========================
# MODEL
# =========================
def build_model(n_features):
    inputs = Input(shape=(LOOKBACK, n_features))
    x = Dense(D_MODEL)(inputs)
    x = PositionalEncoding()(x)

    for _ in range(NUM_LAYERS):
        x = TransformerBlock(D_MODEL, NUM_HEADS, D_FF, DROP_RATE)(x)

    x = Dense(D_MODEL, activation="relu")(x)
    x = Dropout(DROP_RATE)(x)

    x = x[:, -1, :]
    x = Dense(CHUNK * n_features * 2)(x)
    outputs = Reshape((CHUNK, n_features, 2))(x)

    return Model(inputs, outputs)


# =========================
# TRAINING
# =========================
def main():
    print("Starting GEO Phase-2 training...")

    df = preprocess_data(CSV_PATH)
    features = df.columns.tolist()
    n_feats = len(features)

    scaler = StandardScaler()
    scaled = scaler.fit_transform(df.values)
    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))

    X, Y = create_windows_chunk(scaled, LOOKBACK, CHUNK)

    split = int(len(X) * 0.8)
    X_train, X_val = X[:split], X[split:]
    Y_train, Y_val = Y[:split], Y[split:]

    model = build_model(n_feats)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(BASE_LR),
        loss=gaussian_nll
    )

    callbacks = [
        EarlyStopping(patience=6, restore_best_weights=True),
        ModelCheckpoint(
            os.path.join(MODEL_DIR, "phase2_best.keras"),
            save_best_only=True
        )
    ]

    model.fit(
        X_train, Y_train,
        validation_data=(X_val, Y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        callbacks=callbacks,
        verbose=2
    )

    model.save(os.path.join(MODEL_DIR, "phase2_final.keras"))
    print("GEO Phase-2 Training Completed.")


if __name__ == "__main__":
    main()
