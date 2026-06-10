from fastapi import APIRouter, Depends

from app.models.patient_orm import (
    get_all_patients,
    create_patient,
    update_patient,
    delete_patient
)

from app.schemas.patient_schema import PatientCreate

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role

router = APIRouter()


# GET Patients
@router.get("/patients")
def get_patients(
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor", "receptionist"]
    )

    return get_all_patients()


# POST Patient
@router.post("/patients")
def add_patient(
    patient: PatientCreate,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "receptionist"]
    )

    return create_patient(
        patient.patient_name,
        patient.age,
        patient.gender,
        patient.phone,
        patient.address,
        patient.blood_group,
        patient.email,
        patient.password
    )


# PUT Patient
@router.put("/patients/{patient_id}")
def edit_patient(
    patient_id: int,
    phone: str,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "receptionist"]
    )

    return update_patient(
        patient_id,
        phone
    )


# DELETE Patient
@router.delete("/patients/{patient_id}")
def remove_patient(
    patient_id: int,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin"]
    )

    return delete_patient(patient_id)