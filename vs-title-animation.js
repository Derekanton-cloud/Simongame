// Enhanced VS Mode headers with professional styling
$(document).ready(function() {
  // Check if we're in VS mode
  const urlParams = new URLSearchParams(window.location.search);
  const gameMode = urlParams.get('mode') || 'solo';
  const playerCount = urlParams.get('players') || '2';
  
  if (gameMode === 'vs') {
    // Create a container for the VS MODE header
    setTimeout(function() {
      // Structure the title with proper alignment
      $("#level-title").css({
        "position": "relative",
        "text-align": "center",
        "width": "100%",
        "margin-bottom": "30px"
      });
      
      // Ensure subtitle is properly styled and positioned
      $(".vs-mode-subtitle").css({
        "font-family": "'Press Start 2P', cursive",
        "display": "block",
        "margin": "15px auto 0",
        "text-align": "center",
        "position": "relative",
        "z-index": "10",
        "width": "auto",
        "text-transform": "uppercase",
        "color": "#FFDF00",
        "text-shadow": "2px 2px 0 #000000, -2px 2px 0 #000000, 2px -2px 0 #000000, -2px -2px 0 #000000"
      });
      
      // Add animated entrance for better UX
      $("#level-title").addClass("animated-entrance");
      
      // Animate the subtitle with slight delay for a professional effect
      setTimeout(function() {
        $(".vs-mode-subtitle").addClass("animated-entrance");
      }, 300);
      
      // Remove any conflicting elements or styles
      $(".subtitle-container").css({
        "background": "none",
        "border": "none",
        "box-shadow": "none",
        "display": "block",
        "width": "100%",
        "text-align": "center"
      });

      // Force correct DOM structure
      if ($(".vs-mode-subtitle").parent().is("#level-title")) {
        $(".vs-mode-subtitle").detach().appendTo("#level-title");
      }
    }, 200);
  }
});
