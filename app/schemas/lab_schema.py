from pydantic import BaseModel
from datetime import date


# ==========================================
# CREATE LAB
# ==========================================

class LabCreate(BaseModel):

    patient_name: str

    patient_code: str

    test_name: str

    test_date: date

    result: str

    doctor_name: str

    status: str


# ==========================================
# UPDATE LAB
# ==========================================

class LabUpdate(BaseModel):

    result: str

    status: str


# ==========================================
# RESPONSE SCHEMA
# ==========================================

class LabResponse(BaseModel):

    lab_id: int

    patient_name: str

    patient_code: str

    test_name: str

    test_date: date

    result: str

    doctor_name: str

    status: str

    class Config:
        from_attributes = True