from app.database.connection import get_connection

#read
def get_all_patients():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM patients")

    patients = cur.fetchall()

    cur.close()
    conn.close()

    return patients

#create
def create_patient(name, age, gender, phone, address):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO patients
        (patient_name, age, gender, phone, address)
        VALUES (%s, %s, %s, %s, %s)
    """,
    (name, age, gender, phone, address))

    conn.commit()

    cur.close()
    conn.close()

    return "Patient created successfully!"

#update
def update_patient(patient_id, phone):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE patients
        SET phone = %s
        WHERE patient_id = %s
    """,
    (phone, patient_id))

    conn.commit()

    cur.close()
    conn.close()

    return "Patient updated successfully!"

#delete
def delete_patient(patient_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM patients
        WHERE patient_id = %s
    """,
    (patient_id,))

    conn.commit()

    cur.close()
    conn.close()

    return "Patient deleted successfully!"