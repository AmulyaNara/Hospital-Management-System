/**
 * MediFlow Pro - Visits Module
 */

document.addEventListener('DOMContentLoaded', () => {

    const API_URL = "http://127.0.0.1:8000";

    let allVisits = [];
    let currentPage = 1;
    const recordsPerPage = 4;

    // =========================
    // Load Visit Statistics
    // =========================
    async function loadVisitStats() {

        try {

            const response =
                await fetch(
                    `${API_URL}/visit-stats`
                );

            const stats =
                await response.json();

            document.getElementById(
                "totalAppointments"
            ).textContent =
                stats.total_appointments || 0;

            document.getElementById(
                "waitingCount"
            ).textContent =
                stats.waiting || 0;

            document.getElementById(
                "consultationCount"
            ).textContent =
                stats.consultation || 0;

            document.getElementById(
                "completedCount"
            ).textContent =
                stats.completed || 0;

        }
        catch(error) {

            console.error(
                "Visit stats error:",
                error
            );
        }
    }

    // =========================
    // Load Visits
    // =========================
    async function loadVisits() {

        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            const response =
                await fetch(
                    `${API_URL}/visits`,
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

            const visits =
                await response.json();

            allVisits = visits;

            renderVisits();

        }
        catch(error) {

            console.error(
                "Failed to load visits:",
                error
            );
        }
    }

    // =========================
    // Render Visits
    // =========================
    function renderVisits() {

        const tableBody =
            document.getElementById(
                "visitsTableBody"
            );

        tableBody.innerHTML = "";

        const start =
            (currentPage - 1) *
            recordsPerPage;

        const end =
            start +
            recordsPerPage;

        const pageVisits =
            allVisits.slice(
                start,
                end
            );

        pageVisits.forEach(visit => {

            let statusClass =
                "status-waiting";

            if (
                visit.visit_status ===
                "Completed"
            ) {
                statusClass =
                    "status-completed";
            }

            if (
                visit.visit_status ===
                "Consultation"
            ) {
                statusClass =
                    "status-consultation";
            }

            tableBody.innerHTML += `

                <div
                    class="table-row table-body-row"
                    data-patient-id="${visit.patient_id}">

                    <div class="col-time">
                        ${visit.visit_time || "N/A"}
                    </div>

                    <div class="col-patient">
                        ${visit.patient_name || "Unknown"}
                    </div>

                    <div class="col-reason">
                        ${visit.chief_complaint || "N/A"}
                    </div>

                    <div class="col-status">
                        <span class="${statusClass}">
                            ${visit.visit_status || "Waiting"}
                        </span>
                    </div>

                    <div class="col-actions">

                        <button
                            class="row-btn"
                            data-patient-id="${visit.patient_id}">
                            View
                        </button>

                    </div>

                </div>

            `;
        });

        updatePaginationInfo();
        attachRowEvents();
    }

    // =========================
    // Pagination Info
    // =========================
    function updatePaginationInfo() {

        const start =
            ((currentPage - 1)
            * recordsPerPage) + 1;

        const end =
            Math.min(
                currentPage *
                recordsPerPage,
                allVisits.length
            );

        document.getElementById(
            "paginationInfo"
        ).textContent =
            `Showing ${start}-${end} of ${allVisits.length} Visits`;
    }

    // =========================
    // Previous
    // =========================
    const prevBtn =
        document.getElementById(
            "prevBtn"
        );

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            () => {

                if (
                    currentPage > 1
                ) {

                    currentPage--;

                    renderVisits();
                }
            }
        );
    }

    // =========================
    // Next
    // =========================
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
                        allVisits.length /
                        recordsPerPage
                    );

                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderVisits();
                }
            }
        );
    }

    // =========================
    // Search
    // =========================
    const searchInput =
        document.getElementById(
            "visitSearchInput"
        );

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            event => {

                const query =
                    event.target.value
                    .toLowerCase()
                    .trim();

                const rows =
                    document.querySelectorAll(
                        ".table-body-row"
                    );

                rows.forEach(row => {

                    const text =
                        row.innerText
                        .toLowerCase();

                    row.style.display =
                        text.includes(query)
                        ? ""
                        : "none";
                });
            }
        );
    }

    // =========================
    // Row Navigation
    // =========================
    function attachRowEvents() {

        const rows =
            document.querySelectorAll(
                ".table-body-row"
            );

        rows.forEach(row => {

            row.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".row-btn"
                        )
                    ) {
                        return;
                    }

                    const patientId =
                        row.dataset.patientId;

                    console.log(
                        "Patient:",
                        patientId
                    );

                    // Future:
                    // window.location.href =
                    // `/patient-visit/${patientId}`;
                }
            );
        });
    }

    // =========================
    // Emergency Button
    // =========================
    const emergencyButton =
        document.querySelector(
            ".btn-emergency"
        );

    if (emergencyButton) {

        emergencyButton.addEventListener(
            "click",
            () => {

                alert(
                    "Emergency Response Event Dispatcher activated."
                );
            }
        );
    }

    // =========================
    // Initial Load
    // =========================
    loadVisitStats();
    loadVisits();

});