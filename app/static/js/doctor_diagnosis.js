document.addEventListener('DOMContentLoaded', () => {
    
    // Elements Setup
    const searchInput = document.getElementById('tableSearch');
    const tabButtons = document.querySelectorAll('#filterTabs .tab-btn');
    const tableRows = document.querySelectorAll('#clinicalTable tbody tr');
    const emergencyBtn = document.getElementById('emergencyBtn');
    const newDiagnosisBtn = document.getElementById('newDiagnosisBtn');

    // 1. Live Text Search Filter System
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            tableRows.forEach(row => {
                const textContent = row.textContent.toLowerCase();
                if (textContent.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // 2. Filter Tabs Categorization Logic
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Adjust visual tab configuration state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            tableRows.forEach(row => {
                const rowStatus = row.getAttribute('data-status');
                
                if (filterValue === 'all') {
                    row.style.display = '';
                } else if (filterValue === 'pending' && rowStatus === 'pending') {
                    row.style.display = '';
                } else if (filterValue === 'chronic' && rowStatus === 'chronic') {
                    row.style.display = '';
                } else if (filterValue === 'resolved' && rowStatus === 'resolved') {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // 3. Command Action Trigger Alerts
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            alert('Emergency alert signal broadcast initiated to medical response workflows.');
        });
    }

    if (newDiagnosisBtn) {
        newDiagnosisBtn.addEventListener('click', () => {
            alert('Opening digital record creation wizard context...');
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {

    const addDiagnosisBtn =
        document.getElementById("addDiagnosisBtn");

    if (addDiagnosisBtn) {

        addDiagnosisBtn.addEventListener("click", () => {

            window.location.href =
                "/doctor-diagnosis/new";

        });

    }

});