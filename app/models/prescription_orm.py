from sqlalchemy import Column, Integer, String, Text
from app.database.base import Base
from app.database.session import SessionLocal


class Prescription(Base):
    __tablename__ = "prescriptions"

    prescription_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    visit_id = Column(Integer, nullable=False)

    medicine_name = Column(String(255))

    dosage = Column(String(100))

    frequency = Column(String(100))

    duration = Column(String(100))

    instructions = Column(Text)

    #created_at = Column(TIMESTAMP)


# GET
def get_all_prescriptions():
    db = SessionLocal()

    try:
        prescriptions = db.query(Prescription).all()

        prescription_list = []

        for prescription in prescriptions:
            prescription_list.append({
                "prescription_id": prescription.prescription_id,
                "visit_id": prescription.visit_id,
                "medicine_name": prescription.medicine_name,
                "dosage": prescription.dosage,
                "frequency": prescription.frequency,
                "duration": prescription.duration,
                "instructions": prescription.instructions
            })

        return prescription_list

    except Exception as e:
        return {"error": str(e)}

    finally:
        db.close()


# POST
def create_prescription(
    visit_id,
    medicine_name,
    dosage,
    frequency,
    duration,
    instructions
):
    db = SessionLocal()

    try:
        new_prescription = Prescription(
            visit_id=visit_id,
            medicine_name=medicine_name,
            dosage=dosage,
            frequency=frequency,
            duration=duration,
            instructions=instructions
        )

        db.add(new_prescription)
        db.commit()
        db.refresh(new_prescription)

        return {
            "message": "Prescription created successfully!"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()


# PUT
def update_prescription(
    prescription_id,
    medicine_name,
    dosage,
    frequency,
    duration,
    instructions
):
    db = SessionLocal()

    try:
        prescription = (
            db.query(Prescription)
            .filter(
                Prescription.prescription_id == prescription_id
            )
            .first()
        )

        if not prescription:
            return {
                "error": "Prescription not found"
            }

        prescription.medicine_name = medicine_name
        prescription.dosage = dosage
        prescription.frequency = frequency
        prescription.duration = duration
        prescription.instructions = instructions

        db.commit()

        return {
            "message": "Prescription updated successfully!"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()


# DELETE
def delete_prescription(
    prescription_id
):
    db = SessionLocal()

    try:
        prescription = (
            db.query(Prescription)
            .filter(
                Prescription.prescription_id == prescription_id
            )
            .first()
        )

        if not prescription:
            return {
                "error": "Prescription not found"
            }

        db.delete(prescription)

        db.commit()

        return {
            "message": "Prescription deleted successfully!"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()