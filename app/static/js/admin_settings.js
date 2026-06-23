document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       ELEMENTS
    ========================================================== */

    const saveBtn = document.getElementById("saveSettings");

    const resetBtn = document.getElementById("resetSettings");

    const updatePasswordBtn = document.getElementById("updatePassword");

    const themeCards = document.querySelectorAll(".theme-card");

    const themeInputs = document.querySelectorAll("input[name='theme']");

    const sessionButtons = document.querySelectorAll(".session-close");

    const twoFactor = document.getElementById("twoFactor");

    /* ==========================================================
       SAVE SETTINGS
    ========================================================== */

    if (saveBtn) {

        saveBtn.addEventListener("click", () => {

            showToast("Settings saved successfully.");

        });

    }

    /* ==========================================================
       RESET SETTINGS
    ========================================================== */

    if (resetBtn) {

        resetBtn.addEventListener("click", () => {

            if (confirm("Discard all unsaved changes?")) {

                location.reload();

            }

        });

    }

    /* ==========================================================
       UPDATE PASSWORD
    ========================================================== */

    if (updatePasswordBtn) {

        updatePasswordBtn.addEventListener("click", () => {

            const current =
                document.getElementById("currentPassword");

            const password =
                document.getElementById("newPassword");

            const confirmPassword =
                document.getElementById("confirmPassword");

            if (

                !current.value ||

                !password.value ||

                !confirmPassword.value

            ) {

                showToast(
                    "Please fill all password fields.",
                    "error"
                );

                return;

            }

            if (password.value.length < 8) {

                showToast(
                    "Password must contain at least 8 characters.",
                    "error"
                );

                return;

            }

            if (password.value !== confirmPassword.value) {

                showToast(
                    "Passwords do not match.",
                    "error"
                );

                return;

            }

            showToast(
                "Password updated successfully."
            );

            current.value = "";

            password.value = "";

            confirmPassword.value = "";

        });

    }

    /* ==========================================================
       THEME
    ========================================================== */

    themeCards.forEach((card, index) => {

        card.addEventListener("click", () => {

            themeCards.forEach(item =>
                item.classList.remove("active")
            );

            card.classList.add("active");

            themeInputs[index].checked = true;

            const title =
                card.querySelector("h4").innerText;

            showToast(title + " theme selected.");

        });

    });

    /* ==========================================================
       2FA
    ========================================================== */

    if (twoFactor) {

        twoFactor.addEventListener("change", () => {

            if (twoFactor.checked) {

                showToast(
                    "Two-Factor Authentication Enabled."
                );

            }

            else {

                showToast(
                    "Two-Factor Authentication Disabled.",
                    "warning"
                );

            }

        });

    }

    /* ==========================================================
       CLOSE SESSION
    ========================================================== */

    sessionButtons.forEach(button => {

        button.addEventListener("click", () => {

            const session =
                button.closest(".session-item");

            if (!session) return;

            if (confirm("Terminate this session?")) {

                session.remove();

                showToast("Session terminated.");

            }

        });

    });

    /* ==========================================================
       CHECKBOXS
    ========================================================== */

    document
        .querySelectorAll(
            ".notification-table input[type='checkbox']"
        )
        .forEach(box => {

            box.addEventListener("change", () => {

                showToast(
                    "Notification preference updated."
                );

            });

        });

    /* ==========================================================
       RIPPLE
    ========================================================== */

    document.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", (e) => {

            const ripple =
                document.createElement("span");

            ripple.className = "ripple";

            const rect =
                button.getBoundingClientRect();

            ripple.style.left =
                `${e.clientX - rect.left}px`;

            ripple.style.top =
                `${e.clientY - rect.top}px`;

            button.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            }, 600);

        });

    });

    /* ==========================================================
       CARD ANIMATION
    ========================================================== */

    document.querySelectorAll(".card").forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(25px)";

        setTimeout(() => {

            card.style.transition = ".45s";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 120);

    });

    /* ==========================================================
       LIVE STATUS
    ========================================================== */

    setInterval(() => {

        document.querySelectorAll(".database-item p")
            .forEach(item => {

                if (item.innerText === "Connected") {

                    item.style.color = "#10B981";

                }

            });

    }, 5000);

    /* ==========================================================
       TOAST
    ========================================================== */

    function showToast(message, type = "success") {

        const toast =
            document.createElement("div");

        toast.className = "toast";

        if (type === "error") {

            toast.classList.add("error");

        }

        if (type === "warning") {

            toast.classList.add("warning");

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