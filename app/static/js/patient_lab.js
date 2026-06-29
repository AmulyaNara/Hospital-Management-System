document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================
    // Authentication
    // ==========================================================

    const token = localStorage.getItem("access_token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    // ==========================================================
    // API Endpoints
    // ==========================================================

    const PATIENT_API = "/api/patient-dashboard";
    const LAB_API = "/api/patient-labs";

    // ==========================================================
    // Global Variables
    // ==========================================================

    let allLabs = [];
    let filteredLabs = [];

    const ROWS_PER_PAGE = 5;

    let currentPage = 1;

    // ==========================================================
    // DOM Elements
    // ==========================================================

    const labTable =
        document.getElementById("labTable");

    const searchInput =
        document.getElementById("labSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const paginationContainer =
        document.getElementById("paginationContainer");

    const resultsCounter =
        document.getElementById("resultsCounter");

    const emptyState =
        document.getElementById("emptyState");

    const downloadButton =
        document.getElementById("downloadAllBtn");

    // ==========================================================
    // Initialize Page
    // ==========================================================

    initialize();

    async function initialize() {

        await loadPatientHeader();

        await loadLabResults();

        initializeSearch();

        initializeStatusFilter();

        initializeDownloadButton();

    }

    // ==========================================================
    // Load Patient Header
    // ==========================================================

    async function loadPatientHeader() {

        try {

            const response = await fetch(
                PATIENT_API,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {

                throw new Error("Unable to load patient.");

            }

            const patient = await response.json();

            document.getElementById("patientName").textContent =
                patient.patient_name;

            document.getElementById("patientId").textContent =
                patient.patient_id;

            document.getElementById("headerPatientName").textContent =
                patient.patient_name;

            document.getElementById("patientInitial").textContent =
                patient.patient_name.charAt(0).toUpperCase();

        }

        catch (error) {

            console.error("Patient Header Error:", error);

        }

    }

    // ==========================================================
    // Load Laboratory Reports
    // ==========================================================

    async function loadLabResults() {

        try {

            const response = await fetch(
                LAB_API,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {

                throw new Error("Unable to load laboratory reports.");

            }

            const labs = await response.json();

            console.table(labs);

            allLabs = labs;

            filteredLabs = [...labs];

            currentPage = 1;

            renderTable();

            renderPagination();

            updateResultsCounter();

            updateSummaryCards();

            updateTrendChart();

        }

        catch (error) {

            console.error("Lab Loading Error:", error);

        }

    }
        // ==========================================================
    // Render Laboratory Table
    // ==========================================================

    function renderTable() {

        labTable.innerHTML = "";

        // No records found

        if (filteredLabs.length === 0) {

            document.getElementById("labResultsTable").style.display = "none";

            emptyState.style.display = "flex";

            updateResultsCounter();

            return;

        }

        document.getElementById("labResultsTable").style.display = "table";

        emptyState.style.display = "none";

        const startIndex =
            (currentPage - 1) * ROWS_PER_PAGE;

        const endIndex =
            startIndex + ROWS_PER_PAGE;

        const pageData =
            filteredLabs.slice(startIndex, endIndex);

        pageData.forEach(lab => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td class="test-name">

                    <strong>${lab.test_name}</strong>

                    <small>
                        LAB ID : ${lab.patient_code}
                    </small>

                </td>

                <td>

                    ${formatDate(lab.test_date)}

                </td>

                <td>

                    ${lab.doctor_name}

                </td>

                <td>

                    <span class="status ${lab.status.toLowerCase()}">

                        ${lab.status}

                    </span>

                </td>

                <td>

                    <button
                        class="action-btn view-btn">

                        <span class="material-symbols-outlined">

                            visibility

                        </span>

                    </button>

                </td>

            `;

            // Eye Button

            row.querySelector(".view-btn")

                .addEventListener("click", () => {

                    openLabModal(lab);

                });

            labTable.appendChild(row);

        });

    }

    // ==========================================================
    // View Laboratory Report
    // ==========================================================

    function openLabModal(lab) {

        const modal =
            document.getElementById("labModal");

        const body =
            document.getElementById("modalBody");

        body.innerHTML = `

            <div class="lab-report">

                <h3>

                    ${lab.test_name}

                </h3>

                <hr>

                <p>

                    <strong>Lab ID :</strong>

                    ${lab.patient_code}

                </p>

                <p>

                    <strong>Doctor :</strong>

                    ${lab.doctor_name}

                </p>

                <p>

                    <strong>Date :</strong>

                    ${formatDate(lab.test_date)}

                </p>

                <p>

                    <strong>Status :</strong>

                    ${lab.status}

                </p>

                <p>

                    <strong>Result :</strong>

                    ${lab.result_value || "--"}

                    ${lab.unit || ""}

                </p>

                <p>

                    <strong>Reference Range :</strong>

                    ${lab.reference_range || "--"}

                </p>

                <p>

                    <strong>Remarks :</strong>

                    ${lab.remarks || "No remarks available."}

                </p>

            </div>

        `;

        modal.classList.remove("hidden");

    }

    // ==========================================================
    // Close Modal
    // ==========================================================

    document

        .getElementById("closeModal")

        .addEventListener("click", () => {

            document

                .getElementById("labModal")

                .classList.add("hidden");

        });

    window.addEventListener("click", (event) => {

        const modal =
            document.getElementById("labModal");

        if (event.target === modal) {

            modal.classList.add("hidden");

        }

    });
        // ==========================================================
    // Search
    // ==========================================================

    function initializeSearch() {

        searchInput.addEventListener("input", () => {

            applyFilters();

        });

    }

    // ==========================================================
    // Status Filter
    // ==========================================================

    function initializeStatusFilter() {

        statusFilter.addEventListener("change", () => {

            applyFilters();

        });

    }

    // ==========================================================
    // Apply Search + Filter
    // ==========================================================

    function applyFilters() {

        const search =
            searchInput.value.trim().toLowerCase();

        const status =
            statusFilter.value.toLowerCase();

        filteredLabs = allLabs.filter(lab => {

            const matchSearch =

                lab.test_name.toLowerCase().includes(search)

                ||

                lab.doctor_name.toLowerCase().includes(search)

                ||

                lab.patient_code.toLowerCase().includes(search);

            const matchStatus =

                status === ""

                ||

                lab.status.toLowerCase() === status;

            return matchSearch && matchStatus;

        });

        currentPage = 1;

        renderTable();

        renderPagination();

        updateResultsCounter();

        updateSummaryCards();

        updateTrendChart();

    }

    // ==========================================================
    // Results Counter
    // ==========================================================

    function updateResultsCounter() {

        if (filteredLabs.length === 0) {

            resultsCounter.textContent =
                "Showing 0-0 of 0 Results";

            return;

        }

        const start =
            (currentPage - 1) * ROWS_PER_PAGE + 1;

        const end =
            Math.min(
                currentPage * ROWS_PER_PAGE,
                filteredLabs.length
            );

        resultsCounter.textContent =

            `Showing ${start}-${end} of ${filteredLabs.length} Results`;

    }

    // ==========================================================
    // Pagination
    // ==========================================================

    function renderPagination() {

        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(

            filteredLabs.length / ROWS_PER_PAGE

        );

        if (totalPages <= 1) {

            return;

        }

        // ---------------- Previous ----------------

        const previous = document.createElement("button");

        previous.textContent = "Previous";

        previous.disabled = currentPage === 1;

        previous.addEventListener("click", () => {

            currentPage--;

            renderTable();

            renderPagination();

            updateResultsCounter();

        });

        paginationContainer.appendChild(previous);

        // ---------------- Page Numbers ----------------

        for (let i = 1; i <= totalPages; i++) {

            const page = document.createElement("button");

            page.textContent = i;

            if (i === currentPage) {

                page.classList.add("active");

            }

            page.addEventListener("click", () => {

                currentPage = i;

                renderTable();

                renderPagination();

                updateResultsCounter();

            });

            paginationContainer.appendChild(page);

        }

        // ---------------- Next ----------------

        const next = document.createElement("button");

        next.textContent = "Next";

        next.disabled = currentPage === totalPages;

        next.addEventListener("click", () => {

            currentPage++;

            renderTable();

            renderPagination();

            updateResultsCounter();

        });

        paginationContainer.appendChild(next);

    }
        // ==========================================================
    // Summary Cards
    // ==========================================================

    function updateSummaryCards() {

        const cholesterol =
            filteredLabs.find(l =>
                l.test_name.toLowerCase().includes("cholesterol")
            );

        const hba1c =
            filteredLabs.find(l =>
                l.test_name.toLowerCase().includes("hba1c")
                ||
                l.test_name.toLowerCase().includes("glucose")
            );

        // Cholesterol

        if (cholesterol) {

            document.getElementById("cholesterolValue").innerHTML =

                `${cholesterol.result_value || "--"}
                <span>${cholesterol.unit || "mg/dL"}</span>`;

            document.getElementById("cholesterolStatus").textContent =
                cholesterol.remarks || "Normal";

        }

        else {

            document.getElementById("cholesterolValue").innerHTML =
                `-- <span>mg/dL</span>`;

            document.getElementById("cholesterolStatus").textContent =
                "No Data";

        }

        // HbA1c

        if (hba1c) {

            document.getElementById("hba1cValue").innerHTML =

                `${hba1c.result_value || "--"}
                <span>${hba1c.unit || "%"}</span>`;

            document.getElementById("hba1cStatus").textContent =
                hba1c.remarks || "Normal";

        }

        else {

            document.getElementById("hba1cValue").innerHTML =
                `-- <span>%</span>`;

            document.getElementById("hba1cStatus").textContent =
                "No Data";

        }

    }

    // ==========================================================
    // Trend Chart
    // ==========================================================

    function updateTrendChart() {

        const chart =
            document.getElementById("trendChart");

        chart.innerHTML = "";

        const reports = filteredLabs

            .filter(l =>
                l.test_name.toLowerCase().includes("glucose")
                ||
                l.test_name.toLowerCase().includes("hba1c")
            )

            .slice(-6);

        if (reports.length === 0) {

            chart.innerHTML =
                "<p>No Trend Data Available</p>";

            document.getElementById("trendPeriod").textContent =
                "No Reports";

            return;

        }

        reports.forEach(report => {

            const value =
                parseFloat(report.result_value) || 5;

            const height =
                Math.min(value * 20, 120);

            const month =
                new Date(report.test_date)
                .toLocaleString("default", {

                    month: "short"

                });

            chart.innerHTML += `

                <div class="bar-group">

                    <div
                        class="bar"
                        style="height:${height}px">
                    </div>

                    <span>${month}</span>

                </div>

            `;

        });

        document.getElementById("trendPeriod").textContent =

            `Past ${reports.length} Reports`;

    }

    // ==========================================================
    // Download Button
    // ==========================================================

    function initializeDownloadButton() {

        downloadButton.addEventListener("click", () => {

            const json =
                JSON.stringify(filteredLabs, null, 2);

            const blob =
                new Blob([json], {

                    type: "application/json"

                });

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download = "lab_reports.json";

            link.click();

            URL.revokeObjectURL(url);

        });

    }

    // ==========================================================
    // Helper
    // ==========================================================

    function formatDate(date) {

        if (!date) return "--";

        return new Date(date)

            .toLocaleDateString("en-IN", {

                day: "2-digit",

                month: "short",

                year: "numeric"

            });

    }

});