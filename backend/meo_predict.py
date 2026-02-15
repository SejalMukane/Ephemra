# main.py
import os
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import torch
import torch.nn as nn
from datetime import timedelta
import io

# -----------------------------
# Model architecture (same as training)
# -----------------------------
class TransformerForecast(nn.Module):
    def __init__(self, seq_len, pred_len, n_features, d_model=128, num_layers=3, nhead=4):
        super().__init__()
        self.seq_len = seq_len
        self.pred_len = pred_len
        
        self.input_proj = nn.Linear(n_features, d_model)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model, 
            nhead=nhead, 
            batch_first=True
        )
        self.encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)

        self.gru = nn.GRU(d_model, d_model, batch_first=True)
        self.output_layer = nn.Linear(d_model, n_features)

    def forward(self, x, teacher_forcing=False, y_future=None, teacher_prob=0.0):
        B = x.size(0)
        
        enc_in = self.input_proj(x)
        memory = self.encoder(enc_in)

        dec_input = memory[:, -1:, :]
        outputs = []
        hidden = None

        for t in range(self.pred_len):
            out, hidden = self.gru(dec_input, hidden)
            pred = self.output_layer(out)
            outputs.append(pred)

            dec_input = self.input_proj(pred)

        return torch.cat(outputs, dim=1)

# -----------------------------
# Config
# -----------------------------
MODEL_DIR = "models_meo_phase2"
MODEL_PATH = os.path.join(MODEL_DIR, "meo_best_model.pt")

SEQ_LEN = 96
PRED_LEN = 96
N_FEATURES = 4

DEVICE = "cpu"

# -----------------------------
# Load model
# -----------------------------
model = TransformerForecast(seq_len=SEQ_LEN, pred_len=PRED_LEN, n_features=N_FEATURES)
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
# if saved state_dict has 'model' or wrapped in ddp, handle accordingly
if "state_dict" in state_dict and isinstance(state_dict["state_dict"], dict):
    state_dict = state_dict["state_dict"]
model.load_state_dict(state_dict)
model.to(DEVICE)
model.eval()

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="MEO Prediction API")

# Allow local dev CORS from Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REQUIRED_COLS = ["utc_time", "x_error (m)", "y_error (m)", "z_error (m)", "satclockerror (m)"]

def ensure_required_columns(df: pd.DataFrame):
    for col in REQUIRED_COLS:
        if col not in df.columns:
            raise HTTPException(status_code=400, detail=f"Missing required column: {col}")

@app.post("/predict/meo")
async def predict_meo(file: UploadFile = File(...)):
    # read file into pandas
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read CSV: {e}")

    ensure_required_columns(df)

    # parse utc_time
    try:
        df["utc_time"] = pd.to_datetime(df["utc_time"])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse utc_time column: {e}")

    if len(df) < SEQ_LEN:
        raise HTTPException(status_code=400, detail=f"Need at least {SEQ_LEN} rows of data (found {len(df)})")

    # compute interval using last two timestamps (works for regular sampling)
    if len(df) < 2:
        raise HTTPException(status_code=400, detail="Need at least two rows to infer sampling interval")
    last_ts = df["utc_time"].iloc[-1]
    prev_ts = df["utc_time"].iloc[-2]
    interval = last_ts - prev_ts
    if interval.total_seconds() <= 0:
        raise HTTPException(status_code=400, detail="Invalid time ordering in utc_time column")

    # extract last sequence of features for model input
    feat_cols = ["x_error (m)", "y_error (m)", "z_error (m)", "satclockerror (m)"]
    last_seq_df = df.iloc[-SEQ_LEN:][feat_cols].astype(float)
    x = torch.tensor(last_seq_df.values, dtype=torch.float32).unsqueeze(0).to(DEVICE)  # shape (1, seq_len, n_features)

    with torch.no_grad():
        preds = model(x)  # expected shape (1, pred_len, n_features)
    preds_np = preds.cpu().numpy()[0]  # (pred_len, n_features)

    # generate future timestamps: next PRED_LEN intervals
    future_timestamps = [(last_ts + interval * (i + 1)).isoformat() for i in range(PRED_LEN)]

    # convert to plain python lists
    prediction_list = preds_np.tolist()

    return {"prediction": prediction_list, "timestamps": future_timestamps}
