from sqlalchemy import Column, Integer, String, Boolean, ForeignKey

from app.database.base import Base
from app.database.session import SessionLocal

from app.models.patient_orm import Patient


class PatientSettings(Base):

    __tablename__ = "patient_settings"

    setting_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        ForeignKey("patients.patient_id"),
        unique=True,
        nullable=False
    )

    # =====================================================
    # Preferences
    # =====================================================

    preferred_language = Column(String(50))
    timezone = Column(String(100))
    date_format = Column(String(30))

    # =====================================================
    # Notification Settings
    # =====================================================

    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    inapp_notifications = Column(Boolean, default=True)
    health_tips = Column(Boolean, default=True)

    # =====================================================
    # Security Settings
    # =====================================================

    login_alerts = Column(Boolean, default=True)
    biometric_login = Column(Boolean, default=False)

    # =====================================================
    # Accessibility Settings
    # =====================================================

    high_contrast = Column(Boolean, default=False)
    screen_reader = Column(Boolean, default=True)


# =====================================================
# GET PATIENT SETTINGS
# =====================================================

def get_patient_settings(email):

    db = SessionLocal()

    try:

        patient = (

            db.query(Patient)

            .filter(
                Patient.email == email
            )

            .first()

        )

        if not patient:

            return {

                "error": "Patient not found"

            }

        settings = (

            db.query(PatientSettings)

            .filter(
                PatientSettings.patient_id == patient.patient_id
            )

            .first()

        )

        # -------------------------------------------------
        # Create Default Settings
        # -------------------------------------------------

        if not settings:

            settings = PatientSettings(

                patient_id=patient.patient_id,

                preferred_language="English",

                timezone="Asia/Kolkata",

                date_format="DD/MM/YYYY",

                email_notifications=True,

                sms_notifications=False,

                inapp_notifications=True,

                health_tips=True,

                login_alerts=True,

                biometric_login=False,

                high_contrast=False,

                screen_reader=True

            )

            db.add(settings)

            db.commit()

            db.refresh(settings)

        return {

            # -------------------------
            # Patient
            # -------------------------

            "patient_name": patient.patient_name,

            "patient_id": patient.patient_id,

            "email": patient.email,

            "phone": patient.phone,

            # -------------------------
            # Preferences
            # -------------------------

            "preferred_language": settings.preferred_language,

            "timezone": settings.timezone,

            "date_format": settings.date_format,

            # -------------------------
            # Notifications
            # -------------------------

            "email_notifications": settings.email_notifications,

            "sms_notifications": settings.sms_notifications,

            "inapp_notifications": settings.inapp_notifications,

            "health_tips": settings.health_tips,

            # -------------------------
            # Security
            # -------------------------

            "login_alerts": settings.login_alerts,

            "biometric_login": settings.biometric_login,

            # -------------------------
            # Accessibility
            # -------------------------

            "high_contrast": settings.high_contrast,

            "screen_reader": settings.screen_reader

        }

    except Exception as e:

        return {

            "error": str(e)

        }

    finally:

        db.close()


# =====================================================
# UPDATE PATIENT SETTINGS
# =====================================================

def update_patient_settings(

    email,

    data

):

    db = SessionLocal()

    try:

        patient = (

            db.query(Patient)

            .filter(
                Patient.email == email
            )

            .first()

        )

        if not patient:

            return {

                "error": "Patient not found"

            }

        settings = (

            db.query(PatientSettings)

            .filter(
                PatientSettings.patient_id == patient.patient_id
            )

            .first()

        )

        if not settings:

            settings = PatientSettings(

                patient_id=patient.patient_id

            )

            db.add(settings)

        # -------------------------------------------------
        # Patient Information
        # -------------------------------------------------

        patient.patient_name = data.patient_name
        patient.email = data.email
        patient.phone = data.phone

        # -------------------------------------------------
        # Preferences
        # -------------------------------------------------

        settings.preferred_language = data.preferred_language
        settings.timezone = data.timezone
        settings.date_format = data.date_format

        # -------------------------------------------------
        # Notifications
        # -------------------------------------------------

        settings.email_notifications = data.email_notifications
        settings.sms_notifications = data.sms_notifications
        settings.inapp_notifications = data.inapp_notifications
        settings.health_tips = data.health_tips

        # -------------------------------------------------
        # Security
        # -------------------------------------------------

        settings.login_alerts = data.login_alerts
        settings.biometric_login = data.biometric_login

        # -------------------------------------------------
        # Accessibility
        # -------------------------------------------------

        settings.high_contrast = data.high_contrast
        settings.screen_reader = data.screen_reader

        db.commit()

        return {

            "message": "Patient settings updated successfully."

        }

    except Exception as e:

        db.rollback()



        raise Exception(str(e))

        

    finally:

        db.close()