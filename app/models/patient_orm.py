from sqlalchemy import Column, Integer, String, TIMESTAMP,Date,Time
from app.database.base import Base
from app.database.session import SessionLocal
from app.security.hash import hash_password
from app.models.visit_orm import Visit
from app.models.doctor_orm import Doctor
from datetime import datetime
from app.models.diagnosis_orm import Diagnosis
from app.models.visit_orm import Visit
from app.models.doctor_orm import Doctor

from app.models.lab_orm import Lab
from app.models.billing_orm import Billing

class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    phone = Column(String(15))
    address = Column(String)
    blood_group = Column(String(5))
    email = Column(String(100))
    password = Column(String(255))
    created_at = Column(TIMESTAMP)
    medical_condition = Column(String(255))
    clinical_status = Column(String(20))
    last_visit_date = Column(Date)
    last_visit_time = Column(Time)

# GET
def get_all_patients():
    db = SessionLocal()

    try:
        patients = db.query(Patient).all()

        patient_list = []

        for patient in patients:
            latest_visit = (
                        db.query(Visit)
                        .filter(
                            Visit.patient_id == patient.patient_id
                        )
                        .order_by(
                            Visit.visit_date.desc()
                        )
                        .first()
                )
            patient_list.append({
                "patient_id": patient.patient_id,
                "patient_name": patient.patient_name,
                "age": patient.age,
                "gender": patient.gender,
                "phone": patient.phone,
                "address": patient.address,
                "blood_group": patient.blood_group,
                "email": patient.email,
                "password": "********",
                "medical_condition": patient.medical_condition,
                "clinical_status": patient.clinical_status,
                "last_visit_date": (
                    f"{latest_visit.visit_date} {latest_visit.visit_time}"
                    if latest_visit and latest_visit.visit_time
                    else str(latest_visit.visit_date)
                    if latest_visit
                    else "No Visit"
                ),
                "last_visit_time": (
                str(latest_visit.visit_time)
                if latest_visit
                else ""
            )
            })

        return patient_list

    finally:
        db.close()


# POST
def create_patient(
    name,
    age,
    gender,
    phone,
    address,
    blood_group,
    email,
    password
):
    db = SessionLocal()

    try:
        new_patient = Patient(
            patient_name=name,
            age=age,
            gender=gender,
            phone=phone,
            address=address,
            blood_group=blood_group,
            email=email,
            password=hash_password(password)
        )

        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)

        return {
            "message": "Patient created successfully!"
        }

    finally:
        db.close()


# PUT
def update_patient(
    patient_id,
    phone
):
    db = SessionLocal()

    try:
        patient = (
            db.query(Patient)
            .filter(
                Patient.patient_id == patient_id
            )
            .first()
        )

        if not patient:
            return {"error": "Patient not found"}

        patient.phone = phone

        db.commit()

        return {
            "message": "Patient updated successfully!"
        }

    finally:
        db.close()


# DELETE
def delete_patient(
    patient_id
):
    db = SessionLocal()

    try:
        patient = (
            db.query(Patient)
            .filter(
                Patient.patient_id == patient_id
            )
            .first()
        )

        if not patient:
            return {"error": "Patient not found"}

        db.delete(patient)

        db.commit()

        return {
            "message": "Patient deleted successfully!"
        }

    finally:
        db.close()
        
# ==========================================
# Patient Dashboard
# ==========================================

from app.models.prescription_orm import Prescription
from app.models.diagnosis_orm import Diagnosis


def get_patient_dashboard(email):

    db = SessionLocal()

    try:

        hour = datetime.now().hour

        if hour < 12:
            greeting = "Good Morning"
        elif hour < 17:
            greeting = "Good Afternoon"
        else:
            greeting = "Good Evening"

        patient = (
            db.query(Patient)
            .filter(Patient.email == email)
            .first()
        )

        if not patient:
            return {"error": "Patient not found"}

        latest_visit = (
            db.query(
                Visit,
                Doctor.doctor_name
            )
            .join(
                Doctor,
                Visit.doctor_id == Doctor.doctor_id
            )
            .filter(
                Visit.patient_id == patient.patient_id
            )
            .order_by(
                Visit.visit_date.desc()
            )
            .first()
        )

        doctor_name = ""

        if latest_visit:
            visit, doctor_name = latest_visit
        else:
            visit = None

        active_prescriptions = (
            db.query(Prescription)
            .filter(
                Prescription.patient_name == patient.patient_name,
                Prescription.prescription_status == "Active"
            )
            .count()
        )

        latest_diagnosis = (
            db.query(Diagnosis)
            .filter(
                Diagnosis.patient_name == patient.patient_name
            )
            .order_by(
                Diagnosis.diagnosis_id.desc()
            )
            .first()
        )

        latest_lab = (
            db.query(Lab)
            .filter(
                Lab.patient_name == patient.patient_name
            )
            .order_by(
                Lab.test_date.desc()
            )
            .first()
        )

        pending_bill = (
            db.query(Billing)
            .filter(
                Billing.patient_name == patient.patient_name,
                Billing.payment_status == "Pending"
            )
            .order_by(
                Billing.bill_date.desc()
            )
            .first()
        )

        return {

            "greeting": greeting,

            "patient_name": patient.patient_name,

            "patient_id": patient.patient_id,

            "blood_group": patient.blood_group,

            "medical_condition": patient.medical_condition,

            "clinical_status": patient.clinical_status,

            "last_visit_date":
                str(patient.last_visit_date)
                if patient.last_visit_date
                else "",

            "active_prescriptions":
                active_prescriptions,

            "latest_diagnosis":
                latest_diagnosis.disease
                if latest_diagnosis
                else "",

            "next_visit_date":
                str(visit.visit_date)
                if visit
                else "",

            "next_visit_time":
                str(visit.visit_time)
                if visit and visit.visit_time
                else "",

            "doctor_name":
                doctor_name,

            "next_visit_reason":
                visit.chief_complaint
                if visit
                else "",

            "next_visit_status":
                visit.visit_status
                if visit
                else "",

            "recent_lab_result":
                latest_lab.result
                if latest_lab
                else "No Result",

            "outstanding_balance":
                float(pending_bill.amount)
                if pending_bill
                else 0

        }

    finally:

        db.close()


# ==========================================
# Upcoming Appointments
# ==========================================

def get_patient_upcoming_appointments(email):

    db = SessionLocal()

    try:

        patient = (
            db.query(Patient)
            .filter(
                Patient.email == email
            )
            .first()
        )

        if not patient:
            return []

        appointments = (
            db.query(
                Visit,
                Doctor.doctor_name,
                Doctor.specialization
            )
            .join(
                Doctor,
                Visit.doctor_id == Doctor.doctor_id
            )
            .filter(
                Visit.patient_id == patient.patient_id
            )
            .order_by(
                Visit.visit_date.asc()
            )
            .all()
        )

        data = []

        for visit, doctor_name, specialization in appointments:

            data.append({

                "visit_id": visit.visit_id,

                "doctor_name": doctor_name,

                "specialization": specialization,

                "visit_date": str(visit.visit_date),

                "visit_time":
                    str(visit.visit_time)
                    if visit.visit_time
                    else "Time Not Available",

                "status":
                    visit.visit_status
                    if visit.visit_status
                    else "Scheduled"

            })

        return data

    finally:

        db.close()
# ==========================================
# Patient Medical Records
# ==========================================

def get_patient_records(email):

    db = SessionLocal()

    try:

        patient = (
            db.query(Patient)
            .filter(Patient.email == email)
            .first()
        )

        if not patient:
            return []

        records = (
            db.query(
                Diagnosis,
                Visit,
                Doctor.doctor_name
            )
            
            .join(
                Visit,
                Diagnosis.visit_id == Visit.visit_id
            )
            .join(
                Doctor,
                Visit.doctor_id == Doctor.doctor_id
            )
            .filter(
                Visit.patient_id == patient.patient_id
            )
            .order_by(
                Diagnosis.diagnosis_date.desc()
            )
            .all()
        )

        data = []

        for diagnosis, visit, doctor_name in records:

            data.append({

                "record_id": diagnosis.diagnosis_id,

                "document_name": diagnosis.disease,

                "doctor_name": doctor_name,

                "category": "Diagnosis",

                "date": str(diagnosis.diagnosis_date),

                "severity": diagnosis.severity,

                "status": diagnosis.diagnosis_status

            })

        return data

    finally:

        db.close()