// ======================================================
// MediFlow Pro - Doctor Prescriptions
// Part 1
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    console.log("TOKEN FROM LOCAL STORAGE:", token);

const authHeaders = {
    "Authorization": `Bearer ${token}`
};

console.log("AUTH HEADERS:", authHeaders);



    // ===========================================
    // API
    // ===========================================

    const PRESCRIPTION_API = "/prescriptions";
    const STATS_API = "/prescription-stats";

    // ===========================================
    // DOM
    // ===========================================

    const tbody = document.getElementById("prescriptionsTableBody");

    const searchInput = document.getElementById("searchInput");

    const paginationInfo = document.getElementById("paginationInfo");

    const prevBtn = document.getElementById("prevBtn");

    const nextBtn = document.getElementById("nextBtn");

    const totalPrescriptions =
        document.getElementById("totalPrescriptions");

    const activePrescriptions =
        document.getElementById("activePrescriptions");

    const completedPrescriptions =
        document.getElementById("completedPrescriptions");

    const todayPrescriptions =
        document.getElementById("todayPrescriptions");

    // ===========================================
    // Pagination
    // ===========================================

    const rowsPerPage = 6;

    let currentPage = 1;

    let prescriptions = [];

    let filteredPrescriptions = [];

    // ===========================================
    // Fetch Statistics
    // ===========================================

 async function loadStatistics() {

    try {

        const response = await fetch(STATS_API, {
            headers: authHeaders
        });

        console.log("STATUS:", response.status);

        const stats = await response.json();

        console.log("TOTAL =", stats.total_prescriptions);
        console.log("ACTIVE =", stats.active_prescriptions);
        console.log("COMPLETED =", stats.completed_prescriptions);
        console.log("TODAY =", stats.today_prescriptions);
        console.log(stats);

        console.log("Before Update:", totalPrescriptions.textContent);
//alert("Updating card to " + stats.total_prescriptions);

console.log(totalPrescriptions);

totalPrescriptions.textContent = stats.total_prescriptions;

console.log("After:", totalPrescriptions.textContent);

activePrescriptions.textContent = stats.active_prescriptions;
completedPrescriptions.textContent = stats.completed_prescriptions;
todayPrescriptions.textContent = stats.today_prescriptions;

console.log("After Update:", totalPrescriptions.textContent);

setTimeout(() => {
    console.log("After 2 Seconds:", totalPrescriptions.textContent);
}, 2000);
    } catch (err) {

        console.error("Statistics Error:", err);

    }

}
    
    // ===========================================
    // Fetch Prescriptions
    // ===========================================

    async function loadPrescriptions() {

        try {

            const response = await fetch(PRESCRIPTION_API, {
    headers: authHeaders
});

            prescriptions = await response.json();

            filteredPrescriptions = [...prescriptions];

            renderTable();

        }

        catch (error) {

            console.error(
                "Prescription Load Error:",
                error
            );

        }

    }

    // ===========================================
    // Search
    // ===========================================

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();

            filteredPrescriptions = prescriptions.filter(item => {

                return (

                    item.patient_name
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    item.patient_code
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    item.medicine_name
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    item.dosage
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    item.prescription_status
                        ?.toLowerCase()
                        .includes(keyword)

                );

            });

            currentPage = 1;

            renderTable();

        });

    }

    // ===========================================
    // Status Badge Helper
    // ===========================================

    function getBadgeClass(status) {

        if (!status)
            return "active";

        status = status.toLowerCase();

        if (status === "active")
            return "active";

        if (status === "completed")
            return "discontinued";

        if (status === "pending refill")
            return "refill";

        return "active";

    }

        // ===========================================
    // Render Table
    // ===========================================

    function renderTable() {

        tbody.innerHTML = "";

        const start = (currentPage - 1) * rowsPerPage;

        const end = start + rowsPerPage;

        const pageData = filteredPrescriptions.slice(start, end);

        pageData.forEach(item => {

            tbody.innerHTML += `

            <tr>

                <td>

                    <div class="patient-cell">

                        <div class="avatar teal">

                            ${item.patient_name
                                ? item.patient_name.charAt(0).toUpperCase()
                                : "P"}

                        </div>

                        <div>

                            <div class="cell-title">

                                ${item.patient_name || "-"}

                            </div>

                            <div class="cell-sub">

                                ${item.patient_code || "-"}

                            </div>

                        </div>

                    </div>

                </td>

                <td>

                    <div class="cell-title">

                        ${item.medicine_name || "-"}

                    </div>

                    <div class="cell-sub">

                        ${item.dosage || "-"}

                    </div>

                </td>

                <td>

                    ${item.frequency || "-"}

                </td>

                <td>

                    ${item.duration || "-"}

                </td>

                <td>

                    ${item.date_prescribed || "-"}

                </td>

                <td>

                    <span class="badge-status ${getBadgeClass(item.prescription_status)}">

                        ${item.prescription_status || "-"}

                    </span>

                </td>

                <td>

                    <div class="row-actions">

                        <button
                            class="table-action-btn view-btn"
                            data-id="${item.prescription_id}">

                            <i class="fa-solid fa-eye"></i>

                        </button>

                        <button
                            class="table-action-btn edit-btn"
                            data-id="${item.prescription_id}">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                    </div>

                </td>

            </tr>

            `;

        });

        updatePagination();

        attachRowEvents();

    }

    // ===========================================
    // Pagination
    // ===========================================

    function updatePagination() {

        const total = filteredPrescriptions.length;

        const start = total === 0
            ? 0
            : ((currentPage - 1) * rowsPerPage) + 1;

        const end = Math.min(
            currentPage * rowsPerPage,
            total
        );

        paginationInfo.textContent =
            `Showing ${start}-${end} of ${total} Prescriptions`;

        prevBtn.disabled =
            currentPage === 1;

        nextBtn.disabled =
            currentPage >=
            Math.ceil(total / rowsPerPage);

    }

    // ===========================================
    // Previous Page
    // ===========================================

    prevBtn.addEventListener("click", () => {

        if (currentPage > 1) {

            currentPage--;

            renderTable();

        }

    });

    // ===========================================
    // Next Page
    // ===========================================

    nextBtn.addEventListener("click", () => {

        if (
            currentPage <
            Math.ceil(filteredPrescriptions.length / rowsPerPage)
        ) {

            currentPage++;

            renderTable();

        }

    });

    // ===========================================
    // Status Filters
    // ===========================================

    const filterButtons =
        document.querySelectorAll(".tab-btn");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const value =
                button.textContent
                    .trim()
                    .toLowerCase();

            if (value === "all statuses") {

                filteredPrescriptions =
                    [...prescriptions];

            }

            else if (value === "active") {

                filteredPrescriptions =
                    prescriptions.filter(item =>
                        item.prescription_status
                        ?.toLowerCase() === "active"
                    );

            }

            else if (value === "completed") {

                filteredPrescriptions =
                    prescriptions.filter(item =>
                        item.prescription_status
                        ?.toLowerCase() === "completed"
                    );

            }

            else if (value === "today's prescriptions") {

                const today =
                    new Date()
                        .toISOString()
                        .split("T")[0];

                filteredPrescriptions =
                    prescriptions.filter(item =>
                        item.date_prescribed === today
                    );

            }

            currentPage = 1;

            renderTable();

        });

    });

        // ===========================================
    // Row Action Events
    // ===========================================

    function attachRowEvents() {

        // View Button
        document
            .querySelectorAll(".view-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const prescriptionId =
                        button.dataset.id;

                    console.log(
                        "View Prescription:",
                        prescriptionId
                    );

                    // Future Route
                    // window.location.href =
                    // `/doctor-prescriptions/view/${prescriptionId}`;

                });

            });

        // Edit Button
        document
            .querySelectorAll(".edit-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const prescriptionId =
                        button.dataset.id;

                    console.log(
                        "Edit Prescription:",
                        prescriptionId
                    );

                    // Future Route
                    // window.location.href =
                    // `/doctor-prescriptions/edit/${prescriptionId}`;

                });

            });

    }

    // ===========================================
    // New Prescription Button
    // ===========================================

    const newPrescriptionBtn =
        document.getElementById(
            "newPrescriptionBtn"
        );

    if (newPrescriptionBtn) {

        newPrescriptionBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "/doctor-prescriptions/new";

            }
        );

    }

    // ===========================================
    // Emergency Button
    // ===========================================

    const emergencyBtn =
        document.querySelector(
            ".btn-emergency"
        );

    if (emergencyBtn) {

        emergencyBtn.addEventListener(
            "click",
            () => {

                alert(
                    "Emergency Response Activated!"
                );

            }
        );

    }

    // ===========================================
    // Initial Load
    // ===========================================

    loadStatistics();

    loadPrescriptions();

});
