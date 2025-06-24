// How To Play Modal Functionality
$(document).ready(function() {
  
  // Store original href values and modify game links to show modals
  const gameLinks = {
    'solo': 'index.html?mode=solo',
    '2players': 'index.html?mode=vs&players=2',
    '3players': 'index.html?mode=vs&players=3',
    '4players': 'index.html?mode=vs&players=4',
    '5players': 'index.html?mode=vs&players=5'
  };
  
  // Modify game.html links to show modals first
  $('a[href*="index.html?mode=solo"]').on('click', function(e) {
    e.preventDefault();
    showHowToModal('howto-solo-modal');
  });
  
  $('a[href*="index.html?mode=vs&players=2"]').on('click', function(e) {
    e.preventDefault();
    showHowToModal('howto-2players-modal');
  });
  
  $('a[href*="index.html?mode=vs&players=3"]').on('click', function(e) {
    e.preventDefault();
    showHowToModal('howto-3players-modal');
  });
  
  $('a[href*="index.html?mode=vs&players=4"]').on('click', function(e) {
    e.preventDefault();
    showHowToModal('howto-4players-modal');
  });
  
  $('a[href*="index.html?mode=vs&players=5"]').on('click', function(e) {
    e.preventDefault();
    showHowToModal('howto-5players-modal');
  });
  
  // Function to show modal with animation
  function showHowToModal(modalId) {
    const modal = $('#' + modalId);
    modal.addClass('show');
    
    // Add body class to prevent scrolling
    $('body').addClass('modal-open');
    
    // Focus trap for accessibility
    modal.find('.howto-understand-btn').focus();
  }
  
  // Function to hide modal with animation
  function hideHowToModal(modalId) {
    const modal = $('#' + modalId);
    modal.removeClass('show');
    
    // Remove body class to restore scrolling
    $('body').removeClass('modal-open');
  }
  
  // Close modal when clicking X
  $('.howto-close').on('click', function() {
    const modalId = $(this).data('modal');
    hideHowToModal(modalId);
  });
  
  // Close modal when clicking outside content
  $('.howto-modal').on('click', function(e) {
    if (e.target === this) {
      const modalId = $(this).attr('id');
      hideHowToModal(modalId);
    }
  });
  
  // Handle "I Understand" button clicks
  $('.howto-understand-btn').on('click', function() {
    const modalId = $(this).data('modal');
    const mode = $(this).data('mode');
    const players = $(this).data('players');
    
    // Hide the modal first
    hideHowToModal(modalId);
    
    // Small delay for smooth transition, then redirect
    setTimeout(function() {
      if (mode === 'solo') {
        window.location.href = gameLinks.solo;
      } else if (mode === 'vs') {
        window.location.href = `index.html?mode=vs&players=${players}`;
      }
    }, 300);
  });
  
  // ESC key to close modal
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      $('.howto-modal.show').each(function() {
        const modalId = $(this).attr('id');
        hideHowToModal(modalId);
      });
    }
  });
  
  // Prevent body scroll when modal is open
  $('body').on('classChange', function() {
    if ($('body').hasClass('modal-open')) {
      $('body').css('overflow', 'hidden');
    } else {
      $('body').css('overflow', '');
    }
  });
  
  // Add smooth scroll behavior for modal content
  $('.howto-modal-content').on('scroll', function() {
    const scrollTop = $(this).scrollTop();
    const header = $(this).find('.howto-modal-header');
    const footer = $(this).find('.howto-modal-footer');
    
    // Add shadow effects based on scroll position
    if (scrollTop > 0) {
      header.addClass('scrolled');
    } else {
      header.removeClass('scrolled');
    }
    
    const scrollBottom = this.scrollHeight - this.clientHeight - scrollTop;
    if (scrollBottom > 5) {
      footer.addClass('scrolled');
    } else {
      footer.removeClass('scrolled');
    }
  });
  
});

// CSS for scroll shadows
const scrollShadowCSS = `
  .howto-modal-header.scrolled {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  .howto-modal-footer.scrolled {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  }
`;

// Inject the CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = scrollShadowCSS;
  document.head.appendChild(style);
}
