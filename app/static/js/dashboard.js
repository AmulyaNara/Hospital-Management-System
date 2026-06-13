/**
 * Simple Dashboard & Table Action Interactions Engine
 */

// 1. Data configurations for the Weekly Appointment Flow
const appointmentData = {
    Mon: { scheduled: 85, completed: 55 },
    Tue: { scheduled: 95, completed: 75 },
    Wed: { scheduled: 60, completed: 35 },
    Thu: { scheduled: 80, completed: 60 },
    Fri: { scheduled: 100, completed: 85 },
    Sat: { scheduled: 45, completed: 20 }
};

// 2. Loop through the dataset to smoothly update bar graph metrics
function renderWeeklyChart() {
    const bars = document.querySelectorAll('.chart-bar-group');

    bars.forEach(barGroup => {
        const day = barGroup.getAttribute('data-day');
        const metrics = appointmentData[day];

        if (metrics) {
            const scheduledBar = barGroup.querySelector('.fill-scheduled');
            const completedBar = barGroup.querySelector('.fill-completed');

            if (scheduledBar) scheduledBar.style.height = `${metrics.scheduled}%`;
            if (completedBar) completedBar.style.height = `${metrics.completed}%`;
        }
    });
}

// 3. Document DOM safety lifecycle trigger initialization
document.addEventListener('DOMContentLoaded', () => {
    renderWeeklyChart();

    // Row selection interactive action feedback loop
    const tableRows = document.querySelectorAll('.doctors-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', (e) => {
            // Ensure button clicks aren't hijacked
            if (!e.target.closest('button')) {
                const doctorName = row.querySelector('.user-name').textContent;
                console.log(`Inspecting data profile for: ${doctorName}`);
            }
        });
    });
});