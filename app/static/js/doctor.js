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

    diagnosisBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllSections();

        if (diagnosisSection)
            diagnosisSection.style.display = "block";

        removeActive();
        diagnosisBtn.classList.add("active");
    });

    // Issue Prescription Button Redirect
    const issuePrescriptionBtn =
        document.getElementById("issuePrescriptionBtn");

    if (issuePrescriptionBtn) {
        issuePrescriptionBtn.addEventListener("click", () => {
            window.location.href = "/doctor-prescriptions";
        });
    }

});