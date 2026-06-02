import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="Hospital_management_System",
    user="postgres",
    password="Ammu@29",
    port="5432"
)

cur = conn.cursor()
'''
cur.execute("""
INSERT INTO doctors
(doctor_name, specialization, phone, email, password, experience_years)
VALUES
(%s, %s, %s, %s, %s, %s)
""",
(
    'Dr. Arjun',
    'General Medicine',
    '9876500010',
    'arjun@hospital.com',
    'doctor123',
    5
))

conn.commit()

print("Doctor inserted successfully!") ###(create a new doctor record in the database.)

cur.close()
conn.close()
'''

'''
cur.execute("""
UPDATE doctors
SET specialization = %s
WHERE doctor_name = %s
""",
(
    "Cardiology",
    "Dr. Arjun"
))

conn.commit()

print("Doctor updated successfully!") ###(update the specialization of the doctor record in the database.)

cur.close()
conn.close()
'''



cur.execute("SELECT * FROM doctors")

rows = cur.fetchall()

for row in rows:
    print(row)

cur.close()
conn.close()


'''
cur.execute("""DELETE FROM doctors
WHERE doctor_name = %s""", ('Dr. Arjun',))
conn.commit()
print("Doctor deleted successfully!")
cur.close()
conn.close()
'''