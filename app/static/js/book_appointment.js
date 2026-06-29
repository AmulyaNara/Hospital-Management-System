document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("appointmentForm");

    const token = localStorage.getItem("access_token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    // ==========================================
    // Load Logged-in Patient
    // ==========================================

    async function loadPatient() {

        try {

            const response = await fetch(
                "/api/book-appointment/patient",
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load patient details");
            }

            const patient = await response.json();

            document.getElementById("patient_name").value =
                patient.patient_name;

            document.getElementById("patient_id").value =
                patient.patient_id;

            document.getElementById("phone").value =
                patient.phone;

            document.getElementById("patient_name").readOnly = true;
            document.getElementById("patient_id").readOnly = true;
            document.getElementById("phone").readOnly = true;

        }

        catch (error) {

            console.error(error);

            alert("Unable to load patient details.");

        }

    }

    // ==========================================
    // Book Appointment
    // ==========================================

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const appointmentData = {

            doctor_id: parseInt(
                document.getElementById("doctor").value
            ),

            visit_date:
                document.getElementById("appointment_date").value,

            chief_complaint:
                document.getElementById("reason").value,

            visit_number: 1,

            visit_status: "Pending"

        };

        try {

            const response = await fetch(
                "/visits",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...authHeaders
                    },
                    body: JSON.stringify(appointmentData)
                }
            );

            const result = await response.json();

            if (!response.ok) {

                alert(result.error || result.detail || "Unable to book appointment.");

                return;

            }

            alert("Appointment booked successfully.");

            form.reset();

            window.location.href = "/patient-dashboard";

        }

        catch (error) {

            console.error(error);

            alert("Something went wrong.");

        }

    });

    // ==========================================
    // Initialize
    // ==========================================

    loadPatient();

});