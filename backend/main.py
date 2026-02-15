from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from geo_predict import predict_geo_file
from meo_predict import predict_meo

app = FastAPI(title="EPHEMRA GEO + MEO Backend")

# Allow frontend (Next.js) to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running!"}

@app.post("/predict/geo")
async def geo_route(file: UploadFile = File(...)):
    return await predict_geo_file(file)

@app.post("/predict/meo")
async def meo_route(file: UploadFile = File(...)):
    return await predict_meo(file)
