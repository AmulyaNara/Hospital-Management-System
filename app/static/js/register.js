// =============================
// STEP NAVIGATION
// =============================
function goToStep(stepNumber) {

    if (stepNumber === 2) {

        const fullName = document.getElementById("fullName");
        const contactName = document.getElementById("contactName");
        const email = document.getElementById("email");

        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Full Name Required
        if (fullName.value.trim() === "") {

            document.getElementById("fullNameError").innerText =
                "Full Name is required";

            document.getElementById("fullNameError").style.display =
                "block";

            fullName.focus();
            return;
        }

        // Contact Name Required
        if (contactName.value.trim() === "") {

            document.getElementById("contactNameError").innerText =
                "Contact Name is required";

            document.getElementById("contactNameError").style.display =
                "block";

            contactName.focus();
            return;
        }

        // Email Required
        if (email.value.trim() === "") {

            document.getElementById("emailError").innerText =
                "Email Address is required";

            document.getElementById("emailError").style.display =
                "block";

            email.focus();
            return;
        }

        // Email Format Validation
        if (!emailRegex.test(email.value)) {

            document.getElementById("emailError").innerText =
                "Enter a valid email address";

            document.getElementById("emailError").style.display =
                "block";

            email.focus();
            return;
        }

        // Clear Errors
        document.getElementById("fullNameError").style.display = "none";
        document.getElementById("contactNameError").style.display = "none";
        document.getElementById("emailError").style.display = "none";
    }

    const step1 = document.getElementById("step1Container");
    const step2 = document.getElementById("step2Container");
    const indicator = document.getElementById("stepIndicator");
    const titleHeader = document.getElementById("stepHeaderTitle");
    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");

    if (stepNumber === 2) {

        step1.classList.add("hidden-step");
        step2.classList.remove("hidden-step");

        indicator.innerText = "Step 2 of 2";
        titleHeader.innerText = "Security & Verification";

        backBtn.classList.remove("hidden-step");
        nextBtn.classList.add("hidden-step");
        submitBtn.classList.remove("hidden-step");

    } else {

        step2.classList.add("hidden-step");
        step1.classList.remove("hidden-step");

        indicator.innerText = "Step 1 of 2";
        titleHeader.innerText = "Account Creation";

        backBtn.classList.add("hidden-step");
        nextBtn.classList.remove("hidden-step");
        submitBtn.classList.add("hidden-step");
    }
}


// =============================
// FORM SUBMIT VALIDATION
// =============================
async function handleFormSubmit(event) {

    event.preventDefault();

    const fullName =
        document.getElementById("fullName").value;

    const email =
        document.getElementById("email").value;

    const phone =
        document.getElementById("phone").value;

    const dateOfBirth =
        document.getElementById("dateOfBirth").value;

    const gender =
        document.getElementById("gender").value;

    const address =
        document.getElementById("address").value;

    const contactName =
        document.getElementById("contactName").value;

    const emergencyPhone =
        document.getElementById("emergencyPhone").value;

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,8}$/;

    if (!passwordRegex.test(password)) {

        alert(
            "Password must be 6-8 characters with uppercase, lowercase, number and special character."
        );

        return false;
    }

    if (password !== confirmPassword) {

        alert("Passwords do not match!");

        return false;
    }

    const userData = {

        name: fullName,
        email: email,
        password: password,

        role: "patient",

        phone: phone,

        date_of_birth: dateOfBirth,
        gender: gender,
        address: address,

        emergency_contact_name: contactName,
        emergency_contact_phone: emergencyPhone
    };

    try {

        const response = await fetch("/users", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        });

        
        let result = {};

        try {
            result = await response.json();
        } catch {
            result = {
        message: "Unable to connect to server."
    };
}

        if (response.ok) {

            alert("Registration Successful!");

            window.location.href = "/";
        }
        else {

            alert(
                result.message ||
                "Registration failed."
            );
        }

    }
    catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );
    }

    return false;
}


// =============================
// INPUT FOCUS STYLING
// =============================
document.addEventListener("DOMContentLoaded", () => {

    const inputs =
        document.querySelectorAll(".form-control");

    inputs.forEach(input => {

        input.addEventListener("focus", () => {

            const card =
                input.closest(".form-card");

            if (card) {
                card.style.borderColor = "#006a61";
            }
        });

        input.addEventListener("blur", () => {

            const card =
                input.closest(".form-card");

            if (card) {
                card.style.borderColor = "#e2e8f0";
            }
        });
    });
});


// =============================
// NAME VALIDATION FUNCTION
// =============================
function validateName(inputId, errorId, message) {

    const input =
        document.getElementById(inputId);

    const error =
        document.getElementById(errorId);

    if (!input || !error) return;

    input.addEventListener("input", () => {

        const regex =
            /^[A-Za-z\s]+$/;

        if (input.value.trim() === "") {

            input.classList.remove("invalid");
            input.classList.remove("valid");

            error.innerText = "";
            error.style.display = "none";

            return;
        }

        if (!regex.test(input.value)) {

            input.classList.add("invalid");
            input.classList.remove("valid");

            error.innerText = message;
            error.style.display = "block";

        } else {

            input.classList.remove("invalid");
            input.classList.add("valid");

            error.innerText = "";
            error.style.display = "none";
        }
    });
}


// =============================
// EMAIL VALIDATION
// =============================
const email =
    document.getElementById("email");

const emailError =
    document.getElementById("emailError");

if (email) {

    email.addEventListener("input", () => {

        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (email.value.trim() === "") {

            email.classList.remove("invalid");
            email.classList.remove("valid");

            emailError.innerText = "";
            emailError.style.display = "none";

            return;
        }

        if (!emailRegex.test(email.value)) {

            email.classList.add("invalid");
            email.classList.remove("valid");

            emailError.innerText =
                "Enter a valid email address.";

            emailError.style.display = "block";

        } else {

            email.classList.remove("invalid");
            email.classList.add("valid");

            emailError.innerText = "";
            emailError.style.display = "none";
        }
    });
}


// =============================
// PASSWORD VALIDATION
// =============================
const password =
    document.getElementById("password");

const passwordError =
    document.getElementById("passwordError");

if (password) {

    password.addEventListener("input", () => {

        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,8}$/;

        if (password.value.trim() === "") {

            password.classList.remove("invalid");
            password.classList.remove("valid");

            passwordError.innerText = "";
            passwordError.style.display = "none";

            return;
        }

        if (!regex.test(password.value)) {

            password.classList.add("invalid");
            password.classList.remove("valid");

            passwordError.innerText =
                "Password must be 6-8 chars with A-Z, a-z, number and special character.";

            passwordError.style.display = "block";

        } else {

            password.classList.remove("invalid");
            password.classList.add("valid");

            passwordError.innerText = "";
            passwordError.style.display = "none";
        }
    });
}


// =============================
// NAME VALIDATION CALLS
// =============================
validateName(
    "fullName",
    "fullNameError",
    "Name should contain only letters."
);

validateName(
    "contactName",
    "contactNameError",
    "Contact name should contain only letters."
);


// =============================
// CONFIRM PASSWORD VALIDATION
// =============================
const confirmPassword =
    document.getElementById("confirmPassword");

const confirmPasswordError =
    document.getElementById("confirmPasswordError");

if (confirmPassword) {

    confirmPassword.addEventListener("input", () => {

        if (
            confirmPassword.value !== "" &&
            confirmPassword.value !== password.value
        ) {

            confirmPassword.classList.add("invalid");
            confirmPassword.classList.remove("valid");

            confirmPasswordError.innerText =
                "Passwords do not match.";

            confirmPasswordError.style.display = "block";

        } else if (confirmPassword.value !== "") {

            confirmPassword.classList.remove("invalid");
            confirmPassword.classList.add("valid");

            confirmPasswordError.innerText = "";
            confirmPasswordError.style.display = "none";

        } else {

            confirmPassword.classList.remove("invalid");
            confirmPassword.classList.remove("valid");

            confirmPasswordError.innerText = "";
            confirmPasswordError.style.display = "none";
        }
    });
}


// =============================
// RECHECK CONFIRM PASSWORD
// =============================
if (password) {

    password.addEventListener("input", () => {

        if (
            confirmPassword &&
            confirmPassword.value !== "" &&
            confirmPassword.value !== password.value
        ) {

            confirmPassword.classList.add("invalid");
            confirmPassword.classList.remove("valid");

            confirmPasswordError.innerText =
                "Passwords do not match.";

            confirmPasswordError.style.display = "block";

        } else if (
            confirmPassword &&
            confirmPassword.value !== ""
        ) {

            confirmPassword.classList.remove("invalid");
            confirmPassword.classList.add("valid");

            confirmPasswordError.innerText = "";
            confirmPasswordError.style.display = "none";
        }
    });
}

function validatePhone(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.addEventListener("input", () => {
        let value = input.value.replace(/\D/g, "");
        input.value = value;

        if (value.length === 0) {
            error.textContent = "";
            input.classList.remove("input-error");
            return;
        }

        if (!/^[6-9]/.test(value)) {
            error.textContent = "Enter a valid number (must start with 6, 7, 8, or 9)";
            input.classList.add("input-error");
        } else {
            error.textContent = "";
            input.classList.remove("input-error");
        }
    });
}

validatePhone("phone", "phoneError");
validatePhone("emergencyPhone", "emergencyPhoneError");

const phone = document.getElementById("phone");
const emergencyPhone = document.getElementById("emergencyPhone");

function validateMobile(input) {
    const value = input.value.trim();

    if (value === "") {
        input.classList.remove("invalid", "valid");
        return;
    }

    if (/^[6-9]\d{9}$/.test(value)) {
        input.classList.remove("invalid");
        input.classList.add("valid");
    } else {
        input.classList.remove("valid");
        input.classList.add("invalid");
    }
}

phone.addEventListener("input", () => validateMobile(phone));
emergencyPhone.addEventListener("input", () => validateMobile(emergencyPhone));