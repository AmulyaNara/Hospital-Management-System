from pydantic import BaseModel
from datetime import date

class VisitCreate(BaseModel):
    patient_id: int
    doctor_id: int
    visit_date: date
    chief_complaint: str
    visit_number: int