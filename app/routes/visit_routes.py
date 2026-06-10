from fastapi import APIRouter, Depends

from app.models.visit_orm import (
    get_all_visits,
    create_visit,
    update_visit,
    delete_visit
)

from app.schemas.visit_schema import VisitCreate

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role

router = APIRouter()


# GET
@router.get("/visits")
def get_visits(
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor", "receptionist", "patient"]
    )

    return get_all_visits()


# POST
@router.post("/visits")
def add_visit(
    visit: VisitCreate,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "receptionist"]
    )

    return create_visit(
        visit.patient_id,
        visit.doctor_id,
        visit.visit_date,
        visit.chief_complaint,
        visit.visit_number
    )


# PUT
@router.put("/visits/{visit_id}")
def edit_visit(
    visit_id: int,
    chief_complaint: str,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "receptionist"]
    )

    return update_visit(
        visit_id,
        chief_complaint
    )


# DELETE
@router.delete("/visits/{visit_id}")
def remove_visit(
    visit_id: int,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin"]
    )

    return delete_visit(
        visit_id
    )