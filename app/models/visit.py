from app.database.connection import get_connection

def create_visit(patient_id, doctor_id, visit_date, chief_complaint, visit_number):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO visits
        (patient_id, doctor_id, visit_date, chief_complaint, visit_number)
        VALUES (%s, %s, %s, %s, %s)
    """,
    (patient_id, doctor_id, visit_date, chief_complaint, visit_number))

    conn.commit()

    cur.close()
    conn.close()

    return "Visit created successfully!"

def get_all_visits():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM visits")

    visits = cur.fetchall()

    cur.close()
    conn.close()

    return visits

def update_visit(visit_id, chief_complaint):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE visits
        SET chief_complaint = %s
        WHERE visit_id = %s
    """,
    (chief_complaint, visit_id))

    conn.commit()

    cur.close()
    conn.close()

    return "Visit updated successfully!"

def delete_visit(visit_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM visits
        WHERE visit_id = %s
    """,
    (visit_id,))

    conn.commit()

    cur.close()
    conn.close()

    return "Visit deleted successfully!"