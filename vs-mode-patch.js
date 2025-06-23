// VS Mode Patch for text visibility
// This script adds enhanced text rendering for better visibility in VS Mode

$(document).ready(function() {
  // Check if we're in VS mode
  const urlParams = new URLSearchParams(window.location.search);
  const gameMode = urlParams.get('mode') || 'solo';
  const playerCount = urlParams.get('players') || '2';
  
  if (gameMode === 'vs') {
    // Add player count as data attribute
    $('body').attr('data-players', playerCount);
    // Add special class to enhance text visibility
    setTimeout(function() {      // Add additional container for better visibility      let subtitle = $("#level-title .vs-mode-subtitle");
      if (subtitle.length > 0) {
        subtitle.wrap("<div class='subtitle-container'></div>");
        // Removed custom styling to prevent conflicts with CSS files
      }
      
      // Enhance the VS mode title
      $("#level-title").addClass("enhanced-vs-title");
    }, 1000);
    
    // Enhance any VS mode subtitle text when it changes
    const originalHtml = $.fn.html;
    $.fn.html = function() {
      const result = originalHtml.apply(this, arguments);
      
      // Check if this is setting HTML and if it contains vs-mode-subtitle
      if (arguments.length > 0 && 
          typeof arguments[0] === 'string' && 
          arguments[0].includes('vs-mode-subtitle') &&
          this.is("#level-title")) {
        
        // Add a slight delay to ensure the DOM is updated
        setTimeout(() => {          let subtitle = $("#level-title .vs-mode-subtitle");
          if (subtitle.length > 0 && !subtitle.parent().hasClass('subtitle-container')) {
            subtitle.wrap("<div class='subtitle-container'></div>");
            // Removed custom styling to prevent conflicts with CSS files
          }
        }, 50);
      }
      
      return result;
    };
  }
});
