document.addEventListener("DOMContentLoaded", () => {

    // Button click animation
    const interactiveElements = document.querySelectorAll(
        "button, .menu-item, .btn-action-primary, .btn-action-secondary, .btn-action-tertiary"
    );

    interactiveElements.forEach(element => {
        element.addEventListener("mousedown", () => {
            element.style.transform = "scale(0.98)";
            element.style.transition = "transform 0.05s ease";
        });

        element.addEventListener("mouseup", () => {
            element.style.transform = "scale(1)";
        });

        element.addEventListener("mouseleave", () => {
            element.style.transform = "scale(1)";
        });
    });

    // Sidebar buttons
    const dashboardBtn = document.getElementById("dashboard-btn");
    const patientsBtn = document.getElementById("patients-btn");
    const visitsBtn = document.getElementById("visits-btn");
    const appointmentsBtn = document.getElementById("appointments-btn");
    const prescriptionsBtn = document.getElementById("prescriptions-btn");
    const diagnosisBtn = document.getElementById("diagnosis-btn");

    // Sections
    const dashboardSection = document.getElementById("dashboard-section");
    const patientsSection = document.getElementById("patients-section");
    const visitsSection = document.getElementById("visits-section");
    const appointmentsSection = document.getElementById("appointments-section");
    const prescriptionsSection = document.getElementById("prescriptions-section");
    const diagnosisSection = document.getElementById("diagnosis-section");

    function hideAllSections() {

        if (dashboardSection)
            dashboardSection.style.display = "none";

        if (patientsSection)
            patientsSection.style.display = "none";

        if (visitsSection)
            visitsSection.style.display = "none";

        if (appointmentsSection)
            appointmentsSection.style.display = "none";

        if (prescriptionsSection)
            prescriptionsSection.style.display = "none";

        if (diagnosisSection)
            diagnosisSection.style.display = "none";
    }

    function removeActive() {
        document.querySelectorAll(".menu-item").forEach(item => {
            item.classList.remove("active");
        });
    }

    dashboardBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();

        if (dashboardSection)
            dashboardSection.style.display = "block";

        removeActive();
        dashboardBtn.classList.add("active");
    });

    patientsBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();

        if (patientsSection)
            patientsSection.style.display = "block";

        removeActive();
        patientsBtn.classList.add("active");
    });

    visitsBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();

        if (visitsSection)
            visitsSection.style.display = "block";

        removeActive();
        visitsBtn.classList.add("active");
    });

    appointmentsBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();

        if (appointmentsSection)
            appointmentsSection.style.display = "block";

        removeActive();
        appointmentsBtn.classList.add("active");
    });

    prescriptionsBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();

        if (prescriptionsSection)
            prescriptionsSection.style.display = "block";

        removeActive();
        prescriptionsBtn.classList.add("active");
    });

    // Issue Prescription Button Redirect
    const issuePrescriptionBtn =
        document.getElementById("issuePrescriptionBtn");

    if (issuePrescriptionBtn) {
        issuePrescriptionBtn.addEventListener("click", () => {
            window.location.href = "/doctor-prescriptions";
        });
    }
    async function loadDashboard() {

    try {

        const response = await fetch("/doctor-stats");

        const data = await response.json();

        document.getElementById("totalPatients").textContent =
            data.total_patients;

        document.getElementById("todayVisits").textContent =
            data.today_visits;

        document.getElementById("pendingRx").textContent =
            data.pending_prescriptions;

        document.getElementById("labResults").textContent =
            data.pending_lab_results;

    } catch (err) {

        console.error("Dashboard Error:", err);

    }

}
async function loadUpcomingVisits() {

    try {

        const response = await fetch("/doctor-upcoming-visits");

        console.log("Response:", response);

        const visits = await response.json();

        console.log("Visits:", visits);

        const tbody = document.getElementById("upcomingVisitsBody");

        console.log("Tbody:", tbody);

        tbody.innerHTML = "";

        let html = "";

        visits.forEach(visit => {

            html += `
            <tr>
                <td>${visit.visit_time || "-"}</td>

                <td>
                    <div class="patient-profile-tag">
                        <span>${visit.patient_name}</span>
                    </div>
                </td>

                <td>${visit.chief_complaint}</td>

                <td>
                    <span class="status-tag">
                        ${visit.visit_status || "Pending"}
                    </span>
                </td>

                <td>
                    <button class="table-action-btn">
                        <span class="material-symbols-outlined">
                            more_vert
                        </span>
                    </button>
                </td>
            </tr>
            `;

        });

        tbody.innerHTML = html;

        console.log("Rows Loaded:", visits.length);

    } catch (err) {

        console.error("Upcoming Visits Error:", err);

    }

}

loadUpcomingVisits();

// Call the function
loadDashboard();

});