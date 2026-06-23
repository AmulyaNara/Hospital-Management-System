from pydantic import BaseModel
from datetime import date


# ==========================================
# CREATE BILLING
# ==========================================

class BillingCreate(BaseModel):

    patient_name: str

    patient_code: str

    bill_date: date

    amount: float

    payment_status: str

    payment_method: str

    description: str


# ==========================================
# UPDATE BILLING
# ==========================================

class BillingUpdate(BaseModel):

    payment_status: str


# ==========================================
# RESPONSE
# ==========================================

class BillingResponse(BaseModel):

    billing_id: int

    patient_name: str

    patient_code: str

    bill_date: date

    amount: float

    payment_status: str

    payment_method: str

    description: str

    class Config:

        from_attributes = True