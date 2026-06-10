from sqlalchemy import Column, Integer, String, TIMESTAMP
from app.database.base import Base
from app.database.session import SessionLocal
from app.security.hash import hash_password


class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True, index=True)
    admin_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP)


def get_all_admins():
    db = SessionLocal()

    try:
        admins = db.query(Admin).all()

        admin_list = []

        for admin in admins:
            admin_list.append({
                "admin_id": admin.admin_id,
                "admin_name": admin.admin_name,
                "email": admin.email
            })

        return admin_list

    finally:
        db.close()


def create_admin(
    admin_name,
    email,
    password
):
    db = SessionLocal()

    try:
        new_admin = Admin(
            admin_name=admin_name,
            email=email,
            password=hash_password(password)
        )

        db.add(new_admin)
        db.commit()

        return {
            "message": "Admin created successfully!"
        }

    finally:
        db.close()