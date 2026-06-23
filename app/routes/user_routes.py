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
        "patient",
        user.phone,

        user.date_of_birth,
        user.gender,
        user.address,

        user.emergency_contact_name,
        user.emergency_contact_phone
)

    
from app.models.user_orm import (
    create_user,
    get_all_users,
    update_user,
    delete_user
)
@router.get("/users")
def get_users():

    return get_all_users()

@router.put("/users/{user_id}")
def edit_user(
    user_id: int,
    role: str
):

    return update_user(
        user_id,
        role
    )
@router.delete("/users/{user_id}")
def remove_user(
    user_id: int
):

    return delete_user(
        user_id
    )