document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // Authentication
    // ============================================================

    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    // ============================================================
    // API Endpoints
    // ============================================================

    const API = {
        patient: "/api/patient-dashboard",
        billings: "/api/patient-billings",
        downloadInvoice: "/api/download-invoice"
    };

    // ============================================================
    // Global Variables
    // ============================================================

    let allBills = [];
    let filteredBills = [];

    let selectedInvoice = null;

    let currentPage = 1;
    const rowsPerPage = 5;

    let currentTab = "invoice";

    // ============================================================
    // Initialize Application
    // ============================================================

    async function initialize() {

        await loadPatientHeader();

        await loadBillings();

        initializeTabs();

        initializeModal();

        initializeDownloadButton();
    }
    // ============================================================
    // Load Patient Header
    // ============================================================

    async function loadPatientHeader() {

        try {

            const response = await fetch(API.patient, {
                headers: authHeaders
            });

            if (!response.ok) {
                throw new Error("Unable to load patient information.");
            }

            const patient = await response.json();

            console.log("Patient Information");
            console.table(patient);

            // ----------------------------------------
            // Patient Name
            // ----------------------------------------

            const patientName =
                document.getElementById("patientName");

            if (patientName) {

                patientName.textContent =
                    patient.patient_name || "Patient";

            }

            // ----------------------------------------
            // Patient ID
            // ----------------------------------------

            const patientId =
                document.getElementById("patientId");

            if (patientId) {

                patientId.textContent =
                    patient.patient_id || "--";

            }

        }

        catch (error) {

            console.error(
                "Patient Header Error:",
                error
            );

        }

    }
        // ============================================================
    // Load Billing Records
    // ============================================================

    async function loadBillings() {

        try {

            const response = await fetch(API.billings, {
                headers: authHeaders
            });

            if (!response.ok) {
                throw new Error("Unable to load billing records.");
            }

            const bills = await response.json();

            console.log("Billing Records");
            console.table(bills);

            // ----------------------------------------
            // Store Data
            // ----------------------------------------

            allBills = bills || [];

            filteredBills = [...allBills];

            currentPage = 1;

            // ----------------------------------------
            // Update Entire UI
            // ----------------------------------------

            updateSummaryCards();

            renderBillingTable();

            renderPagination();

            updateResultsCounter();

            updateLastUpdated();

        }

        catch (error) {

            console.error(
                "Billing Loading Error:",
                error
            );

            const table =
                document.getElementById("billingTable");

            if (table) {

                table.innerHTML = `
                    <tr>

                        <td colspan="5"
                            style="
                                text-align:center;
                                padding:40px;
                                color:#888;
                            ">

                            Unable to load billing records.

                        </td>

                    </tr>
                `;

            }

        }

    }
        // ============================================================
    // Update Summary Cards
    // ============================================================

    function updateSummaryCards() {

        let outstandingBalance = 0;
        let totalPaid = 0;
        let recentCredits = 0;

        let pendingInvoices = 0;
        let paidInvoices = 0;

        filteredBills.forEach(bill => {

            const amount = Number(bill.amount) || 0;

            const status =
                (bill.payment_status || "")
                .trim()
                .toLowerCase();

            switch (status) {

                case "pending":

                    outstandingBalance += amount;
                    pendingInvoices++;

                    break;

                case "paid":

                    totalPaid += amount;
                    paidInvoices++;

                    break;

                case "credited":
                case "credit":
                case "refund":
                case "refunded":

                    recentCredits += amount;

                    break;

            }

        });

        // ==========================================
        // Outstanding Balance
        // ==========================================

        document.getElementById("outstandingBalance").textContent =

            formatCurrency(outstandingBalance);

        document.getElementById("outstandingFooter").innerHTML = `

            <span class="material-symbols-outlined">

                account_balance_wallet

            </span>

            ${
                pendingInvoices > 0

                ? `${pendingInvoices} Pending Invoice${pendingInvoices > 1 ? "s" : ""}`

                : "No Outstanding Balance"
            }

        `;

        // ==========================================
        // Total Paid
        // ==========================================

        document.getElementById("totalPaid").textContent =

            formatCurrency(totalPaid);

        document.getElementById("totalPaidFooter").innerHTML = `

            <span class="material-symbols-outlined">

                check_circle

            </span>

            ${paidInvoices} Payment${paidInvoices !== 1 ? "s" : ""} Completed

        `;

        // ==========================================
        // Recent Credits
        // ==========================================

        document.getElementById("recentCredits").textContent =

            formatCurrency(recentCredits);

        document.getElementById("recentCreditsFooter").innerHTML = `

            <span class="material-symbols-outlined">

                history

            </span>

            Insurance Credits / Refunds

        `;

    }
        // ============================================================
    // Render Billing Table
    // ============================================================

    function renderBillingTable() {

        const table =
            document.getElementById("billingTable");

        const emptyState =
            document.getElementById("emptyState");

        const tableContainer =
            document.getElementById("billingTableContainer");

        table.innerHTML = "";

        // ==========================================
        // Empty State
        // ==========================================

        if (filteredBills.length === 0) {

            tableContainer.style.display = "none";

            emptyState.style.display = "block";

            updateResultsCounter();

            return;

        }

        tableContainer.style.display = "table";

        emptyState.style.display = "none";

        // ==========================================
        // Current Page Records
        // ==========================================

        const startIndex =
            (currentPage - 1) * rowsPerPage;

        const endIndex =
            startIndex + rowsPerPage;

        const currentBills =
            filteredBills.slice(startIndex, endIndex);

        // ==========================================
        // Render Rows
        // ==========================================

        currentBills.forEach(bill => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>

                    BILL-${String(bill.billing_id).padStart(4, "0")}

                </td>

                <td>

                    <div class="service">

                        <strong>

                            ${bill.description}

                        </strong>

                        <small>

                            ${formatDate(bill.bill_date)}

                        </small>

                    </div>

                </td>

                <td>

                    ${formatCurrency(bill.amount)}

                </td>

                <td>

                    <span class="status ${bill.payment_status.toLowerCase()}">

                        ${bill.payment_status}

                    </span>

                </td>

                <td>

                    <button
                        class="view-btn"
                        data-id="${bill.billing_id}">

                        <span class="material-symbols-outlined">

                            visibility

                        </span>

                    </button>

                </td>

            `;

            // =====================================
            // View Button
            // =====================================

            row.querySelector(".view-btn")
                .addEventListener("click", () => {

                    selectedInvoice = bill;

                    openInvoiceModal(bill);

                });

            table.appendChild(row);
            const viewBtn = row.querySelector(".view-btn");

viewBtn.addEventListener("click", () => {
    console.log("Clicked", bill);
    alert("Reached");
    openInvoiceModal(bill);
});

        });

    }
        // ============================================================
    // Render Pagination
    // ============================================================

    function renderPagination() {

        const container =
            document.getElementById("paginationContainer");

        container.innerHTML = "";

        const totalPages =
            Math.ceil(filteredBills.length / rowsPerPage);

        if (totalPages <= 1) {

            return;

        }

        // ==========================================
        // Previous Button
        // ==========================================

        const previousButton =
            document.createElement("button");

        previousButton.className = "page-btn";

        previousButton.textContent = "Previous";

        previousButton.disabled =
            currentPage === 1;

        previousButton.addEventListener("click", () => {

            currentPage--;

            renderBillingTable();

            renderPagination();

            updateResultsCounter();

        });

        container.appendChild(previousButton);

        // ==========================================
        // Page Numbers
        // ==========================================

        for (let page = 1; page <= totalPages; page++) {

            const pageButton =
                document.createElement("button");

            pageButton.className = "page-btn";

            pageButton.textContent = page;

            if (page === currentPage) {

                pageButton.classList.add("active");

            }

            pageButton.addEventListener("click", () => {

                currentPage = page;

                renderBillingTable();

                renderPagination();

                updateResultsCounter();

            });

            container.appendChild(pageButton);

        }

        // ==========================================
        // Next Button
        // ==========================================

        const nextButton =
            document.createElement("button");

        nextButton.className = "page-btn";

        nextButton.textContent = "Next";

        nextButton.disabled =
            currentPage === totalPages;

        nextButton.addEventListener("click", () => {

            currentPage++;

            renderBillingTable();

            renderPagination();

            updateResultsCounter();

        });

        container.appendChild(nextButton);

    }

    // ============================================================
    // Update Results Counter
    // ============================================================

    function updateResultsCounter() {

        const totalRecords =
            filteredBills.length;

        const startRecord =

            totalRecords === 0

                ? 0

                : ((currentPage - 1) * rowsPerPage) + 1;

        const endRecord =

            Math.min(

                currentPage * rowsPerPage,

                totalRecords

            );

        document.getElementById("billingResults").textContent =

            `Showing ${startRecord}-${endRecord} of ${totalRecords} Results`;

    }
        // ============================================================
    // Initialize Search
    // ============================================================

    function initializeSearch() {

        const searchBox =
            document.getElementById("billingSearch");

        if (!searchBox) {

            return;

        }

        searchBox.addEventListener("input", () => {

            applyFilters();

        });

    }

    // ============================================================
    // Initialize Tabs
    // ============================================================

    function initializeTabs() {

        const invoiceTab =
            document.getElementById("invoiceTab");

        const paymentHistoryTab =
            document.getElementById("paymentHistoryTab");

        invoiceTab.addEventListener("click", () => {

            currentTab = "invoice";

            invoiceTab.classList.add("active");

            paymentHistoryTab.classList.remove("active");

            applyFilters();

        });

        paymentHistoryTab.addEventListener("click", () => {

            currentTab = "payment";

            paymentHistoryTab.classList.add("active");

            invoiceTab.classList.remove("active");

            applyFilters();

        });

    }

    // ============================================================
    // Apply Filters
    // ============================================================

    function applyFilters() {

        const searchBox =
            document.getElementById("billingSearch");

        const keyword =

            searchBox

            ? searchBox.value.trim().toLowerCase()

            : "";

        filteredBills = allBills.filter(bill => {

            const invoiceNumber =

                `bill-${String(bill.billing_id).padStart(4, "0")}`
                .toLowerCase();

            const description =

                (bill.description || "")
                .toLowerCase();

            const status =

                (bill.payment_status || "")
                .toLowerCase();

            const matchesSearch =

                invoiceNumber.includes(keyword)

                ||

                description.includes(keyword)

                ||

                status.includes(keyword);

            // ----------------------------------------
            // Invoice Tab
            // ----------------------------------------

            if (currentTab === "invoice") {

                return matchesSearch;

            }

            // ----------------------------------------
            // Payment History Tab
            // ----------------------------------------

            return (

                matchesSearch &&

                status === "paid"

            );

        });

        currentPage = 1;

        updateSummaryCards();

        renderBillingTable();

        renderPagination();

        updateResultsCounter();

    }
        // ============================================================
    // Initialize Invoice Modal
    // ============================================================

    function initializeModal() {

        const modal =
            document.getElementById("invoiceModal");

        const closeButton =
            document.getElementById("closeModal");

        if (!modal || !closeButton) {

            return;

        }

        closeButton.addEventListener("click", () => {

            modal.classList.add("hidden");

        });

        window.addEventListener("click", (event) => {

            if (event.target === modal) {

                modal.classList.add("hidden");

            }

        });

    }

    // ============================================================
    // Open Invoice Modal
    // ============================================================

    function openInvoiceModal(bill) {
        console.log("Modal Function Running");
        selectedInvoice = bill;

        const modal =
            document.getElementById("invoiceModal");

        const modalBody =
            document.getElementById("modalBody");

        if (!modal || !modalBody) {

            return;

        }

        modalBody.innerHTML = `

            <div class="invoice-details">

                <div class="invoice-row">

                    <strong>Invoice Number</strong>

                    <span>

                        BILL-${String(bill.billing_id).padStart(4, "0")}

                    </span>

                </div>

                <div class="invoice-row">

                    <strong>Patient Name</strong>

                    <span>

                        ${document.getElementById("patientName").textContent}

                    </span>

                </div>

                <div class="invoice-row">

                    <strong>Patient ID</strong>

                    <span>

                        ${document.getElementById("patientId").textContent}

                    </span>

                </div>

                <div class="invoice-row">

                    <strong>Service</strong>

                    <span>

                        ${bill.description}

                    </span>

                </div>

                <div class="invoice-row">

                    <strong>Bill Date</strong>

                    <span>

                        ${formatDate(bill.bill_date)}

                    </span>

                </div>

                <div class="invoice-row">

                    <strong>Amount</strong>

                    <span>

                        ${formatCurrency(bill.amount)}

                    </span>

                </div>

                <div class="invoice-row">

                    <strong>Status</strong>

                    <span class="status ${bill.payment_status.toLowerCase()}">

                        ${bill.payment_status}

                    </span>

                </div>

            </div>

        `;

        // Store invoice id for download

        document
            .getElementById("downloadInvoiceBtn")
            .dataset.id = bill.billing_id;

        modal.classList.remove("hidden");

    }
        // ============================================================
    // Download Invoice
    // ============================================================

    function initializeDownloadButton() {

        const downloadButton =
            document.getElementById("downloadInvoiceBtn");

        if (!downloadButton) {

            return;

        }

        downloadButton.addEventListener("click", async () => {

            const billingId =
                downloadButton.dataset.id;

            if (!billingId) {

                alert("Invoice not selected.");

                return;

            }

            try {

                const response = await fetch(

                    `/api/download-invoice/${billingId}`,

                    {
                        headers: authHeaders
                    }

                );

                if (!response.ok) {

                    throw new Error("Unable to download invoice.");

                }

                const blob =
                    await response.blob();

                const url =
                    window.URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    `Invoice-${billingId}.pdf`;

                document.body.appendChild(link);

                link.click();

                link.remove();

                window.URL.revokeObjectURL(url);

            }

            catch (error) {

                console.error(error);

                alert("Unable to download invoice.");

            }

        });

    }
        // ============================================================
    // Format Currency
    // ============================================================

    function formatCurrency(amount) {

        return `₹${Number(amount || 0).toLocaleString("en-IN", {

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

        })}`;

    }

    // ============================================================
    // Format Date
    // ============================================================

    function formatDate(dateString) {

        if (!dateString) {

            return "--";

        }

        const date = new Date(dateString);

        return date.toLocaleDateString("en-IN", {

            day: "2-digit",

            month: "short",

            year: "numeric"

        });

    }

    // ============================================================
    // Update Last Updated
    // ============================================================

    function updateLastUpdated() {

        const element =
            document.getElementById("lastUpdated");

        if (!element) {

            return;

        }

        const now = new Date();

        element.textContent = now.toLocaleString("en-IN", {

            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        });

    }

    // ============================================================
    // Show Empty State
    // ============================================================

    function toggleEmptyState() {

        const emptyState =
            document.getElementById("emptyState");

        const table =
            document.getElementById("billingTableContainer");

        if (filteredBills.length === 0) {

            emptyState.style.display = "block";

            table.style.display = "none";

        }

        else {

            emptyState.style.display = "none";

            table.style.display = "table";

        }

    }

    // ============================================================
    // Reset to First Page
    // ============================================================

    function resetPagination() {

        currentPage = 1;

    }

    // ============================================================
    // Initialize Page
    // ============================================================

    async function initialize() {

        await loadPatientHeader();

        await loadBillings();

        initializeSearch();

        initializeTabs();

        initializeModal();

        initializeDownloadButton();

        updateLastUpdated();

    }

    // ============================================================
    // Start Application
    // ============================================================

    initialize();

});