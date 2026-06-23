document.addEventListener("DOMContentLoaded", () => {
    console.log("patient_reports.js loaded");
    const token = localStorage.getItem("access_token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    async function loadPatientHeader() {

        const response = await fetch(
            "/api/patient-dashboard",
            {
                headers: authHeaders
            }
        );

        const patient = await response.json();

        document.getElementById("patientName").textContent =
            patient.patient_name;

        document.getElementById("patientId").textContent =
            patient.patient_id;

    }

    async function loadRecords() {

        const response = await fetch(
            "/api/patient-records",
            {
                headers: authHeaders
            }
        );

        const data = await response.json();

        console.log(data);

        const table =
            document.getElementById("recordsTable");

        table.innerHTML = "";

        data.forEach(record => {

            const row = document.createElement("tr");

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

                <td>${record.doctor_name}</td>

                <td>
                    <span class="badge green">
                        ${record.category}
                    </span>
                </td>

                <td>${record.date}</td>

                <td class="text-right">

                    <button class="view-btn">

                        <span class="material-symbols-outlined">

                            visibility

                        </span>

                    </button>

                </td>
            `;

            table.appendChild(row);

        });

    }

    loadPatientHeader();
    loadRecords();

});