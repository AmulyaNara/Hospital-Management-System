from pydantic import BaseModel

class VisitCreate(BaseModel):
    patient_id: int
    doctor_id: int
    visit_reason: str