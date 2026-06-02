'''

from app.models.visit import get_all_visits

visits = get_all_visits()

for visit in visits:
    print(visit)

'''
from app.models.prescription import create_prescription

print(
    create_prescription(
        1,
        "Dolo 650",
        "650mg",
        "Twice Daily",
        "5 Days",
        "After Food"
    )
)

from app.models.prescription import get_all_prescriptions

prescriptions = get_all_prescriptions()

for prescription in prescriptions:
    print(prescription)