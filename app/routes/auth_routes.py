from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.security.hash import verify_password
from app.security.token import create_access_token

from app.database.session import SessionLocal
from app.models.user_orm import User


router = APIRouter()


@router.post("/login")
def login(
    user: OAuth2PasswordRequestForm = Depends()
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

        access_token = create_access_token(
            data={
                "sub": db_user.email,
                "role": db_user.role
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    finally:
        db.close()