# 🩺 PCOS Multimodal Risk Assessment System

An end-to-end **AI-powered clinical decision support system** for assessing **Polycystic Ovary Syndrome (PCOS)** risk using **clinical tabular data**, **ultrasound images**, and **automatic medical report parsing**.

This project combines **machine learning, deep learning, document intelligence, and full-stack engineering** into a single production-ready pipeline focused on **accuracy, robustness, and real-world usability**.

---

### 🚀 Key Features

- ✅ Multimodal PCOS prediction (Tabular + Ultrasound)
- 🧠 **Multi-Expert Ensemble Architecture** for tabular data
- 📄 **Automatic PDF medical report parsing**
- 🔬 Confidence-aware predictions
- 🖥️ Clinician-friendly modern frontend (Next.js)
- ⚙️ Scalable FastAPI backend
- 📊 ROC-AUC focused evaluation


### 🧩 System Overview

```
Medical PDF ──┐
├──▶ Document Parser ──▶ Auto-filled Form (Editable)
Manual Input ─┘

Tabular Data ─────────▶ Tabular Experts (3 Models)
│
Ultrasound Image ─▶ CNN + LBP ─▶ Ultrasound Model
│
Meta Learner (Stacking)
│
Adaptive Fusion
│
Final PCOS Risk
```


### 📁 Project Structure

```
PCOS/
│
├── 📂 app/                          # FastAPI Backend Application
│   ├── api/                         # API route handlers
│   ├── core/                        # Core configuration
│   │   └── config.py               # Model paths & settings
│   ├── models/                      # Pydantic schemas
│   └── main.py                     # FastAPI app entry point
│
├── 📂 data/                         # Datasets & Features
│   ├── features/                    # Extracted texture features
│   │   ├── pcosgen_ultrasound_texture_features.csv
│   │   └── mmotu_ultrasound_texture_features.csv
│   ├── tabular/                     # Clinical tabular data
│   │   ├── tabular_unified_clean.csv
│   │   ├── tabular_hormonal_expert.csv
│   │   ├── tabular_metabolic_expert.csv
│   │   └── tabular_symptom_expert.csv
│   └── ultrasound/                  # Ultrasound imaging data
│       ├── raw/                     # Original datasets
│       ├── processed/               # Preprocessed images
│       └── standardized/            # Binary classification format
│
├── 📂 frontend/                     # Next.js Web Application
│   ├── app/                         # Next.js App Router
│   │   ├── assess/                  # PCOS Assessment Form
│   │   │   ├── page.tsx            # Main assessment page
│   │   │   └── DocumentUploader.tsx # PDF upload component
│   │   ├── results/                 # Results Dashboard
│   │   │   └── page.tsx
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Global styles
│   ├── lib/                         # Utility functions
│   │   └── api.ts                  # API client
│   ├── public/                      # Static assets
│   └── package.json                # Dependencies
│
├── 📂 models/                       # Trained ML Models
│   ├── catboost_tabular_final.cbm  # Tabular classifier
│   ├── ultrasound_catboost_combined.cbm  # Ultrasound classifier
│   ├── expert_hormonal.cbm         # Hormonal expert model
│   ├── expert_metabolic.cbm        # Metabolic expert model
│   └── expert_symptom.cbm          # Symptom expert model
│
├── 📂 notebooks/                    # Jupyter Notebooks
│   ├── 01_data_exploration.ipynb
│   ├── 02_model_training.ipynb
│   ├── 03_evaluation.ipynb
│   └── 04_sample_inputs.ipynb
│
├── 📂 scripts/                      # Data Processing & Training Scripts
│   ├── create_tabular_expert_datasets.py  # Expert dataset creation
│   ├── train_tabular_expert.py           # Train expert models
│   ├── extract_texture_features.py       # Feature extraction
│   ├── convert_mmotu_to_binary.py        # Dataset preprocessing
│   └── [other processing scripts]
│
├── 📄 requirements.txt              # Python dependencies
├── 📄 Readme.md                     # Project documentation
└── 📄 .gitignore                   # Git ignore rules
```

### 🔑 Key Components

- **Backend (FastAPI)**: REST API serving ML predictions
- **Frontend (Next.js)**: Modern web interface for PCOS assessment
- **Models**: CatBoost classifiers for tabular + ultrasound analysis
- **Data Pipeline**: Scripts for preprocessing, feature extraction, and model training


## 🧪 Datasets Used

### 1️⃣ Tabular Clinical Dataset
Includes:
- Demographics (Age, Height, Weight, BMI)
- Hormonal markers (FSH, LH, AMH, TSH, PRL, Progesterone)
- Metabolic indicators (RBS, weight gain)
- Symptoms & lifestyle factors
- Ultrasound numerical findings

**Target Variable:** `PCOS (0 / 1)`

---

### 2️⃣ Ultrasound Image Dataset
- Ovarian ultrasound scans
- Feature extraction using:
  - **ResNet50 CNN embeddings**
  - **Local Binary Pattern (LBP) texture features**

---

### 3️⃣ Medical Report PDFs
- Lab reports
- Ultrasound summaries
- Clinical diagnostic sheets

Used **only for automatic data extraction**, not for training.

---

## 🧠 Modeling Approach

### 🔹 Tabular Modeling - Multi-Expert Architecture

Instead of one monolithic model, tabular data is split into **domain-specific experts**:

| Expert | Feature Focus |
|------|---------------|
| Hormonal Expert | FSH, LH, AMH, TSH, PRL |
| Metabolic Expert | BMI, RBS, Weight Gain |
| Symptom Expert | Acne, Hair Growth, Exercise |

Each expert:
- CatBoostClassifier
- Early stopping enabled
- Optimized for ROC-AUC

---

### 🔹 Meta Learner (Stacking)

The outputs of all experts are combined using a **meta learner**.

**Meta Features**
- Expert probabilities
- Maximum probability
- Mean probability
- Standard deviation
- Pairwise probability gaps

**Model Used**
- Logistic Regression / CatBoost

**Purpose**
- Improve calibration
- Reduce bias of individual experts

---

### 🔹 Ultrasound Modeling

- CNN Backbone: **ResNet50 (ImageNet weights)**
- Texture features: **LBP histogram**
- Final classifier: **CatBoost**

This captures both **structural** and **textural** ovarian features.

---

### 🔹 Adaptive Multimodal Fusion

Final PCOS probability is computed using **dynamic weighting**:

- High confidence in tabular → tabular weighted more
- High confidence in ultrasound → ultrasound weighted more
- Otherwise → balanced fusion

---

## 📄 Medical Document Parsing

### Supported Inputs
- PDF medical reports
- Tables + free text
- Decimal values & units

### Parsing Stack
- **Camelot** (table extraction)
- **pdfplumber** (text extraction)
- Regex-based numeric parsing
- Range-based validation
- Confidence scoring per field

### Output Format
```json
{
  "FSH(mIU/mL)": { "value": 5.8, "confidence": 0.95 },
  "AMH(ng/mL)": { "value": 8.4, "confidence": 0.93 }
}

```

### Model Performance

| Component        | Metric                 | Score     |
| ---------------- | ---------------------- | --------- |
| Hormonal Expert  | ROC-AUC                | ~0.71     |
| Metabolic Expert | ROC-AUC                | ~0.63     |
| Symptom Expert   | ROC-AUC                | ~0.75     |
| Meta Learner     | ROC-AUC                | **~0.80** |
| Final Multimodal | Separation & Stability | High      |

### 🖥️ Frontend Capabilities

- Manual data entry
- PDF medical report upload
- Automatic field extraction
- Editable extracted values
- Ultrasound image upload
  
Clear risk categorization:

  - LOW

  - MODERATE

  - HIGH

### Backend API
Predict PCOS
```
POST /api/pcos/predict
```

## FormData

```
tabular_data → JSON

ultrasound → Image
```

## Parse Medical Document
```
POST /api/pcos/parse-document
```

## FormData

```
document → PDF
```

### Installation & Setup

```
conda create -n pcos python=3.10

conda activate pcos

pip install -r requirements.txt

uvicorn app.main:app --reload
```

## Frontend:
```
cd frontend
npm install
npm run dev
```

### ⚠️ Disclaimer

This system is not a medical diagnostic tool.

It is intended for educational, research, and decision-support purposes only.
Final diagnosis must always be made by a licensed healthcare professional.
