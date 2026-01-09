# app/api/pcos.py

import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.services.multimodal_service import predict_pcos
from app.parsing.document_parser import parse_document
from app.auth.dependencies import get_current_user
from app.users.user_models import User

from app.auth.auth_router import get_db
from sqlalchemy.orm import Session
from app.assessments.assessment_service import save_assessment

router = APIRouter(prefix="/api/pcos", tags=["PCOS"])

REQUIRED_FIELDS = [
    "Age (yrs)",
    "Cycle(R/I)",
    "Cycle length(days)",
]

def validate_minimum_inputs(tabular: dict):
    missing = []

    for f in REQUIRED_FIELDS:
        if f not in tabular or tabular[f] in [None, "", 0]:
            missing.append(f)

    # Hormonal sufficiency
    hormonal_present = any(
        tabular.get(k, 0) > 0
        for k in ["LH(mIU/mL)", "FSH(mIU/mL)", "AMH(ng/mL)"]
    )

    if not hormonal_present:
        missing.append("At least one hormonal value (LH / FSH / AMH)")

    # Ovarian sufficiency
    ovarian_present = any(
        tabular.get(k, 0) > 0
        for k in [
            "Follicle No. (L)",
            "Follicle No. (R)",
            "Avg. F size (L) (mm)",
            "Avg. F size (R) (mm)",
            "Endometrium (mm)",
        ]
    )

    if not ovarian_present:
        missing.append("At least one ovarian ultrasound metric")

    return missing

@router.post("/predict")
async def predict(
    tabular_data: str = Form(...),
    ultrasound: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        tabular_dict = json.loads(tabular_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in tabular_data")

    if not ultrasound.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Ultrasound must be an image")

    missing = validate_minimum_inputs(tabular_dict)
    if missing:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Insufficient clinical data for PCOS prediction",
                "missing": missing
            }
        )

    image_bytes = await ultrasound.read()

    print(f"[PCOS] User {current_user.email} running prediction")

    result = predict_pcos(tabular_dict, image_bytes)

    save_assessment(
        db=db,
        user_id=current_user.id,
        tabular_data=tabular_dict,
        ultrasound_filename=ultrasound.filename,
        prediction=result,
    )
    
    return result


@router.post("/parse-document")
async def parse_medical_document(
    document: UploadFile = File(...)
):
    if not document.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF documents are supported"
        )

    pdf_bytes = await document.read()

    try:
        extracted = parse_document(pdf_bytes)
        return {
            "status": "success",
            "fields": extracted
        }

    except Exception as e:
        print("[ERROR] Document parsing failed:", str(e))
        raise HTTPException(
            status_code=500,
            detail="Document parsing failed"
        )