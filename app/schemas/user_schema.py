from pydantic import BaseModel
import re
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: str

    date_of_birth: str
    gender: str
    address: str

    emergency_contact_name: str
    emergency_contact_phone: str
    
    