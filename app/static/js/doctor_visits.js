/**
 * MediFlow Pro - Core Interactions & Layout Animation Script Module
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Search Bar Scale Expansion Interaction
    const searchInput = document.querySelector('.search-container input');
    const searchContainer = document.querySelector('.search-container');

    if (searchInput && searchContainer) {
        searchInput.addEventListener('focus', () => {
            searchContainer.classList.add('expanded');
        });

        searchInput.addEventListener('blur', () => {
            searchContainer.classList.remove('expanded');
        });
    }

    // 2. Patient Data Table Row Navigation Simulation Trigger
 const dataRows = document.querySelectorAll('.table-body-row');

dataRows.forEach(row => {
    row.addEventListener('click', (event) => {

        if (event.target.closest('.row-btn')) {
            return;
        }

        const patientId = row.dataset.patientId;

        window.location.href = `/patient-visit/${patientId}`;
    });
});
    // 3. Operational Performance Monitor Logging Setup
    const emergencyButton = document.querySelector('.btn-emergency');
    if (emergencyButton) {
        emergencyButton.addEventListener('click', () => {
            alert('Emergency Response Event Dispatcher activated. Chief medical officers are being routed to critical workspace areas.');
        });
    }
});