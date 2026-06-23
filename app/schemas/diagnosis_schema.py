from pydantic import BaseModel

class DiagnosisCreate(BaseModel):
    visit_id: int
    disease: str
    symptoms: str
    doctor_notes: str
    patient_name: str
    patient_code: str
    severity: str
    diagnosis_status: str
    icd_code: str