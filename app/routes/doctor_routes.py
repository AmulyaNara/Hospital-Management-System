from fastapi import APIRouter, Depends

from app.models.doctor_orm import (
    get_all_doctors,
    create_doctor,
    update_doctor,
    delete_doctor
)

from app.schemas.doctor_schema import DoctorCreate

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role

router = APIRouter()


# GET -> Read all doctors
@router.get("/doctors")
def get_doctors(
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor", "receptionist"]
    )

    return get_all_doctors()


# POST -> Create a new doctor
@router.post("/doctors")
def add_doctor(
    doctor: DoctorCreate,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin"]
    )

    return create_doctor(
        doctor.doctor_name,
        doctor.specialization,
        doctor.phone,
        doctor.email,
        doctor.password,
        doctor.experience_years
    )


# PUT -> Update doctor specialization
@router.put("/doctors/{doctor_id}")
def edit_doctor(
    doctor_id: int,
    specialization: str,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin"]
    )

    return update_doctor(
        doctor_id,
        specialization
    )


# DELETE -> Remove a doctor
@router.delete("/doctors/{doctor_id}")
def remove_doctor(
    doctor_id: int,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin"]
    )

    return delete_doctor(
        doctor_id
    )