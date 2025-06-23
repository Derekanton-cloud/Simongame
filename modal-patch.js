// Enhanced modal-patch.js for improved modal behavior
(function() {
  // Wait until DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // This fixes the modal behavior when clicked
    document.getElementById('vs-option').addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
        // Delay showing the modal to ensure all events are processed
      setTimeout(function() {
        const modal = document.getElementById('vs-modal');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.classList.add('active'); // Add active class for animations
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Animate the player icons with a staggered effect
        const playerIcons = modal.querySelectorAll('.player-icon');
        playerIcons.forEach((icon, index) => {
          icon.style.animation = `playerPop 0.5s ${index * 0.1}s forwards ease-out`;
        });
        
        // Trigger a custom event for home.js to enhance styling
        const event = new CustomEvent('modalShown');
        document.dispatchEvent(event);
      }, 50);
      
      return false;
    }, true);
    
    // Close modal when clicking the X button
    const closeButton = document.querySelector('.close-modal');
    if (closeButton) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeVsModal();
      });
    }
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeVsModal();
      }
    });
    
    // Prevent clicks on modal content from closing the modal
    if (document.querySelector('.modal-content')) {
      document.querySelector('.modal-content').addEventListener('click', function(e) {
        e.stopPropagation();
      }, true);
    }
    
    // Close modal when clicking outside the content area
    document.getElementById('vs-modal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeVsModal();
      }
    });
    
    // Function to close modal with animation
    function closeVsModal() {
      const modal = document.getElementById('vs-modal');
      modal.classList.remove('active');
      modal.style.opacity = '0';
      
      // Hide modal after animation completes
      setTimeout(function() {
        modal.style.display = 'none';
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
      }, 300);
    }
  });
})();
