from fastapi import APIRouter
from app.schemas.user_schema import UserCreate
from app.models.user_orm import create_user

router = APIRouter()


@router.post("/users")
def add_user(
    user: UserCreate
):

    return create_user(
        user.name,
        user.email,
        user.password,
        user.role,
        user.phone
    )