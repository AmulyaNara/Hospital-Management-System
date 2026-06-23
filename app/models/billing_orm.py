from sqlalchemy import Column, Integer, String, Date, Numeric
from app.database.base import Base
from app.database.session import SessionLocal


class Billing(Base):

    __tablename__ = "billings"

    billing_id = Column(Integer, primary_key=True, index=True)

    patient_name = Column(String(100), nullable=False)

    patient_code = Column(String(20))

    bill_date = Column(Date)

    amount = Column(Numeric(10, 2))

    payment_status = Column(String(30))

    payment_method = Column(String(50))

    description = Column(String(255))


# ==========================================
# GET ALL BILLINGS
# ==========================================

def get_all_billings():

    db = SessionLocal()

    try:

        bills = db.query(Billing).all()

        billing_list = []

        for bill in bills:

            billing_list.append({

                "billing_id": bill.billing_id,

                "patient_name": bill.patient_name,

                "patient_code": bill.patient_code,

                "bill_date": str(bill.bill_date),

                "amount": float(bill.amount),

                "payment_status": bill.payment_status,

                "payment_method": bill.payment_method,

                "description": bill.description

            })

        return billing_list

    finally:

        db.close()


# ==========================================
# GET PATIENT BILLINGS
# ==========================================

def get_patient_billings(patient_name):

    db = SessionLocal()

    try:

        bills = (

            db.query(Billing)

            .filter(

                Billing.patient_name == patient_name

            )

            .order_by(

                Billing.bill_date.desc()

            )

            .all()

        )

        billing_list = []

        for bill in bills:

            billing_list.append({

                "billing_id": bill.billing_id,

                "patient_name": bill.patient_name,

                "patient_code": bill.patient_code,

                "bill_date": str(bill.bill_date),

                "amount": float(bill.amount),

                "payment_status": bill.payment_status,

                "payment_method": bill.payment_method,

                "description": bill.description

            })

        return billing_list

    finally:

        db.close()


# ==========================================
# CREATE BILL
# ==========================================

def create_billing(

    patient_name,
    patient_code,
    bill_date,
    amount,
    payment_status,
    payment_method,
    description

):

    db = SessionLocal()

    try:

        new_bill = Billing(

            patient_name=patient_name,

            patient_code=patient_code,

            bill_date=bill_date,

            amount=amount,

            payment_status=payment_status,

            payment_method=payment_method,

            description=description

        )

        db.add(new_bill)

        db.commit()

        db.refresh(new_bill)

        return {

            "message":
            "Billing created successfully!"

        }

    finally:

        db.close()


# ==========================================
# UPDATE BILL
# ==========================================

def update_billing(

    billing_id,
    payment_status

):

    db = SessionLocal()

    try:

        bill = (

            db.query(Billing)

            .filter(

                Billing.billing_id == billing_id

            )

            .first()

        )

        if not bill:

            return {

                "error":
                "Billing not found"

            }

        bill.payment_status = payment_status

        db.commit()

        return {

            "message":
            "Billing updated successfully!"

        }

    finally:

        db.close()


# ==========================================
# DELETE BILL
# ==========================================

def delete_billing(

    billing_id

):

    db = SessionLocal()

    try:

        bill = (

            db.query(Billing)

            .filter(

                Billing.billing_id == billing_id

            )

            .first()

        )

        if not bill:

            return {

                "error":
                "Billing not found"

            }

        db.delete(bill)

        db.commit()

        return {

            "message":
            "Billing deleted successfully!"

        }

    finally:

        db.close()