from sqlalchemy import (
    Column,
    Integer,
    String,
    TIMESTAMP,
    Date
)
from sqlalchemy.sql import func

from app.database.base import Base
from app.database.session import SessionLocal
from app.security.hash import hash_password


class User(Base):

    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    role = Column(String(50), nullable=False)

    phone = Column(String(15))

    date_of_birth = Column(Date)

    gender = Column(String(20))

    address = Column(String)

    emergency_contact_name = Column(String(100))

    emergency_contact_phone = Column(String(15))

    employee_id = Column(String(20), unique=True)

    department = Column(String(100))

    shift = Column(String(50))

    status = Column(String(30), default="Active")

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )


# =====================================================
# CREATE USER
# =====================================================

def create_user(
    name,
    email,
    password,
    role,
    phone,
    date_of_birth,
    gender,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    employee_id,
    department,
    shift,
    status
):

    db = SessionLocal()

    try:

        new_user = User(

            name=name,

            email=email,

            password=hash_password(password),

            role=role,

            phone=phone,

            date_of_birth=date_of_birth,

            gender=gender,

            address=address,

            emergency_contact_name=emergency_contact_name,

            emergency_contact_phone=emergency_contact_phone,

            employee_id=employee_id,

            department=department,

            shift=shift,

            status=status

        )

        db.add(new_user)

        db.commit()

        db.refresh(new_user)

        return {
            "message": "User created successfully!"
        }

    finally:

        db.close()


# =====================================================
# GET ALL USERS
# =====================================================

def get_all_users():

    db = SessionLocal()

    try:

        return db.query(User).all()

    finally:

        db.close()


# =====================================================
# UPDATE USER
# =====================================================

def update_user(
    user_id,
    name,
    email,
    phone,
    date_of_birth,
    gender,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    employee_id,
    department,
    shift,
    status
):

    db = SessionLocal()

    try:

        user = (
            db.query(User)
            .filter(User.user_id == user_id)
            .first()
        )

        if not user:

            return {
                "message": "User not found"
            }

        user.name = name

        user.email = email

        user.phone = phone

        user.date_of_birth = date_of_birth

        user.gender = gender

        user.address = address

        user.emergency_contact_name = emergency_contact_name

        user.emergency_contact_phone = emergency_contact_phone

        user.employee_id = employee_id

        user.department = department

        user.shift = shift

        user.status = status

        db.commit()

        db.refresh(user)

        return {

            "message": "User updated successfully",

            "user": user

        }

    finally:

        db.close()


# =====================================================
# DELETE USER
# =====================================================

def delete_user(user_id):

    db = SessionLocal()

    try:

        user = (
            db.query(User)
            .filter(User.user_id == user_id)
            .first()
        )

        if not user:

            return {
                "message": "User not found"
            }

        db.delete(user)

        db.commit()

        return {
            "message": "User deleted successfully"
        }

    finally:

        db.close()