"""
inference.py
Mirrors the exact architecture and preprocessing from the training notebook.
"""

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ── Exact same architecture as in the notebook (Cell 12) ─────────────────────

def build_base_model(model_name: str, num_classes: int) -> nn.Module:
    """
    Rebuild architecture with no pretrained weights.
    Must match build_pretrained_model() in the notebook exactly.
    """
    try:
        m = getattr(models, model_name)(weights=None)
    except TypeError:
        m = getattr(models, model_name)(pretrained=False)

    if model_name == "resnet50":
        m.fc = nn.Linear(m.fc.in_features, num_classes)

    elif model_name == "efficientnet_b0":
        # classifier is Sequential([Dropout(0), Linear(1)])
        m.classifier[1] = nn.Linear(m.classifier[1].in_features, num_classes)

    elif model_name == "mobilenet_v2":
        # classifier is Sequential([Dropout(0), Linear(1)])
        m.classifier[1] = nn.Linear(m.classifier[1].in_features, num_classes)

    elif model_name == "densenet121":
        m.classifier = nn.Linear(m.classifier.in_features, num_classes)

    return m


# ── Exact same ensemble as in the notebook (Cell 15) ─────────────────────────

class WeightedEnsemble(nn.Module):
    def __init__(self, base_models: list, raw_weights: torch.Tensor):
        super().__init__()
        self.models      = nn.ModuleList(base_models)
        self.raw_weights = nn.Parameter(raw_weights)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        with torch.no_grad():
            outputs = torch.stack([m(x) for m in self.models], dim=0)
        weights = torch.softmax(self.raw_weights, dim=0).view(-1, 1, 1)
        return (outputs * weights).sum(dim=0)

    def get_weights(self) -> list:
        return torch.softmax(self.raw_weights.detach().cpu(), dim=0).tolist()


# ── Public API ────────────────────────────────────────────────────────────────

def load_model(bundle_path: str):
    """
    Load ensemble from the saved bundle.

    Returns
    -------
    model : WeightedEnsemble in eval mode on DEVICE
    meta  : dict with class_names, img_size, mean, std, model_names
    """
    print(f"Loading bundle from: {bundle_path}")
    bundle = torch.load(bundle_path, map_location=DEVICE, weights_only=False)

    num_classes = bundle["num_classes"]
    model_names = bundle["model_names"]
    base_states = bundle["base_model_states"]
    raw_weights = bundle["ensemble_raw_weights"].to(DEVICE)

    base_models = []
    for name in model_names:
        m = build_base_model(name, num_classes).to(DEVICE)
        m.load_state_dict(base_states[name])
        for p in m.parameters():
            p.requires_grad = False   # keep frozen
        m.eval()
        base_models.append(m)
        print(f"  Loaded: {name}")

    ensemble = WeightedEnsemble(base_models, raw_weights).to(DEVICE)
    ensemble.eval()

    meta = {
        "class_names" : bundle["class_names"],
        "num_classes" : bundle["num_classes"],
        "img_size"    : bundle["img_size"],
        "mean"        : bundle["mean"],
        "std"         : bundle["std"],
        "model_names" : bundle["model_names"],
    }

    print(f"Ensemble ready. Classes: {meta['class_names']}")
    print(f"Ensemble weights: {[round(w,4) for w in ensemble.get_weights()]}")
    return ensemble, meta


def predict(model: nn.Module, meta: dict, image: Image.Image) -> dict:
    """
    Run inference on one PIL image.
    Uses the exact same eval_transform as the notebook (Cell 9).

    Returns dict with predicted_class, confidence, class_probabilities.
    """
    # Exact same eval_transform as Cell 9
    tf = transforms.Compose([
        transforms.Resize((meta["img_size"], meta["img_size"])),
        transforms.ToTensor(),
        transforms.Normalize(meta["mean"], meta["std"]),
    ])

    tensor = tf(image.convert("RGB")).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = model(tensor)
        probs  = torch.softmax(logits, dim=1).squeeze().cpu()

    top_idx  = probs.argmax().item()
    top_prob = probs[top_idx].item()

    return {
        "predicted_class"     : meta["class_names"][top_idx],
        "confidence"          : round(top_prob, 4),
        "class_probabilities" : {
            cls: round(probs[i].item(), 4)
            for i, cls in enumerate(meta["class_names"])
        },
    }