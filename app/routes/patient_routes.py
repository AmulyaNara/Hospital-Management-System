from fastapi import (
    APIRouter,
    Depends,
    Request
)

from fastapi.responses import (
    HTMLResponse,
    FileResponse
)

from fastapi.templating import Jinja2Templates

from reportlab.pdfgen import canvas

import tempfile
import os

from app.database.session import SessionLocal

from app.models.patient_orm import (
    Patient,
    get_all_patients,
    create_patient,
    update_patient,
    delete_patient,
    get_patient_dashboard,
    get_patient_upcoming_appointments,
    get_patient_records,
    get_patient_reminders,
    get_patient_profile
)

from app.models.visit_orm import Visit
from app.models.doctor_orm import Doctor
from app.models.diagnosis_orm import Diagnosis

from app.schemas.patient_schema import PatientCreate

from app.security.oauth2 import get_current_user
from app.security.role_checker import require_role


# ==========================================================
# Router
# ==========================================================

router = APIRouter()

templates = Jinja2Templates(
    directory="app/templates"
)

# ==========================================================
# PATIENT LIST
# ==========================================================

@router.get("/patients")
def get_patients(

    current_user=Depends(
        get_current_user
    )

):

    require_role(

        current_user,

        [
            "admin",
            "doctor",
            "receptionist"
        ]

    )

    return get_all_patients()


# ==========================================================
# PATIENT STATISTICS
# ==========================================================

@router.get("/patient-stats")
def get_patient_stats():

    db = SessionLocal()

    try:

        total_patients = (
            db.query(Patient)
            .count()
        )

        critical_care = (
            db.query(Patient)
            .filter(
                Patient.clinical_status == "Critical"
            )
            .count()
        )

        pending_followups = (
            db.query(Patient)
            .filter(
                Patient.last_visit_date == None
            )
            .count()
        )

        return {

            "total_patients":
                total_patients,

            "critical_care":
                critical_care,

            "pending_followups":
                pending_followups,

            "avg_wait_time":
                18

        }

    finally:

        db.close()
# ==========================================================
# BOOK APPOINTMENT PAGE
# ==========================================================

@router.get("/book-appointment")
def book_appointment_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/book_appointment.html",
        context={}
    )

# ==========================================================
# APPOINTMENT HISTORY PAGE
# ==========================================================

@router.get(
    "/appointment-history",
    response_class=HTMLResponse
)
def appointment_history_page(
    request: Request
):

    return templates.TemplateResponse(
        "patient_dashboard/appointment_history.html",
        {
            "request": request
        }
    )


# ==========================================================
# PATIENT DASHBOARD API
# ==========================================================

@router.get("/api/patient-dashboard")
def patient_dashboard(

    current_user=Depends(
        get_current_user
    )

):

    return get_patient_dashboard(
        current_user["email"]
    )


# ==========================================================
# PATIENT APPOINTMENTS
# ==========================================================

@router.get("/api/patient-appointments")
def patient_appointments(

    current_user=Depends(
        get_current_user
    )

):

    return get_patient_upcoming_appointments(
        current_user["email"]
    )


# ==========================================================
# PATIENT MEDICAL RECORDS
# ==========================================================

@router.get("/api/patient-records")
def patient_records(

    current_user=Depends(
        get_current_user
    )

):

    return get_patient_records(
        current_user["email"]
    )


# ==========================================================
# PATIENT REMINDERS
# ==========================================================

@router.get("/api/patient-reminders")
def patient_reminders(

    current_user=Depends(
        get_current_user
    )

):

    return get_patient_reminders(
        current_user["email"]
    )


@router.get("/patient-support")
def patient_support(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_support.html",
        context={}
    )
# ==========================================================
# BOOK APPOINTMENT PATIENT DETAILS
# ==========================================================

@router.get("/api/book-appointment/patient")
def appointment_patient(

    current_user=Depends(
        get_current_user
    )

):

    return get_patient_profile(
        current_user["email"]
    )
@router.get("/patients/{patient_id}")
def get_patient(patient_id: int):

    db = SessionLocal()

    try:

        patient = (
            db.query(Patient)
            .filter(Patient.patient_id == patient_id)
            .first()
        )

        if not patient:
            return {"error": "Patient not found"}

        return {
            "patient_id": patient.patient_id,
            "patient_name": patient.patient_name,
            "age": patient.age,
            "gender": patient.gender,
            "phone": patient.phone,
            "address": patient.address,
            "blood_group": patient.blood_group,
            "email": patient.email,
            "medical_condition": patient.medical_condition,
            "clinical_status": patient.clinical_status
        }

    finally:
        db.close()
# ==========================================================
# CREATE PATIENT
# ==========================================================

@router.post("/patients")
def add_patient(
    patient: PatientCreate,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        [
            "admin",
            "receptionist",
            "patient"
        ]
    )

    return create_patient(
        patient.patient_name,
        patient.age,
        patient.gender,
        patient.phone,
        patient.address,
        patient.blood_group,
        patient.email,
        patient.password
    )


# ==========================================================
# UPDATE PATIENT
# ==========================================================

@router.put("/patients/{patient_id}")
def edit_patient(
    patient_id: int,
    phone: str,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        [
            "admin",
            "receptionist"
        ]
    )

    return update_patient(
        patient_id,
        phone
    )


# ==========================================================
# DELETE PATIENT
# ==========================================================

@router.delete("/patients/{patient_id}")
def remove_patient(
    patient_id: int,
    current_user=Depends(get_current_user)
):

    require_role(
        current_user,
        [
            "admin"
        ]
    )

    return delete_patient(
        patient_id
    )
# ==========================================================
# DOWNLOAD MEDICAL REPORT (PDF)
# ==========================================================

@router.get("/api/record/{record_id}/download")
def download_record(record_id: int):

    db = SessionLocal()

    try:

        record = (
            db.query(
                Diagnosis,
                Visit,
                Patient.patient_name,
                Doctor.doctor_name
            )
            .join(
                Visit,
                Diagnosis.visit_id == Visit.visit_id
            )
            .join(
                Patient,
                Visit.patient_id == Patient.patient_id
            )
            .join(
                Doctor,
                Visit.doctor_id == Doctor.doctor_id
            )
            .filter(
                Diagnosis.diagnosis_id == record_id
            )
            .first()
        )

        if not record:

            return {
                "error": "Medical record not found"
            }

        diagnosis, visit, patient_name, doctor_name = record

        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        )

        pdf = canvas.Canvas(temp_file.name)

        # -----------------------------
        # Header
        # -----------------------------

        pdf.setFont("Helvetica-Bold", 20)

        pdf.drawString(
            170,
            800,
            "MEDCORE HOSPITAL"
        )

        pdf.setFont("Helvetica", 12)

        y = 760

        details = [

            ("Patient Name", patient_name),

            ("Doctor", doctor_name),

            ("Disease", diagnosis.disease),

            ("Severity", diagnosis.severity),

            ("Status", diagnosis.diagnosis_status),

            ("Diagnosis Date", str(diagnosis.diagnosis_date)),

            ("Visit Date", str(visit.visit_date))

        ]

        for label, value in details:

            pdf.drawString(
                50,
                y,
                f"{label} : {value}"
            )

            y -= 25

        y -= 20

        pdf.setFont(
            "Helvetica-Bold",
            14
        )

        pdf.drawString(
            50,
            y,
            "Chief Complaint"
        )

        y -= 25

        pdf.setFont(
            "Helvetica",
            12
        )

        pdf.drawString(
            50,
            y,
            visit.chief_complaint or "N/A"
        )

        y -= 50

        pdf.drawString(
            50,
            y,
            "Generated by MedCore Hospital Management System"
        )

        pdf.save()

        return FileResponse(
            temp_file.name,
            media_type="application/pdf",
            filename=f"Medical_Report_{record_id}.pdf"
        )

    finally:

        db.close()
# ==========================================================
# DOWNLOAD MEDICAL REPORT (PDF)
# ==========================================================

@router.get("/api/record/{record_id}/download")
def download_record(record_id: int):

    db = SessionLocal()

    try:

        record = (
            db.query(
                Diagnosis,
                Visit,
                Patient.patient_name,
                Doctor.doctor_name
            )
            .join(
                Visit,
                Diagnosis.visit_id == Visit.visit_id
            )
            .join(
                Patient,
                Visit.patient_id == Patient.patient_id
            )
            .join(
                Doctor,
                Visit.doctor_id == Doctor.doctor_id
            )
            .filter(
                Diagnosis.diagnosis_id == record_id
            )
            .first()
        )

        if not record:

            return {
                "error": "Medical record not found"
            }

        diagnosis, visit, patient_name, doctor_name = record

        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        )

        pdf = canvas.Canvas(temp_file.name)

        # -----------------------------
        # Header
        # -----------------------------

        pdf.setFont("Helvetica-Bold", 20)

        pdf.drawString(
            170,
            800,
            "MEDCORE HOSPITAL"
        )

        pdf.setFont("Helvetica", 12)

        y = 760

        details = [

            ("Patient Name", patient_name),

            ("Doctor", doctor_name),

            ("Disease", diagnosis.disease),

            ("Severity", diagnosis.severity),

            ("Status", diagnosis.diagnosis_status),

            ("Diagnosis Date", str(diagnosis.diagnosis_date)),

            ("Visit Date", str(visit.visit_date))

        ]

        for label, value in details:

            pdf.drawString(
                50,
                y,
                f"{label} : {value}"
            )

            y -= 25

        y -= 20

        pdf.setFont(
            "Helvetica-Bold",
            14
        )

        pdf.drawString(
            50,
            y,
            "Chief Complaint"
        )

        y -= 25

        pdf.setFont(
            "Helvetica",
            12
        )

        pdf.drawString(
            50,
            y,
            visit.chief_complaint or "N/A"
        )

        y -= 50

        pdf.drawString(
            50,
            y,
            "Generated by MedCore Hospital Management System"
        )

        pdf.save()

        return FileResponse(
            temp_file.name,
            media_type="application/pdf",
            filename=f"Medical_Report_{record_id}.pdf"
        )

    finally:

        db.close()