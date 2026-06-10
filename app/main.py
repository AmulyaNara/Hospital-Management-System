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
templates = Jinja2Templates(
    directory="app/templates"
)

# Static files
app.mount(
    "/static",
    StaticFiles(directory="app/static"),
    name="static"
)

# Routes
app.include_router(doctor_router)
app.include_router(patient_router)
app.include_router(visit_router)
app.include_router(diagnosis_router)
app.include_router(prescription_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(user_router)

@app.get("/")
def login_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="login.html"
    )
    
@app.get("/dashboard")
def dashboard(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="dashboard.html"
    )

@app.get("/doctors-page")
def doctors_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="doctors.html"
    )