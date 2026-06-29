document.addEventListener("DOMContentLoaded", () => {
    let allAppointments = [];
    const token = localStorage.getItem("access_token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    const APPOINTMENT_API = "/api/patient-appointments";

    async function loadPatientHeader() {

        try {

            const response = await fetch(
                "/api/patient-dashboard",
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load patient");
            }

            const patient = await response.json();

            document.getElementById("patientName").textContent =
                patient.patient_name;

            document.getElementById("patientId").textContent =
                patient.patient_id;

        }

        catch (error) {

            console.error(error);

        }

    }

async function loadAppointments() {

    try {

        const response = await fetch(
            APPOINTMENT_API,
            {
                headers: authHeaders
            }
        );

        if (!response.ok) {

            throw new Error("Failed to load appointments");

        }

        const data = await response.json();
        allAppointments = data;
        const upcoming = data.filter(
    a => a.status.toLowerCase() === "pending"
).length;

const past = data.filter(
    a => a.status.toLowerCase() === "completed"
).length;

document.getElementById("upcomingCount").textContent =
    upcoming;

document.getElementById("pastCount").textContent =
    past;
    const total = data.length;

document.getElementById("paginationInfo").textContent =
    `Showing ${total} appointment${total !== 1 ? "s" : ""}`;
        console.table(data);

        // -------------------------
        // Update Next Session Card
        // -------------------------
        updateNextSession(data);

        const table =
            document.getElementById("appointmentsTable");

        table.innerHTML = "";

        data.forEach(item => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>

                    <strong>${item.visit_date}</strong><br>

                    <small>${item.visit_time}</small>

                </td>

                <td>

                    ${item.doctor_name}

                </td>

                <td>

                    ${item.specialization || "General Physician"}

                </td>

                <td>

                    Main Hospital

                </td>

                <td>

                    <span class="status">

                        ${item.status}

                    </span>

                </td>

                <td>

                    <span class="material-symbols-outlined">

                        chevron_right

                    </span>

                </td>

            `;

            table.appendChild(row);

        });

    }

    catch (error) {

        console.error(error);

    }

}

    loadPatientHeader();
    loadAppointments();

    const searchInput =
    document.getElementById("appointmentSearch");

searchInput.addEventListener("input",function(){

    const value=this.value.toLowerCase();

    const filtered=allAppointments.filter(item=>{

        return (

            item.doctor_name.toLowerCase().includes(value)

            ||

            (item.specialization || "")
            .toLowerCase()
            .includes(value)

            ||

            item.status.toLowerCase().includes(value)

            ||

            item.visit_date.toLowerCase().includes(value)

            ||

            "main hospital".includes(value)

        );

    });

    renderAppointments(filtered);

    document.getElementById("paginationInfo").textContent =
        `Showing ${filtered.length} appointment${filtered.length!==1?"s":""}`;

});

});

const openMapBtn = document.getElementById("openMapBtn");

if(openMapBtn){

    openMapBtn.addEventListener("click",()=>{

        window.open(
            "https://maps.google.com/?q=Hyderabad,Telangana",
            "_blank"
        );

    });

}
function updateNextSession(appointments){

    if(!appointments.length) return;

    // Find first pending/upcoming appointment
    const next = appointments.find(a =>
        a.status.toLowerCase() === "pending"
    );

    if(!next) return;

    document.getElementById("nextSessionTitle").textContent =
        "Appointment with " + next.doctor_name;

    document.getElementById("nextSessionDate").textContent =
        next.visit_date;

    document.getElementById("nextSessionTime").textContent =
        next.visit_time;

    updateInstructions(next.specialization);
}
function updateInstructions(specialization){

    let instruction = "";

    switch((specialization || "").toLowerCase()){

        case "cardiology":

            instruction =
            "• Carry previous ECG/ECHO reports.\n" +
            "• Continue your prescribed heart medications.\n" +
            "• Arrive at least 15 minutes before your appointment.";

            break;

        case "neurology":

            instruction =
            "• Bring MRI/CT scan reports if available.\n" +
            "• Carry your current medication list.\n" +
            "• Inform the doctor about recent headaches or dizziness.";

            break;

        case "orthopedics":

            instruction =
            "• Carry previous X-rays or MRI scans.\n" +
            "• Wear comfortable clothing.\n" +
            "• Avoid heavy physical activity before the visit.";

            break;

        case "dermatology":

            instruction =
            "• Do not apply creams or lotions before the consultation.\n" +
            "• Bring previous skin treatment prescriptions.";

            break;

        default:

            instruction =
            "• Bring previous medical records.\n" +
            "• Carry your current prescription.\n" +
            "• Reach the hospital 15 minutes before your appointment.";

    }

    document.getElementById("instructionText").innerHTML =
        instruction.replace(/\n/g,"<br>");
}
function renderAppointments(data){

    const table =
        document.getElementById("appointmentsTable");

    table.innerHTML = "";

    data.forEach(item=>{

        const row=document.createElement("tr");

        row.innerHTML=`

            <td>
                <strong>${item.visit_date}</strong><br>
                <small>${item.visit_time}</small>
            </td>

            <td>${item.doctor_name}</td>

            <td>${item.specialization || "General Physician"}</td>

            <td>Main Hospital</td>

            <td>
                <span class="status">
                    ${item.status}
                </span>
            </td>

            <td>
                <span class="material-symbols-outlined">
                    chevron_right
                </span>
            </td>

        `;

        table.appendChild(row);

    });

}