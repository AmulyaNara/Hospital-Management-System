document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       SEARCH
    ========================================================== */

    const searchInput =
        document.querySelector(".search-box input");

    if (searchInput) {

        searchInput.addEventListener("keyup", () => {

            const value =
                searchInput.value.toLowerCase();

            document.querySelectorAll("tbody tr")
            .forEach(row => {

                row.style.display =
                    row.innerText.toLowerCase()
                    .includes(value)
                    ? ""
                    : "none";

            });

        });

    }

    /* ==========================================================
       FILTER
    ========================================================== */

    const filterBtn =
        document.querySelector(".outline-btn");

    if (filterBtn) {

        filterBtn.addEventListener("click", () => {

            showToast(
                "Filter feature coming soon."
            );

        });

    }

    /* ==========================================================
       EXPORT
    ========================================================== */

    const exportBtn =
        document.getElementById("exportBtn");

    if (exportBtn) {

        exportBtn.addEventListener("click", () => {

            showToast("Export started...");

            setTimeout(() => {

                window.location.href =
                    "/admin-diagnosis/export";

            }, 800);

        });

    }

    /* ==========================================================
       ADD DIAGNOSIS
    ========================================================== */

    const addDiagnosisBtn =
        document.getElementById("addDiagnosisBtn");

    if (addDiagnosisBtn) {

        addDiagnosisBtn.addEventListener("click", () => {

            window.location.href =
                "/admin-diagnosis/new";

        });

    }

    /* ==========================================================
       NEW DIAGNOSIS
    ========================================================== */

    const newDiagnosisBtn =
        document.getElementById("newDiagnosisBtn");

    if (newDiagnosisBtn) {

        newDiagnosisBtn.addEventListener("click", () => {

            window.location.href =
                "/admin-diagnosis/new";

        });

    }

    /* ==========================================================
       VIEW SYSTEM LOGS
    ========================================================== */

    const logsBtn =
        document.getElementById("viewLogsBtn");

    if (logsBtn) {

        logsBtn.addEventListener("click", () => {

            window.location.href =
                "/admin-logs";

        });

    }

    /* ==========================================================
       TABLE ACTIONS
    ========================================================== */

    document.querySelectorAll(".icon-btn")
    .forEach((button, index) => {

        button.addEventListener("click", () => {

            showToast(
                "Opening Diagnosis #" + (index + 1)
            );

            setTimeout(() => {

                window.location.href =
                    "/admin-diagnosis/view/" +
                    (index + 1);

            }, 500);

        });

    });

    /* ==========================================================
       PAGINATION
    ========================================================== */

    document.querySelectorAll(".pagination button")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
            .querySelectorAll(".pagination button")
            .forEach(btn => {

                btn.classList.remove("active");

            });

            if (
                !button.innerText.includes("Previous")
                &&
                !button.innerText.includes("Next")
                &&
                button.innerText !== "..."
            ) {

                button.classList.add("active");

            }

        });

    });

    /* ==========================================================
       CARD ANIMATION
    ========================================================== */

    const cards =
        document.querySelectorAll(
            ".stat-card,.table-card,.system-card,.security-card"
        );

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(25px)";

        setTimeout(() => {

            card.style.transition = ".5s";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 120);

    });

    /* ==========================================================
       BUTTON HOVER
    ========================================================== */

    document.querySelectorAll("button")
    .forEach(button => {

        button.addEventListener("mouseenter", () => {

            button.style.transition = ".25s";

        });

    });

    /* ==========================================================
       RIPPLE EFFECT
    ========================================================== */

    document.querySelectorAll("button")
    .forEach(button => {

        button.addEventListener("click", function (e) {

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
       NETWORK STATUS
    ========================================================== */

    window.addEventListener("offline", () => {

        showToast(
            "Internet connection lost.",
            "error"
        );

    });

    window.addEventListener("online", () => {

        showToast(
            "Internet connection restored."
        );

    });

    /* ==========================================================
       LIVE CLOCK
    ========================================================== */

    function updateClock() {

        const clock =
            document.getElementById("liveClock");

        if (!clock) return;

        clock.innerHTML =
            new Date().toLocaleTimeString();

    }

    setInterval(updateClock, 1000);

    updateClock();

    /* ==========================================================
       TOAST
    ========================================================== */

    function showToast(
        message,
        type = "success"
    ) {

        const old =
            document.querySelector(".toast");

        if (old) {

            old.remove();

        }

        const toast =
            document.createElement("div");

        toast.className = "toast";

        toast.innerHTML = message;

        if (type === "error") {

            toast.style.background =
                "#DC2626";

        }

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("show");

        }, 100);

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 400);

        }, 3000);

    }

    /* ==========================================================
       READY
    ========================================================== */

    console.log(
        "Admin Diagnosis Loaded Successfully."
    );

});