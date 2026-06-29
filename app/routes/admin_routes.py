from fastapi import APIRouter
import csv
import io

from fastapi.responses import StreamingResponse

from app.models.patient_orm import get_all_patients
from app.schemas.admin_schema import AdminCreate

from app.models.admin_orm import (
    get_all_admins,
    create_admin,
    get_admin_dashboard,
    get_recent_patients,
    get_recent_visits,
    get_recent_activities,
)

from app.models.user_orm import (
    get_all_users,
    create_user,
    update_user,
    delete_user,
)

router = APIRouter()


# ==========================================================
# ADMIN CRUD
# ==========================================================

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


# ==========================================================
# ADMIN DASHBOARD
# ==========================================================

@router.get("/api/admin-dashboard")
def admin_dashboard():

    return get_admin_dashboard()


# ==========================================================
# RECENT PATIENTS
# ==========================================================

@router.get("/api/admin-recent-patients")
def admin_recent_patients():

    return get_recent_patients()


# ==========================================================
# RECENT VISITS
# ==========================================================

@router.get("/api/admin-recent-visits")
def admin_recent_visits():

    return get_recent_visits()


# ==========================================================
# RECENT ACTIVITIES
# ==========================================================

@router.get("/api/admin-recent-activities")
def admin_recent_activities():

    return get_recent_activities()


# ==========================================================
# RECEPTIONIST APIs
# ==========================================================

@router.get("/api/admin-receptionists")
def get_receptionists():

    users = get_all_users()

    return [

        user

        for user in users

        if user.role.lower() == "receptionist"

    ]


@router.post("/api/admin-receptionists")
def add_receptionist(data: dict):

    return create_user(

        name=data["name"],

        email=data["email"],

        password=data["password"],

        role="receptionist",

        phone=data["phone"],

        date_of_birth=data["date_of_birth"],

        gender=data["gender"],

        address=data["address"],

        emergency_contact_name=data["emergency_contact_name"],

        emergency_contact_phone=data["emergency_contact_phone"],

        employee_id=data["employee_id"],

        department=data["department"],

        shift=data["shift"],

        status=data["status"]

    )


@router.put("/api/admin-receptionists/{user_id}")
def update_receptionist(
    user_id: int,
    data: dict
):

    return update_user(

        user_id=user_id,

        name=data["name"],

        email=data["email"],

        phone=data["phone"],

        date_of_birth=data["date_of_birth"],

        gender=data["gender"],

        address=data["address"],

        emergency_contact_name=data["emergency_contact_name"],

        emergency_contact_phone=data["emergency_contact_phone"],

        employee_id=data["employee_id"],

        department=data["department"],

        shift=data["shift"],

        status=data["status"]

    )


@router.delete("/api/admin-receptionists/{user_id}")
def delete_receptionist(user_id: int):

    return delete_user(user_id)


# ==========================================================
# RECEPTIONIST STATISTICS
# ==========================================================

@router.get("/api/admin-receptionists/stats")
def receptionist_stats():

    users = get_all_users()

    receptionists = [

        user

        for user in users

        if user.role.lower() == "receptionist"

    ]

    total_staff = len(receptionists)

    active_now = len([

        user

        for user in receptionists

        if (user.status or "").lower() == "active"

    ])

    off_duty = len([

        user

        for user in receptionists

        if (user.status or "").lower() == "off duty"

    ])

    on_break = len([

        user

        for user in receptionists

        if (user.status or "").lower() == "on break"

    ])

    return {

        "total_staff": total_staff,

        "active_now": active_now,

        "off_duty": off_duty,

        "on_break": on_break,

        "vacant_desks": max(0, total_staff - active_now)
    }
# ==========================================================
# EXPORT PATIENT REPORT
# ==========================================================

# ==========================================================
# EXPORT PATIENT REPORT
# ==========================================================

@router.get("/api/admin/export")
def export_report():

    patients = get_all_patients()

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "Patient ID",
        "Patient Name",
        "Phone",
        "Gender",
        "Blood Group",
        "Medical Condition"
    ])

    for patient in patients:

        writer.writerow([
            patient["patient_id"],
            patient["patient_name"],
            patient["phone"],
            patient["gender"],
            patient["blood_group"],
            patient["medical_condition"]
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=Hospital_Report.csv"
        }
    )