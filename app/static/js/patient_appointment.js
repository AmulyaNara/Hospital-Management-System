document.addEventListener("DOMContentLoaded", () => {

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

            console.log(data);

            const table = document.getElementById("appointmentsTable");

            table.innerHTML = "";

            data.forEach(item => {

                console.log(item);

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>
                        <strong>${item.visit_date}</strong><br>
                        <small>${item.visit_time}</small>
                    </td>

                    <td>${item.doctor_name}</td>

                    <td>${item.specialization}</td>

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

        catch (error) {

            console.error(error);

        }

    }

    loadPatientHeader();
    loadAppointments();

});