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

router = APIRouter()


# GET
@router.get("/diagnosis")
def get_diagnosis(
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor", "patient"]
    )

    return get_all_diagnosis()


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
        diagnosis.doctor_notes
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