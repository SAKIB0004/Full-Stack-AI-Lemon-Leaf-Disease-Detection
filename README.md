# Lemon Leaf Disease Detection

A full-stack AI application for detecting and classifying lemon leaf diseases from uploaded images using deep learning.

---

## Overview

This project allows users to upload a lemon leaf image through a web interface and receive a disease prediction with confidence scores. It combines:

* a **FastAPI backend** for model inference
* a **Next.js frontend** for the user interface
* a **deep learning classification model**
* **Docker Compose** for running the full stack locally
* a **research notebook** for training and experimentation

---

## Problem Statement

Lemon leaf diseases can reduce plant health and crop quality if they are not identified early. Manual identification can be slow and inconsistent. This project provides a simple AI-based system that helps classify lemon leaf diseases from images in a faster and more accessible way.

---

## Features

* Upload lemon leaf images from the frontend
* Predict leaf disease using a trained deep learning model
* View confidence score and class probabilities
* FastAPI backend with clear API endpoints
* Next.js frontend with responsive UI
* Docker support for running backend and frontend together
* Research notebook for model training and experimentation

---

## Tech Stack

### Backend

* FastAPI
* Python
* PyTorch
* Pillow

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* React

### DevOps

* Docker
* Docker Compose
* GitHub Actions

### Research

* Jupyter Notebook
* Kaggle / experimentation workflow

---

## Project Structure

```text
LEMON LEAF DISEASE DETECTION/
├─ backend/
│  ├─ app/
│  │  ├─ __init__.py
│  │  ├─ inference.py
│  │  └─ main.py
│  ├─ fastapi_artifacts/
│  │  ├─ class_names.json
│  │  ├─ ensemble_bundle.pth
│  │  └─ inference_config.json
│  ├─ .dockerignore
│  ├─ .env.example
│  ├─ Dockerfile
│  ├─ requirements.txt
│  └─ start.sh
│
├─ frontend/
│  ├─ app/
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ Footer.tsx
│  │  ├─ Header.tsx
│  │  ├─ HealthBadge.tsx
│  │  └─ ResultCard.tsx
│  ├─ lib/
│  │  └─ api.ts
│  ├─ types/
│  │  └─ api.ts
│  ├─ .env.example
│  ├─ Dockerfile
│  ├─ package.json
│  └─ tsconfig.json
│
├─ research/
│  └─ notebooks/
│     └─ lemon-leaf-disease-kaggle-final.ipynb
│
├─ .github/
│  └─ workflows/
│     ├─ backend-ci.yml
│     └─ frontend-ci.yml
│
├─ docker-compose.yml
└─ README.md
```

---

## How It Works

1. The user uploads a lemon leaf image from the frontend
2. The frontend sends the image to the FastAPI backend
3. The backend preprocesses the image
4. The trained model performs inference
5. The backend returns:

   * predicted class
   * confidence score
   * class probabilities
6. The frontend displays the result in a clean UI

---

## Local Development Setup

### Prerequisites

Make sure these are installed:

* Python 3.10+
* Node.js 18+ or 20+
* npm
* Docker Desktop
* Git

---

## Run the Backend Locally

```bash
cd backend
python -m venv .venv
```

### Activate virtual environment

#### Windows

```bash
.venv\Scripts\activate
```

#### macOS / Linux

```bash
source .venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Start FastAPI

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Backend URLs

* API Root: `http://localhost:8000`
* Health Check: `http://localhost:8000/health`
* Swagger Docs: `http://localhost:8000/docs`

---

## Run the Frontend Locally

```bash
cd frontend
npm install
```

### Create environment file

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Start frontend

```bash
npm run dev
```

### Frontend URL

* Frontend App: `http://localhost:3000`

---

## Run Full Stack with Docker Compose

From the project root:

```bash
docker compose up --build
```

### Services

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:8000`
* Backend Docs: `http://localhost:8000/docs`
* Health Check: `http://localhost:8000/health`

### Stop containers

```bash
docker compose down
```

### Rebuild from scratch

```bash
docker compose down
docker compose up --build
```

> Note: If your backend uses a large model file, the first startup may take time depending on how the model is loaded or downloaded.

---

## API Endpoints

### `GET /`

Returns basic API information.

### `GET /health`

Checks whether the backend is running and whether the model is loaded.

### `POST /predict`

Accepts an uploaded image file and returns prediction results.

#### Request

* Content-Type: `multipart/form-data`
* Field name: `file`

#### Example Response

```json
{
  "filename": "leaf.jpg",
  "predicted_class": "Citrus Canker",
  "confidence": 0.94,
  "class_probabilities": {
    "Anthracnose": 0.01,
    "Bacterial Blight": 0.02,
    "Citrus Canker": 0.94,
    "Curl Virus": 0.01,
    "Deficiency Leaf": 0.00,
    "Dry Leaf": 0.00,
    "Healthy Leaf": 0.01,
    "Sooty Mould": 0.00,
    "Spider Mites": 0.01
  }
}
```

---

## Model and Inference

The backend uses a trained image classification model for lemon leaf disease prediction.

### Model files

Located in:

```text
backend/fastapi_artifacts/
```

Important files:

* `ensemble_bundle.pth`
* `class_names.json`
* `inference_config.json`

### Inference flow

* load trained model at startup
* preprocess uploaded image
* run prediction
* return class probabilities and confidence score

> For deployment, large model files may need to be downloaded externally or handled separately from the main GitHub repository.

---

## Research Notebook

Training, experimentation, and model development are kept in:

```text
research/notebooks/lemon-leaf-disease-kaggle-final.ipynb
```

This notebook contains the model training and research workflow used for the project.

---

## Environment Variables

### Frontend

File: `frontend/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Backend

Use `.env` or `.env.example` if needed for deployment-related configuration.

---

## CI / Project Workflow

This project includes GitHub Actions workflows for checking backend and frontend changes.

* `backend-ci.yml`
* `frontend-ci.yml`

These workflows help validate the project structure and build process.

---


## Author

**Mahmudul Haque Sakib**
GitHub: `https://github.com/your-username`
LinkedIn: `https://linkedin.com/in/your-profile`
Portfolio: `https://mhsakib.vercel.app`

---


## Quick Start

### Local backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Local frontend

```bash
cd frontend
npm install
npm run dev
```

### Full stack with Docker

```bash
docker compose up --build
```
