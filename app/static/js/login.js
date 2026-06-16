// ===============================
// Role Selection
// ===============================
function setRole(role) {

    // Save selected role
    document.getElementById("selectedRole").value = role;

    // Remove active class from all buttons
    document.querySelectorAll(".role-tab")
        .forEach(btn => btn.classList.remove("active-role"));

    // Add active class to clicked role
    if (role === "Patient") {
        document.querySelectorAll(".role-tab")[0]
            .classList.add("active-role");

        document.getElementById("email").placeholder =
            "Patient ID / Email";
    }

    else if (role === "Staff") {
        document.querySelectorAll(".role-tab")[1]
            .classList.add("active-role");

        document.getElementById("email").placeholder =
            "Staff ID / Email";
    }

    else if (role === "Admin") {
        document.querySelectorAll(".role-tab")[2]
            .classList.add("active-role");

        document.getElementById("email").placeholder =
            "Admin Username";
    }
}

// Default Role
window.onload = function () {
    setRole("Patient");
};

// ===============================
// Show / Hide Password
// ===============================
function togglePassword() {

    const password =
        document.getElementById("password");

    const eyeIcon =
        document.getElementById("eye-icon");

    if (password.type === "password") {

        password.type = "text";

        eyeIcon.textContent = "visibility_off";

    } else {

        password.type = "password";

        eyeIcon.textContent = "visibility";
    }
}

// ===============================
// Login Form Submit
// ===============================
document
.getElementById("loginForm")
.addEventListener(
    "submit",
    async function(event){

        event.preventDefault();

        const username =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const selectedRole =
            document.getElementById("selectedRole").value;

        const formData =
            new URLSearchParams();

        formData.append(
            "username",
            username
        );

        formData.append(
            "password",
            password
        );

        // Send selected role
        formData.append(
            "role",
            selectedRole
        );

        try{

            const response =
                await fetch(
                    "/login",
                    {
                        method: "POST",

                        headers:{
                            "Content-Type":
                            "application/x-www-form-urlencoded"
                        },

                        body: formData
                    }
                );

            const data =
                await response.json();

            if(response.ok){

                localStorage.setItem(
                    "access_token",
                    data.access_token
                );

                localStorage.setItem(
                    "role",
                    data.role
                );

                localStorage.setItem(
                    "name",
                    data.name
                );

                if(data.role === "admin"){

                    window.location.href =
                        "/dashboard";
                }

                else if(data.role === "doctor"){

                    window.location.href =
                        "/doctor-dashboard";
                }

                else if(data.role === "patient"){

                    window.location.href =
                        "/patient-dashboard";
                }

                else if(data.role === "receptionist"){

                    window.location.href =
                        "/receptionist-dashboard";
                }

            }
            else{

                alert(data.detail);
            }

        }
        catch(error){

            console.error(error);

            alert("Server Error");
        }

    }
);