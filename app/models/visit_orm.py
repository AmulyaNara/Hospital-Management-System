from sqlalchemy import (
    Column,
    Integer,
    Date,
    Time,
    Text,
    TIMESTAMP,
    String
)

from app.database.base import Base
from app.database.session import SessionLocal




class Visit(Base):
    __tablename__ = "visits"

    visit_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False)
    doctor_id = Column(Integer, nullable=False)
    visit_date = Column(Date, nullable=False)
    chief_complaint = Column(Text)
    visit_number = Column(Integer)
    created_at = Column(TIMESTAMP)
    visit_time = Column(Time)
    visit_status = Column(String(30))

# GET
def get_all_visits():
    from app.models.patient_orm import Patient
    db = SessionLocal()

    try:
        visits = (
            db.query(
                Visit,
                Patient.patient_name
            )
            .join(
                Patient,
                Visit.patient_id == Patient.patient_id
            )
            .all()
        )

        visit_list = []

        for visit, patient_name in visits:
            visit_list.append({
                "visit_id": visit.visit_id,
                "patient_id": visit.patient_id,
                "doctor_id": visit.doctor_id,
                "patient_name": patient_name,
                "visit_date": str(visit.visit_date),
                "chief_complaint": visit.chief_complaint,
                "visit_number": visit.visit_number,
                "visit_time": str(visit.visit_time),
                "visit_status": visit.visit_status
})

        return visit_list

    except Exception as e:
        return {"error": str(e)}

    finally:
        db.close()


# POST
def create_visit(
    patient_id,
    doctor_id,
    visit_date,
    chief_complaint,
    visit_number,
    visit_time,
    visit_status
):
    db = SessionLocal()

    try:
        new_visit = Visit(
            patient_id=patient_id,
            doctor_id=doctor_id,
            visit_date=visit_date,
            chief_complaint=chief_complaint,
            visit_number=visit_number,
            visit_time=visit_time,
            visit_status=visit_status
        )

        db.add(new_visit)
        db.commit()
        db.refresh(new_visit)

        return {
            "message": "Visit created successfully!"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()



def get_patient_appointments(email):
    from app.models.patient_orm import Patient
    db = SessionLocal()

    try:

        patient = (
            db.query(Patient)
            .filter(Patient.email == email)
            .first()
        )

        if not patient:
            return []

        visits = (
            db.query(Visit)
            .filter(
                Visit.patient_id == patient.patient_id
            )
            .order_by(
                Visit.visit_date.desc()
            )
            .all()
        )

        visit_list = []

        for visit in visits:

            visit_list.append({

                "visit_id": visit.visit_id,

                "visit_date": str(visit.visit_date),

                "visit_time": str(visit.visit_time),

               
               #"doctor_name": visit.doctor_name,

                "reason": visit.chief_complaint,
                "status": visit.visit_status,

            })

        return visit_list

    finally:

        db.close()
        
# PUT
def update_visit(
    visit_id,
    chief_complaint
):
    db = SessionLocal()

    try:
        visit = (
            db.query(Visit)
            .filter(
                Visit.visit_id == visit_id
            )
            .first()
        )

        if not visit:
            return {
                "error": "Visit not found"
            }

        visit.chief_complaint = chief_complaint

        db.commit()

        return {
            "message": "Visit updated successfully!"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()


# DELETE
def delete_visit(
    visit_id
):
    db = SessionLocal()

    try:
        visit = (
            db.query(Visit)
            .filter(
                Visit.visit_id == visit_id
            )
            .first()
        )

        if not visit:
            return {
                "error": "Visit not found"
            }

        db.delete(visit)

        db.commit()

        return {
            "message": "Visit deleted successfully!"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()