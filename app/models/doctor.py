from app.database.connection import get_connection

#read
def get_all_doctors():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM doctors")

    doctors = cur.fetchall()

    cur.close()
    conn.close()

    return doctors

#create
def create_doctor(name, specialization, phone, email, password, experience):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO doctors
        (doctor_name, specialization, phone, email, password, experience_years)
        VALUES (%s, %s, %s, %s, %s, %s)
    """,
    (name, specialization, phone, email, password, experience))

    conn.commit()

    cur.close()
    conn.close()

    return "Doctor created successfully!"

#update
def update_doctor(doctor_id, specialization):
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

    return "Doctor updated successfully!"

#delete
def delete_doctor(doctor_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM doctors WHERE doctor_id = %s",
        (doctor_id,)
    )

    conn.commit()

    cur.close()
    conn.close()

    return "Doctor deleted successfully!"