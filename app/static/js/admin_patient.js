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

    document.querySelectorAll(".icon-btn").forEach(button => {

        button.addEventListener("click", () => {

            if (button.classList.contains("delete")) return;

            showToast("Feature coming soon.");

        });

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