from fastapi import APIRouter

from app.schemas.admin_schema import AdminCreate

from app.models.admin_orm import (
    get_all_admins,
    create_admin
)

router = APIRouter()


@router.get("/admins")
def get_admins():
    return get_all_admins()


@router.post("/admins")
def add_admin(admin: AdminCreate):

    return create_admin(
        admin.admin_name,
        admin.email,
        admin.password
    )