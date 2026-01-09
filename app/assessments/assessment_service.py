from sqlalchemy.orm import Session
from app.assessments.assessment_model import PCOSAssessment

def save_assessment(
        db: Session,
        user_id,
        tabular_data: dict,
        ultrasound_filename: str,
        prediction: dict,
):
    assessment = PCOSAssessment(
        user_id=user_id,
        tabular_data=tabular_data,
        ultrasound_filename=ultrasound_filename,
        tabular_risk=prediction["tabular_risk"],
        ultrasound_risk=prediction["ultrasound_risk"],
        final_pcos_probability=prediction["final_pcos_probability"],
        risk_level=prediction["risk_level"],
    )

    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return assessment