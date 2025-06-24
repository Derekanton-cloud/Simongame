// How To Play Modal Functionality for game.html
$(document).ready(function() {  
  
  console.log('HowTo Modal Game JS loaded');
  
  // Function to show modal with animation - FORCE DISPLAY
  function showHowToModal(modalId) {
    console.log('Showing modal:', modalId);
    const modal = $('#' + modalId);
    const modalContent = modal.find('.howto-modal-content');
    
    // FORCE scroll to top BEFORE anything else
    modalContent[0].scrollTop = 0;
    modalContent.scrollTop(0);
    
    // FORCE display and visibility
    modal.css({
      'display': 'flex',
      'visibility': 'visible',
      'opacity': '1'
    }).addClass('show');
    
    // Add body class to prevent scrolling
    $('body').addClass('modal-open').css('overflow', 'hidden');
    
    // Aggressively ensure scroll is at top
    modalContent[0].scrollTop = 0;
    modalContent.scrollTop(0);
    
    // Multiple attempts to ensure it stays at top
    for (let i = 0; i < 5; i++) {
      setTimeout(function() {
        modalContent[0].scrollTop = 0;
        modalContent.scrollTop(0);
      }, i * 20);
    }
    
    // Final attempt after animation
    setTimeout(function() {
      modalContent[0].scrollTop = 0;
      modalContent.scrollTop(0);
    }, 600);
  }
  
  // Function to hide modal with animation
  function hideHowToModal(modalId) {
    console.log('Hiding modal:', modalId);
    const modal = $('#' + modalId);
    modal.removeClass('show');
    
    setTimeout(function() {
      modal.css('display', 'none');
    }, 300);
    
    // Remove body class to restore scrolling
    $('body').removeClass('modal-open').css('overflow', '');
  }
    // Wait for the page to fully load before attaching handlers
  setTimeout(function() {
    
    // COMPLETELY OVERRIDE the solo play link - remove ALL other handlers first
    $('a[href="index.html?mode=solo"]').off().on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('Solo play clicked - showing modal');
      showHowToModal('howto-solo-modal');
      
      return false;
    });
    
    // Also handle clicks on the entire solo game option div
    $('.game-option.solo').off('click').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('Solo option div clicked - showing modal');
      showHowToModal('howto-solo-modal');
      
      return false;
    });
    
    // Handle clicks on any child elements of solo option
    $('.game-option.solo *').off('click').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('Solo option child clicked - showing modal');
      showHowToModal('howto-solo-modal');
      
      return false;
    });
      // Override the VS mode modal links (inside the VS modal) - Multiple approaches for reliability
    
    // Method 1: Direct href matching
    $(document).on('click', 'a[href="index.html?mode=vs&players=2"]', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('2-player link clicked - showing modal');
      // Close the VS modal first
      $('#vs-modal').fadeOut();
      // Show the how-to modal
      setTimeout(function() {
        showHowToModal('howto-2players-modal');
      }, 300);
      
      return false;
    });
    
    $(document).on('click', 'a[href="index.html?mode=vs&players=3"]', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('3-player link clicked - showing modal');
      $('#vs-modal').fadeOut();
      setTimeout(function() {
        showHowToModal('howto-3players-modal');
      }, 300);
      
      return false;
    });
    
    $(document).on('click', 'a[href="index.html?mode=vs&players=4"]', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('4-player link clicked - showing modal');
      $('#vs-modal').fadeOut();
      setTimeout(function() {
        showHowToModal('howto-4players-modal');
      }, 300);
      
      return false;
    });
    
    $(document).on('click', 'a[href="index.html?mode=vs&players=5"]', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('5-player link clicked - showing modal');
      $('#vs-modal').fadeOut();
      setTimeout(function() {
        showHowToModal('howto-5players-modal');
      }, 300);
      
      return false;
    });
    
    // Method 2: Using broader selectors as backup
    $(document).on('click', '.modal-option', function(e) {
      const href = $(this).attr('href');
      if (href && href.includes('mode=vs&players=')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('Modal option clicked with href:', href);
        
        // Extract player count
        const players = href.match(/players=(\d+)/)[1];
        
        // Close the VS modal first
        $('#vs-modal').fadeOut();
        
        // Show the appropriate how-to modal
        setTimeout(function() {
          showHowToModal(`howto-${players}players-modal`);
        }, 300);
        
        return false;
      }
    });
    
  }, 1000); // Increased wait time to ensure all other scripts are loaded
  
  // Additional observer to catch when VS modal is shown and attach handlers
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const target = mutation.target;
        if (target.id === 'vs-modal' && target.style.display === 'flex') {
          console.log('VS modal detected as shown, attaching handlers');
          attachVSModalHandlers();
        }
      }
    });
  });
  
  // Start observing the VS modal
  const vsModal = document.getElementById('vs-modal');
  if (vsModal) {
    observer.observe(vsModal, { attributes: true, attributeFilter: ['style', 'class'] });
  }
  
  // Function to attach handlers to VS modal options
  function attachVSModalHandlers() {
    // Wait a bit for the modal to be fully rendered
    setTimeout(function() {
      // Remove any existing handlers first
      $('#vs-modal .modal-option').off('click.howto');
      
      // Attach new handlers with namespace
      $('#vs-modal a[href="index.html?mode=vs&players=2"]').on('click.howto', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('VS modal 2-player clicked');
        $('#vs-modal').fadeOut();
        setTimeout(function() {
          showHowToModal('howto-2players-modal');
        }, 300);
        return false;
      });
      
      $('#vs-modal a[href="index.html?mode=vs&players=3"]').on('click.howto', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('VS modal 3-player clicked');
        $('#vs-modal').fadeOut();
        setTimeout(function() {
          showHowToModal('howto-3players-modal');
        }, 300);
        return false;
      });
      
      $('#vs-modal a[href="index.html?mode=vs&players=4"]').on('click.howto', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('VS modal 4-player clicked');
        $('#vs-modal').fadeOut();
        setTimeout(function() {
          showHowToModal('howto-4players-modal');
        }, 300);
        return false;
      });
      
      $('#vs-modal a[href="index.html?mode=vs&players=5"]').on('click.howto', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('VS modal 5-player clicked');
        $('#vs-modal').fadeOut();
        setTimeout(function() {
          showHowToModal('howto-5players-modal');
        }, 300);
        return false;
      });
        console.log('VS modal handlers attached');
    }, 100);
  }
  
  // Additional ultra-aggressive approach: capture clicks on modal-option elements using pure DOM events
  document.addEventListener('click', function(e) {
    // Check if we're clicking on a VS modal option
    const target = e.target;
    const modalOption = target.closest('.modal-option');
    const vsModal = target.closest('#vs-modal');
    
    if (modalOption && vsModal && modalOption.getAttribute('href')) {
      const href = modalOption.getAttribute('href');
      if (href.includes('mode=vs&players=')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('Ultra-aggressive handler caught VS mode click:', href);
        
        // Extract player count
        const playersMatch = href.match(/players=(\d+)/);
        if (playersMatch) {
          const players = playersMatch[1];
          
          // Close the VS modal first
          $('#vs-modal').fadeOut();
          
          // Show the appropriate how-to modal
          setTimeout(function() {
            showHowToModal(`howto-${players}players-modal`);
          }, 300);
        }
        
        return false;
      }
    }
  }, true); // Use capture phase to catch events before other handlers
  
  // Additional event delegation to catch any clicks that might be missed
  $(document).on('click', 'a[href="index.html?mode=solo"]', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    console.log('Document delegated solo play clicked - showing modal');
    showHowToModal('howto-solo-modal');
    
    return false;
  });
  
  $(document).on('click', '.game-option.solo', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    console.log('Document delegated solo option clicked - showing modal');
    showHowToModal('howto-solo-modal');
    
    return false;
  });
  
  // Close modal when clicking X only
  $('.howto-close').off().on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const modalId = $(this).data('modal');
    hideHowToModal(modalId);
    
    return false;
  });
  
  // DISABLE clicking outside to close modal
  $('.howto-modal').off('click');
  
  // Handle "I Understand" button clicks - ONLY way to close and proceed
  $('.howto-understand-btn').off().on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const modalId = $(this).data('modal');
    const mode = $(this).data('mode');
    const players = $(this).data('players');
    
    console.log('I Understand clicked for:', mode);
    
    // Add loading state to button
    $(this).addClass('loading').text('Starting Game...');
    
    // Hide the modal and redirect after a delay
    setTimeout(function() {
      hideHowToModal(modalId);
      
      // Redirect after hiding the modal
      setTimeout(function() {
        if (mode === 'solo') {
          window.location.href = 'index.html?mode=solo';
        } else if (mode === 'vs') {
          window.location.href = `index.html?mode=vs&players=${players}`;
        }
      }, 300);
    }, 500);
    
    return false;
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
  $(document).on('DOMSubtreeModified', 'body', function() {
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
    }  });
  
});