document.addEventListener('DOMContentLoaded', () => {

    const API_URL = "http://127.0.0.1:8000";
    let allPatients = [];
    let currentPage = 1;
    const recordsPerPage = 6;
    async function loadPatientStats() {

    try {

        const response =
            await fetch(
                `${API_URL}/patient-stats`
            );

        const stats =
            await response.json();

        document.getElementById(
            "totalPatients"
        ).textContent =
            stats.total_patients;

        document.getElementById(
            "criticalCare"
        ).textContent =
            stats.critical_care;

        document.getElementById(
            "pendingFollowups"
        ).textContent =
            stats.pending_followups;

        document.getElementById(
            "avgWaitTime"
        ).textContent =
            stats.avg_wait_time;

    }
    catch(error) {

        console.error(
            "Failed to load stats:",
            error
        );
    }
}
    // =========================
    // Load Dashboard Cards
    // =========================
    async function loadPatients() {

    try {

        const token =
            localStorage.getItem(
                "access_token"
            );

        const response =
            await fetch(
                `${API_URL}/patients`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const patients =
            await response.json();

        allPatients = patients;

        renderPatients();

    }
    catch(error) {

        console.error(
            "Failed to load patients:",
            error
        );
    }
}
function renderPatients() {

    const tableBody =
        document.getElementById(
            "patientsTableBody"
        );

    tableBody.innerHTML = "";

    const start =
        (currentPage - 1) *
        recordsPerPage;

    const end =
        start +
        recordsPerPage;

    const pagePatients =
        allPatients.slice(
            start,
            end
        );

    pagePatients.forEach(patient => {

        tableBody.innerHTML += `
            <tr class="clinical-table-row">

                <td>
                    <div class="patient-identity-cell">
                        <div>

                            <p class="p-name">
                                ${patient.patient_name || "N/A"}
                            </p>

                            <p class="p-condition">
                                ${patient.medical_condition || patient.gender || "N/A"}
                            </p>

                        </div>
                    </div>
                </td>

                <td>
                    <div class="stack-cell">

                        <p class="p-id">
                            PID-${patient.patient_id}
                        </p>

                        <p class="p-age">
                            ${patient.age || "N/A"} Years
                        </p>

                    </div>
                </td>

                <td>
                    <div class="stack-cell">

                        <p class="p-date">
                            ${patient.last_visit_date || "No Visit"}
                        </p>

                    </div>
                </td>

                <td>

                    <span class="status-badge stable">
                        ${patient.clinical_status || "Active"}
                    </span>

                </td>

                <td>

                    <div class="row-actions">

                        <button class="btn-view">
                            View Records
                        </button>

                    </div>

                </td>

            </tr>
        `;
    });

    updatePaginationInfo();
}
function updatePaginationInfo() {

    const start =
        ((currentPage - 1) *
        recordsPerPage) + 1;

    const end =
        Math.min(
            currentPage *
            recordsPerPage,
            allPatients.length
        );

    const paginationInfo =
        document.getElementById(
            "paginationInfo"
        );

    if (paginationInfo) {

        paginationInfo.textContent =
            `Showing ${start}-${end} of ${allPatients.length} records`;
    }
}

const prevBtn =
    document.getElementById(
        "prevBtn"
    );

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        () => {

            if(currentPage > 1){

                currentPage--;

                renderPatients();
            }
        }
    );
}

const nextBtn =
    document.getElementById(
        "nextBtn"
    );

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        () => {

            const totalPages =
                Math.ceil(
                    allPatients.length /
                    recordsPerPage
                );

            if(currentPage < totalPages){

                currentPage++;

                renderPatients();
            }
        }
    );
}
loadPatientStats();
loadPatients();
});