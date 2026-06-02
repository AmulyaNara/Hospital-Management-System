from app.database.connection import get_connection


# CREATE
def create_prescription(
    visit_id,
    medicine_name,
    dosage,
    frequency,
    duration,
    instructions
):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO prescriptions
        (
            visit_id,
            medicine_name,
            dosage,
            frequency,
            duration,
            instructions
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    """,
    (
        visit_id,
        medicine_name,
        dosage,
        frequency,
        duration,
        instructions
    ))

    conn.commit()

    cur.close()
    conn.close()

    return "Prescription created successfully!"


# READ
def get_all_prescriptions():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM prescriptions")

    prescriptions = cur.fetchall()

    cur.close()
    conn.close()

    return prescriptions


# UPDATE
def update_prescription(
    prescription_id,
    medicine_name,
    dosage,
    frequency,
    duration,
    instructions
):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE prescriptions
        SET
            medicine_name = %s,
            dosage = %s,
            frequency = %s,
            duration = %s,
            instructions = %s
        WHERE prescription_id = %s
    """,
    (
        medicine_name,
        dosage,
        frequency,
        duration,
        instructions,
        prescription_id
    ))

    conn.commit()

    cur.close()
    conn.close()

    return "Prescription updated successfully!"


# DELETE
def delete_prescription(prescription_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM prescriptions
        WHERE prescription_id = %s
    """,
    (prescription_id,))

    conn.commit()

    cur.close()
    conn.close()

    return "Prescription deleted successfully!"