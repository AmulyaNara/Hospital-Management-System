from app.database.connection import get_connection

def create_diagnosis(visit_id, disease, symptoms):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO diagnosis
        (visit_id, disease, symptoms)
        VALUES (%s, %s, %s)
    """,
    (visit_id, disease, symptoms))

    conn.commit()

    cur.close()
    conn.close()

    return "Diagnosis created successfully!"

def get_all_diagnosis():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM diagnosis")

    diagnosis = cur.fetchall()

    cur.close()
    conn.close()

    return diagnosis

def update_diagnosis(diagnosis_id, disease):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE diagnosis
        SET disease = %s
        WHERE diagnosis_id = %s
    """,
    (disease, diagnosis_id))

    conn.commit()

    cur.close()
    conn.close()

    return "Diagnosis updated successfully!"

def delete_diagnosis(diagnosis_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM diagnosis
        WHERE diagnosis_id = %s
    """,
    (diagnosis_id,))

    conn.commit()

    cur.close()
    conn.close()

    return "Diagnosis deleted successfully!"