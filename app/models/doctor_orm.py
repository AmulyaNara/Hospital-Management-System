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
def get_all_doctors(
    page=1,
    limit=10,
    search="",
    specialization=""
):
    db = SessionLocal()

    try:

        query = db.query(Doctor)

        # Search
        if search:
            query = query.filter(
                Doctor.doctor_name.ilike(f"%{search}%")
            )

        # Filter
        if specialization:
            query = query.filter(
                Doctor.specialization.ilike(f"%{specialization}%")
            )

        total = query.count()

        doctors = (
            query
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        doctor_list = []

        for doctor in doctors:
            doctor_list.append({
                "doctor_id": doctor.doctor_id,
                "doctor_name": doctor.doctor_name,
                "specialization": doctor.specialization,
                "phone": doctor.phone,
                "email": doctor.email,
                "experience_years": doctor.experience_years,
                "clinical_status": doctor.clinical_status
            })

        return {
            "data": doctor_list,
            "page": page,
            "limit": limit,
            "total": total,
            "pages": (total + limit - 1) // limit
        }

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
# =====================================================
# UPDATE DOCTOR
# =====================================================

def update_doctor(
    doctor_id,
    doctor_name,
    specialization,
    phone,
    email,
    experience_years,
    clinical_status
):

    db = SessionLocal()

    try:

        doctor = (
            db.query(Doctor)
            .filter(Doctor.doctor_id == doctor_id)
            .first()
        )

        if not doctor:

            return {
                "message": "Doctor not found"
            }

        doctor.doctor_name = doctor_name
        doctor.specialization = specialization
        doctor.phone = phone
        doctor.email = email
        doctor.experience_years = experience_years
        doctor.clinical_status = clinical_status

        db.commit()

        db.refresh(doctor)

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