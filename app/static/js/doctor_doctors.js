/**
 * MediAdmin - Operational UI Interactions Script Module
 */

document.addEventListener('DOMContentLoaded', () => {

    const API_URL = "http://127.0.0.1:8000";

    let allDoctors = [];
    let currentPage = 1;
    const recordsPerPage = 6;

    // ====================================
    // Load Doctor Statistics Cards
    // ====================================

    async function loadDoctorStats() {

        try {

            const response =
                await fetch(
                    `${API_URL}/doctor-stats`
                );

            const stats =
                await response.json();

            document.getElementById(
                "totalDoctors"
            ).textContent =
                stats.total_doctors;

            document.getElementById(
                "totalPatients"
            ).textContent =
                stats.total_patients;

            document.getElementById(
                "activeStaff"
            ).textContent =
                stats.active_staff;

            document.getElementById(
                "bedOccupancy"
            ).textContent =
                stats.bed_occupancy;

        }
        catch(error) {

            console.error(
                "Doctor stats error:",
                error
            );
        }
    }

    // ====================================
    // Load Doctors From Backend
    // ====================================

    async function loadDoctors() {

        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            const response =
                await fetch(
                    `${API_URL}/doctors`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }

            const result =
    await response.json();

allDoctors = result.data || [];

renderDoctors();

        }
        catch(error) {

            console.error(
                "Failed to load doctors:",
                error
            );
        }
    }

    // ====================================
    // Render Doctors (Pagination)
    // ====================================

    function renderDoctors() {

        const tableBody =
            document.getElementById(
                "registryTableBody"
            );

        tableBody.innerHTML = "";

        const start =
            (currentPage - 1) *
            recordsPerPage;

        const end =
            start +
            recordsPerPage;

        const pageDoctors =
            allDoctors.slice(
                start,
                end
            );

        pageDoctors.forEach(doctor => {

            tableBody.innerHTML += `
                <tr>

                    <td style="padding-left:40px;">

                        <div class="profile-cell">

                            <div class="avatar-placeholder">
                                ${doctor.doctor_name
                                    .substring(0, 2)
                                    .toUpperCase()}
                            </div>

                            <div class="profile-info">

                                <p class="font-label-md name">
                                    ${doctor.doctor_name}
                                </p>

                                <p class="font-body-sm sub">
                                    ID: DOC-${doctor.doctor_id}
                                </p>

                            </div>

                        </div>

                    </td>

                    <td>

                        <span class="specialty-pill font-label-sm">
                            ${doctor.specialization || "N/A"}
                        </span>

                    </td>

                    <td>

                        <div class="status-cell active">

                            <span class="status-dot"></span>

                            <span class="font-label-sm">
                                ${doctor.clinical_status || "Active"}
                            </span>

                        </div>

                    </td>

                    <td class="font-body-sm">

                        ${doctor.email || "N/A"}

                    </td>

                </tr>
            `;
        });

        updatePaginationInfo();
    }

    // ====================================
    // Update Footer
    // ====================================

    function updatePaginationInfo() {

        const start =
            ((currentPage - 1) *
            recordsPerPage) + 1;

        const end =
            Math.min(
                currentPage *
                recordsPerPage,
                allDoctors.length
            );

        const paginationInfo =
            document.getElementById(
                "paginationInfo"
            );

        if (paginationInfo) {

            paginationInfo.textContent =
                `Showing ${start}-${end} of ${allDoctors.length} Doctors`;
        }
    }

    // ====================================
    // Previous Button
    // ====================================

    const prevBtn =
        document.getElementById(
            "prevBtn"
        );

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            () => {

                if (currentPage > 1) {

                    currentPage--;

                    renderDoctors();
                }
            }
        );
    }

    // ====================================
    // Next Button
    // ====================================

    const nextBtn =
        document.getElementById(
            "nextBtn"
        );

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            () => {

                const totalPages =
    Math.ceil(
        allDoctors.length / recordsPerPage
    );

                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderDoctors();
                }
            }
        );
    }

    // ====================================
    // Search Box Animation
    // ====================================

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchContainer =
        document.getElementById(
            "searchContainer"
        );

    if (
        searchInput &&
        searchContainer
    ) {

        searchInput.addEventListener(
            "focus",
            () => {

                searchContainer.style.transform =
                    "scale(1.02)";

                searchContainer.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.08)";
            }
        );

        searchInput.addEventListener(
            "blur",
            () => {

                searchContainer.style.transform =
                    "scale(1)";

                searchContainer.style.boxShadow =
                    "none";
            }
        );
    }

    // ====================================
    // Row Selection
    // ====================================

    const tableBody =
        document.getElementById(
            "registryTableBody"
        );

    if (tableBody) {

        tableBody.addEventListener(
            "click",
            (event) => {

                const row =
                    event.target.closest(
                        "tr"
                    );

                if (!row) return;

                document
                    .querySelectorAll(
                        ".selected-row"
                    )
                    .forEach(item =>
                        item.classList.remove(
                            "selected-row"
                        )
                    );

                row.classList.add(
                    "selected-row"
                );
            }
        );
    }

    // ====================================
    // Initial Load
    // ====================================

    loadDoctorStats();
    loadDoctors();

});