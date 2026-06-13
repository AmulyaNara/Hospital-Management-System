document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Hover Elevation Micro-interactions Ecosystem for Layout Cards
    const interactiveCards = document.querySelectorAll('.transition-card, .transition-row');
    
    interactiveCards.forEach(item => {
        item.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.2s ease, background-color 0.2s ease';
        
        item.addEventListener('mouseenter', () => {
            if (item.classList.contains('record-item-card')) {
                item.style.transform = 'translateY(-2px)';
                item.style.borderColor = 'var(--teal-main)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (item.classList.contains('record-item-card')) {
                item.style.transform = 'translateY(0)';
                item.style.borderColor = 'var(--border-faint-line)';
            }
        });
    });

    // 2. Search Container Frame Highlight Focus Ring Interaction Actions
    const searchField = document.querySelector('.search-input');
    const searchFrame = document.querySelector('.search-container');

    if (searchField && searchFrame) {
        searchField.addEventListener('focus', () => {
            searchFrame.style.boxShadow = '0 0 0 2px rgba(0, 106, 97, 0.2)';
            searchFrame.style.borderColor = 'var(--teal-main)';
        });

        searchField.addEventListener('blur', () => {
            searchFrame.style.boxShadow = 'none';
            searchFrame.style.borderColor = 'var(--border-faint-line)';
        });
    }
});