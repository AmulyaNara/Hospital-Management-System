document.addEventListener('DOMContentLoaded', () => {
    // Dynamic click feedback mechanics for professional user interactions
    const interactiveElements = document.querySelectorAll('button, .menu-item, .btn-action-primary, .btn-action-secondary, .btn-action-tertiary');

    interactiveElements.forEach(element => {
        element.addEventListener('mousedown', () => {
            element.style.transform = 'scale(0.98)';
            element.style.transition = 'transform 0.05s ease';
        });

        element.addEventListener('mouseup', () => {
            element.style.transform = 'scale(1)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    });
});