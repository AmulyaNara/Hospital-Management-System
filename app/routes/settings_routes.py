from fastapi import APIRouter, Depends

from app.security.oauth2 import get_current_user

from app.schemas.settings_schema import PatientSettingsUpdate

from app.models.patient_settings_orm import (

    get_patient_settings,

    update_patient_settings

)

router = APIRouter()


# =====================================================
# GET PATIENT SETTINGS
# =====================================================

@router.get("/api/patient-settings")
def patient_settings(

    current_user=Depends(get_current_user)

):

    return get_patient_settings(

        current_user["email"]

    )


# =====================================================
# UPDATE PATIENT SETTINGS
# =====================================================

@router.put("/api/patient-settings")
def save_settings(

    settings: PatientSettingsUpdate,

    current_user=Depends(get_current_user)

):

    return update_patient_settings(

        current_user["email"],

        settings

    )


# =====================================================
# DEBUG
# =====================================================

print("=" * 50)
print("SETTINGS ROUTES LOADED")
print(router.routes)
print("=" * 50)