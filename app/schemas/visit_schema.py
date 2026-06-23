from pydantic import BaseModel
from datetime import date, time

class VisitCreate(BaseModel):
    patient_id: int
    doctor_id: int
    visit_date: date
    chief_complaint: str
    visit_number: int
    visit_time: time
    visit_status: str