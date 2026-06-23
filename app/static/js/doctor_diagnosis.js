document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // Authentication
    // ==========================================

    const token = localStorage.getItem("access_token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    // ==========================================
    // API Endpoints
    // ==========================================

    const DIAGNOSIS_API = "/diagnosis";
    const STATS_API = "/diagnosis-stats";

    // ==========================================
    // DOM Elements
    // ==========================================

    const searchInput =
        document.getElementById("tableSearch");

    const tabButtons =
        document.querySelectorAll("#filterTabs .tab-btn");

    const tableRows =
        document.querySelectorAll("#clinicalTable tbody tr");

    const emergencyBtn =
        document.getElementById("emergencyBtn");

    const newDiagnosisBtn =
        document.getElementById("newDiagnosisBtn");

    const addDiagnosisBtn =
        document.getElementById("addDiagnosisBtn");

    // Statistics

    const totalDiagnosis =
        document.getElementById("totalDiagnosis");

    const activeDiagnosis =
        document.getElementById("activeDiagnosis");

    const highSeverity =
        document.getElementById("highSeverity");
    const diagnosisTableBody =
        document.getElementById("diagnosisTableBody");

    // ==========================================
    // Load Statistics
    // ==========================================

    async function loadStatistics() {

        try {

            const response = await fetch(
                STATS_API,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load statistics");
            }

            const stats = await response.json();

            if (totalDiagnosis)
                totalDiagnosis.textContent =
                    stats.total_diagnosis || 0;

            if (activeDiagnosis)
                activeDiagnosis.textContent =
                    stats.active_diagnosis || 0;

            if (highSeverity)
                highSeverity.textContent =
                    stats.high_severity || 0;

        }

        catch (error) {

            console.error(
                "Statistics Error:",
                error
            );

        }

    }

    // ==========================================
// Load Diagnosis Table
// ==========================================

async function loadDiagnosis() {

    try {

        const response = await fetch(
            DIAGNOSIS_API,
            {
                headers: authHeaders
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load diagnosis.");
        }

        const diagnosisList = await response.json();

        diagnosisTableBody.innerHTML = "";

        diagnosisList.forEach(diagnosis => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${diagnosis.patient_name || "-"}</td>

                <td>
                    <strong>${diagnosis.disease || "-"}</strong><br>
                    <small>${diagnosis.icd_code || "-"}</small>
                </td>

                <td>${diagnosis.severity || "-"}</td>

                <td>${diagnosis.diagnosis_date || "-"}</td>

                <td>${diagnosis.diagnosis_status || "-"}</td>

                <td>
                    <button class="table-action-btn">
                        <span class="material-symbols-outlined">edit</span>
                    </button>

                    <button class="table-action-btn">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                </td>
            `;

            diagnosisTableBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(
            "Diagnosis Load Error:",
            error
        );

    }

}
    // ==========================================
    // Search
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener("input", (e) => {

            const query =
                e.target.value.toLowerCase().trim();

            tableRows.forEach(row => {

                const text =
                    row.textContent.toLowerCase();

                row.style.display =
                    text.includes(query)
                    ? ""
                    : "none";

            });

        });

    }

    // ==========================================
    // Filter Tabs
    // ==========================================

    tabButtons.forEach(button => {

        button.addEventListener("click", () => {

            tabButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const filter =
                button.dataset.filter;

            tableRows.forEach(row => {

                const status =
                    row.dataset.status;

                if (
                    filter === "all" ||
                    filter === status
                ) {
                    row.style.display = "";
                }
                else {
                    row.style.display = "none";
                }

            });

        });

    });

    // ==========================================
    // Emergency Button
    // ==========================================

    if (emergencyBtn) {

        emergencyBtn.addEventListener("click", () => {

            alert(
                "Emergency Alert Sent Successfully."
            );

        });

    }

    // ==========================================
    // New Diagnosis Button
    // ==========================================

    if (newDiagnosisBtn) {

        newDiagnosisBtn.addEventListener("click", () => {

            window.location.href =
                "/doctor-diagnosis/new";

        });

    }

    if (addDiagnosisBtn) {

        addDiagnosisBtn.addEventListener("click", () => {

            window.location.href =
                "/doctor-diagnosis/new";

        });

    }

    // ==========================================
    // Initialize
    // ==========================================

    loadStatistics();
    loadDiagnosis();

});