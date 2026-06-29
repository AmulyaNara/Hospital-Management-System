from fastapi import APIRouter, Depends
from app.database.session import SessionLocal
from app.models.doctor_orm import Doctor
from app.models.patient_orm import Patient

from app.models.doctor_orm import (
    get_all_doctors,
    create_doctor,
    update_doctor,
    delete_doctor
)

from app.schemas.doctor_schema import DoctorCreate

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role

from datetime import date
from app.models.visit_orm import Visit

from app.models.prescription_orm import Prescription

from app.models.visit_orm import get_all_visits
router = APIRouter()


# GET -> Read all doctors
from fastapi import Query

@router.get("/doctors")
def get_doctors(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    search: str = "",
    specialization: str = "",
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor", "receptionist"]
    )

    return get_all_doctors(
        page=page,
        limit=limit,
        search=search,
        specialization=specialization
    )

@router.get("/doctor-stats")
def get_doctor_stats():

    db = SessionLocal()

    try:

        total_doctors = (
            db.query(Doctor)
            .count()
        )

        total_patients = (
            db.query(Patient)
            .count()
        )
        
        today_visits = (
            db.query(Visit)
            .filter(Visit.visit_date == date.today())
            .count()
        )
        pending_prescriptions = (
    db.query(Prescription)
    .count()
)

        active_staff = (
            db.query(Doctor)
            .filter(
                Doctor.clinical_status == "Active"
            )
            .count()
        )

        return {
    "total_doctors": total_doctors,
    "total_patients": total_patients,
    "today_visits": today_visits,
    "pending_prescriptions": pending_prescriptions,
    "pending_lab_results": 0,
    "active_staff": active_staff,
    "bed_occupancy": "442/480"
}

    finally:
        db.close()

@router.get("/doctor-upcoming-visits")
def doctor_upcoming_visits():

    return get_all_visits()

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
    doctor: DoctorCreate,
    current_user=Depends(get_current_user)
):

    require_role(current_user, ["admin"])

    return update_doctor(
        doctor_id,
        doctor.doctor_name,
        doctor.specialization,
        doctor.phone,
        doctor.email,
        doctor.experience_years,
        doctor.clinical_status
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