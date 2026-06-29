document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       AUTHORIZATION
    ========================================================== */

    const token = localStorage.getItem("access_token");

    const headers = {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`

    };

    /* ==========================================================
       API ENDPOINTS
    ========================================================== */

    const API = {

        doctors: "/doctors",

        dashboard: "/doctor-stats",

        visits: "/doctor-upcoming-visits"

    };

    /* ==========================================================
       DOM ELEMENTS
    ========================================================== */

    const doctorTable = document.getElementById("doctorsTable");

    const searchInput = document.getElementById("searchDoctor");

    const specializationFilter =
        document.getElementById("specializationFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const previousBtn =
        document.getElementById("previousPage");

    const nextBtn =
        document.getElementById("nextPage");

    const paginationInfo =
        document.getElementById("paginationInfo");

    const addDoctorBtn =
        document.getElementById("addDoctorBtn");

    const doctorModal =
        document.getElementById("doctorModal");

    const closeDoctorModal =
        document.getElementById("closeDoctorModal");

    const doctorForm =
        document.getElementById("doctorForm");

    /* ==========================================================
       GLOBAL VARIABLES
    ========================================================== */

    let doctors = [];

    let filteredDoctors = [];

    let currentPage = 1;

    const rowsPerPage = 6;

    let editingDoctorId = null;

    /* ==========================================================
       INITIALIZE
    ========================================================== */

    initialize();

    async function initialize(){

        await loadDashboard();

        await loadDoctors();

        await loadUpcomingVisits();

        initializeModal();

        initializeSearch();

        initializeFilters();

    }

    /* ==========================================================
       DASHBOARD
    ========================================================== */

    async function loadDashboard(){

        try{

            const response = await fetch(

                API.dashboard,

                {

                    headers

                }

            );

            const data = await response.json();

            document.getElementById("totalDoctors").textContent =
                data.total_doctors;

            document.getElementById("totalPatients").textContent =
                data.total_patients;

            document.getElementById("activeStaff").textContent =
                data.active_staff;

            document.getElementById("bedOccupancy").textContent =
                data.bed_occupancy;

        }

        catch(error){

            console.error(

                "Dashboard Error",

                error

            );

        }

    }

    /* ==========================================================
       LOAD DOCTORS
    ========================================================== */

    async function loadDoctors(){

    try{

        const search = searchInput?.value || "";
        const specialization = specializationFilter?.value || "";

        const response = await fetch(

            `${API.doctors}?page=${currentPage}&limit=${rowsPerPage}&search=${encodeURIComponent(search)}&specialization=${encodeURIComponent(specialization)}`,

            {
                headers
            }

        );

        const result = await response.json();

        doctors = result.data;
        filteredDoctors = result.data;

        renderDoctors();

        if(paginationInfo){

            paginationInfo.textContent =
                `Page ${result.page} of ${result.pages} • ${result.total} Doctors`;

        }

        if(previousBtn)
            previousBtn.disabled = result.page === 1;

        if(nextBtn)
            nextBtn.disabled = result.page >= result.pages;

    }

    catch(error){

        console.error(error);

    }

}
        /* ==========================================================
       RENDER DOCTORS TABLE
    ========================================================== */

    function renderDoctors(){

        if(!doctorTable) return;

        doctorTable.innerHTML = "";

        const start = (currentPage - 1) * rowsPerPage;

        const end = start + rowsPerPage;

        const pageDoctors = filteredDoctors.slice(start, end);

        pageDoctors.forEach(doctor => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${doctor.doctor_id}</td>

                <td>

                    <div class="doctor-info">

                        <strong>${doctor.doctor_name}</strong><br>

                        <small>${doctor.email}</small>

                    </div>

                </td>

                <td>${doctor.specialization}</td>

                <td>${doctor.phone}</td>

                <td>${doctor.experience_years} Years</td>

                <td>

                    <span class="status-badge ${getStatusClass(doctor.clinical_status)}">

                        ${doctor.clinical_status}

                    </span>

                </td>

                <td>

                    <button
                        class="table-btn edit-btn"
                        data-id="${doctor.doctor_id}">

                        <span class="material-symbols-outlined">
                            edit
                        </span>

                    </button>

                    <button
                        class="table-btn delete-btn"
                        data-id="${doctor.doctor_id}">

                        <span class="material-symbols-outlined">
                            delete
                        </span>

                    </button>

                </td>

            `;

            doctorTable.appendChild(row);

        });

        initializeTableButtons();

        updatePagination();

    }

    /* ==========================================================
       STATUS COLOR
    ========================================================== */

    function getStatusClass(status){

        if(!status) return "";

        switch(status.toLowerCase()){

            case "active":

                return "active";

            case "inactive":

                return "inactive";

            case "on leave":

                return "leave";

            default:

                return "";

        }

    }

    /* ==========================================================
       SEARCH
    ========================================================== */

    function initializeSearch(){

        if(!searchInput) return;

        searchInput.addEventListener("input", filterDoctors);

    }

    /* ==========================================================
       FILTERS
    ========================================================== */

    function initializeFilters(){

        specializationFilter?.addEventListener(

            "change",

            filterDoctors

        );

        statusFilter?.addEventListener(

            "change",

            filterDoctors

        );

    }

    function filterDoctors(){

        const keyword =

            searchInput.value.toLowerCase().trim();

        const specialization =

            specializationFilter?.value || "";

        const status =

            statusFilter?.value || "";

        filteredDoctors = doctors.filter(doctor => {

            const matchSearch =

                doctor.doctor_name.toLowerCase().includes(keyword)

                ||

                doctor.email.toLowerCase().includes(keyword)

                ||

                doctor.phone.toLowerCase().includes(keyword)

                ||

                doctor.specialization.toLowerCase().includes(keyword);

            const matchSpecialization =

                specialization === ""

                ||

                doctor.specialization === specialization;

            const matchStatus =

                status === ""

                ||

                doctor.clinical_status === status;

            return (

                matchSearch

                &&

                matchSpecialization

                &&

                matchStatus

            );

        });

        currentPage = 1;

        renderDoctors();

    }

    /* ==========================================================
       TABLE BUTTONS
    ========================================================== */

    function initializeTableButtons(){

        document

            .querySelectorAll(".edit-btn")

            .forEach(button => {

                button.onclick = () =>

                    editDoctor(

                        button.dataset.id

                    );

            });

        document

            .querySelectorAll(".delete-btn")

            .forEach(button => {

                button.onclick = () =>

                    deleteDoctor(

                        button.dataset.id

                    );

            });

    }
        /* ==========================================================
       PAGINATION
    ========================================================== */

    function updatePagination(){

        const totalPages =

            Math.ceil(

                filteredDoctors.length / rowsPerPage

            ) || 1;

        if(paginationInfo){

            const start =

                filteredDoctors.length === 0

                ? 0

                : ((currentPage - 1) * rowsPerPage) + 1;

            const end = Math.min(

                currentPage * rowsPerPage,

                filteredDoctors.length

            );

            paginationInfo.textContent =

                `Showing ${start} - ${end} of ${filteredDoctors.length} Doctors`;

        }

        if(previousBtn){

            previousBtn.disabled = currentPage === 1;

        }

        if(nextBtn){

            nextBtn.disabled =

                currentPage >= totalPages;

        }

    }

    /* ==========================================================
       PREVIOUS BUTTON
    ========================================================== */

    previousBtn?.addEventListener(

        "click",

        () => {

            if(currentPage > 1){

                currentPage--;

                renderDoctors();

            }

        }

    );

    /* ==========================================================
       NEXT BUTTON
    ========================================================== */

    nextBtn?.addEventListener(

        "click",

        () => {

            const totalPages =

                Math.ceil(

                    filteredDoctors.length /

                    rowsPerPage

                );

            if(currentPage < totalPages){

                currentPage++;

                renderDoctors();

            }

        }

    );

    /* ==========================================================
       MODAL
    ========================================================== */

    function initializeModal(){

        addDoctorBtn?.addEventListener(

            "click",

            () => {

                editingDoctorId = null;

                doctorForm.reset();

                doctorModal.style.display = "flex";

            }

        );

        closeDoctorModal?.addEventListener(

            "click",

            closeModal

        );

        window.addEventListener(

            "click",

            (event) => {

                if(event.target === doctorModal){

                    closeModal();

                }

            }

        );

    }

    function closeModal(){

        doctorModal.style.display = "none";

        doctorForm.reset();

        editingDoctorId = null;

    }
        /* ==========================================================
       FORM SUBMIT (ADD / UPDATE)
    ========================================================== */

    doctorForm?.addEventListener(

        "submit",

        saveDoctor

    );

    async function saveDoctor(event){

        event.preventDefault();

        const formData = new FormData(doctorForm);

        const doctor = Object.fromEntries(formData.entries());

        doctor.experience_years = parseInt(
            doctor.experience_years
        );

        try{

            /* ---------- UPDATE ---------- */

            if(editingDoctorId){

                const response = await fetch(

                    `${API.doctors}/${editingDoctorId}`,

                    {

                        method:"PUT",

                        headers,

                        body:JSON.stringify(doctor)

                    }

                );

                if(!response.ok){

                    throw new Error(
                        "Unable to update doctor."
                    );

                }

                showToast(
                    "Doctor updated successfully."
                );

            }

            /* ---------- ADD ---------- */

            else{

                const response = await fetch(

                    API.doctors,

                    {

                        method:"POST",

                        headers,

                        body:JSON.stringify(doctor)

                    }

                );

                if(!response.ok){

                    throw new Error(
                        "Unable to add doctor."
                    );

                }

                showToast(
                    "Doctor added successfully."
                );

            }

            closeModal();

            await loadDoctors();

            await loadDashboard();

        }

        catch(error){

            console.error(error);

            showToast(

                error.message,

                "error"

            );

        }

    }

    /* ==========================================================
       EDIT DOCTOR
    ========================================================== */

    function editDoctor(id){

        const doctor = doctors.find(

            item => item.doctor_id == id

        );

        if(!doctor){

            showToast(

                "Doctor not found.",

                "error"

            );

            return;

        }

        editingDoctorId = id;

        doctorForm.doctor_name.value =
            doctor.doctor_name;

        doctorForm.specialization.value =
            doctor.specialization;

        doctorForm.phone.value =
            doctor.phone;

        doctorForm.email.value =
            doctor.email;

        doctorForm.experience_years.value =
            doctor.experience_years;

        doctorForm.clinical_status.value =
            doctor.clinical_status;

        doctorForm.password.value = "";

        doctorModal.style.display = "flex";

    }

    /* ==========================================================
       DELETE DOCTOR
    ========================================================== */

    async function deleteDoctor(id){

        const confirmDelete = confirm(

            "Delete this doctor?"

        );

        if(!confirmDelete){

            return;

        }

        try{

            const response = await fetch(

                `${API.doctors}/${id}`,

                {

                    method:"DELETE",

                    headers

                }

            );

            if(!response.ok){

                throw new Error(

                    "Unable to delete doctor."

                );

            }

            showToast(

                "Doctor deleted successfully."

            );

            await loadDoctors();

            await loadDashboard();

        }

        catch(error){

            console.error(error);

            showToast(

                error.message,

                "error"

            );

        }

    }
        /* ==========================================================
       UPCOMING VISITS
    ========================================================== */

    async function loadUpcomingVisits(){

        try{

            const response = await fetch(

                API.visits,

                {

                    headers

                }

            );

            const visits = await response.json();

            const tbody =

                document.getElementById(

                    "upcomingVisitsBody"

                );

            if(!tbody) return;

            tbody.innerHTML = "";

            visits.forEach(visit => {

                tbody.innerHTML += `

                    <tr>

                        <td>

                            ${visit.visit_time || "-"}

                        </td>

                        <td>

                            ${visit.patient_name}

                        </td>

                        <td>

                            ${visit.chief_complaint}

                        </td>

                        <td>

                            <span class="status-tag">

                                ${visit.visit_status || "Pending"}

                            </span>

                        </td>

                    </tr>

                `;

            });

        }

        catch(error){

            console.error(

                "Visit Error",

                error

            );

        }

    }

    /* ==========================================================
       TOAST
    ========================================================== */

    function showToast(

        message,

        type = "success"

    ){

        const oldToast =

            document.querySelector(".toast");

        if(oldToast){

            oldToast.remove();

        }

        const toast =

            document.createElement("div");

        toast.className =

            `toast ${type}`;

        toast.innerHTML = message;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            },300);

        },3000);

    }

    /* ==========================================================
       BUTTON RIPPLE EFFECT
    ========================================================== */

    document.addEventListener(

        "click",

        (event)=>{

            const button =

                event.target.closest("button");

            if(!button) return;

            const ripple =

                document.createElement("span");

            ripple.className = "ripple";

            const rect =

                button.getBoundingClientRect();

            ripple.style.left =

                `${event.clientX - rect.left}px`;

            ripple.style.top =

                `${event.clientY - rect.top}px`;

            button.appendChild(ripple);

            setTimeout(()=>{

                ripple.remove();

            },600);

        }

    );

    /* ==========================================================
       ESC CLOSE MODAL
    ========================================================== */

    document.addEventListener(

        "keydown",

        (event)=>{

            if(

                event.key==="Escape"

                &&

                doctorModal.style.display==="flex"

            ){

                closeModal();

            }

        }

    );

    /* ==========================================================
       WINDOW RESIZE
    ========================================================== */

    window.addEventListener(

        "resize",

        ()=>{

            renderDoctors();

        }

    );

    /* ==========================================================
       END
    ========================================================== */

});