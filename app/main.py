from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.routes.doctor_routes import router as doctor_router
from app.routes.patient_routes import router as patient_router
from app.routes.visit_routes import router as visit_router
from app.routes.diagnosis_routes import router as diagnosis_router
from app.routes.prescription_routes import router as prescription_router
from app.routes.auth_routes import router as auth_router
from app.routes.admin_routes import router as admin_router
from app.routes.user_routes import router as user_router

from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
from fastapi.responses import HTMLResponse
from app.routes.settings_routes import router as settings_router

from app.routes.lab_routes import router as lab_router
from app.routes.billing_routes import router as billing_router
app = FastAPI()

app.add_middleware(
    SessionMiddleware,
    secret_key="hospital_secret_key"
)
# Templates
templates = Jinja2Templates(directory="app/templates")

# Static Files
app.mount(
    "/static",
    StaticFiles(directory="app/static"),
    name="static"
)

# Include API Routers
app.include_router(doctor_router)
app.include_router(patient_router)
app.include_router(visit_router)
app.include_router(diagnosis_router)
app.include_router(prescription_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(user_router)
app.include_router(lab_router)
app.include_router(billing_router)
app.include_router(settings_router)
# =========================
# Login Page
# =========================
@app.get("/")
def login_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={}
    )


# =========================
# Register Page
# =========================
@app.get("/register")
def register_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="register.html",
        context={}
    )


# =========================
# Admin Dashboard
# =========================
@app.get("/dashboard")
def dashboard(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="admin_dashboard/admin_home.html"
    )


# =========================
# Doctor Dashboard
# =========================
@app.get("/doctor-dashboard")
def doctor_dashboard(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="doctor_dashboard/doctor_dashboard.html"
    )


# =========================
# Patient Dashboard
# =========================
@app.get("/patient-dashboard")
def patient_dashboard(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_dashboard.html"
    )


# =========================
# Receptionist Dashboard
# =========================
@app.get("/receptionist-dashboard")
def receptionist_dashboard(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="reception_dashboard/receptionist_dashboard.html"
    )


# =========================
# Doctors Page
# =========================
@app.get("/doctors-page")
def doctors_page(request: Request):
        return templates.TemplateResponse(
        request=request,
        name="doctors.html"
    )

@app.get("/admin-home")
def admin_home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="admin_dashboard/admin_home.html"
    )
@app.get("/admin-doctors")
def doctors_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="admin_dashboard/doctor.html"
    )
    
@app.get("/doctor-patients")
def doctor_patients(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="doctor_dashboard/doctor_patients.html"
    )
    
@app.get("/doctor-doctors")
def doctor_doctors(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="doctor_dashboard/doctor_doctors.html"
    )
@app.get("/doctor-visits")
def doctor_visits(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="doctor_dashboard/doctor_visits.html"
    )
@app.get("/patient-visit/{patient_id}")
def patient_visit(patient_id: int, request: Request):
    return templates.TemplateResponse(
        request=request,
        name="doctor_dashboard/patient_visit.html",
        context={
            "patient_id": patient_id
        }
    )

@app.get("/doctor-prescriptions")
def doctor_prescriptions(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="doctor_dashboard/doctor_prescriptions.html"
    )
    
@app.get("/logout")
def logout(request: Request):

    request.session.clear()

    return RedirectResponse("/")

@app.get("/doctor-prescriptions/new")
def new_prescription(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="doctor_dashboard/new_prescription.html"
    )
@app.get("/doctor-diagnosis", response_class=HTMLResponse)
def doctor_diagnosis(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="doctor_dashboard/doctor_diagnosis.html"
    )

@app.get("/doctor-diagnosis/new")
def new_diagnosis(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="doctor_dashboard/new_diagnosis.html"
    )
# =========================
# Patient Appointments
# =========================
@app.get("/patient-appointments")
def patient_appointments(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_appointment.html"
    )


# =========================
# Patient Reports
# =========================
@app.get("/patient-reports")
def patient_reports(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_reports.html"
    )


# =========================
# Patient Lab Results
# =========================
@app.get("/patient-lab")
def patient_lab(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_lab.html"
    )


# =========================
# Patient Billing
# =========================
@app.get("/patient-billings")
def patient_billings(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_billings.html"
    )


# =========================
# Patient Settings
# =========================
@app.get("/patient-settings")
def patient_settings(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_settings.html"
    )


# =========================
# Patient Support
# =========================
@app.get("/patient-support")
def patient_support(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_support.html"
    )
    
# =========================
# Patient Support
# =========================
@app.get("/patient-support")
def patient_support(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_support.html"
    )
  
@app.get("/patient-settings")
def patient_settings(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="patient_dashboard/patient_settings.html"
    )
    
@app.get("/receptionist-appointments")
def receptionist_appointments(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="reception_dashboard/receptionist_appointments.html"
    )
    
@app.get("/admin-patients")
def admin_patients(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="admin_dashboard/admin_patient.html"

    )

@app.get("/admin-diagnosis")
def admin_diagnosis(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="admin_dashboard/admin_diagnosis.html"
    )


@app.get("/admin-prescriptions")
def admin_prescriptions(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="admin_dashboard/admin_prescriptions.html"
    )

@app.get("/admin-receptionists")
def admin_receptionists(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="admin_dashboard/admin_receptionist.html"
    )
    
@app.get("/admin-settings")
def admin_settings(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="admin_dashboard/admin_settings.html"
    )