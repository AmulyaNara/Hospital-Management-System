/**
 * MedCore Clinical Records Platform Workspace Script
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Client Search Filtering Engine Pipeline
    const searchInput = document.getElementById('patientSearchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase().trim();
            const dataRows = document.querySelectorAll('.clinical-table-row');
            
            dataRows.forEach(row => {
                // Read text contents from target criteria within identity nodes
                const textContent = row.innerText.toLowerCase();
                
                if (textContent.includes(query)) {
                    // Reset to standard fallback visible state
                    row.style.display = '';
                } else {
                    // Hide securely from user views
                    row.style.display = 'none';
                }
            });
        });
    }

    // 2. Intercept and Dispatch Safe Notifications for Emergency Alerts
    const alertButtons = document.querySelectorAll('.alert-trigger');
    
    alertButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Prevent standard parent table cell action triggers
            event.stopPropagation();
            
            const targetRow = button.closest('tr');
            let patientName = 'Patient Record';
            
            if (targetRow) {
                const nameNode = targetRow.querySelector('.p-name');
                if (nameNode) {
                    patientName = nameNode.innerText.trim();
                }
            }
            
            // Dispatch window prompt context
            alert(`CLINICAL ALERT: Immediate attention requested for ${patientName}. The Emergency Response Team has been notified.`);
        });
    });

    // 3. Dynamic Rotation Simulation on Load Button Component Click
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            console.log("MedCore system fetching next patient register chunk...");
        });
    }
});
document.getElementById("patients-btn").addEventListener("click", function(e) {
    e.preventDefault();

    document.getElementById("dashboard-content").style.display = "none";
    document.getElementById("patients-content").style.display = "block";
});