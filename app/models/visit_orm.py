from sqlalchemy import Column, Integer, Date, Text, TIMESTAMP
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


# GET
def get_all_visits():
    db = SessionLocal()

    try:
        visits = db.query(Visit).all()

        visit_list = []

        for visit in visits:
            visit_list.append({
                "visit_id": visit.visit_id,
                "patient_id": visit.patient_id,
                "doctor_id": visit.doctor_id,
                "visit_date": str(visit.visit_date),
                "chief_complaint": visit.chief_complaint,
                "visit_number": visit.visit_number
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
    visit_number
):
    db = SessionLocal()

    try:
        new_visit = Visit(
            patient_id=patient_id,
            doctor_id=doctor_id,
            visit_date=visit_date,
            chief_complaint=chief_complaint,
            visit_number=visit_number
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