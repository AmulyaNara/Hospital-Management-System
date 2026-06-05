from fastapi import APIRouter

from app.models.visit_orm import (
    get_all_visits,
    create_visit,
    update_visit,
    delete_visit
)

from app.schemas.visit_schema import VisitCreate

router = APIRouter()


# GET
@router.get("/visits")
def get_visits():
    return get_all_visits()


# POST
@router.post("/visits")
def add_visit(visit: VisitCreate):

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
    chief_complaint: str
):
    return update_visit(
        visit_id,
        chief_complaint
    )


# DELETE
@router.delete("/visits/{visit_id}")
def remove_visit(visit_id: int):
    return delete_visit(visit_id)