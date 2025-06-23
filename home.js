// Home page script for Simon Game

$(document).ready(function() {
    // Instead of replacing the modal, we'll ensure the styles are properly applied
    setTimeout(function() {
        // Make sure the battle icon is properly styled
        if($('.battle-icon').length && !$('.battle-icon').find('.battle-swords').length) {
            $('.battle-icon').html('<i class="battle-swords"></i>');
        }
        
        // Ensure modal options are styled correctly
        $('.modal-options').addClass('enhanced-layout');
        
        // Ensure the modal content has the correct max-width
        $('.modal-content').css('max-width', '1200px');
    }, 100);    // Add random movement to floating symbols
    animateSymbols();
    
    // Handle solo game mode selection
    $('.game-option.solo').click(function(e) {
        e.preventDefault();
        const href = $(this).attr('href');
        
        // Add selection animation
        $(this).addClass('selected');
        
        // Redirect after a short delay for the animation to complete
        setTimeout(function() {
            window.location.href = href;
        }, 300);
    });    // Remove duplicate event handlers, let modal-patch.js handle modal interactions
    // We'll only handle styling and animation enhancements
    function enhanceModalStyling() {
        // Apply enhanced styling to modal elements
        $('.modal-option').each(function(index) {
            $(this).attr('data-index', index);
            
            // Apply staggered animation to modal options
            $(this).css({
                'animation-delay': `${0.1 * (index + 1)}s`,
                'transform': 'scale(1)'
            });
        });
        
        // Make sure player icons have proper animation
        $('.player-icon').each(function(index) {
            $(this).css('animation-delay', `${0.05 * index}s`);
        });
    }
      // Wait for modal to be shown and then enhance it
    $(document).on('modalShown', function() {
        enhanceModalStyling();
    });
      // Prevent clicks inside modal from closing it
    $('.modal-content').on('click', function(e) {
        e.stopPropagation();
    });
    
    // Handle VS mode option selection from modal - ensure live binding
    $(document).on('click', '.modal-option', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const href = $(this).attr('href');
        
        // Add selection animation
        $(this).addClass('selected');
        
        // Close modal and redirect after a short delay
        setTimeout(function() {
            window.location.href = href;
        }, 300);
    });
    
    // Add ESC key to close modal
    $(document).keydown(function(e) {
        if (e.key === "Escape" && $('#vs-modal').is(':visible')) {
            closeVsModal();
        }
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
                'top': `${randomY}%`            });
        });
    }
    
    // This function only triggers the custom event and is not the primary handler
    function triggerModalEvent() {
        // Trigger a custom event that can be listened for
        $(document).trigger('modalShown');
        
        // Make sure body doesn't scroll when modal is open
        $('body').css('overflow', 'hidden');
        
        // Block any click events on the document for a moment to prevent accidental closing
        $('body').css('pointer-events', 'none');
        setTimeout(function() {
            $('body').css('pointer-events', 'auto');
            // Re-enable pointer events on modal content
            $('.modal-content').css('pointer-events', 'auto');
        }, 10);
          // Set up a visibility protection mechanism
        const visibilityCheck = setInterval(function() {
            if ($('#vs-modal').css('display') !== 'flex') {
                $('#vs-modal').css({
                    'display': 'flex',
                    'opacity': '1'
                });
            }
        }, 50);
        
        // Clear the interval after 1 second (modal should be stable by then)
        setTimeout(function() { clearInterval(visibilityCheck); }, 1000);
        
        // Add floating symbols inside modal
        addModalSymbols();
        
        // Add subtle animation to player icons
        $('.player-icon').each(function(index) {
            const delay = index * 0.1;
            $(this).css('animation', `playerPop 0.5s ${delay}s forwards ease-out`);
        });    }
    
    // Close VS Mode modal with animation
    function closeVsModal() {
        console.log("Closing VS modal");
        const modal = $('#vs-modal');
        
        // Remove active class
        modal.removeClass('active');
        
        // Animate closing
        modal.animate({opacity: 0}, 300, function() {
            modal.css('display', 'none');
            // Re-enable body scrolling
            $('body').css('overflow', 'auto');        });
    }
    
    // Add floating symbols to modal background
    function addModalSymbols() {
        // Get the existing modal symbols
        const modalSymbols = $('#vs-modal .modal-symbol');
        
        // Animate the existing modal symbols
        modalSymbols.each(function(index) {
            const symbol = $(this);
            const size = Math.floor(Math.random() * 25) + 15;
            const opacity = Math.random() * 0.15 + 0.08;
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomDelay = Math.random() * 5;
            const randomDuration = Math.random() * 10 + 15;
            
            symbol.css({
                width: size + 'px',
                height: size + 'px',
                left: randomX + '%',
                top: randomY + '%',
                opacity: opacity,
                animation: `float ${randomDuration}s infinite ease-in-out ${randomDelay}s`
            });
            
            // Add different shapes based on symbol class
            if (index % 6 === 0) {
                symbol.css({
                    backgroundColor: 'var(--accent-color)',
                    borderRadius: '50%',
                    filter: 'blur(2px)'
                });
            } else if (index % 6 === 1) {
                symbol.css({
                    backgroundColor: 'var(--blue-color)',
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    filter: 'blur(1px)'
                });
            } else if (index % 6 === 2) {
                symbol.css({
                    backgroundColor: 'var(--green-color)',
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    filter: 'blur(1.5px)'
                });
            } else if (index % 6 === 3) {
                symbol.css({
                    backgroundColor: 'var(--red-color)',
                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                    filter: 'blur(1px)'
                });
            } else if (index % 6 === 4) {
                symbol.css({
                    backgroundColor: 'var(--yellow-color)',
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    filter: 'blur(2px)'
                });
            } else {
                symbol.css({
                    backgroundColor: 'var(--purple-color)',
                    borderRadius: '4px',
                    filter: 'blur(1.5px)'
                });
            }
        });
    }

    // Initialize modal (ensure it's properly set up when page loads)
    $('#vs-modal').css('opacity', '0');
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
