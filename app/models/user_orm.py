from sqlalchemy import Column, Integer, String, TIMESTAMP
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
    created_at = Column(TIMESTAMP)
def create_user(
    name,
    email,
    password,
    role,
    phone
):
    db = SessionLocal()

    try:

        new_user = User(
            name=name,
            email=email,
            password=hash_password(password),
            role=role,
            phone=phone
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User created successfully!"
        }

    finally:
        db.close()
        
def get_all_users():

    db = SessionLocal()

    try:

        users = db.query(User).all()

        return users

    finally:

        db.close()
        
def update_user(
    user_id,
    role
):

    db = SessionLocal()

    try:

        user = (
            db.query(User)
            .filter(
                User.user_id == user_id
            )
            .first()
        )

        if not user:

            return {
                "message":
                "User not found"
            }

        user.role = role

        db.commit()

        return {
            "message":
            "User updated successfully"
        }

    finally:

        db.close()
        
def delete_user(
    user_id
):

    db = SessionLocal()

    try:

        user = (
            db.query(User)
            .filter(
                User.user_id == user_id
            )
            .first()
        )

        if not user:

            return {
                "message":
                "User not found"
            }

        db.delete(user)

        db.commit()

        return {
            "message":
            "User deleted successfully"
        }

    finally:

        db.close()