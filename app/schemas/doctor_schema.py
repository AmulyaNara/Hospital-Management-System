from pydantic import BaseModel

class DoctorCreate(BaseModel):
    doctor_name: str
    specialization: str
    phone: str
    email: str
    password: str
    experience_years: int
    clinical_status: str