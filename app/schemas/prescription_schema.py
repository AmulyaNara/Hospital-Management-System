from pydantic import BaseModel

class PrescriptionCreate(BaseModel):

    visit_id: int
    medicine_name: str
    dosage: str
    frequency: str
    duration: str
    instructions: str
    patient_name: str
    patient_code: str
    prescription_status: str
    doctor_id: int
    doctor_name: str
    diagnosis: str
    doctor_notes: str