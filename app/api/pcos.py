# app/api/pcos.py

import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.multimodal_service import predict_pcos
from app.parsing.document_parser import parse_document

router = APIRouter(prefix="/api/pcos", tags=["PCOS"])


# ======================================================
# PCOS PREDICTION (UNCHANGED)
# ======================================================
@router.post("/predict")
async def predict(
    tabular_data: str = Form(...),
    ultrasound: UploadFile = File(...)
):
    try:
        tabular_dict = json.loads(tabular_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in tabular_data")

    image_bytes = await ultrasound.read()
    result = predict_pcos(tabular_dict, image_bytes)
    return result


# ======================================================
# DOCUMENT PARSING ENDPOINT (NEW)
# ======================================================
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

