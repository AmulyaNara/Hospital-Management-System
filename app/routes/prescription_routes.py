from fastapi import APIRouter, Depends

from app.models.prescription_orm import (
    create_prescription,
    get_all_prescriptions,
    update_prescription,
    delete_prescription,
    
)

from app.schemas.prescription_schema import PrescriptionCreate

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role

from app.database.session import SessionLocal
from app.models.prescription_orm import Prescription
router = APIRouter()

# GET
@router.get("/prescriptions")
def get_prescriptions():

    return get_all_prescriptions()

@router.get("/prescription-stats")
def get_prescription_stats():

    db = SessionLocal()

    try:
        from datetime import date

        print("COUNTING TOTAL")
        total_prescriptions = db.query(Prescription).count()

        print("COUNTING ACTIVE")
        active_prescriptions = (
            db.query(Prescription)
            .filter(Prescription.prescription_status == "Active")
            .count()
        )

        print("COUNTING COMPLETED")
        completed_prescriptions = (
            db.query(Prescription)
            .filter(Prescription.prescription_status == "Completed")
            .count()
        )

        print("COUNTING TODAY")
        today_prescriptions = (
            db.query(Prescription)
            .filter(Prescription.date_prescribed == date.today())
            .count()
        )

        print("DONE")

        return {
            "total_prescriptions": total_prescriptions,
            "active_prescriptions": active_prescriptions,
            "completed_prescriptions": completed_prescriptions,
            "today_prescriptions": today_prescriptions
        }

    except Exception as e:
        print("ERROR:", e)
        raise
    

    finally:
        db.close()
# POST
@router.post("/prescriptions")
def add_prescription(
    prescription: PrescriptionCreate,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor"]
    )

    return create_prescription(
        prescription.visit_id,
        prescription.medicine_name,
        prescription.dosage,
        prescription.frequency,
        prescription.duration,
        prescription.instructions,
        prescription.patient_name,
        prescription.patient_code,
        prescription.prescription_status,
        prescription.doctor_id,
        prescription.doctor_name,
        prescription.diagnosis,
        prescription.doctor_notes
    )


# PUT
@router.put("/prescriptions/{prescription_id}")
def edit_prescription(
    prescription_id: int,
    prescription: PrescriptionCreate,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor"]
    )

    return update_prescription(
        prescription_id,
        prescription.medicine_name,
        prescription.dosage,
        prescription.frequency,
        prescription.duration,
        prescription.instructions,
        prescription.diagnosis,
        prescription.doctor_notes
    )


# DELETE
@router.delete("/prescriptions/{prescription_id}")
def remove_prescription(
    prescription_id: int,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin"]
    )

    return delete_prescription(
        prescription_id
    )