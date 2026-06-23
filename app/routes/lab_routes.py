from fastapi import APIRouter, Depends
from app.schemas.lab_schema import (
    LabCreate,
    LabUpdate
)
from app.models.lab_orm import (
    get_all_labs,
    create_lab,
    update_lab,
    delete_lab,
    get_patient_labs
)
from app.models.patient_orm import get_patient_dashboard
from app.security.oauth2 import get_current_user

router = APIRouter()


# ==========================================
# GET ALL LABS (Admin)
# ==========================================

@router.get("/labs")
def all_labs():

    return get_all_labs()


# ==========================================
# CREATE LAB
# ==========================================

@router.post("/labs")
def add_lab(lab: LabCreate):

    return create_lab(
        patient_name=lab.patient_name,
        patient_code=lab.patient_code,
        test_name=lab.test_name,
        test_date=lab.test_date,
        result=lab.result,
        doctor_name=lab.doctor_name,
        status=lab.status
    )


# ==========================================
# UPDATE LAB
# ==========================================

@router.put("/labs/{lab_id}")
def edit_lab(
    lab_id: int,
    lab: LabUpdate
):

    return update_lab(
        lab_id=lab_id,
        result=lab.result,
        status=lab.status
    )


# ==========================================
# DELETE LAB
# ==========================================

@router.delete("/labs/{lab_id}")
def remove_lab(
    lab_id: int
):

    return delete_lab(lab_id)


# ==========================================
# PATIENT LAB RESULTS
# (Logged-in Patient Only)
# ==========================================


@router.get("/api/patient-labs")
def patient_labs(
    current_user=Depends(get_current_user)
):

    patient = get_patient_dashboard(
        current_user["email"]
    )

    return get_patient_labs(
        patient["patient_name"]
    )