from passlib.context import CryptContext
from app.database.connection import get_connection

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

conn = get_connection()
cur = conn.cursor()

# =========================
# HASH PATIENT PASSWORDS
# =========================

cur.execute("""
    SELECT patient_id, password
    FROM patients
""")

patients = cur.fetchall()

for patient_id, password in patients:

    if password and not password.startswith("$2b$"):
        hashed_password = pwd_context.hash(password)

        cur.execute("""
            UPDATE patients
            SET password = %s
            WHERE patient_id = %s
        """, (hashed_password, patient_id))

print("Patient passwords updated!")

# =========================
# HASH DOCTOR PASSWORDS
# =========================

cur.execute("""
    SELECT doctor_id, password
    FROM doctors
""")

doctors = cur.fetchall()

for doctor_id, password in doctors:

    if password and not password.startswith("$2b$"):
        hashed_password = pwd_context.hash(password)

        cur.execute("""
            UPDATE doctors
            SET password = %s
            WHERE doctor_id = %s
        """, (hashed_password, doctor_id))

print("Doctor passwords updated!")

conn.commit()

cur.close()
conn.close()

print("All passwords hashed successfully!")