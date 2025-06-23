// Modal fix script
$(document).ready(function() {
  // This script fixes issues with the VS mode modal
  
  // Override the default click behavior
  $('#vs-option').off('click').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Show the modal
    const modal = $('#vs-modal');
    modal.css({
      'display': 'flex',
      'opacity': '1'
    });
    
    // Add floating symbols inside modal
    addModalSymbols();
    
    // Prevent clicks inside the modal from bubbling up
    $('.modal-content').on('click', function(e) {
      e.stopPropagation();
    });
    
    // Only close on X button click
    $('.close-modal').on('click', function() {
      closeModal();
    });
    
    // Modal option selection
    $('.modal-option').on('click', function(e) {
      e.preventDefault();
      const href = $(this).attr('href');
      
      // Add selection animation
      $(this).addClass('selected');
      
      // Redirect after a short delay
      setTimeout(function() {
        window.location.href = href;
      }, 300);
    });
  });
  
  // Function to safely close the modal
  function closeModal() {
    const modal = $('#vs-modal');
    modal.animate({opacity: 0}, 300, function() {
      modal.css('display', 'none');
    });
  }
  
  // Function to add floating symbols
  function addModalSymbols() {
    // Only add symbols once
    if ($('#vs-modal .modal-symbol').length === 0) {
      for (let i = 0; i < 6; i++) {
        const symbol = $('<div>').addClass('modal-symbol');
        const size = Math.floor(Math.random() * 20) + 10;
        const opacity = Math.random() * 0.15 + 0.05;
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * 5;
        const randomDuration = Math.random() * 10 + 10;
        
        symbol.css({
          width: size + 'px',
          height: size + 'px',
          left: randomX + '%',
          top: randomY + '%',
          opacity: opacity,
          animation: `float ${randomDuration}s infinite ease-in-out ${randomDelay}s`
        });
        
        // Add different shapes
        if (i % 3 === 0) {
          symbol.css({
            backgroundColor: 'var(--accent-color)',
            borderRadius: '50%'
          });
        } else if (i % 3 === 1) {
          symbol.css({
            backgroundColor: 'var(--blue-color)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          });
        } else {
          symbol.css({
            backgroundColor: 'var(--green-color)',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
          });
        }
        
        $('#vs-modal .modal-content').append(symbol);
      }
    }
  }
});
