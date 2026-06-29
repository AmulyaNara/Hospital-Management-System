document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // Authentication
    // ==========================================

    const token = localStorage.getItem("access_token");

    const headers = {

        Authorization: `Bearer ${token}`

    };

    // ==========================================
    // Existing Hover Effects
    // ==========================================

    const runtimeCards = document.querySelectorAll(
        ".bento-block-item, .metric-card-box"
    );

    runtimeCards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-4px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0)";

        });

    });

    // ==========================================
    // Sidebar Navigation
    // ==========================================

    const links = document.querySelectorAll(
        ".sidebar-navigation .nav-anchor"
    );

    links.forEach(link => {

        link.addEventListener("click", () => {

            links.forEach(item => {

                item.classList.remove("active");

            });

            link.classList.add("active");

        });

    });

    // ==========================================
    // Dashboard Cards
    // ==========================================

    async function loadDashboard() {

        try {

            const response = await fetch(

                "/api/admin-dashboard",

                {

                    headers

                }

            );

            const data = await response.json();

            document.getElementById("totalPatients").textContent =
                data.total_patients;

            document.getElementById("totalDoctors").textContent =
                data.total_doctors;

            document.getElementById("todayAppointments").textContent =
                data.today_appointments;

            document.getElementById("totalRevenue").textContent =
                `₹${data.revenue}`;

        }

        catch (err) {

            console.error(err);

        }

    }

    // ==========================================
    // Recent Patients
    // ==========================================

    async function loadRecentPatients() {

        try {

            const response = await fetch(

                "/api/admin-recent-patients",

                {

                    headers

                }

            );

            const patients = await response.json();

            const tbody =
                document.getElementById("recentPatients");

            if (!tbody) return;

            tbody.innerHTML = "";

            patients.forEach(patient => {

                tbody.innerHTML += `

                <tr>

                    <td>${patient.patient_id}</td>

                    <td>${patient.patient_name}</td>

                    <td>${patient.phone}</td>

                    <td>${patient.last_visit ?? "-"}</td>

                </tr>

                `;

            });

        }

        catch (err) {

            console.error(err);

        }

    }

    // ==========================================
    // Recent Visits
    // ==========================================

    async function loadRecentVisits() {

        try {

            const response = await fetch(

                "/api/admin-recent-visits",

                {

                    headers

                }

            );

            const visits = await response.json();

            const tbody =
                document.getElementById("recentVisits");

            if (!tbody) return;

            tbody.innerHTML = "";

            visits.forEach(visit => {

                tbody.innerHTML += `

                <tr>

                    <td>${visit.patient}</td>

                    <td>${visit.doctor}</td>

                    <td>${visit.date}</td>

                    <td>${visit.status}</td>

                </tr>

                `;

            });

        }

        catch (err) {

            console.error(err);

        }

    }

    // ==========================================
    // Activities
    // ==========================================

    async function loadActivities() {

        try {

            const response = await fetch(

                "/api/admin-recent-activities",

                {

                    headers

                }

            );

            const activities = await response.json();

            const container =
                document.getElementById("recentActivities");

            if (!container) return;

            container.innerHTML = "";

            activities.forEach(activity => {

                container.innerHTML += `

                <div class="activity-item">

                    <strong>${activity.activity}</strong>

                    <small>${activity.time}</small>

                </div>

                `;

            });

        }

        catch (err) {

            console.error(err);

        }

    }
    const exportBtn = document.getElementById("exportBtn");

if(exportBtn){

    exportBtn.onclick = () => {

        window.location.href = "/api/admin/export";

    };

}
/* ==========================================
   NEW ADMISSION
========================================== */

const newAdmissionBtn = document.getElementById("newAdmissionBtn");

if (newAdmissionBtn) {

    newAdmissionBtn.addEventListener("click", () => {

        window.location.href = "/admin-patients";

    });

}

    // ==========================================
    // Initialize
    // ==========================================

    loadDashboard();

    loadRecentPatients();

    loadRecentVisits();

    loadActivities();

});
