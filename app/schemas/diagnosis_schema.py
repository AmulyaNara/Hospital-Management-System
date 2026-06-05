from pydantic import BaseModel

class DiagnosisCreate(BaseModel):
    visit_id: int
    disease: str
    symptoms: str
    doctor_notes: str