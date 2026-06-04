from fastapi import APIRouter
from app.models.doctor import get_all_doctors, create_doctor
from app.schemas.doctor_schema import DoctorCreate

router = APIRouter()

#get -> read all doctors
@router.get("/doctors")
def get_doctors():
    return get_all_doctors()

#post -> create a new doctor
@router.post("/doctors")
def add_doctor(doctor: DoctorCreate):

    return create_doctor(
        doctor.doctor_name,
        doctor.specialization,
        doctor.phone,
        doctor.email,
        doctor.password,
        doctor.experience_years
    )
#put -> update doctor specialization
@router.put("/doctors/{doctor_id}")
def edit_doctor(
    doctor_id: int,
    specialization: str
):
    return update_doctor(
        doctor_id,
        specialization
    )
#delete -> remove a doctor
@router.delete("/doctors/{doctor_id}")
def remove_doctor(doctor_id: int):
    return delete_doctor(doctor_id)