from fastapi import APIRouter
from app.models.patient import (
    get_all_patients,
    create_patient,
    update_patient,
    delete_patient
)

from app.schemas.patient_schema import PatientCreate

router = APIRouter()


# GET
@router.get("/patients")
def get_patients():
    return get_all_patients()


# POST
@router.post("/patients")
def add_patient(patient: PatientCreate):

    return create_patient(
        patient.patient_name,
        patient.age,
        patient.gender,
        patient.phone,
        patient.address
    )


# PUT
@router.put("/patients/{patient_id}")
def edit_patient(
    patient_id: int,
    phone: str
):
    return update_patient(
        patient_id,
        phone
    )


# DELETE
@router.delete("/patients/{patient_id}")
def remove_patient(patient_id: int):
    return delete_patient(patient_id)