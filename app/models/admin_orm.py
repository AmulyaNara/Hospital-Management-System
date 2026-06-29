from sqlalchemy import Column, Integer, String, TIMESTAMP
from app.database.base import Base
from app.database.session import SessionLocal
from app.security.hash import hash_password
from sqlalchemy import func
from datetime import date

from app.models.patient_orm import Patient
from app.models.doctor_orm import Doctor
from app.models.visit_orm import Visit

class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True, index=True)
    admin_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP)


def get_all_admins():
    db = SessionLocal()

    try:
        admins = db.query(Admin).all()

        admin_list = []

        for admin in admins:
            admin_list.append({
                "admin_id": admin.admin_id,
                "admin_name": admin.admin_name,
                "email": admin.email
            })

        return admin_list

    finally:
        db.close()

def get_admin_dashboard():

    db = SessionLocal()

    try:

        total_patients = db.query(Patient).count()

        total_doctors = db.query(Doctor).count()

        today_appointments = (
            db.query(Visit)
            .filter(Visit.visit_date == date.today())
            .count()
        )

        total_visits = db.query(Visit).count()

        revenue = total_visits * 500

        return {

            "total_patients": total_patients,

            "total_doctors": total_doctors,

            "today_appointments": today_appointments,

            "revenue": revenue

        }

    finally:

        db.close()

def get_recent_patients():

    db = SessionLocal()

    try:

        patients = (
            db.query(Patient)
            .order_by(Patient.created_at.desc())
            .limit(5)
            .all()
        )

        return [

            {

                "patient_name": p.patient_name,

                "patient_id": p.patient_id,

                "phone": p.phone,

                "last_visit": p.last_visit_date

            }

            for p in patients

        ]

    finally:

        db.close()
    
def get_recent_visits():

    from app.models.patient_orm import Patient
    from app.models.doctor_orm import Doctor

    db = SessionLocal()

    try:

        visits = (

            db.query(
                Visit,
                Patient.patient_name,
                Doctor.doctor_name
            )

            .join(
                Patient,
                Visit.patient_id == Patient.patient_id
            )

            .join(
                Doctor,
                Visit.doctor_id == Doctor.doctor_id
            )

            .order_by(
                Visit.visit_date.desc()
            )

            .limit(5)

            .all()

        )

        return [

            {

                "patient": patient_name,

                "doctor": doctor_name,

                "date": str(visit.visit_date),

                "status": visit.visit_status

            }

            for visit, patient_name, doctor_name in visits

        ]

    finally:

        db.close()

def get_recent_activities():

    return [

        {

            "activity": "New patient registered",

            "time": "5 minutes ago"

        },

        {

            "activity": "Doctor updated profile",

            "time": "15 minutes ago"

        },

        {

            "activity": "Appointment booked",

            "time": "20 minutes ago"

        }

    ]
    
def create_admin(
    admin_name,
    email,
    password
):
    db = SessionLocal()

    try:
        new_admin = Admin(
            admin_name=admin_name,
            email=email,
            password=hash_password(password)
        )

        db.add(new_admin)
        db.commit()

        return {
            "message": "Admin created successfully!"
        }

    finally:
        db.close()