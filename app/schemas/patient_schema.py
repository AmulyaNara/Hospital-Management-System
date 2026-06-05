from pydantic import BaseModel


class PatientCreate(BaseModel):
    patient_name: str
    age: int
    gender: str
    phone: str
    address: str
    blood_group: str
    email: str
    password: str