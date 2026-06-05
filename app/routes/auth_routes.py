from fastapi import APIRouter, HTTPException

from app.schemas.login_schema import LoginRequest
from app.security.hash import verify_password
from app.security.token import create_access_token

from app.database.session import SessionLocal
from app.models.doctor_orm import Doctor

router = APIRouter()


@router.post("/login")
def login(user: LoginRequest):

    db = SessionLocal()

    try:

        doctor = (
            db.query(Doctor)
            .filter(
                Doctor.email == user.email
            )
            .first()
        )

        if not doctor:
            raise HTTPException(
                status_code=401,
                detail="Invalid Email"
            )

        if not verify_password(
            user.password,
            doctor.password
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid Password"
            )

        access_token = create_access_token(
            data={
                "sub": doctor.email,
                "role": "doctor"
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": "doctor"
        }

    finally:
        db.close()