document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // Authentication
    // ==========================================

    const token = localStorage.getItem("access_token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    // ==========================================
    // API
    // ==========================================

    const DASHBOARD_API = "/api/patient-dashboard";

    // ==========================================
    // Existing UI Animations
    // ==========================================

    const interactiveCards = document.querySelectorAll(
        ".transition-card, .transition-row"
    );

    interactiveCards.forEach(item => {

        item.style.transition =
            "transform 0.25s cubic-bezier(0.2,0.8,0.2,1), border-color .2s ease, background-color .2s ease";

        item.addEventListener("mouseenter", () => {

            if (item.classList.contains("record-item-card")) {

                item.style.transform = "translateY(-2px)";
                item.style.borderColor = "var(--teal-main)";

            }

        });

        item.addEventListener("mouseleave", () => {

            if (item.classList.contains("record-item-card")) {

                item.style.transform = "translateY(0)";
                item.style.borderColor = "var(--border-faint-line)";

            }

        });

    });

    // ==========================================
    // Search Box Animation
    // ==========================================

    const searchField =
        document.querySelector(".search-input");

    const searchFrame =
        document.querySelector(".search-container");

    if (searchField && searchFrame) {

        searchField.addEventListener("focus", () => {

            searchFrame.style.boxShadow =
                "0 0 0 2px rgba(0,106,97,.2)";

            searchFrame.style.borderColor =
                "var(--teal-main)";

        });

        searchField.addEventListener("blur", () => {

            searchFrame.style.boxShadow = "none";

            searchFrame.style.borderColor =
                "var(--border-faint-line)";

        });

    }

    // ==========================================
    // Load Patient Dashboard
    // ==========================================

    async function loadPatientDashboard() {

        try {

            const response = await fetch(
                DASHBOARD_API,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load dashboard");
            }

            const data = await response.json();
document.getElementById("welcomeMessage").textContent =
    `${data.greeting}, ${data.patient_name}.`;

document.getElementById("patientName").textContent =
    data.patient_name;

document.getElementById("patientId").textContent =
    data.patient_id;

document.getElementById("nextAppointment").textContent =
    data.next_visit_date || "No Appointment";

document.getElementById("nextAppointmentInfo").textContent =
    `${data.next_visit_time || "Time Not Available"} • ${data.doctor_name || "Doctor Not Assigned"}`;

document.getElementById("activePrescriptions").textContent =
    `${data.active_prescriptions} Orders`;

document.getElementById("recentLabResult").textContent =
    data.recent_lab_result || "No Results";

document.getElementById("outstandingBalance").textContent =
    `₹${data.outstanding_balance || 0}`;

           

        }

        catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

        }

    }

    // ==========================================
    // Initialize
    // ==========================================

    loadPatientDashboard();

});