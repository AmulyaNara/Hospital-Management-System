document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================
    // AUTHENTICATION
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
    // API ROUTES
    // ==========================================================

    const API = {

        dashboard: "/api/patient-dashboard",

        appointments: "/api/patient-appointments",

        records: "/api/patient-records",

        reminders: "/api/patient-reminders"

    };

    // ==========================================================
    // UI ANIMATIONS
    // ==========================================================

    function initializeAnimations() {

        document.querySelectorAll(
            ".transition-card,.transition-row"
        ).forEach(card => {

            card.style.transition =
                "all .25s cubic-bezier(.2,.8,.2,1)";

            card.addEventListener("mouseenter", () => {

                if (
                    card.classList.contains(
                        "record-item-card"
                    )
                ) {

                    card.style.transform =
                        "translateY(-2px)";

                    card.style.borderColor =
                        "var(--teal-main)";

                }

            });

            card.addEventListener("mouseleave", () => {

                if (
                    card.classList.contains(
                        "record-item-card"
                    )
                ) {

                    card.style.transform =
                        "translateY(0)";

                    card.style.borderColor =
                        "var(--border-faint-line)";

                }

            });

        });

    }

    // ==========================================================
    // SEARCH BOX EFFECT
    // ==========================================================

    function initializeSearch() {

        const searchInput =
            document.querySelector(".search-input");

        const searchContainer =
            document.querySelector(".search-container");

        if (!searchInput || !searchContainer) return;

        searchInput.addEventListener("focus", () => {

            searchContainer.style.boxShadow =
                "0 0 0 2px rgba(0,106,97,.2)";

            searchContainer.style.borderColor =
                "var(--teal-main)";

        });

        searchInput.addEventListener("blur", () => {

            searchContainer.style.boxShadow = "none";

            searchContainer.style.borderColor =
                "var(--border-faint-line)";

        });

    }

    // ==========================================================
    // DASHBOARD
    // ==========================================================

    async function loadPatientDashboard() {

        try {

            const response = await fetch(
                API.dashboard,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok)
                throw new Error("Dashboard failed");

            const data = await response.json();

            const set = (id, value) => {

                const element =
                    document.getElementById(id);

                if (element)
                    element.textContent = value;

            };

            set(
                "welcomeMessage",
                `${data.greeting}, ${data.patient_name}.`
            );

            set(
                "patientName",
                data.patient_name
            );

            set(
                "patientId",
                data.patient_id
            );

            set(
                "nextAppointment",
                data.next_visit_date ||
                "No Appointment"
            );

            set(
                "nextAppointmentInfo",
                `${data.next_visit_time || "Time Not Available"} • ${data.doctor_name || "Doctor Not Assigned"}`
            );

            set(
                "activePrescriptions",
                `${data.active_prescriptions} Orders`
            );

            set(
                "recentLabResult",
                data.recent_lab_result ||
                "No Results"
            );

            set(
                "outstandingBalance",
                `₹${data.outstanding_balance || 0}`
            );

        }

        catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

        }

    }
    // ==========================================================
    // APPOINTMENTS
    // ==========================================================

    async function loadAppointments() {

        try {

            const response = await fetch(
                API.appointments,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {

                throw new Error("Unable to load appointments");

            }

            const appointments = await response.json();

            const tbody =
                document.getElementById("appointmentsTable");

            if (!tbody) return;

            tbody.innerHTML = "";

            if (appointments.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align:center;padding:25px;">
                            No appointments found.
                        </td>
                    </tr>
                `;

                return;

            }

            appointments.forEach(app => {

                const row = document.createElement("tr");

                row.innerHTML = `

                    <td>${app.doctor_name}</td>

                    <td>${app.specialization || "General"}</td>

                    <td>

                        ${app.visit_date}<br>

                        ${app.visit_time}

                    </td>

                    <td>

                        <span class="status">

                            ${app.status}

                        </span>

                    </td>

                    <td>

                        <button
                            class="view-btn"
                            data-id="${app.visit_id}">

                            View

                        </button>

                    </td>

                `;

                tbody.appendChild(row);

            });

            initializeAppointmentButtons();

        }

        catch(error){

            console.error(error);

        }

    }

    // ==========================================================
    // VIEW APPOINTMENT
    // ==========================================================

    function initializeAppointmentButtons(){

        document
            .querySelectorAll(".view-btn")
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    async ()=>{

                        const visitId =
                            button.dataset.id;

                        await viewAppointment(
                            visitId
                        );

                    }
                );

            });

    }

    async function viewAppointment(visitId){

        try{

            const response =
                await fetch(
                    `/api/visit/${visitId}`,
                    {
                        headers: authHeaders
                    }
                );

            if(!response.ok){

                alert(
                    "Unable to load appointment."
                );

                return;

            }

            const visit =
                await response.json();

            alert(

`Appointment Details

Doctor : ${visit.doctor_name || visit.doctor_id}

Patient : ${visit.patient_name || "Current Patient"}

Specialization : ${visit.specialization || "General"}

Date : ${visit.visit_date}

Time : ${visit.visit_time || "Not Available"}

Complaint : ${visit.reason || visit.chief_complaint}

Status : ${visit.status || visit.visit_status}

Consultation Fee : ₹${visit.consultation_fee || "N/A"}`

            );

        }

        catch(error){

            console.error(error);

        }

    }
    // ==========================================================
    // MEDICAL RECORDS
    // ==========================================================

    async function loadRecords() {

        try {

            const response = await fetch(
                API.records,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to load medical records."
                );

            }

            const records =
                await response.json();

            const container =
                document.getElementById(
                    "recordsContainer"
                );

            if (!container) return;

            container.innerHTML = "";

            if(records.length===0){

                container.innerHTML=`

                <div class="empty-state">

                    <span class="material-symbols-outlined">

                        description

                    </span>

                    <p>

                        No Medical Records Available

                    </p>

                </div>

                `;

                return;

            }

            records.forEach(record=>{

                const card=
                    document.createElement("div");

                card.className=
                    "record-item-card transition-card";

                card.innerHTML=`

                    <div>

                        <h4>

                            ${record.document_name}

                        </h4>

                        <p>

                            Uploaded :
                            ${record.date}

                        </p>

                        <small>

                            ${record.doctor_name}

                        </small>

                    </div>

                    <button
                        class="icon-btn download-btn"
                        data-id="${record.record_id}"
                        title="Download Report">

                        <span class="material-symbols-outlined">

                            download

                        </span>

                    </button>

                `;

                container.appendChild(card);

            });

            initializeDownloadButtons();

        }

        catch(error){

            console.error(error);

        }

    }

    // ==========================================================
    // DOWNLOAD REPORT
    // ==========================================================

    function initializeDownloadButtons(){

        document
            .querySelectorAll(".download-btn")
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        const id=
                            button.dataset.id;

                        downloadRecord(id);

                    }
                );

            });

    }

    async function downloadRecord(recordId){

        try{

            if(!recordId){

                alert(
                    "Record ID not found."
                );

                return;

            }

            window.location.href=
                `/api/record/${recordId}/download`;

        }

        catch(error){

            console.error(error);

            alert(
                "Unable to download report."
            );

        }

    }
    // ==========================================================
    // REMINDERS
    // ==========================================================

    async function loadReminders() {

        try {

            const response = await fetch(
                API.reminders,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to load reminders."
                );

            }

            const reminders =
                await response.json();

            const container =
                document.getElementById(
                    "remindersContainer"
                );

            if (!container) return;

            container.innerHTML = "";

            if (reminders.length === 0) {

                container.innerHTML = `

                    <div class="empty-state">

                        <span class="material-symbols-outlined">

                            notifications_off

                        </span>

                        <p>

                            No Reminders Available

                        </p>

                    </div>

                `;

                return;

            }

            reminders.forEach(reminder => {

                const card =
                    document.createElement("div");

                card.className =
                    `card-box reminder-card ${reminder.type}`;

                card.innerHTML = `

                    <div class="reminder-header">

                        <span class="material-symbols-outlined reminder-icon">

                            notifications

                        </span>

                        <h4>

                            ${reminder.title}

                        </h4>

                    </div>

                    <p class="reminder-text">

                        ${reminder.message}

                    </p>

                    <button
                        class="inline-link reminder-action"
                        data-action="${reminder.action}">

                        ${reminder.action}

                    </button>

                `;

                container.appendChild(card);

            });

            initializeReminderButtons();

        }

        catch(error){

            console.error(error);

        }

    }

    // ==========================================================
    // REMINDER BUTTONS
    // ==========================================================

    function initializeReminderButtons(){

        document
            .querySelectorAll(".reminder-action")
            .forEach(button=>{

                button.addEventListener(
                    "click",
                    ()=>{

                        const action =
                            button.dataset.action;

                        switch(action){

                            case "Schedule Now":

                                window.location.href =
                                    "/book-appointment";

                                break;

                            case "View Locations":

                                window.location.href =
                                    "/hospital-locations";

                                break;

                            case "Order Medication":

                                window.location.href =
                                    "/patient-prescriptions";

                                break;

                            case "View Prescription":

                                window.location.href =
                                    "/patient-prescriptions";

                                break;

                            default:

                                alert(action);

                        }

                    }
                );

            });

    }
    // ==========================================================
    // BOOK APPOINTMENT
    // ==========================================================

    function initializeAppointmentButtonsUI() {

        const heroButton =
            document.getElementById(
                "bookAppointmentBtn"
            );

        const sidebarButton =
            document.getElementById(
                "sidebarBookAppointmentBtn"
            );

        function redirectToAppointment(){

            window.location.href =
                "/book-appointment";

        }

        if(heroButton){

            heroButton.addEventListener(
                "click",
                redirectToAppointment
            );

        }

        if(sidebarButton){

            sidebarButton.addEventListener(
                "click",
                redirectToAppointment
            );

        }

    }

    // ==========================================================
    // VIEW RECORDS
    // ==========================================================

    function initializeViewRecords(){

        const button =
            document.getElementById(
                "viewRecordsBtn"
            );

        if(!button) return;

        button.addEventListener(
            "click",
            ()=>{

                window.location.href =
                    "/patient-reports";

            }
        );

    }

    // ==========================================================
    // SUPPORT
    // ==========================================================

function initializeSupportButton() {

    // Sidebar Support
    const supportBtn = document.getElementById("supportBtn");

    if (supportBtn) {

        supportBtn.addEventListener("click", () => {

            window.location.href = "/patient-support";

        });

    }

    // Dashboard Start New Message
    const messageBtn = document.getElementById("startMessageBtn");

    if (messageBtn) {

        messageBtn.addEventListener("click", (e) => {

            e.preventDefault();

            window.location.href = "/patient-support";

        });

    }

}
    // ==========================================================
    // SETTINGS
    // ==========================================================

    function initializeSettingsButton(){

        const button =
            document.getElementById(
                "settingsBtn"
            );

        if(!button) return;

        button.addEventListener(
            "click",
            ()=>{

                window.location.href =
                    "/patient-settings";

            }
        );

    }

    // ==========================================================
    // LOGOUT
    // ==========================================================

    function initializeLogoutButton(){

        const logout =
            document.getElementById(
                "logoutBtn"
            );

        if(!logout) return;

        logout.addEventListener(
            "click",
            ()=>{

                localStorage.removeItem(
                    "access_token"
                );

                window.location.href =
                    "/login";

            }
        );

    }

    // ==========================================================
    // INITIALIZE APPLICATION
    // ==========================================================

    async function initializePatientDashboard(){

        initializeAnimations();

        initializeSearch();

        initializeAppointmentButtonsUI();

        initializeViewRecords();

        initializeSupportButton();

        initializeSettingsButton();

        initializeLogoutButton();

        await loadPatientDashboard();

        await loadAppointments();

        await loadRecords();

        await loadReminders();

    }
    setTimeout(() => {

    initializeSearch();

}, 500);

    initializePatientDashboard();

});

function initializeSearch() {

    const searchBox = document.querySelector(".search-input");

    if (!searchBox) return;

    searchBox.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        // Search Appointment Table
        document.querySelectorAll("#appointmentsTable tr").forEach(row => {

            const text = row.innerText.toLowerCase();

            row.style.display =
                text.includes(value)
                    ? ""
                    : "none";

        });

        // Search Medical Records
        document.querySelectorAll(".record-item-card").forEach(card => {

            const text = card.innerText.toLowerCase();

            card.style.display =
                text.includes(value)
                    ? ""
                    : "none";

        });

    });

}// ===============================
// Dashboard Search
// ===============================

const dashboardSearch = document.getElementById("dashboardSearch");

if (dashboardSearch) {

    dashboardSearch.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        // Search Appointment Table
        document.querySelectorAll("#appointmentsTable tr").forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(value)
                    ? ""
                    : "none";

        });

        // Search Medical Records
        document.querySelectorAll("#recordsContainer .record-item-card").forEach(card => {

            card.style.display =
                card.innerText.toLowerCase().includes(value)
                    ? ""
                    : "none";

        });

    });

}