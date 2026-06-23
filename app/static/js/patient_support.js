document.addEventListener("DOMContentLoaded", () => {

    console.log("Patient Support Loaded");

    // ==========================================
    // Search Support Cards & FAQs
    // ==========================================

    const searchInput = document.querySelector(".search-box input");

    if (searchInput) {

        searchInput.addEventListener("keyup", function () {

            const value = this.value.toLowerCase();

            // Search Cards
            document.querySelectorAll(".support-card").forEach(card => {

                const text = card.innerText.toLowerCase();

                card.style.display = text.includes(value)
                    ? ""
                    : "none";

            });

            // Search FAQ
            document.querySelectorAll(".faq-section details").forEach(item => {

                const text = item.innerText.toLowerCase();

                item.style.display = text.includes(value)
                    ? ""
                    : "none";

            });

        });

    }

    // ==========================================
    // FAQ Accordion
    // ==========================================

    const details = document.querySelectorAll(".faq-section details");

    details.forEach(current => {

        current.addEventListener("toggle", () => {

            if (current.open) {

                details.forEach(item => {

                    if (item !== current) {

                        item.removeAttribute("open");

                    }

                });

            }

        });

    });

    // ==========================================
    // Support Card Hover Animation
    // ==========================================

    document.querySelectorAll(".support-card").forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-8px)";
            card.style.transition = ".3s";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0)";

        });

    });

    // ==========================================
    // Emergency Card Hover
    // ==========================================

    const urgentCard = document.querySelector(".urgent-card");

    if (urgentCard) {

        urgentCard.addEventListener("mouseenter", () => {

            urgentCard.style.transform = "scale(1.02)";
            urgentCard.style.transition = ".3s";

        });

        urgentCard.addEventListener("mouseleave", () => {

            urgentCard.style.transform = "scale(1)";

        });

    }

    // ==========================================
    // Contact Form
    // ==========================================

    const form = document.querySelector(".support-form");

    if (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            const message = this.querySelector("textarea").value.trim();

            if (message === "") {

                alert("Please enter your message.");

                return;

            }

            alert("Support request submitted successfully.");

            this.reset();

        });

    }

    // ==========================================
    // Book Appointment
    // ==========================================

    const bookBtn = document.querySelector(".book-btn");

    if (bookBtn) {

        bookBtn.addEventListener("click", () => {

            window.location.href = "/patient-appointments";

        });

    }

    // ==========================================
    // Sidebar Active State
    // ==========================================

    const currentPage = window.location.pathname;

    document.querySelectorAll(".sidebar-nav .nav-item").forEach(link => {

        if (link.getAttribute("href") === currentPage) {

            document
                .querySelectorAll(".sidebar-nav .nav-item")
                .forEach(item => item.classList.remove("active"));

            link.classList.add("active");

        }

    });

    // ==========================================
    // Smooth Scroll
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                e.preventDefault();

                target.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    });

});