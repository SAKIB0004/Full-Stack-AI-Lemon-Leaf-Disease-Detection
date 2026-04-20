"""
app.py
FastAPI server for Lemon Leaf Disease Classification.

Start: uvicorn app:app --host 0.0.0.0 --port 8000
Docs:  http://localhost:8000/docs
"""

from contextlib import asynccontextmanager
from pathlib import Path
import io

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image

from .inference import load_model, predict as run_predict

# ── Paths ─────────────────────────────────────────────────────────────────────
from pathlib import Path

BUNDLE_PATH = Path(__file__).resolve().parent.parent / "fastapi_artifacts" / "ensemble_bundle.pth"

# ── Global model state (loaded once at startup) ───────────────────────────────
MODEL = None
META  = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup, release on shutdown."""
    global MODEL, META
    MODEL, META = load_model(str(BUNDLE_PATH))
    print("Model ready for inference.")
    yield
    MODEL = None
    META  = None


# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title       = "Lemon Leaf Disease Classifier",
    description = "Weighted ensemble: ResNet50 + EfficientNet-B0 + MobileNetV2 + DenseNet121",
    version     = "1.0.0",
    lifespan    = lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allows the Next.js frontend (localhost:3000) to call this API.
# For production, replace the origins list with your actual frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",       # Next.js dev server
        "http://127.0.0.1:3000",      # alternate localhost form
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "status"  : "ok",
        "model"   : "lemon-leaf-weighted-ensemble",
        "classes" : META["class_names"],
    }


@app.get("/health")
def health():
    return {
        "status"       : "healthy",
        "model_loaded" : MODEL is not None,
        "num_classes"  : META["num_classes"] if META else None,
        "model_names"  : META["model_names"] if META else None,
    }


@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    """
    Upload a leaf image (jpg/png) and get the disease prediction.

    Returns:
        predicted_class     : most likely disease class
        confidence          : probability of predicted class (0-1)
        class_probabilities : full probability for each class
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code = 400,
            detail      = f"File must be an image. Got: {file.content_type}"
        )

    try:
        contents = await file.read()
        image    = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(
            status_code = 400,
            detail      = f"Could not open image: {str(e)}"
        )

    result = run_predict(MODEL, META, image)

    return JSONResponse(content={
        "filename"            : file.filename,
        "predicted_class"     : result["predicted_class"],
        "confidence"          : result["confidence"],
        "class_probabilities" : result["class_probabilities"],
    })