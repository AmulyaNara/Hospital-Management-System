from sqlalchemy import Column, Integer, String, TIMESTAMP
from app.database.base import Base
from app.database.session import SessionLocal
from app.security.hash import hash_password


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


# GET
def get_all_patients():
    db = SessionLocal()

    try:
        patients = db.query(Patient).all()

        patient_list = []

        for patient in patients:
            patient_list.append({
                "patient_id": patient.patient_id,
                "patient_name": patient.patient_name,
                "age": patient.age,
                "gender": patient.gender,
                "phone": patient.phone,
                "address": patient.address,
                "blood_group": patient.blood_group,
                "email": patient.email,
                "password": "********"
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