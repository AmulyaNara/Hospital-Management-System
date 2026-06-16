/**
 * MediAdmin - Operational UI Interactions Script Module
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. App Header Search Field Focus Transitions
    const searchInput = document.getElementById('searchInput');
    const searchContainer = document.getElementById('searchContainer');

    if (searchInput && searchContainer) {
        searchInput.addEventListener('focus', () => {
            searchContainer.style.transform = 'scale(1.02)';
            searchContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });

        searchInput.addEventListener('blur', () => {
            searchContainer.style.transform = 'scale(1)';
            searchContainer.style.boxShadow = 'none';
        });
    }

    // 2. Data Registry Table Row Highlight Selection Management
    const tableBody = document.getElementById('registryTableBody');
    
    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            // Prevent row selection layout trigger if clicking action icons or buttons
            if (event.target.closest('button')) return;

            const row = event.target.closest('tr');
            if (!row) return;

            // Remove any existing active selection states
            const activeRows = tableBody.querySelectorAll('.selected-row');
            activeRows.forEach(activeRow => activeRow.classList.remove('selected-row'));

            // Focus-highlight current clicked row structure
            row.classList.add('selected-row');
        });
    }
});