document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       AUTHENTICATION
    ===================================================== */

    const token = localStorage.getItem("access_token");

    if (!token) {

        window.location.href = "/";

        return;

    }

    const headers = {

        Authorization: `Bearer ${token}`,

        "Content-Type": "application/json"

    };

    /* =====================================================
       GLOBAL ELEMENTS
    ===================================================== */

    const profileForm = document.getElementById("profileForm");

    const saveBtn = document.getElementById("saveProfileBtn");

    const fullName = document.getElementById("fullName");

    const email = document.getElementById("email");

    const phone = document.getElementById("phone");

    const language = document.getElementById("language");

    const timezone = document.getElementById("timezone");

    const dateFormat = document.getElementById("dateFormat");

    const patientName = document.getElementById("patientName");

    const patientId = document.getElementById("patientId");

    const emailNotifications =
        document.getElementById("emailNotifications");

    const smsNotifications =
        document.getElementById("smsNotifications");

    const inappNotifications =
        document.getElementById("inappNotifications");

    const healthTips =
        document.getElementById("healthTips");

    const loginAlerts =
        document.getElementById("loginAlerts");

    const biometricLogin =
        document.getElementById("biometricLogin");

    const highContrast =
        document.getElementById("highContrast");

    const screenReader =
        document.getElementById("screenReader");

    /* =====================================================
       LOAD SETTINGS
    ===================================================== */

    async function loadSettings() {

        try {

            console.log("Loading patient settings...");

            const response = await fetch(

                "/api/patient-settings",

                {

                    headers

                }

            );

            if (!response.ok) {

                throw new Error("Unable to load settings.");

            }

            const data = await response.json();

            console.log("Patient Settings", data);

            /* ==========================
               HEADER
            ========================== */

            if (patientName)
                patientName.textContent =
                    data.patient_name;

            if (patientId)
                patientId.textContent =
                    data.patient_id;

            /* ==========================
               PROFILE
            ========================== */

            if (fullName)
                fullName.value =
                    data.patient_name || "";

            if (email)
                email.value =
                    data.email || "";

            if (phone)
                phone.value =
                    data.phone || "";

            if (language)
                language.value =
                    data.preferred_language || "English";

            if (timezone)
                timezone.value =
                    data.timezone || "Asia/Kolkata";

            if (dateFormat)
                dateFormat.value =
                    data.date_format || "DD/MM/YYYY";

            /* ==========================
               NOTIFICATIONS
            ========================== */

            if (emailNotifications)
                emailNotifications.checked =
                    data.email_notifications;

            if (smsNotifications)
                smsNotifications.checked =
                    data.sms_notifications;

            if (inappNotifications)
                inappNotifications.checked =
                    data.inapp_notifications;

            if (healthTips)
                healthTips.checked =
                    data.health_tips;

            /* ==========================
               SECURITY
            ========================== */

            if (loginAlerts)
                loginAlerts.checked =
                    data.login_alerts ?? true;

            if (biometricLogin)
                biometricLogin.checked =
                    data.biometric_login ?? false;

            /* ==========================
               ACCESSIBILITY
            ========================== */

            if (highContrast)
                highContrast.checked =
                    data.high_contrast ?? false;

            if (screenReader)
                screenReader.checked =
                    data.screen_reader ?? true;

        }

        catch (error) {

            console.error(error);

            showToast(

                "Unable to load settings.",

                "error"

            );

        }

    }

    loadSettings();
        /* =====================================================
       SAVE SETTINGS
    ===================================================== */

    async function saveSettings() {

        try {

            saveBtn.disabled = true;

            const originalText = saveBtn.innerHTML;

            saveBtn.innerHTML = "Saving...";

            const payload = {

                patient_name: fullName.value.trim(),

                email: email.value.trim(),

                phone: phone.value.trim(),

                preferred_language: language.value,

                timezone: timezone.value,

                date_format: dateFormat.value,

                email_notifications:
                    emailNotifications.checked,

                sms_notifications:
                    smsNotifications.checked,

                inapp_notifications:
                    inappNotifications.checked,

                health_tips:
                    healthTips.checked,

                login_alerts:
                    loginAlerts.checked,

                biometric_login:
                    biometricLogin.checked,

                high_contrast:
                    highContrast.checked,

                screen_reader:
                    screenReader.checked

            };

            console.log(payload);

            const response = await fetch(

                "/api/patient-settings",

                {

                    method: "PUT",

                    headers,

                    body: JSON.stringify(payload)

                }

            );

            const result = await response.json();

            if (!response.ok) {

                throw new Error(

                    result.detail ||

                    result.error ||

                    "Unable to save settings."

                );

            }

            showToast(

                "Settings updated successfully.",

                "success"

            );

            if(patientName){

                patientName.textContent =
                    fullName.value;

            }

            saveBtn.disabled = false;

            saveBtn.innerHTML = originalText;

        }

        catch(error){

            console.error(error);

            saveBtn.disabled = false;

            saveBtn.innerHTML = "Save Changes";

            showToast(

                error.message,

                "error"

            );

        }

    }

    /* =====================================================
       SAVE BUTTON
    ===================================================== */

    if(saveBtn){

        saveBtn.addEventListener(

            "click",

            saveSettings

        );

    }

    /* =====================================================
       PREVENT FORM SUBMIT
    ===================================================== */

    if(profileForm){

        profileForm.addEventListener(

            "submit",

            function(e){

                e.preventDefault();

                saveSettings();

            }

        );

    }

    /* =====================================================
       THEME
    ===================================================== */


const themeCards = document.querySelectorAll(".theme-card");

themeCards.forEach(card => {

    card.addEventListener("click", () => {

        themeCards.forEach(c =>
            c.classList.remove("active")
        );

        card.classList.add("active");

        const theme = card.dataset.theme.toLowerCase();

        if (theme === "dark") {

            document.body.classList.add("dark-theme");
            document.body.classList.remove("light-theme");

        } else {

            document.body.classList.remove("dark-theme");
            document.body.classList.add("light-theme");

        }

        localStorage.setItem("theme", theme);

    });

});

const savedTheme =
    localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {

    document.body.classList.add("dark-theme");

} else {

    document.body.classList.add("light-theme");

}

themeCards.forEach(card => {

    card.classList.toggle(

        "active",

        card.dataset.theme === savedTheme

    );

});



    /* =====================================================
       FONT SIZE
    ===================================================== */

    const fontButtons =

        document.querySelectorAll(

            ".font-btn"

        );

    fontButtons.forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                fontButtons.forEach(btn=>{

                    btn.classList.remove(

                        "active"

                    );

                });

                button.classList.add(

                    "active"

                );

                const size =

                    button.innerText.trim();

                if(size==="Small"){

                    document.body.style.fontSize="14px";

                }

                else if(size==="Large"){

                    document.body.style.fontSize="18px";

                }

                else{

                    document.body.style.fontSize="16px";

                }

                localStorage.setItem(

                    "fontSize",

                    size

                );

            }

        );

    });

    const savedFont =

        localStorage.getItem(

            "fontSize"

        );

    if(savedFont){

        fontButtons.forEach(btn=>{

            if(

                btn.innerText.trim()

                === savedFont

            ){

                btn.click();

            }

        });

    }

    /* =====================================================
       SWITCH EVENTS
    ===================================================== */

    [

        emailNotifications,

        smsNotifications,

        inappNotifications,

        healthTips,

        loginAlerts,

        biometricLogin,

        highContrast,

        screenReader

    ].forEach(toggle=>{

        if(toggle){

            toggle.addEventListener(

                "change",

                ()=>{

                    console.log(

                        toggle.id,

                        toggle.checked

                    );

                }

            );

        }

    });
        /* =====================================================
       CHANGE PASSWORD
    ===================================================== */

    const changePasswordBtn =
        document.getElementById("changePasswordBtn");

    if (changePasswordBtn) {

        changePasswordBtn.addEventListener("click", () => {

            showToast(
                "Password reset feature will be connected soon."
            );

        });

    }

    /* =====================================================
       REMOVE DEVICE
    ===================================================== */

    const removeButtons =
        document.querySelectorAll(".removeDeviceBtn");

    removeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const confirmRemove = confirm(

                "Remove this device from your account?"

            );

            if (!confirmRemove) return;

            const device =
                button.closest(".device-item");

            if (device) {

                device.remove();

            }

            showToast(

                "Device removed successfully."

            );

        });

    });

    /* =====================================================
       LOGOUT ALL DEVICES
    ===================================================== */

    const logoutAllBtn =
        document.getElementById("logoutAllBtn");

    if (logoutAllBtn) {

        logoutAllBtn.addEventListener("click", () => {

            const confirmLogout = confirm(

                "Sign out from all devices?"

            );

            if (!confirmLogout) return;

            showToast(

                "All active sessions have been terminated."

            );

        });

    }

    /* =====================================================
       DELETE ACCOUNT
    ===================================================== */

    const deleteAccountBtn =
        document.getElementById("deleteAccountBtn");

    if (deleteAccountBtn) {

        deleteAccountBtn.addEventListener("click", () => {

            const confirmDelete = confirm(

                "This action cannot be undone.\n\nDelete your account?"

            );

            if (!confirmDelete) return;

            showToast(

                "Account deletion request submitted.",

                "error"

            );

        });

    }

    /* =====================================================
       PROFILE IMAGE
    ===================================================== */

    const profileImage =
        document.getElementById("profileImage");

    if (profileImage) {

        profileImage.addEventListener("click", () => {

            showToast(

                "Profile picture upload will be available soon."

            );

        });

    }

    /* =====================================================
       PAGE ANIMATION
    ===================================================== */

    const cards =
        document.querySelectorAll(".settings-card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition = ".5s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 120);

    });

    /* =====================================================
       BUTTON HOVER EFFECT
    ===================================================== */

    const buttons =
        document.querySelectorAll("button");

    buttons.forEach(button => {

        button.addEventListener("mouseenter", () => {

            button.style.transition = ".25s";

        });

    });

    /* =====================================================
       NETWORK STATUS
    ===================================================== */

    window.addEventListener("offline", () => {

        showToast(

            "Internet connection lost.",

            "error"

        );

    });

    window.addEventListener("online", () => {

        showToast(

            "Internet connection restored."

        );

    });
        /* =====================================================
       RIPPLE EFFECT
    ===================================================== */

    buttons.forEach(button => {

        button.addEventListener("click", function (e) {

            const ripple = document.createElement("span");

            ripple.classList.add("ripple");

            const rect = button.getBoundingClientRect();

            ripple.style.left =
                `${e.clientX - rect.left}px`;

            ripple.style.top =
                `${e.clientY - rect.top}px`;

            button.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            }, 600);

        });

    });

    /* =====================================================
       AUTO SAVE REMINDER
    ===================================================== */

    let formChanged = false;

    profileForm?.querySelectorAll(

        "input, select"

    ).forEach(element => {

        element.addEventListener("change", () => {

            formChanged = true;

        });

    });

    window.addEventListener("beforeunload", function (e) {

        if (formChanged) {

            e.preventDefault();

            e.returnValue = "";

        }

    });

    /* =====================================================
       TOAST FUNCTION
    ===================================================== */

    function showToast(

        message,

        type = "success"

    ) {

        const oldToast =

            document.querySelector(".toast");

        if (oldToast) {

            oldToast.remove();

        }

        const toast =

            document.createElement("div");

        toast.className = "toast";

        toast.textContent = message;

        if (type === "error") {

            toast.style.background = "#DC2626";

        }

        else {

            toast.style.background = "#00A896";

        }

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("show");

        }, 100);

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 400);

        }, 3000);

    }

    /* =====================================================
       PAGE READY
    ===================================================== */

    console.log(

        "Patient Settings Loaded Successfully."

    );

});