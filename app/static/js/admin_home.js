document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dynamic Metric Card Box Dynamic Hover Elevations System Actions Loop
    const runtimeCards = document.querySelectorAll('.bento-block-item, .metric-card-box');
    
    runtimeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // 2. Persistent Nav Anchor Interaction Highlight Mechanics Loop
    const navigationalLinks = document.querySelectorAll('.sidebar-navigation .nav-anchor');
    
    navigationalLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Prevent actual hash shifts during administrative tracking demonstrations

            
            navigationalLinks.forEach(item => {
                item.classList.remove('active');
            });
            
            link.classList.add('active');
            
            // Console logger tracking route modifications internally
            const tabReference = link.getAttribute('data-tab');
            console.log(`MedCore Navigation routed destination profile container view context: ${tabReference}`);
        });
    });
});