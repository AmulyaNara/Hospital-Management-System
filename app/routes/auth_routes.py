from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm

from app.security.hash import verify_password
from app.security.token import create_access_token

from app.database.session import SessionLocal
from app.models.user_orm import User

router = APIRouter()


@router.post("/login")
def login(
    user: OAuth2PasswordRequestForm = Depends(),
    role: str = Form(...)
):

    db = SessionLocal()

    try:

        db_user = (
            db.query(User)
            .filter(
                User.email == user.username
            )
            .first()
        )

        if not db_user:
            raise HTTPException(
                status_code=401,
                detail="Invalid Email"
            )

        if not verify_password(
            user.password,
            db_user.password
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid Password"
            )

        # ==================================
        # Role Validation
        # ==================================

        if role == "Patient":
            if db_user.role != "patient":
                raise HTTPException(
                    status_code=403,
                    detail="Please login through Patient Portal"
                )

        elif role == "Staff":
            if db_user.role not in ["doctor", "receptionist"]:
                raise HTTPException(
                    status_code=403,
                    detail="Please login through Hospital Staff Portal"
                )

        elif role == "Admin":
            if db_user.role != "admin":
                raise HTTPException(
                    status_code=403,
                    detail="Please login through Administration Portal"
                )

        access_token = create_access_token(
            data={
                "sub": db_user.email,
                "role": db_user.role
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": db_user.role,
            "name": db_user.name
        }

    finally:
        db.close()