from fastapi import APIRouter, Depends
from app.database.session import SessionLocal
from app.models.visit_orm import Visit

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role
from app.models.visit_orm import get_patient_appointments

from app.models.visit_orm import (
    get_all_visits,
    create_visit,
    update_visit,
    delete_visit,
    get_visit_details
)

from app.schemas.visit_schema import VisitCreate

router = APIRouter()

@router.get("/visits")
def get_visits(
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "doctor", "receptionist"]
    )

    return get_all_visits()
# GET
@router.post("/visits")
def add_visit(
    visit: VisitCreate,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["admin", "receptionist", "patient"]
    )

    return create_visit(
    current_user["email"],
    visit.doctor_id,
    visit.visit_date,
    visit.chief_complaint,
    visit.visit_number,
    visit.visit_status
)


@router.get("/visit-stats")
def get_visit_stats():

    db = SessionLocal()

    try:

        total_appointments = (
            db.query(Visit)
            .count()
        )

        waiting = (
            db.query(Visit)
            .filter(
                Visit.visit_status == "Waiting"
            )
            .count()
        )

        consultation = (
            db.query(Visit)
            .filter(
                Visit.visit_status == "Consultation"
            )
            .count()
        )

        completed = (
            db.query(Visit)
            .filter(
                Visit.visit_status == "Completed"
            )
            .count()
        )

        return {
            "total_appointments": total_appointments,
            "waiting": waiting,
            "consultation": consultation,
            "completed": completed
        }

    finally:
        db.close()

@router.get("/api/patient-appointments")
def patient_appointments_api(
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        ["patient"]
    )

    return get_patient_appointments(
        current_user["email"]
    )
    
# POST


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
    
@router.get("/api/visit/{visit_id}")
def get_visit(
    visit_id: int,
    current_user=Depends(get_current_user)
):
    require_role(
        current_user,
        ["patient", "doctor", "admin", "receptionist"]
    )

    return get_visit_details(visit_id)

