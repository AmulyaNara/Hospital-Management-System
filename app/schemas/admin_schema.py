from pydantic import BaseModel


class AdminCreate(BaseModel):
    admin_name: str
    email: str
    password: str