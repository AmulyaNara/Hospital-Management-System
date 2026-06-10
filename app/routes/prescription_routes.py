from fastapi import APIRouter, Depends

from app.models.prescription_orm import (
    create_prescription,
    get_all_prescriptions,
    update_prescription,
    delete_prescription
)

from app.schemas.prescription_schema import PrescriptionCreate

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role

router = APIRouter()


# GET
@router.get("/prescriptions")
def get_prescriptions(
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor", "patient"]
    )

    return get_all_prescriptions()


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
        prescription.instructions
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
        prescription.instructions
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