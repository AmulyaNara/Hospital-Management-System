from fastapi import APIRouter, Depends

from app.models.patient_orm import (
    get_all_patients,
    create_patient,
    update_patient,
    delete_patient,
    get_patient_dashboard,
    get_patient_upcoming_appointments,
    get_patient_records
)

from app.schemas.patient_schema import PatientCreate

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role
from app.database.session import SessionLocal
from app.models.patient_orm import Patient

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

@router.get("/patient-stats")
def get_patient_stats():

    db = SessionLocal()

    try:

        total_patients = db.query(Patient).count()
        critical_care = (
            db.query(Patient)
            .filter(
                Patient.clinical_status == "Critical"
            )
            .count()
        )

        pending_followups = (
            db.query(Patient)
            .filter(
                Patient.last_visit_date == None
            )
            .count()
        )
        return {
            "total_patients": total_patients,
            "critical_care": critical_care,
            "pending_followups": pending_followups,
            "avg_wait_time": 18
        }

    finally:
        db.close()


# ==========================================
# Patient Dashboard
# ==========================================



@router.get("/api/patient-appointments")
def patient_appointments():

    return get_patient_upcoming_appointments(
        "ram@gmail.com"
    )
    
@router.get("/api/patient-dashboard")
def patient_dashboard():

    return get_patient_dashboard(
        "ram@gmail.com"
    )   

@router.get("/api/patient-records")
def patient_records():

    return get_patient_records(
        "ram@gmail.com"
    )
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


print("=" * 50)
print("PATIENT ROUTES LOADED")
print(router.routes)
print("=" * 50)