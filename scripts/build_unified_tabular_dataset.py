import pandas as pd
import numpy as np
import os

# ======================================================
# PATHS
# ======================================================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PCOS_PATH = os.path.join(BASE_DIR, "data", "tabular", "PCOS.xlsx")
INFERT_PATH = os.path.join(BASE_DIR, "data", "tabular", "PCOS_infertility.xlsx")
OUT_PATH = os.path.join(BASE_DIR, "data", "tabular", "tabular_unified_clean.csv")

# ======================================================
# COLUMN NORMALIZATION MAP
# ======================================================
COLUMN_MAP = {
    "Age (yrs)": "age_yrs",
    "Weight (Kg)": "weight_kg",
    "Height(Cm)": "heightcm",
    "BMI": "bmi",
    "Blood Group": "blood_group",
    "Pulse rate(bpm)": "pulse_ratebpm",
    "RR (breaths/min)": "rr_breaths/min",
    "Hb(g/dl)": "hbg/dl",
    "Cycle(R/I)": "cycler/i",
    "Cycle length(days)": "cycle_lengthdays",
    "Marraige Status (Yrs)": "marraige_status_yrs",
    "Pregnant(Y/N)": "pregnanty/n",
    "No. of aborptions": "no._of_aborptions",
    "I   beta-HCG(mIU/mL)": "i___beta-hcgmiu/ml",
    "II    beta-HCG(mIU/mL)": "ii____beta-hcgmiu/ml",
    "FSH(mIU/mL)": "fshmiu/ml",
    "LH(mIU/mL)": "lhmiu/ml",
    "FSH/LH": "fsh/lh",
    "Hip(inch)": "hipinch",
    "Waist(inch)": "waistinch",
    "Waist:Hip Ratio": "waist:hip_ratio",
    "TSH (mIU/L)": "tsh_miu/l",
    "AMH(ng/mL)": "amhng/ml",
    "PRL(ng/mL)": "prlng/ml",
    "Vit D3 (ng/mL)": "vit_d3_ng/ml",
    "PRG(ng/mL)": "prgng/ml",
    "RBS(mg/dl)": "rbsmg/dl",
    "Weight gain(Y/N)": "weight_gainy/n",
    "hair growth(Y/N)": "hair_growthy/n",
    "Skin darkening (Y/N)": "skin_darkening_y/n",
    "Hair loss(Y/N)": "hair_lossy/n",
    "Pimples(Y/N)": "pimplesy/n",
    "Fast food (Y/N)": "fast_food_y/n",
    "Reg.Exercise(Y/N)": "reg.exercisey/n",
    "BP _Systolic (mmHg)": "bp__systolic_mmhg",
    "BP _Diastolic (mmHg)": "bp__diastolic_mmhg",
    "Follicle No. (L)": "follicle_no._l",
    "Follicle No. (R)": "follicle_no._r",
    "Avg. F size (L) (mm)": "avg._f_size_l_mm",
    "Avg. F size (R) (mm)": "avg._f_size_r_mm",
    "Endometrium (mm)": "endometrium_mm",
    "PCOS (Y/N)": "label"
}

# ======================================================
# LOAD DATA
# ======================================================
df_main = pd.read_excel(PCOS_PATH)
df_inf = pd.read_excel(INFERT_PATH)

df_main = df_main.rename(columns=COLUMN_MAP)
df_inf = df_inf.rename(columns=COLUMN_MAP)

# ======================================================
# DROP IDENTIFIERS
# ======================================================
DROP_COLS = ["sl. no", "patient file no.", "unnamed: 44"]
df_main = df_main.drop(columns=[c for c in df_main.columns if c.lower() in DROP_COLS], errors="ignore")
df_inf = df_inf.drop(columns=[c for c in df_inf.columns if c.lower() in DROP_COLS], errors="ignore")

# ======================================================
# DEFINE MASTER SCHEMA
# ======================================================
FEATURES = sorted(set(df_main.columns) | set(df_inf.columns))
FEATURES.remove("label")

# ======================================================
# ALIGN INFERTILITY DATA (PAD MISSING)
# ======================================================
for col in FEATURES:
    if col not in df_inf.columns:
        df_inf[col] = np.nan

df_inf = df_inf[FEATURES + ["label"]]
df_main = df_main[FEATURES + ["label"]]

# ======================================================
# CONCAT
# ======================================================
df = pd.concat([df_main, df_inf], ignore_index=True)

# ======================================================
# CLEAN NUMERIC COLUMNS
# ======================================================
NUMERIC_COLS = df.select_dtypes(include=["float", "int"]).columns

for col in NUMERIC_COLS:
    df[col] = (
        df[col]
        .astype(str)
        .str.strip()
        .str.replace(r"[^\d\.-]", "", regex=True)
    )
    df[col] = pd.to_numeric(df[col], errors="coerce")

# ======================================================
# CAST CATEGORICAL
# ======================================================
CAT_COLS = [
    "blood_group","cycler/i","pregnanty/n",
    "weight_gainy/n","hair_growthy/n",
    "skin_darkening_y/n","hair_lossy/n",
    "pimplesy/n","fast_food_y/n","reg.exercisey/n"
]

for col in CAT_COLS:
    if col in df.columns:
        df[col] = df[col].astype(str)

# ======================================================
# SAVE
# ======================================================
df.to_csv(OUT_PATH, index=False)
print("✅ Unified dataset saved:", OUT_PATH)
print("Shape:", df.shape)
