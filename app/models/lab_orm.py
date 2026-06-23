from sqlalchemy import Column, Integer, String, Date
from app.database.base import Base
from app.database.session import SessionLocal


class Lab(Base):

    __tablename__ = "labs"

    lab_id = Column(Integer, primary_key=True, index=True)

    patient_name = Column(String(100), nullable=False)

    patient_code = Column(String(20))

    test_name = Column(String(100))

    test_date = Column(Date)

    result = Column(String(100))

    doctor_name = Column(String(100))

    status = Column(String(30))


# ==========================================
# GET ALL LABS
# ==========================================

def get_all_labs():

    db = SessionLocal()

    try:

        labs = db.query(Lab).all()

        lab_list = []

        for lab in labs:

            lab_list.append({

                "lab_id": lab.lab_id,

                "patient_name": lab.patient_name,

                "patient_code": lab.patient_code,

                "test_name": lab.test_name,

                "test_date": str(lab.test_date),

                "result": lab.result,

                "doctor_name": lab.doctor_name,

                "status": lab.status

            })

        return lab_list

    finally:

        db.close()


# ==========================================
# GET PATIENT LABS
# ==========================================

def get_patient_labs(patient_name):

    db = SessionLocal()

    try:

        labs = (
            db.query(Lab)
            .filter(
                Lab.patient_name == patient_name
            )
            .order_by(
                Lab.test_date.desc()
            )
            .all()
        )

        lab_list = []

        for lab in labs:

            lab_list.append({

                "lab_id": lab.lab_id,

                "patient_name": lab.patient_name,

                "patient_code": lab.patient_code,

                "test_name": lab.test_name,

                "test_date": str(lab.test_date),

                "result": lab.result,

                "doctor_name": lab.doctor_name,

                "status": lab.status

            })

        return lab_list

    finally:

        db.close()


# ==========================================
# CREATE LAB
# ==========================================

def create_lab(

    patient_name,
    patient_code,
    test_name,
    test_date,
    result,
    doctor_name,
    status

):

    db = SessionLocal()

    try:

        new_lab = Lab(

            patient_name=patient_name,
            patient_code=patient_code,
            test_name=test_name,
            test_date=test_date,
            result=result,
            doctor_name=doctor_name,
            status=status

        )

        db.add(new_lab)

        db.commit()

        db.refresh(new_lab)

        return {

            "message":
            "Lab created successfully!"

        }

    finally:

        db.close()


# ==========================================
# UPDATE LAB
# ==========================================

def update_lab(

    lab_id,
    result,
    status

):

    db = SessionLocal()

    try:

        lab = (

            db.query(Lab)

            .filter(

                Lab.lab_id == lab_id

            )

            .first()

        )

        if not lab:

            return {

                "error":
                "Lab not found"

            }

        lab.result = result

        lab.status = status

        db.commit()

        return {

            "message":
            "Lab updated successfully!"

        }

    finally:

        db.close()


# ==========================================
# DELETE LAB
# ==========================================

def delete_lab(

    lab_id

):

    db = SessionLocal()

    try:

        lab = (

            db.query(Lab)

            .filter(

                Lab.lab_id == lab_id

            )

            .first()

        )

        if not lab:

            return {

                "error":
                "Lab not found"

            }

        db.delete(lab)

        db.commit()

        return {

            "message":
            "Lab deleted successfully!"

        }

    finally:

        db.close()