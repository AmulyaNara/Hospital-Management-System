from fastapi import APIRouter

from app.models.diagnosis_orm import (
    create_diagnosis,
    get_all_diagnosis,
    update_diagnosis,
    delete_diagnosis
)

from app.schemas.diagnosis_schema import DiagnosisCreate

router = APIRouter()


# GET
@router.get("/diagnosis")
def get_diagnosis():
    return get_all_diagnosis()


# POST
@router.post("/diagnosis")
def add_diagnosis(diagnosis: DiagnosisCreate):

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
    disease: str
):
    return update_diagnosis(
        diagnosis_id,
        disease
    )


# DELETE
@router.delete("/diagnosis/{diagnosis_id}")
def remove_diagnosis(diagnosis_id: int):
    return delete_diagnosis(diagnosis_id)