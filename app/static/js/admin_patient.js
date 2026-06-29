document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       ELEMENTS
    ========================================================== */

    const modal = document.getElementById("patientModal");
    const openButtons = [
        document.getElementById("newPatientBtn"),
        document.getElementById("registerPatient")
    ];
    const closeModalBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const patientForm = document.getElementById("patientForm");
    const searchInput = document.getElementById("searchPatient");

    /* ==========================================================
       MODAL
    ========================================================== */

    function openModal() {

        if (modal) {

            modal.classList.add("active");

        }

    }

    function closeModal() {

        if (modal) {

            modal.classList.remove("active");

        }

    }

    openButtons.forEach(btn => {

        if (btn) {

            btn.addEventListener("click", openModal);

        }

    });

    if (closeModalBtn) {

        closeModalBtn.addEventListener("click", closeModal);

    }

    if (cancelBtn) {

        cancelBtn.addEventListener("click", closeModal);

    }

    window.addEventListener("click", (e) => {

        if (e.target === modal) {

            closeModal();

        }

    });

    /* ==========================================================
       SEARCH PATIENT
    ========================================================== */

    if (searchInput) {

        searchInput.addEventListener("keyup", () => {

            const value = searchInput.value.toLowerCase();

            document.querySelectorAll("#patientTable tr").forEach(row => {

                const text = row.innerText.toLowerCase();

                row.style.display = text.includes(value)
                    ? ""
                    : "none";

            });

        });

    }

    /* ==========================================================
       FORM VALIDATION
    ========================================================== */

    if (patientForm) {

        patientForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const inputs = patientForm.querySelectorAll("input");

            let valid = true;

            inputs.forEach(input => {

                if (input.value.trim() === "") {

                    input.style.borderColor = "#EF4444";

                    valid = false;

                } else {

                    input.style.borderColor = "#E5E7EB";

                }

            });

            if (!valid) {

                showToast("Please fill all required fields.", "error");

                return;

            }

            showToast("Patient Registered Successfully");

            patientForm.reset();

            closeModal();

        });

    }

    /* ==========================================================
       VIEW BUTTON
    ========================================================== */

    document.addEventListener("click", async (e) => {

    const button = e.target.closest(".view-btn");

    if (!button) return;

    const id = button.dataset.id;

    const token = localStorage.getItem("access_token");

    try {

        const response = await fetch(`/patients/${id}`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const patient = await response.json();

        alert(

`Patient ID : ${patient.patient_id}

Patient Name : ${patient.patient_name}

Age : ${patient.age}

Gender : ${patient.gender}

Phone : ${patient.phone}

Blood Group : ${patient.blood_group}

Email : ${patient.email}

Status : ${patient.clinical_status}`

        );

    }

    catch(error){

        console.error(error);

    }

});
    /* ==========================================================
       DELETE BUTTON
    ========================================================== */

    document.querySelectorAll(".delete").forEach(button => {

        button.addEventListener("click", () => {

            if (confirm("Delete this patient?")) {

                button.closest("tr").remove();

                showToast("Patient deleted.");

            }

        });

    });

    /* ==========================================================
       EXPORT BUTTON
    ========================================================== */

    const exportBtn = document.querySelector(".outline-btn");

    if (exportBtn) {

        exportBtn.addEventListener("click", () => {

            showToast("Records exported successfully.");

        });

    }

    /* ==========================================================
       FILTER BUTTONS
    ========================================================== */

    document.querySelectorAll(".filter-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            showToast("Filter feature coming soon.");

        });

    });

    /* ==========================================================
       PAGINATION
    ========================================================== */

    document.querySelectorAll(".pagination button").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".pagination button")
                .forEach(btn => btn.classList.remove("active"));

            if (!button.innerText.includes("Previous") &&
                !button.innerText.includes("Next")) {

                button.classList.add("active");

            }

        });

    });

    /* ==========================================================
       CARD ANIMATION
    ========================================================== */

    const cards = document.querySelectorAll(".stat-card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition = ".45s";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 120);

    });

    /* ==========================================================
       RIPPLE EFFECT
    ========================================================== */

    document.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", function (e) {

            const ripple = document.createElement("span");

            ripple.className = "ripple";

            const rect = this.getBoundingClientRect();

            ripple.style.left = `${e.clientX - rect.left}px`;

            ripple.style.top = `${e.clientY - rect.top}px`;

            this.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            }, 600);

        });

    });

    /* ==========================================================
       TOAST
    ========================================================== */

    function showToast(message, type = "success") {

        const toast = document.createElement("div");

        toast.className = "toast";

        if (type === "error") {

            toast.style.background = "#DC2626";

        }

        toast.innerHTML = message;

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("show");

        }, 100);

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3000);

    }

});
async function loadPatients() {

    try {

        const token =
            localStorage.getItem("access_token");

        const response =
            await fetch("/patients", {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

        const patients =
            await response.json();

        const tbody =
            document.getElementById("patientTable");

        if (!tbody) return;

        tbody.innerHTML = "";

        patients.forEach(patient => {

            tbody.innerHTML += `

            <tr>

                <td>${patient.patient_id}</td>

                <td>${patient.patient_name}</td>

                <td>${patient.phone}</td>

                <td>${patient.last_visit_date || "-"}</td>

                <td>₹0</td>

                <td>${patient.clinical_status || "Stable"}</td>

                <td>

                    <button
class="icon-btn view-btn"
data-id="${patient.patient_id}">
                        <span class="material-symbols-outlined">
                            visibility
                        </span>
                    </button>
                 <button
        class="icon-btn download-btn"
        data-id="${patient.patient_id}">

        <span class="material-symbols-outlined">
            download
        </span>

    </button>
                </td>

            </tr>

            `;

        });

    }

    catch(error) {

        console.error(
            "Patients Load Error:",
            error
        );

    }

}
document.addEventListener("click", async (e)=>{

    const button = e.target.closest(".view-btn");

    if(!button) return;

    const id = button.dataset.id;

    const token = localStorage.getItem("access_token");

    const response = await fetch(

        `/patients/${id}`,

        {

            headers:{

                Authorization:`Bearer ${token}`

            }

        }

    );

    const patient = await response.json();

    alert(

`Patient ID : ${patient.patient_id}

Name : ${patient.patient_name}

Age : ${patient.age}

Gender : ${patient.gender}

Phone : ${patient.phone}

Blood Group : ${patient.blood_group}

Email : ${patient.email}

Status : ${patient.clinical_status}`

    );

});
async function loadPatientStats() {

    try {

        const token =
            localStorage.getItem("access_token");

        const response =
            await fetch("/patient-stats", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        const data = await response.json();

        document.getElementById("totalPatients").textContent =
            data.total_patients;

        document.getElementById("criticalCare").textContent =
            data.critical_care;

        document.getElementById("pendingFollowups").textContent =
            data.pending_followups;

        document.getElementById("avgWaitTime").textContent =
            data.avg_wait_time;

    }

    catch(error) {

        console.error(
            "Patient Stats Error:",
            error
        );

    }

}

async function loadPatientStats() {

    try {

        const token =
            localStorage.getItem("access_token");

        const response =
            await fetch("/patient-stats", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        const data = await response.json();

        document.getElementById("totalPatients").textContent =
            data.total_patients;

        document.getElementById("criticalCare").textContent =
            data.critical_care;

        document.getElementById("pendingFollowups").textContent =
            data.pending_followups;

        document.getElementById("avgWaitTime").textContent =
            data.avg_wait_time;

    }

    catch(error) {

        console.error(
            "Patient Stats Error:",
            error
        );

    }

}
async function loadPatientStats() {

    try {

        const token =
            localStorage.getItem("access_token");

        const response =
            await fetch("/patient-stats", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        const data = await response.json();

        document.getElementById("totalPatients").textContent =
            data.total_patients;

        document.getElementById("criticalCare").textContent =
            data.critical_care;

        document.getElementById("pendingFollowups").textContent =
            data.pending_followups;

        document.getElementById("avgWaitTime").textContent =
            data.avg_wait_time;

    }

    catch(error) {

        console.error(
            "Patient Stats Error:",
            error
        );

    }

}

async function loadPatientStats() {

    try {

        const token =
            localStorage.getItem("access_token");

        const response =
            await fetch("/patient-stats", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        const data = await response.json();

        document.getElementById("totalPatients").textContent =
            data.total_patients;

        document.getElementById("criticalCare").textContent =
            data.critical_care;

        document.getElementById("pendingFollowups").textContent =
            data.pending_followups;

        document.getElementById("avgWaitTime").textContent =
            data.avg_wait_time;

    }

    catch(error) {

        console.error(
            "Patient Stats Error:",
            error
        );

    }

}
document.addEventListener("click", (e) => {

    const button = e.target.closest(".download-btn");

    if (!button) return;

    const id = button.dataset.id;

    window.open(`/api/record/${id}/download`, "_blank");

});


loadPatientStats();

loadPatients();