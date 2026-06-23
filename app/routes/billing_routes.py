from fastapi import APIRouter, Depends

from app.schemas.billing_schema import BillingCreate, BillingUpdate

from app.models.billing_orm import (
    get_all_billings,
    get_patient_billings,
    create_billing,
    update_billing,
    delete_billing
)

from app.models.patient_orm import get_patient_dashboard
from app.security.oauth2 import get_current_user

router = APIRouter()


# ==========================================
# GET ALL BILLINGS
# ==========================================

@router.get("/billings")
def all_billings():

    return get_all_billings()


# ==========================================
# PATIENT BILLINGS
# ==========================================

@router.get("/api/patient-billings")
def patient_billings(
    current_user=Depends(get_current_user)
):

    patient = get_patient_dashboard(
        current_user["email"]
    )

    return get_patient_billings(
        patient["patient_name"]
    )


# ==========================================
# CREATE BILL
# ==========================================

@router.post("/billings")
def add_billing(
    billing: BillingCreate
):

    return create_billing(
        patient_name=billing.patient_name,
        patient_code=billing.patient_code,
        bill_date=billing.bill_date,
        amount=billing.amount,
        payment_status=billing.payment_status,
        payment_method=billing.payment_method,
        description=billing.description
    )


# ==========================================
# UPDATE BILL
# ==========================================

@router.put("/billings/{billing_id}")
def edit_billing(
    billing_id: int,
    billing: BillingUpdate
):

    return update_billing(
        billing_id,
        billing.payment_status
    )


# ==========================================
# DELETE BILL
# ==========================================

@router.delete("/billings/{billing_id}")
def remove_billing(
    billing_id: int
):

    return delete_billing(
        billing_id
    )
    
print("=" * 50)
print("BILLING ROUTES LOADED")
print(router.routes)
print("=" * 50)