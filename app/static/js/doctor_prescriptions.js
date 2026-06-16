document.addEventListener('DOMContentLoaded', () => {
    
    // Status Filter Actions
    const filterButtons = document.querySelectorAll('.tab-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Clear current active selector state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Assign active flag to clicked filter target
            button.classList.add('active');
            
            const selectedStatus = button.textContent.trim().toLowerCase();
            filterTableRows(selectedStatus);
        });
    });

    // Helper Engine to Handle Dynamic Filtering Logic
    function filterTableRows(status) {
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const rowBadge = row.querySelector('.badge-status');
            if (!rowBadge) return;
            
            const badgeText = rowBadge.textContent.trim().toLowerCase();
            
            if (status === 'all statuses') {
                row.style.display = '';
            } else if (status === 'pending refill' && badgeText === 'refill needed') {
                row.style.display = '';
            } else if (badgeText === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Dynamic Search Input Integration
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const rows = document.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const textContent = row.textContent.toLowerCase();
                if (textContent.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Interactive Selection on Rows
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', (event) => {
            // Avoid conflict if the user clicks a specific action icon button
            if (event.target.closest('.table-action-btn')) return;

            const nameElement = row.querySelector('.cell-title');
            if (nameElement) {
                console.log(`Accessing comprehensive log metadata file for: ${nameElement.textContent}`);
            }
        });
    });
});

document
    .getElementById("newPrescriptionBtn")
    .addEventListener("click", () => {
        window.location.href = "/doctor-prescriptions/new";
    });
const newPrescriptionBtn = document.getElementById("newPrescriptionBtn");

console.log(newPrescriptionBtn);

if (newPrescriptionBtn) {
    newPrescriptionBtn.addEventListener("click", () => {
        alert("Button Clicked");
    });
}