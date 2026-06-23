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
    // Load Billing Records
    // ==========================================

    async function loadBillings() {

        try {

            const response = await fetch(
                "/api/patient-billings",
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load billings");
            }

            const data = await response.json();
            console.log(JSON.stringify(data, null, 2));

            const table = document.getElementById("billingTable");

            console.log(data);
            console.log("Billing Table:", table);
            console.log("Records:", data.length);

            table.innerHTML = "";

            data.forEach(bill => {
                console.log("Current Bill:", bill);
                const row = document.createElement("tr");

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
                                ${bill.bill_date}
                            </small>

                        </div>
                    </td>

                    <td>
                        ₹${Number(bill.amount).toLocaleString("en-IN")}
                    </td>

                    <td>

                        <span class="status ${bill.payment_status.toLowerCase()}">

                            ${bill.payment_status}

                        </span>

                    </td>

                    <td>

                        <button class="view-btn">

                            <span class="material-symbols-outlined">

                                visibility

                            </span>

                        </button>

                    </td>
                `;

                table.appendChild(row);
                console.log("Row Added");
            });

            // View Button

            document.querySelectorAll(".view-btn").forEach(button => {

                button.addEventListener("click", function () {

                    const row = this.closest("tr");

                    alert(
                        "Invoice : " +
                        row.cells[0].innerText
                    );

                });

            });

        }

        catch (error) {

            console.error(error);

        }

    }

    loadPatientHeader();

    loadBillings();

});