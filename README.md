# 🌌 EPHEMRA — AI Prediction of GNSS Satellite Clock & Ephemeris Errors

AI/ML-based system aligned with **ISRO Problem Statement 25176**  
Predicting time-varying GNSS satellite clock & orbit error build-up using Transformer models.

---

## 🛰️ Problem Statement (ISRO)

**Goal:**  
Predict the time-varying error build-up between uploaded and modeled values of:

- Satellite Clock Bias
- Satellite Ephemeris (Orbit)

These errors directly affect **navigation accuracy and timing precision**.

---

# 🌠 Application Preview

## 🏠 Landing Experience

![Hero](assets/hero.png)

EPHEMRA provides an interactive research dashboard to analyze and forecast satellite error behavior.

---

## 🛰️ Orbit Selection Interface

![Orbit Selection](assets/orbit-select.png)

Users can choose between:

- **MEO Constellation** – GNSS navigation satellites  
- **GEO Constellation** – Geostationary satellites  

---

## 📊 MEO Orbital Analysis Dashboard

![MEO Dashboard](assets/meo-dashboard.png)

Features:

- Positional deviation plots (Radial / Along-Track / Cross-Track)
- Satellite clock bias prediction
- Residual diagnostics
- Ephemeris log export

---

## 🌍 GEO Orbital Analysis Dashboard

![GEO Dashboard](assets/geo-dashboard.png)

Includes:

- Drift monitoring
- Error component tracking
- Clock error analysis
- Statistical error logging

---

# 🎯 Project Objective

EPHEMRA predicts the error growth between:

📡 Uploaded broadcast parameters  
📐 Modeled ICD parameters  

for satellites operating in:

- **MEO (Medium Earth Orbit)**
- **GEO / GSO (Geostationary Orbit)**

Predictions generated every **15 minutes up to 24 hours ahead**.

---

# 🧠 AI/ML Approach

## Models Implemented

- 🔁 Transformer-based time series forecasting
- 📊 Deep learning sequential models
- ⏱️ Long-horizon prediction (15min → 24hr)

Why Transformers?

Satellite error propagation has **long-range temporal dependencies**, making Transformers ideal.

---

# 📊 Prediction Horizons

| Horizon | Supported |
|---|---|
| 15 minutes | ✅ |
| 30 minutes | ✅ |
| 1 hour | ✅ |
| 2 hours | ✅ |
| 24 hours | ✅ |

Training: **7 days data**  
Prediction target: **Unseen 8th day**

---

# 🏗️ Architecture

```
Frontend (Next.js Dashboard)
        ↓
FastAPI Inference API
        ↓
Transformer Models (TensorFlow)
        ↓
GNSS Ephemeris Dataset
```

---

# ⚙️ Tech Stack

## Backend (ML & API)

- Python 3.9+
- FastAPI
- NumPy & Pandas
- TensorFlow / Keras
- Custom Transformer Models

## Frontend (Dashboard)

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Research-style visualization UI

---

# 📈 Evaluation (ISRO Criteria)

Model performance measured by:

- Prediction accuracy across horizons
- Gaussian distribution of residuals
- Long-term prediction stability
- Statistical consistency

---

# ✨ Key Features

- GEO & MEO separate pipelines
- Transformer long-horizon forecasting
- API-driven inference
- Research visualization dashboard
- Expandable to probabilistic forecasting

---

# 🔮 Future Work

- Probabilistic uncertainty estimation
- GAN-based error synthesis
- Cloud inference pipeline
- Real-time GNSS ingestion
- Research paper publication

---

# 👩‍🚀 Author

**Sejal Mukane**  
AI/ML Engineer — Space Technology & Scientific ML

Focus: GNSS • Time-Series Forecasting • Research Systems

---

# ⭐ Conclusion

EPHEMRA demonstrates how modern AI and Transformer models can improve GNSS navigation reliability and directly support **ISRO’s real-world satellite navigation challenges.**
