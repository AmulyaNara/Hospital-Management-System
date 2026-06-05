from sqlalchemy import Column, Integer, String, Text, Date
from app.database.base import Base
from app.database.session import SessionLocal
from datetime import date

class Diagnosis(Base):
    __tablename__ = "diagnosis"

    diagnosis_id = Column(Integer, primary_key=True, index=True)

    visit_id = Column(Integer, nullable=False)

    disease = Column(String(200), nullable=False)

    symptoms = Column(Text)

    doctor_notes = Column(Text)

    diagnosis_date = Column(Date)


# GET
def get_all_diagnosis():
    db = SessionLocal()

    try:
        diagnoses = db.query(Diagnosis).all()

        diagnosis_list = []

        for diagnosis in diagnoses:
            diagnosis_list.append({
                "diagnosis_id": diagnosis.diagnosis_id,
                "visit_id": diagnosis.visit_id,
                "disease": diagnosis.disease,
                "symptoms": diagnosis.symptoms,
                "doctor_notes": diagnosis.doctor_notes,
                "diagnosis_date": (
    str(diagnosis.diagnosis_date)
    if diagnosis.diagnosis_date
    else "Not Available"
)
            })

        return diagnosis_list

    except Exception as e:
        return {"error": str(e)}

    finally:
        db.close()


# POST
def create_diagnosis(
    visit_id,
    disease,
    symptoms,
    doctor_notes
):
    db = SessionLocal()

    try:
        new_diagnosis = Diagnosis(
    visit_id=visit_id,
    disease=disease,
    symptoms=symptoms,
    doctor_notes=doctor_notes,
    diagnosis_date=date.today()
)

        db.add(new_diagnosis)
        db.commit()
        db.refresh(new_diagnosis)

        return {
            "message": "Diagnosis created successfully!"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()


# PUT
def update_diagnosis(
    diagnosis_id,
    disease
):
    db = SessionLocal()

    try:
        diagnosis = (
            db.query(Diagnosis)
            .filter(
                Diagnosis.diagnosis_id == diagnosis_id
            )
            .first()
        )

        if not diagnosis:
            return {
                "error": "Diagnosis not found"
            }

        diagnosis.disease = disease

        db.commit()

        return {
            "message": "Diagnosis updated successfully!"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()


# DELETE
def delete_diagnosis(
    diagnosis_id
):
    db = SessionLocal()

    try:
        diagnosis = (
            db.query(Diagnosis)
            .filter(
                Diagnosis.diagnosis_id == diagnosis_id
            )
            .first()
        )

        if not diagnosis:
            return {
                "error": "Diagnosis not found"
            }

        db.delete(diagnosis)

        db.commit()

        return {
            "message": "Diagnosis deleted successfully!"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()