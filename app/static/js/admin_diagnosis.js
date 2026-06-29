/* ==========================================================
   MEDCORE HMS - DIAGNOSIS MODULE
   Part 1
========================================================== */

const API = {
    diagnosis: "/diagnosis",
    stats: "/diagnosis-stats"
};

let diagnoses = [];
let filteredDiagnoses = [];

const searchInput = document.getElementById("searchDiagnosis");
const statusFilter = document.getElementById("statusFilter");
const tableBody = document.getElementById("diagnosisTableBody");

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    loadDiagnoses();

    initializeSearch();

    initializeFilters();

});

/* ==========================================================
   DASHBOARD
========================================================== */

async function loadDashboard(){

    try{

        const response = await fetch(API.stats);

        const data = await response.json();

        document.getElementById("totalDiagnoses").textContent =
            data.total_diagnosis;

        document.getElementById("criticalCases").textContent =
            data.high_severity;

        document.getElementById("pendingReviews").textContent =
            data.active_diagnosis;

        document.getElementById("avgBilling").textContent =
            data.completed_diagnosis;

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================================
   LOAD TABLE
========================================================== */

async function loadDiagnoses(){

    try{

        const response = await fetch(API.diagnosis);

        diagnoses = await response.json();

        filteredDiagnoses = [...diagnoses];

        renderTable();

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================================
   RENDER TABLE
========================================================== */

function renderTable(){

    if(!tableBody) return;

    tableBody.innerHTML = "";

    filteredDiagnoses.forEach(diagnosis=>{

        tableBody.innerHTML += `

<tr>

<td>#DX-${diagnosis.diagnosis_id}</td>

<td>

<div class="patient-info">

<div class="avatar green">

${(diagnosis.patient_name || "NA").substring(0,2).toUpperCase()}

</div>

<div>

<strong>

${diagnosis.patient_name}

</strong>

<small>

${diagnosis.patient_code}

</small>

</div>

</div>

</td>

<td>

${diagnosis.disease}

</td>

<td>

${diagnosis.diagnosis_date}

</td>

<td>

<span class="badge">

${diagnosis.severity}

</span>

</td>

<td>

<span class="status confirmed">

${diagnosis.diagnosis_status}

</span>

</td>

<td>

₹${diagnosis.consult_fee}

</td>

<td>

<button
class="icon-btn view-btn"
data-id="${diagnosis.diagnosis_id}">

<span class="material-symbols-outlined">

visibility

</span>

</button>

<button
class="icon-btn edit-btn"
data-id="${diagnosis.diagnosis_id}">

<span class="material-symbols-outlined">

edit

</span>

</button>

<button
class="icon-btn delete-btn"
data-id="${diagnosis.diagnosis_id}">

<span class="material-symbols-outlined">

delete

</span>

</button>

</td>

</tr>

`;

    });

}

/* ==========================================================
   SEARCH
========================================================== */

function initializeSearch(){

    if(!searchInput) return;

    searchInput.addEventListener("keyup",()=>{

        const value =
            searchInput.value.toLowerCase();

        filteredDiagnoses = diagnoses.filter(item=>

            (item.patient_name || "").toLowerCase().includes(value)

            ||

            (item.disease || "").toLowerCase().includes(value)

            ||

            (item.patient_code || "").toLowerCase().includes(value)

        );

        renderTable();

    });

}

/* ==========================================================
   FILTER
========================================================== */

function initializeFilters(){

    if(!statusFilter) return;

    statusFilter.addEventListener("change",()=>{

        const status = statusFilter.value;

        if(status==="All Statuses"){

    filteredDiagnoses=[...diagnoses];

}

        else{

            filteredDiagnoses = diagnoses.filter(

                diagnosis=>

                diagnosis.diagnosis_status===status

            );

        }

        renderTable();

    });

}
/* ==========================================================
   VIEW DIAGNOSIS
========================================================== */

document.addEventListener("click", async (e) => {

    const viewBtn = e.target.closest(".view-btn");

    if (!viewBtn) return;

    try {

        const response = await fetch(
            `${API.diagnosis}/${viewBtn.dataset.id}`
        );

        const diagnosis = await response.json();

        if (diagnosis.error) {
            alert(diagnosis.error);
            return;
        }

        document.getElementById("viewDiagnosisId").textContent =
            diagnosis.diagnosis_id;

        document.getElementById("viewPatientName").textContent =
            diagnosis.patient_name;

        document.getElementById("viewPatientCode").textContent =
            diagnosis.patient_code;

        document.getElementById("viewDisease").textContent =
            diagnosis.disease;

        document.getElementById("viewSymptoms").textContent =
            diagnosis.symptoms;

        document.getElementById("viewDoctorNotes").textContent =
            diagnosis.doctor_notes;

        document.getElementById("viewSeverity").textContent =
            diagnosis.severity;

        document.getElementById("viewStatus").textContent =
            diagnosis.diagnosis_status;

        document.getElementById("viewICDCode").textContent =
            diagnosis.icd_code;

        document
            .getElementById("diagnosisDrawer")
            .classList.add("active");

    }

    catch (error) {

        console.error(error);

    }

});

/* ==========================================================
   CLOSE DRAWER
========================================================== */

document
.getElementById("closeDrawer")
?.addEventListener("click", () => {

    document
        .getElementById("diagnosisDrawer")
        .classList.remove("active");

});

/* ==========================================================
   DELETE
========================================================== */

document.addEventListener("click", async (e) => {

    const deleteBtn = e.target.closest(".delete-btn");

    if (!deleteBtn) return;

    if (!confirm("Delete this diagnosis?"))
        return;

    try {

        await fetch(

            `${API.diagnosis}/${deleteBtn.dataset.id}`,

            {

                method: "DELETE"

            }

        );

        loadDiagnoses();

    }

    catch (error) {

        console.error(error);

    }

});
