document.addEventListener("DOMContentLoaded", async () => {

    console.log("JS Loaded");

    const token = localStorage.getItem("access_token");
    console.log("Token:", token);

    const response = await fetch("/api/patient-appointments", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    console.log("Status:", response.status);

    const appointments = await response.json();

    console.log("Appointments:", appointments);

    const tableBody = document.getElementById("appointmentTableBody");

    console.log("TableBody:", tableBody);

    tableBody.innerHTML = "";

    appointments.forEach((appointment) => {

        console.log("Row:", appointment);

        tableBody.innerHTML += `
        <tr>
            <td>${appointment.visit_id}</td>
            <td>${appointment.doctor_name}</td>
            <td>${appointment.visit_date}</td>
            <td>${appointment.visit_time}</td>
            <td>${appointment.reason}</td>
            <td>${appointment.status}</td>
        </tr>
        `;

    });

    console.log("Finished");
});