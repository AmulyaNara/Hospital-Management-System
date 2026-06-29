document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       API ENDPOINTS
    ========================================================== */

    const API = {

        receptionists: "/api/admin-receptionists",

        stats: "/api/admin-receptionists/stats"

    };

    /* ==========================================================
       DOM ELEMENTS
    ========================================================== */

    const modal = document.getElementById("receptionistModal");

    const receptionistForm = document.getElementById("receptionistForm");

    const openBtn = document.getElementById("addReceptionistBtn");

    const closeBtn = document.getElementById("closeModal");

    const cancelBtn = document.getElementById("cancelBtn");

    const searchInput = document.getElementById("searchReceptionist");

    const tbody = document.getElementById("receptionistTableBody");

    const pagination = document.querySelector(".pagination");

    const paginationInfo = document.getElementById("paginationInfo");

    const totalStaff = document.getElementById("totalStaff");

    const activeNow = document.getElementById("activeNow");

    const vacantDesks = document.getElementById("vacantDesks");

    const filterBtn = document.querySelectorAll(".outline-btn")[0];

    const exportBtn = document.querySelectorAll(".outline-btn")[1];

    /* ==========================================================
       GLOBAL VARIABLES
    ========================================================== */

    let receptionistData = [];

    let filteredData = [];

    let currentPage = 1;

    const rowsPerPage = 8;

    /* ==========================================================
       INITIALIZE
    ========================================================== */

    initialize();

    async function initialize() {

        initializeModal();

        initializeButtons();

        initializeSearch();

        initializeAnimations();

        await refreshDashboard();

    }

    /* ==========================================================
       MODAL
    ========================================================== */

    function initializeModal() {

        if (openBtn) {

            openBtn.addEventListener("click", () => {

                receptionistForm.reset();

                delete receptionistForm.dataset.editId;

                openModal();

            });

        }

        if (closeBtn) {

            closeBtn.addEventListener("click", closeModal);

        }

        if (cancelBtn) {

            cancelBtn.addEventListener("click", closeModal);

        }

        window.addEventListener("click", (event) => {

            if (event.target === modal) {

                closeModal();

            }

        });

    }

    function openModal() {

        if (!modal) return;

        modal.classList.add("active");

    }

    function closeModal() {

        if (!modal) return;

        modal.classList.remove("active");

        receptionistForm.reset();

        delete receptionistForm.dataset.editId;

    }
        /* ==========================================================
       DASHBOARD STATISTICS
    ========================================================== */

    async function loadDashboardStats() {

        try {

            const response = await fetch(API.stats);

            if (!response.ok) {

                throw new Error("Unable to load statistics.");

            }

            const stats = await response.json();

            if (totalStaff) {

                totalStaff.textContent = stats.total_staff ?? 0;

            }

            if (activeNow) {

                activeNow.textContent = stats.active_now ?? 0;

            }

            if (vacantDesks) {

                vacantDesks.textContent = stats.vacant_desks ?? 0;

            }

        }

        catch (error) {

            console.error(error);

            showToast(

                "Unable to load dashboard statistics.",

                "error"

            );

        }

    }

    /* ==========================================================
       LOAD RECEPTIONISTS
    ========================================================== */

    async function loadReceptionists() {

        try {

            const response = await fetch(

                API.receptionists

            );

            if (!response.ok) {

                throw new Error(

                    "Unable to load receptionists."

                );

            }

            receptionistData = await response.json();

            filteredData = [...receptionistData];

            currentPage = 1;

            renderTable();

        }

        catch (error) {

            console.error(error);

            receptionistData = [];

            filteredData = [];

            renderTable();

            showToast(

                "Unable to load receptionist list.",

                "error"

            );

        }

    }

    /* ==========================================================
       REFRESH DASHBOARD
    ========================================================== */

    async function refreshDashboard() {

        await Promise.all([

            loadDashboardStats(),

            loadReceptionists()

        ]);

    }

    /* ==========================================================
       EMPTY STATE
    ========================================================== */

    function toggleEmptyState() {

        const emptyState =

            document.getElementById(

                "emptyState"

            );

        if (!emptyState || !tbody) return;

        if (filteredData.length === 0) {

            emptyState.style.display = "flex";

            tbody.innerHTML = "";

        }

        else {

            emptyState.style.display = "none";

        }

    }

    /* ==========================================================
       STATUS BADGE
    ========================================================== */

    function getStatusClass(status) {

        if (!status) {

            return "";

        }

        switch (status.toLowerCase()) {

            case "active":

                return "active";

            case "off duty":

                return "off-duty";

            case "on break":

                return "break";

            default:

                return "";

        }

    }
        /* ==========================================================
       RENDER TABLE
    ========================================================== */

    function renderTable() {

        if (!tbody) return;

        toggleEmptyState();

        tbody.innerHTML = "";

        if (filteredData.length === 0) {

            updatePagination();

            return;

        }

        const start = (currentPage - 1) * rowsPerPage;

        const end = start + rowsPerPage;

        const pageData = filteredData.slice(start, end);

        pageData.forEach(user => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${user.employee_id ?? "-"}</td>

                <td>

                    <div class="user-info">

                        <div class="avatar">

                            ${(user.name || "?").charAt(0).toUpperCase()}

                        </div>

                        <div>

                            <strong>${user.name}</strong>

                            <small>${user.email}</small>

                        </div>

                    </div>

                </td>

                <td>${user.department ?? "-"}</td>

                <td>${user.shift ?? "-"}</td>

                <td>${user.phone ?? "-"}</td>

                <td>

                    <span class="status ${getStatusClass(user.status)}">

                        ${user.status ?? "-"}

                    </span>

                </td>

                <td>

                    <button

                        class="icon-btn view-btn"

                        data-id="${user.user_id}">

                        <span class="material-symbols-outlined">

                            visibility

                        </span>

                    </button>

                    <button

                        class="icon-btn edit-btn"

                        data-id="${user.user_id}">

                        <span class="material-symbols-outlined">

                            edit

                        </span>

                    </button>

                    <button

                        class="icon-btn delete"

                        data-id="${user.user_id}">

                        <span class="material-symbols-outlined">

                            delete

                        </span>

                    </button>

                </td>

            `;

            tbody.appendChild(row);

        });

        initializeRowButtons();

        updatePagination();

    }

    /* ==========================================================
       SEARCH
    ========================================================== */

    function initializeSearch() {

        if (!searchInput) return;

        searchInput.addEventListener("input", () => {

            performSearch(

                searchInput.value

            );

        });

    }

    function performSearch(keyword) {

        keyword = keyword

            .toLowerCase()

            .trim();

        filteredData = receptionistData.filter(user =>

            (user.employee_id || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (user.name || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (user.email || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (user.phone || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (user.department || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (user.shift || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (user.status || "")

                .toLowerCase()

                .includes(keyword)

        );

        currentPage = 1;

        renderTable();

    }

    /* ==========================================================
       PAGINATION
    ========================================================== */

    function updatePagination() {

        if (!pagination) return;

        pagination.innerHTML = "";

        const totalPages =

            Math.ceil(

                filteredData.length /

                rowsPerPage

            ) || 1;

        for (

            let page = 1;

            page <= totalPages;

            page++

        ) {

            const button =

                document.createElement("button");

            button.textContent = page;

            if (

                page === currentPage

            ) {

                button.classList.add("active");

            }

            button.addEventListener("click", () => {

                currentPage = page;

                renderTable();

            });

            pagination.appendChild(button);

        }

        updatePaginationInfo();

    }

    function updatePaginationInfo() {

        if (!paginationInfo) return;

        const start =

            filteredData.length === 0

            ? 0

            : ((currentPage - 1)

            * rowsPerPage) + 1;

        const end = Math.min(

            currentPage * rowsPerPage,

            filteredData.length

        );

        paginationInfo.textContent =

            `Showing ${start} - ${end} of ${filteredData.length} Receptionists`;

    }
        /* ==========================================================
       FORM SUBMIT
    ========================================================== */

    receptionistForm?.addEventListener("submit", submitReceptionist);

    async function submitReceptionist(event) {

        event.preventDefault();

        const formData = new FormData(receptionistForm);

        const receptionist = Object.fromEntries(formData.entries());

        /* ---------- Basic Validation ---------- */

        if (!receptionist.name.trim()) {

            showToast("Name is required.", "error");

            return;

        }

        if (!receptionist.email.trim()) {

            showToast("Email is required.", "error");

            return;

        }

        if (!receptionist.phone.trim()) {

            showToast("Phone number is required.", "error");

            return;

        }

        try {

            /* ---------- EDIT ---------- */

            if (receptionistForm.dataset.editId) {

                const response = await fetch(

                    `${API.receptionists}/${receptionistForm.dataset.editId}`,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify(receptionist)

                    }

                );

                if (!response.ok) {

                    throw new Error("Unable to update receptionist.");

                }

                showToast("Receptionist updated successfully.");

            }

            /* ---------- ADD ---------- */

            else {

                const response = await fetch(

                    API.receptionists,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify(receptionist)

                    }

                );

                if (!response.ok) {

                    throw new Error("Unable to add receptionist.");

                }

                showToast("Receptionist added successfully.");

            }

            receptionistForm.reset();

            delete receptionistForm.dataset.editId;

            closeModal();

            await refreshDashboard();

        }

        catch (error) {

            console.error(error);

            showToast(error.message, "error");

        }

    }

    /* ==========================================================
       EDIT BUTTON
    ========================================================== */

    async function editReceptionist(id) {

        const receptionist = receptionistData.find(

            user => user.user_id == id

        );

        if (!receptionist) {

            return;

        }

        receptionistForm.dataset.editId = id;

        receptionistForm.employee_id.value = receptionist.employee_id ?? "";

        receptionistForm.name.value = receptionist.name ?? "";

        receptionistForm.email.value = receptionist.email ?? "";

        receptionistForm.phone.value = receptionist.phone ?? "";

        receptionistForm.gender.value = receptionist.gender ?? "";

        receptionistForm.date_of_birth.value =

            receptionist.date_of_birth ?? "";

        receptionistForm.address.value = receptionist.address ?? "";

        receptionistForm.department.value = receptionist.department ?? "";

        receptionistForm.shift.value = receptionist.shift ?? "";

        receptionistForm.status.value = receptionist.status ?? "";

        receptionistForm.emergency_contact_name.value =

            receptionist.emergency_contact_name ?? "";

        receptionistForm.emergency_contact_phone.value =

            receptionist.emergency_contact_phone ?? "";

        receptionistForm.password.value = "";

        openModal();

    }

    /* ==========================================================
       ROW BUTTONS
    ========================================================== */

    function initializeRowButtons() {

        document

            .querySelectorAll(".edit-btn")

            .forEach(button => {

                button.onclick = () =>

                    editReceptionist(

                        button.dataset.id

                    );

            });

        document

            .querySelectorAll(".view-btn")

            .forEach(button => {

                button.onclick = () =>

                    viewReceptionist(

                        button.dataset.id

                    );

            });

        document

            .querySelectorAll(".delete")

            .forEach(button => {

                button.onclick = () =>

                    deleteReceptionist(

                        button.dataset.id

                    );

            });

    }
        /* ==========================================================
       VIEW RECEPTIONIST
    ========================================================== */

    function viewReceptionist(id) {

        const receptionist = receptionistData.find(

            user => user.user_id == id

        );

        if (!receptionist) {

            showToast(

                "Receptionist not found.",

                "error"

            );

            return;

        }

        alert(

`Employee ID : ${receptionist.employee_id}

Name : ${receptionist.name}

Email : ${receptionist.email}

Phone : ${receptionist.phone}

Department : ${receptionist.department}

Shift : ${receptionist.shift}

Status : ${receptionist.status}

Gender : ${receptionist.gender}

DOB : ${receptionist.date_of_birth}

Emergency Contact :

${receptionist.emergency_contact_name}

${receptionist.emergency_contact_phone}

Address :

${receptionist.address}`

        );

    }

    /* ==========================================================
       DELETE RECEPTIONIST
    ========================================================== */

    async function deleteReceptionist(id) {

        const confirmDelete = confirm(

            "Are you sure you want to delete this receptionist?"

        );

        if (!confirmDelete) {

            return;

        }

        try {

            const response = await fetch(

                `${API.receptionists}/${id}`,

                {

                    method: "DELETE"

                }

            );

            if (!response.ok) {

                throw new Error(

                    "Unable to delete receptionist."

                );

            }

            showToast(

                "Receptionist deleted successfully."

            );

            await refreshDashboard();

        }

        catch (error) {

            console.error(error);

            showToast(

                error.message,

                "error"

            );

        }

    }

    /* ==========================================================
       FILTER
    ========================================================== */

    function initializeButtons() {

        if (filterBtn) {

            filterBtn.addEventListener(

                "click",

                () => {

                    showToast(

                        "Advanced filters will be available soon."

                    );

                }

            );

        }

        if (exportBtn) {

            exportBtn.addEventListener(

                "click",

                exportReceptionists

            );

        }

    }

    /* ==========================================================
       EXPORT CSV
    ========================================================== */

    function exportReceptionists() {

        if (receptionistData.length === 0) {

            showToast(

                "No receptionist data to export.",

                "error"

            );

            return;

        }

        const headers = [

            "Employee ID",

            "Name",

            "Email",

            "Phone",

            "Department",

            "Shift",

            "Status"

        ];

        const rows = receptionistData.map(user => [

            user.employee_id,

            user.name,

            user.email,

            user.phone,

            user.department,

            user.shift,

            user.status

        ]);

        const csv = [

            headers.join(","),

            ...rows.map(

                row => row.join(",")

            )

        ].join("\n");

        const blob = new Blob(

            [csv],

            {

                type: "text/csv"

            }

        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download =

            "Receptionists.csv";

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

        showToast(

            "Receptionist list exported."

        );

    }
        /* ==========================================================
       CARD ANIMATIONS
    ========================================================== */

    function initializeAnimations() {

        const cards = document.querySelectorAll(

            ".stat-card, .table-card, .info-card"

        );

        cards.forEach((card, index) => {

            card.style.opacity = "0";

            card.style.transform = "translateY(20px)";

            setTimeout(() => {

                card.style.transition =

                    "all 0.45s ease";

                card.style.opacity = "1";

                card.style.transform =

                    "translateY(0)";

            }, index * 120);

        });

    }

    /* ==========================================================
       RIPPLE EFFECT
    ========================================================== */

    document.addEventListener("click", (event) => {

        const button = event.target.closest("button");

        if (!button) return;

        const ripple = document.createElement("span");

        ripple.className = "ripple";

        const rect = button.getBoundingClientRect();

        ripple.style.left =

            `${event.clientX - rect.left}px`;

        ripple.style.top =

            `${event.clientY - rect.top}px`;

        button.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

    /* ==========================================================
       TOAST
    ========================================================== */

    function showToast(

        message,

        type = "success"

    ) {

        const oldToast =

            document.querySelector(".toast");

        if (oldToast) {

            oldToast.remove();

        }

        const toast =

            document.createElement("div");

        toast.className =

            `toast ${type}`;

        toast.textContent = message;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3000);

    }

    /* ==========================================================
       GLOBAL ERROR HANDLER
    ========================================================== */

    window.addEventListener(

        "unhandledrejection",

        (event) => {

            console.error(event.reason);

            showToast(

                "Something went wrong.",

                "error"

            );

        }

    );

    /* ==========================================================
       ESC CLOSES MODAL
    ========================================================== */

    document.addEventListener(

        "keydown",

        (event) => {

            if (

                event.key === "Escape" &&

                modal.classList.contains("active")

            ) {

                closeModal();

            }

        }

    );

    /* ==========================================================
       WINDOW RESIZE
    ========================================================== */

    window.addEventListener(

        "resize",

        () => {

            renderTable();

        }

    );

    /* ==========================================================
       END
    ========================================================== */

});