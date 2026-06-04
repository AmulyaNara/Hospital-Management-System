from pydantic import BaseModel

class PrescriptionCreate(BaseModel):
    visit_id: int
    medicine_name: str
    dosage: str
    frequency: str
    duration: str
    instructions: str