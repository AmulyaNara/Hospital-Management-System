from app.database.connection import get_connection
from app.security.hash import hash_password


# READ
def get_all_patients():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM patients")

        patients = cur.fetchall()

        cur.close()
        conn.close()

        return patients

    except Exception as e:
        return {"error": str(e)}


# CREATE
def create_patient(
    name,
    age,
    gender,
    phone,
    address,
    blood_group,
    email,
    password
):
    try:
        conn = get_connection()
        cur = conn.cursor()

        hashed_password = hash_password(password)

        cur.execute("""
            INSERT INTO patients
            (
                patient_name,
                age,
                gender,
                phone,
                address,
                blood_group,
                email,
                password
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            name,
            age,
            gender,
            phone,
            address,
            blood_group,
            email,
            hashed_password
        ))

        conn.commit()

        cur.close()
        conn.close()

        return {"message": "Patient created successfully!"}

    except Exception as e:
        return {"error": str(e)}


# UPDATE
def update_patient(patient_id, phone):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE patients
            SET phone = %s
            WHERE patient_id = %s
        """,
        (
            phone,
            patient_id
        ))

        conn.commit()

        cur.close()
        conn.close()

        return {"message": "Patient updated successfully!"}

    except Exception as e:
        return {"error": str(e)}


# DELETE
def delete_patient(patient_id):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            DELETE FROM patients
            WHERE patient_id = %s
        """,
        (patient_id,)
        )

        conn.commit()

        cur.close()
        conn.close()

        return {"message": "Patient deleted successfully!"}

    except Exception as e:
        return {"error": str(e)}