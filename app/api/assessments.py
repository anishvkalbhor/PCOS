from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.auth.auth_router import get_db
from app.auth.dependencies import get_current_user
from app.assessments.assessment_model import PCOSAssessment
from app.users.user_models import User

router = APIRouter(prefix="/api/assessments", tags=["Assessments"])

@router.get("/my-history")
def get_my_assessments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assessments = (
        db.query(PCOSAssessment)
        .filter(PCOSAssessment.user_id == current_user.id)
        .order_by(PCOSAssessment.created_at.desc())
        .all()
    )

    return assessments