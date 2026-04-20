#!/usr/bin/env sh
set -e

MODEL_DIR="/app/fastapi_artifacts"
MODEL_PATH="$MODEL_DIR/ensemble_bundle.pth"

echo "===== START.SH RUNNING ====="
echo "PORT: ${PORT:-8000}"

mkdir -p "$MODEL_DIR"

echo "Before download:"
ls -lah "$MODEL_DIR" || true

if [ -z "$GDRIVE_FILE_ID" ]; then
  echo "ERROR: GDRIVE_FILE_ID is not set"
  exit 1
fi

if [ ! -f "$MODEL_PATH" ]; then
  echo "Model not found. Downloading from Google Drive..."
  python -m gdown "https://drive.google.com/uc?id=${GDRIVE_FILE_ID}" -O "$MODEL_PATH"
else
  echo "Model already exists at $MODEL_PATH"
fi

echo "After download:"
ls -lah "$MODEL_DIR" || true

if [ ! -f "$MODEL_PATH" ]; then
  echo "ERROR: Model file still not found after download"
  exit 1
fi

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"