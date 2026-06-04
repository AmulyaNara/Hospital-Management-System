   
from fastapi import FastAPI
from app.routes.doctor_routes import router as doctor_router
from app.routes.patient_routes import router as patient_router
from app.routes.visit_routes import router as visit_router
from app.routes.diagnosis_routes import router as diagnosis_router
from app.routes.prescription_routes import router as prescription_router

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Hospital Management System API"
    }

app.include_router(doctor_router)
app.include_router(patient_router)
app.include_router(visit_router)
app.include_router(diagnosis_router)
app.include_router(prescription_router)