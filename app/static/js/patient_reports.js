document.addEventListener("DOMContentLoaded", () => {

    console.log("Patient Records Page Loaded");

    // ==========================================================
    // Authentication
    // ==========================================================

    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    // ==========================================================
    // API Endpoints
    // ==========================================================

    const PATIENT_API = "/api/patient-dashboard";
    const RECORDS_API = "/api/patient-records";

    // ==========================================================
    // Global Variables
    // ==========================================================

    let allRecords = [];
    let filteredRecords = [];

    const RECORDS_PER_PAGE = 5;
    let currentPage = 1;

    // ==========================================================
    // DOM Elements
    // ==========================================================

    const patientName =
        document.getElementById("patientName");

    const patientId =
        document.getElementById("patientId");

    const recordsTable =
        document.getElementById("recordsTable");

    const totalItems =
        document.getElementById("totalItems");

    const paginationContainer =
        document.getElementById("paginationContainer");

    const searchInput =
        document.getElementById("recordSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const dateFilter =
        document.getElementById("dateFilter");

    const bookAppointmentBtn =
        document.getElementById("bookAppointmentBtn");

    // ==========================================================
    // Sidebar Button
    // ==========================================================

    if (bookAppointmentBtn) {

        bookAppointmentBtn.addEventListener("click", () => {

            window.location.href =
                "/patient-appointments";

        });

    }

    // ==========================================================
    // Initialize Page
    // ==========================================================

    initializePage();

    async function initializePage() {

        await loadPatientHeader();

        await loadMedicalRecords();

        attachFilterEvents();

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

                throw new Error("Unable to load patient details.");

            }

            const patient = await response.json();

            patientName.textContent =
                patient.patient_name;

            patientId.textContent =
                patient.patient_id;

        }

        catch (error) {

            console.error(
                "Patient Header Error:",
                error
            );

        }

    }

    // ==========================================================
    // Load Medical Records
    // ==========================================================

    async function loadMedicalRecords() {

        try {

            const response = await fetch(
                RECORDS_API,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {

                throw new Error("Unable to load medical records.");

            }

            const records = await response.json();

            console.table(records);

            allRecords = records;

            filteredRecords = [...records];

            currentPage = 1;

            updateTotalItems();

            renderRecords();

            renderPagination();

        }

        catch (error) {

            console.error(
                "Medical Records Error:",
                error
            );

        }

    }
        // ==========================================================
    // Update Total Items
    // ==========================================================

    function updateTotalItems() {

        totalItems.textContent =
            `${filteredRecords.length} Total Item${filteredRecords.length !== 1 ? "s" : ""}`;

    }


    // ==========================================================
    // Render Medical Records Table
    // ==========================================================

    function renderRecords() {

        recordsTable.innerHTML = "";

        // Empty State
        if (filteredRecords.length === 0) {

            recordsTable.innerHTML = `

                <tr>

                    <td colspan="5" class="empty-state">

                        No medical records found.

                    </td>

                </tr>

            `;

            return;

        }

        const startIndex =
            (currentPage - 1) * RECORDS_PER_PAGE;

        const endIndex =
            startIndex + RECORDS_PER_PAGE;

        const pageRecords =
            filteredRecords.slice(startIndex, endIndex);

        pageRecords.forEach(record => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>

                    <div class="record-info">

                        <div class="record-icon teal">

                            <span class="material-symbols-outlined">

                                description

                            </span>

                        </div>

                        <span>

                            ${record.document_name}

                        </span>

                    </div>

                </td>

                <td>

                    ${record.doctor_name}

                </td>

                <td>

                    <span class="badge green">

                        ${record.category}

                    </span>

                </td>

                <td>

                    ${record.date}

                </td>

                <td class="text-right">

                    <button
                        class="view-btn">

                        <span class="material-symbols-outlined">

                            visibility

                        </span>

                    </button>

                </td>

            `;

            row
                .querySelector(".view-btn")
                .addEventListener("click", () => {

                    viewRecord(record);

                });

            recordsTable.appendChild(row);

        });

    }


    // ==========================================================
    // View Record
    // ==========================================================

    function viewRecord(record) {

        const details = `

Document Name : ${record.document_name}

Doctor : ${record.doctor_name}

Category : ${record.category}

Date : ${record.date}

Status : ${record.status || "Verified"}

Description : ${record.description || "No additional information available."}

        `;

        alert(details);

    }
        // ==========================================================
    // Attach Search & Filter Events
    // ==========================================================

    function attachFilterEvents() {

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                applyFilters
            );

        }

        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                applyFilters
            );

        }

        if (dateFilter) {

            dateFilter.addEventListener(
                "change",
                applyFilters
            );

        }

    }

    // ==========================================================
    // Apply All Filters
    // ==========================================================

    function applyFilters() {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();

        const selectedCategory =
            categoryFilter.value
                .trim()
                .toLowerCase();

        const selectedDate =
            dateFilter.value;

        filteredRecords = allRecords.filter(record => {

            const matchSearch =

                record.document_name
                    .toLowerCase()
                    .includes(searchText)

                ||

                record.doctor_name
                    .toLowerCase()
                    .includes(searchText);

            const matchCategory =

                selectedCategory === ""

                ||

                (record.category || "")
                    .toLowerCase() ===
                    selectedCategory;

            const matchDate =

                selectedDate === ""

                ||

                record.date ===
                selectedDate;

            return (

                matchSearch

                &&

                matchCategory

                &&

                matchDate

            );

        });

        currentPage = 1;

        updateTotalItems();

        renderRecords();

        renderPagination();

    }
        // ==========================================================
    // Render Pagination
    // ==========================================================

    function renderPagination() {

        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(
            filteredRecords.length / RECORDS_PER_PAGE
        );

        if (totalPages <= 1) {

            return;

        }

        // -----------------------------
        // Previous Button
        // -----------------------------

        const previousButton =
            document.createElement("button");

        previousButton.textContent = "Previous";

        previousButton.disabled =
            currentPage === 1;

        previousButton.addEventListener("click", () => {

            currentPage--;

            renderRecords();

            renderPagination();

        });

        paginationContainer.appendChild(
            previousButton
        );

        // -----------------------------
        // Page Numbers
        // -----------------------------

        for (let page = 1; page <= totalPages; page++) {

            const pageButton =
                document.createElement("button");

            pageButton.textContent = page;

            if (page === currentPage) {

                pageButton.classList.add("active");

            }

            pageButton.addEventListener("click", () => {

                currentPage = page;

                renderRecords();

                renderPagination();

            });

            paginationContainer.appendChild(
                pageButton
            );

        }

        // -----------------------------
        // Next Button
        // -----------------------------

        const nextButton =
            document.createElement("button");

        nextButton.textContent = "Next";

        nextButton.disabled =
            currentPage === totalPages;

        nextButton.addEventListener("click", () => {

            currentPage++;

            renderRecords();

            renderPagination();

        });

        paginationContainer.appendChild(
            nextButton
        );

    }

});