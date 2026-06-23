from pydantic import BaseModel


# ==========================================
# UPDATE PATIENT SETTINGS
# ==========================================

class PatientSettingsUpdate(BaseModel):

    # -------------------------
    # Patient Information
    # -------------------------

    patient_name: str

    email: str

    phone: str

    # -------------------------
    # Preferences
    # -------------------------

    preferred_language: str

    timezone: str

    date_format: str

    # -------------------------
    # Notification Settings
    # -------------------------

    email_notifications: bool

    sms_notifications: bool

    inapp_notifications: bool

    health_tips: bool

    # -------------------------
    # Security Settings
    # -------------------------

    login_alerts: bool

    biometric_login: bool

    # -------------------------
    # Accessibility Settings
    # -------------------------

    high_contrast: bool

    screen_reader: bool