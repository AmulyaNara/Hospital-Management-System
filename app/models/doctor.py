from app.database.connection import get_connection
from app.security.hash import hash_password


# READ
def get_all_doctors():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM doctors")

        doctors = cur.fetchall()

        cur.close()
        conn.close()

        return doctors

    except Exception as e:
        return {"error": str(e)}


# CREATE
def create_doctor(name, specialization, phone, email, password, experience):
    try:
        conn = get_connection()
        cur = conn.cursor()

        hashed_password = hash_password(password)

        cur.execute("""
            INSERT INTO doctors
            (doctor_name, specialization, phone, email, password, experience_years)
            VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            name,
            specialization,
            phone,
            email,
            hashed_password,
            experience
        ))

        conn.commit()

        cur.close()
        conn.close()

        return {"message": "Doctor created successfully!"}

    except Exception as e:
        return {"error": str(e)}


# UPDATE
def update_doctor(doctor_id, specialization):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE doctors
            SET specialization = %s
            WHERE doctor_id = %s
        """,
        (specialization, doctor_id))

        conn.commit()

        cur.close()
        conn.close()

        return {"message": "Doctor updated successfully!"}

    except Exception as e:
        return {"error": str(e)}


# DELETE
def delete_doctor(doctor_id):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            "DELETE FROM doctors WHERE doctor_id = %s",
            (doctor_id,)
        )

        conn.commit()

        cur.close()
        conn.close()

        return {"message": "Doctor deleted successfully!"}

    except Exception as e:
        return {"error": str(e)}