document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("access_token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    // ==========================================
    // Load Patient Header
    // ==========================================

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

    // ==========================================
    // Load Lab Results
    // ==========================================

    async function loadLabResults() {

        try {

            const response = await fetch(
                "/api/patient-labs",
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load labs");
            }

            const data = await response.json();

            console.log(data);

            const table =
                document.getElementById("labTable");

            table.innerHTML = "";

            data.forEach(lab => {

                const row = document.createElement("tr");

                row.innerHTML = `

                    <td class="test-name">

                        <strong>${lab.test_name}</strong>

                        <small>
                            LAB ID : ${lab.patient_code}
                        </small>

                    </td>

                    <td>${lab.test_date}</td>

                    <td>${lab.doctor_name}</td>

                    <td>

                        <span class="status ${lab.status.toLowerCase()}">

                            ${lab.status}

                        </span>

                    </td>

                    <td>

                        <button class="action-btn">

                            <span class="material-symbols-outlined">

                                visibility

                            </span>

                        </button>

                    </td>

                `;

                table.appendChild(row);

            });

            // ==========================
            // Search
            // ==========================

            const searchInput =
                document.querySelector(".search-box input");

            if (searchInput) {

                searchInput.addEventListener("keyup", function () {

                    const value =
                        this.value.toLowerCase();

                    table.querySelectorAll("tr").forEach(row => {

                        row.style.display =
                            row.innerText.toLowerCase().includes(value)
                            ? ""
                            : "none";

                    });

                });

            }

        }

        catch (error) {

            console.error(error);

        }

    }

    loadPatientHeader();
    loadLabResults();

});