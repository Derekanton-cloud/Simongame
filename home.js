// Home page script for Simon Game

$(document).ready(function() {
    // Add random movement to floating symbols
    animateSymbols();
    
    // Handle game mode selection
    $('.game-option').click(function(e) {
        e.preventDefault();
        const href = $(this).attr('href');
        
        // Add selection animation
        $(this).addClass('selected');
        
        // Redirect after a short delay for the animation to complete
        setTimeout(function() {
            window.location.href = href;
        }, 300);
    });
    
    // Add additional random movements to symbols
    function animateSymbols() {
        $('.symbol').each(function() {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomDelay = Math.random() * 5;
            
            $(this).css({
                'animation-delay': `-${randomDelay}s`,
                'left': `${randomX}%`,
                'top': `${randomY}%`
            });
        });
    }
});

// Pass the selected mode to the game page
function getGameMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mode') || 'solo'; // Default to solo mode
}

// Export the function for use in game.js
if (typeof module !== 'undefined') {
    module.exports = { getGameMode };
}
