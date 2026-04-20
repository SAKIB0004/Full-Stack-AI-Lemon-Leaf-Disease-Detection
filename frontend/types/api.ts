// types/api.ts
// Matches exactly what the FastAPI backend returns

export interface PredictResponse {
  filename: string;
  predicted_class: string;
  confidence: number;                        // 0.0 – 1.0
  class_probabilities: Record<string, number>; // { "Healthy": 0.02, ... }
}

export interface HealthResponse {
  status: "healthy" | "unhealthy";
  model_loaded: boolean;
  num_classes: number | null;
  model_names: string[] | null;
}

export interface RootResponse {
  status: string;
  model: string;
  classes: string[];
}

export type AppState =
  | "idle"         // no image selected
  | "ready"        // image selected, not yet submitted
  | "loading"      // waiting for API response
  | "success"      // result received
  | "error";       // something went wrong
