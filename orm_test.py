from app.database.session import engine

try:
    connection = engine.connect()
    print("ORM Connected Successfully!")
    connection.close()

except Exception as e:
    print("Connection Failed!")
    print(e)
from app.database.session import SessionLocal
from app.models.doctor_orm import Doctor

db = SessionLocal()

try:
    doctors = db.query(Doctor).all()

    for doctor in doctors:
        print(
            doctor.doctor_id,
            doctor.doctor_name,
            doctor.specialization
        )

except Exception as e:
    print("Error:", e)

finally:
    db.close()