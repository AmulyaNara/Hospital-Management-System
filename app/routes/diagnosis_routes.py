from fastapi import APIRouter, Depends

from app.models.diagnosis_orm import (
    create_diagnosis,
    get_all_diagnosis,
    update_diagnosis,
    delete_diagnosis
)

from app.schemas.diagnosis_schema import DiagnosisCreate

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role

from app.database.session import SessionLocal
from app.models.diagnosis_orm import Diagnosis

router = APIRouter()


# GET
from fastapi import Query

@router.get("/diagnosis")
def get_diagnosis(

    search: str = "",
    status: str = "",
    severity: str = ""

):

    return get_all_diagnosis(
        search,
        status,
        severity
    )


@router.get("/diagnosis-stats")
def get_diagnosis_stats():

    db = SessionLocal()

    try:

        total_diagnosis = db.query(Diagnosis).count()

        active_diagnosis = (
            db.query(Diagnosis)
            .filter(Diagnosis.diagnosis_status == "Active")
            .count()
        )

        completed_diagnosis = (
            db.query(Diagnosis)
            .filter(Diagnosis.diagnosis_status == "Completed")
            .count()
        )

        high_severity = (
            db.query(Diagnosis)
            .filter(Diagnosis.severity == "High")
            .count()
        )

        return {
            "total_diagnosis": total_diagnosis,
            "active_diagnosis": active_diagnosis,
            "completed_diagnosis": completed_diagnosis,
            "high_severity": high_severity
        }

    finally:
        db.close()
@router.get("/diagnosis/{diagnosis_id}")
def get_diagnosis_by_id(diagnosis_id: int):

    db = SessionLocal()

    try:

        diagnosis = (
            db.query(Diagnosis)
            .filter(Diagnosis.diagnosis_id == diagnosis_id)
            .first()
        )

        if not diagnosis:
            return {
                "error": "Diagnosis not found"
            }

        return {
            "diagnosis_id": diagnosis.diagnosis_id,
            "patient_name": diagnosis.patient_name,
            "patient_code": diagnosis.patient_code,
            "disease": diagnosis.disease,
            "symptoms": diagnosis.symptoms,
            "doctor_notes": diagnosis.doctor_notes,
            "severity": diagnosis.severity,
            "diagnosis_status": diagnosis.diagnosis_status,
            "icd_code": diagnosis.icd_code
        }

    finally:
        db.close()
# POST
@router.post("/diagnosis")
def add_diagnosis(
    diagnosis: DiagnosisCreate,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor"]
    )

    return create_diagnosis(
        diagnosis.visit_id,
        diagnosis.disease,
        diagnosis.symptoms,
        diagnosis.doctor_notes,
        diagnosis.patient_name,
        diagnosis.patient_code,
        diagnosis.severity,
        diagnosis.diagnosis_status,
        diagnosis.icd_code
    )


# PUT
@router.put("/diagnosis/{diagnosis_id}")
def edit_diagnosis(
    diagnosis_id: int,
    disease: str,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor"]
    )

    return update_diagnosis(
        diagnosis_id,
        disease
    )


# DELETE
@router.delete("/diagnosis/{diagnosis_id}")
def remove_diagnosis(
    diagnosis_id: int,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin"]
    )

    return delete_diagnosis(
        diagnosis_id
    )
    
