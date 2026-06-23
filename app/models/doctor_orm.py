from sqlalchemy import Column, Integer, String, TIMESTAMP
from app.database.base import Base
from app.database.session import SessionLocal
from app.security.hash import hash_password


class Doctor(Base):
    __tablename__ = "doctors"

    doctor_id = Column(Integer, primary_key=True, index=True)
    doctor_name = Column(String(100), nullable=False)
    specialization = Column(String(100))
    phone = Column(String(15))
    email = Column(String(100))
    password = Column(String(255))
    experience_years = Column(Integer)
    created_at = Column(TIMESTAMP)
    clinical_status = Column(String(20), default="Active")
    #profile_image = Column(String(255))
# GET
def get_all_doctors():
    db = SessionLocal()

    try:
        doctors = db.query(Doctor).all()

        doctor_list = []

        for doctor in doctors:
            doctor_list.append({
                "doctor_id": doctor.doctor_id,
                "doctor_name": doctor.doctor_name,
                "specialization": doctor.specialization,
                "phone": doctor.phone,
                "email": doctor.email,
                "password": "********",
                "experience_years": doctor.experience_years,
                "clinical_status": doctor.clinical_status
            })

        return doctor_list

    finally:
        db.close()


# POST
def create_doctor(
    name,
    specialization,
    phone,
    email,
    password,
    experience
):
    db = SessionLocal()

    try:
        new_doctor = Doctor(
            doctor_name=name,
            specialization=specialization,
            phone=phone,
            email=email,
            password=hash_password(password),
            experience_years=experience,
            clinical_status="Active"
        )

        db.add(new_doctor)
        db.commit()

        return {
            "message": "Doctor created successfully!"
        }

    finally:
        db.close()


# PUT
def update_doctor(
    doctor_id,
    specialization
):
    db = SessionLocal()

    try:
        doctor = (
            db.query(Doctor)
            .filter(
                Doctor.doctor_id == doctor_id
            )
            .first()
        )

        if not doctor:
            return {"error": "Doctor not found"}

        doctor.specialization = specialization

        db.commit()

        return {
            "message": "Doctor updated successfully!"
        }

    finally:
        db.close()


# DELETE
def delete_doctor(
    doctor_id
):
    db = SessionLocal()

    try:
        doctor = (
            db.query(Doctor)
            .filter(
                Doctor.doctor_id == doctor_id
            )
            .first()
        )

        if not doctor:
            return {"error": "Doctor not found"}

        db.delete(doctor)

        db.commit()

        return {
            "message": "Doctor deleted successfully!"
        }

    finally:
        db.close()