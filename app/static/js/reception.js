document.addEventListener('DOMContentLoaded', () => {
    
    // --- MICRO-INTERACTION BUTTON SCALING EFFECT ---
    const clickables = document.querySelectorAll('button, .menu-item');
    
    clickables.forEach(element => {
        element.addEventListener('mousedown', () => {
            element.style.transform = 'scale(0.96)';
            element.style.transition = 'transform 0.05s ease';
        });
        
        element.addEventListener('mouseup', () => {
            element.style.transform = '';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });

    // --- SEARCH BAR BOX HIGHLIGHT COMPONENT SHADOWS ---
    const searchInput = document.querySelector('.search-input');
    const searchBoxWrapper = document.querySelector('.search-box-wrapper');
    
    if (searchInput && searchBoxWrapper) {
        searchInput.addEventListener('focus', () => {
            searchBoxWrapper.style.boxShadow = '0 0 0 2px rgba(0, 106, 97, 0.2)';
            searchBoxWrapper.style.borderRadius = '8px';
            searchBoxWrapper.style.transition = 'box-shadow 0.2s ease';
        });
        
        searchInput.addEventListener('blur', () => {
            searchBoxWrapper.style.boxShadow = '';
        });
    }
});