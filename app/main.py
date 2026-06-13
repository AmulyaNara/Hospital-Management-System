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

app = FastAPI()

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
        name="admin_dashboard/dashboard.html"
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
@app.get("/doctors")
def doctors_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="admin_dashboard/doctors.html"
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