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
    patient_name = Column(String(100))
    patient_code = Column(String(30))
    severity = Column(String(30))
    diagnosis_status = Column(String(30))
    icd_code = Column(String(30))
    consult_fee = Column(Integer)


# GET
def get_all_diagnosis(
    search="",
    status="",
    severity=""
):
    db = SessionLocal()

    try:

        query = db.query(Diagnosis)

        # Search
        if search:
            query = query.filter(
                (Diagnosis.patient_name.ilike(f"%{search}%")) |
                (Diagnosis.disease.ilike(f"%{search}%")) |
                (Diagnosis.patient_code.ilike(f"%{search}%"))
            )

        # Status Filter
        if status:
            query = query.filter(
                Diagnosis.diagnosis_status == status
            )

        # Severity Filter
        if severity:
            query = query.filter(
                Diagnosis.severity == severity
            )

        diagnoses = query.all()

        diagnosis_list = []

        for diagnosis in diagnoses:

            diagnosis_list.append({

                "diagnosis_id": diagnosis.diagnosis_id,
                "visit_id": diagnosis.visit_id,
                "disease": diagnosis.disease,
                "symptoms": diagnosis.symptoms,
                "doctor_notes": diagnosis.doctor_notes,
                "diagnosis_date": str(diagnosis.diagnosis_date),
                "patient_name": diagnosis.patient_name,
                "patient_code": diagnosis.patient_code,
                "severity": diagnosis.severity,
                "diagnosis_status": diagnosis.diagnosis_status,
                "icd_code": diagnosis.icd_code,
                "consult_fee": diagnosis.consult_fee

            })

        return diagnosis_list

    finally:

        db.close()

# POST
def create_diagnosis(
    visit_id,
    disease,
    symptoms,
    doctor_notes,
    patient_name,
    patient_code,
    severity,
    diagnosis_status,
    icd_code
):
    db = SessionLocal()

    try:
        new_diagnosis = Diagnosis(
    visit_id=visit_id,
    disease=disease,
    symptoms=symptoms,
    doctor_notes=doctor_notes,
    diagnosis_date=date.today(),
    patient_name=patient_name,
    patient_code=patient_code,
    severity=severity,
    diagnosis_status=diagnosis_status,
    icd_code=icd_code
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