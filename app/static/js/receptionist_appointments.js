document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       MODAL
    ========================================================== */

    const modal = document.getElementById("appointmentModal");
    const openBtn = document.getElementById("newAppointmentBtn");
    const closeBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelAppointment");

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

    if (openBtn) {
        openBtn.addEventListener("click", openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
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
       SEARCH
    ========================================================== */

    const searchInput = document.querySelector(".search-box input");

    if (searchInput) {

        searchInput.addEventListener("keyup", () => {

            const value = searchInput.value.toLowerCase();

            document.querySelectorAll("tbody tr").forEach(row => {

                const text = row.innerText.toLowerCase();

                row.style.display = text.includes(value)
                    ? ""
                    : "none";

            });

        });

    }

    /* ==========================================================
       FILTER
    ========================================================== */

    const filterBtn = document.querySelector(".outline-btn");

    if (filterBtn) {

        filterBtn.addEventListener("click", () => {

            showToast("Filter options coming soon.");

        });

    }

    /* ==========================================================
       EXPORT
    ========================================================== */

    const exportButtons = document.querySelectorAll(".outline-btn");

    if (exportButtons.length > 1) {

        exportButtons[1].addEventListener("click", () => {

            showToast("Export completed successfully.");

        });

    }

    /* ==========================================================
       APPOINTMENT FORM
    ========================================================== */

    const appointmentForm =
        document.getElementById("appointmentForm");

    if (appointmentForm) {

        appointmentForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const patient =
                appointmentForm.querySelector("input[type='text']");

            if (!patient.value.trim()) {

                showToast("Please enter patient name.", "error");

                patient.focus();

                return;

            }

            showToast("Appointment booked successfully.");

            appointmentForm.reset();

            closeModal();

        });

    }

    /* ==========================================================
       TABLE ACTIONS
    ========================================================== */

    document.querySelectorAll(".icon-btn").forEach(button => {

        button.addEventListener("click", () => {

            showToast("Appointment details feature coming soon.");

        });

    });

    /* ==========================================================
       PAGINATION
    ========================================================== */

    document.querySelectorAll(".pagination button").forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".pagination button")
                .forEach(btn => btn.classList.remove("active"));

            if (!button.querySelector(".material-symbols-outlined")) {

                button.classList.add("active");

            }

        });

    });

    /* ==========================================================
       QUICK ACTIONS
    ========================================================== */

    document.querySelectorAll(".action-btn").forEach(button => {

        button.addEventListener("click", () => {

            const text = button.innerText.trim();

            showToast(text);

        });

    });

    /* ==========================================================
       RIPPLE EFFECT
    ========================================================== */

    document.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", (e) => {

            const ripple = document.createElement("span");

            ripple.className = "ripple";

            const rect = button.getBoundingClientRect();

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

    const cards = document.querySelectorAll(

        ".stat-card,.widget-card,.table-card"

    );

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition = ".5s";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 120);

    });

    /* ==========================================================
       TOAST
    ========================================================== */

    function showToast(message, type = "success") {

        let toast = document.createElement("div");

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

    /* ==========================================================
       LIVE CLOCK
    ========================================================== */

    function updateClock() {

        const clock = document.getElementById("liveClock");

        if (!clock) return;

        const now = new Date();

        clock.innerHTML = now.toLocaleTimeString();

    }

    setInterval(updateClock, 1000);

    updateClock();

    /* ==========================================================
       AUTO REFRESH STATS (Demo)
    ========================================================== */

    setInterval(() => {

        const cards = document.querySelectorAll(".stat-card h2");

        if (cards.length >= 4) {

            cards[0].innerHTML = 40 + Math.floor(Math.random() * 6);

            cards[1].innerHTML = 6 + Math.floor(Math.random() * 4);

        }

    }, 10000);

});