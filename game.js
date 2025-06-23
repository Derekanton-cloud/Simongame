var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var waitingForRestart = false; // Flag to indicate if we're waiting for user click to restart
var level = 0;
var highScore = 0;
var touchEnabled = false; // Track if touch is in progress to prevent double actions

// Game mode variables
var gameMode = 'solo'; // Default mode
var currentPlayer = 1;  // For VS mode: starts with player 1
var activePlayers = [true, true, true, true, true, true]; // Active players in VS mode (index 0 not used)
var totalPlayers = 2;  // Default number of players for VS mode
var remainingPlayers = 0; // Count of players still in the game

// Variables for high score reset feature
var highScoreClicks = 0;
var highScoreClickTimer = null;

// Load the high score from localStorage when the page loads
$(document).ready(function() {
  // Get the game mode from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  gameMode = urlParams.get('mode') || 'solo';
  
  // Get number of players if in VS mode
  if (gameMode === 'vs') {
    const players = parseInt(urlParams.get('players')) || 2;
    totalPlayers = Math.min(Math.max(players, 2), 5); // Ensure between 2-5 players
    
    // Initialize all players as active
    for (let i = 1; i <= totalPlayers; i++) {
      activePlayers[i] = true;
    }
    remainingPlayers = totalPlayers;
    
    // Add loading class to body for transition effect
    $("body").addClass("vs-mode-loading");
    
    // Update UI based on game mode
    $("#level-title").text("Click On Screen To Start");
    
    // Hide high score container (only for solo play)
    $("#high-score-container").hide();
    
    // Add VS mode class to body
    $("body").addClass("vs-mode");
    
    // Add player count specific class for CSS targeting
    $("body").addClass(`players-${totalPlayers}`);
    
    // Create player status displays for VS mode with enhanced visibility
    let playerStatusHTML = '<div id="player-scores">';
    // Player color schemes for better visibility
    const playerColors = [
      "", // Not used (index 0)
      "rgb(255, 107, 107)", // Player 1 - Red
      "rgb(77, 171, 247)",  // Player 2 - Blue
      "rgb(255, 212, 59)",  // Player 3 - Yellow
      "rgb(56, 217, 169)",  // Player 4 - Green
      "rgb(204, 93, 232)"   // Player 5 - Purple
    ];
    
    for (let i = 1; i <= totalPlayers; i++) {
      playerStatusHTML += `<div id="p${i}-score" class="player-score${i === currentPlayer ? ' active-player' : ''}" 
        style="--player-color: ${playerColors[i]};">
        <strong>Player ${i}</strong>
      </div>`;
    }
    playerStatusHTML += '</div>';
    $(".game-header").append(playerStatusHTML);
    
    // Remove loading class after a delay to create smooth transition
    setTimeout(() => {
      $("body").removeClass("vs-mode-loading");
    }, 800);
    
    // Add VS mode styling to level title
    $("#level-title").addClass("vs-mode-title");
  } else {
    // Solo mode - apply same styling as VS mode
    $("body").addClass("vs-mode solo-mode");
    
    // Change title to SOLO PLAY
    $(".vs-main-title").text("SOLO PLAY");
    
    // Show high score container for solo mode
    $("#high-score-container").show();
    
    // Update UI for solo mode
    $("#level-title").text("Click On Screen To Start");
    $("#level-title").addClass("vs-mode-title");
  }
  
  // Load high score for solo mode
  if (gameMode === 'solo' && localStorage.getItem("simonHighScore")) {
    highScore = parseInt(localStorage.getItem("simonHighScore"));
    updateHighScoreDisplay();
  }
  
  // Add high score reset functionality (5 clicks within 3 seconds)
  $("#high-score-container").on("click", function() {
    highScoreClicks++;
    
    // Show visual feedback that the click was registered
    $(this).addClass("high-score-clicked");
    setTimeout(function() {
      $("#high-score-container").removeClass("high-score-clicked");
    }, 200);
    
    // Reset the timer each time
    clearTimeout(highScoreClickTimer);
    
    // Check if we've reached 5 clicks
    if (highScoreClicks === 5) {
      // Reset high score
      highScore = 0;
      localStorage.setItem("simonHighScore", 0);
      updateHighScoreDisplay();
      
      // Show reset animation and message
      $("#high-score-container").addClass("high-score-reset");
      $("#level-title").text("High Score Reset!");
      
      setTimeout(function() {
        $("#high-score-container").removeClass("high-score-reset");
        if (!started) {
          if (waitingForRestart) {
            $("#level-title").text("Game Over, Click Anywhere to Restart");
          } else {
            $("#level-title").text("Click On Screen To Start");
          }
        } else {
          $("#level-title").text("Level " + level);
        }
      }, 1500);
      
      // Reset counter
      highScoreClicks = 0;
    } else {
      // Set timer to reset clicks after 3 seconds
      highScoreClickTimer = setTimeout(function() {
        highScoreClicks = 0;
      }, 3000);
    }
  });
  
  // Fix for mobile viewport height issues
  function setMobileViewportHeight() {
    // Set the viewport height to match the actual visible area
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Call it initially and on resize
  setMobileViewportHeight();
  window.addEventListener('resize', setMobileViewportHeight);
  
  // Add specific handling for mobile devices
  if ('ontouchstart' in window) {
    // Add mobile class to body for specific mobile styling
    $("body").addClass("mobile-device");
    
    // Add touch handlers for mobile
    $(document).on("touchstart", function(event) {
      // Skip touches on buttons when in restart state
      if ($(event.target).closest('.btn').length && waitingForRestart) {
        return;
      }
      
      // Skip touches on the high score container
      if ($(event.target).closest('#high-score-container').length) {
        return;
      }
      
      if (!started && !touchEnabled) {
        touchEnabled = true;
        
        if (waitingForRestart) {
          // If we're waiting for a restart, reset the flag and start the game
          waitingForRestart = false;
          startGame();
        } else {
          // If this is the first game, just start normally
          startGame();
        }
        
        // Re-enable touch after a short delay
        setTimeout(function() {
          touchEnabled = false;
        }, 1000);
      }
    });
  }
  
  // Prevent scrolling when touching the game buttons on mobile
  $(".btn").on("touchmove", function(e) {
    e.preventDefault();
  });
  
  // Ensure touchend events are properly handled to prevent any lingering effects
  $(".btn").on("touchend touchcancel", function(e) {
    e.preventDefault();
    // Make sure any visual effects are properly cleaned up
    $(this).removeClass("pressed");
  });
  
  // Prevent pull-to-refresh on mobile
  $(document).on("touchmove", function(e) {
    if (started) {
      e.preventDefault();
    }
  });
});

function updateHighScoreDisplay() {
  $("#high-score").text(highScore);
  
  // Subtle pulse animation when the score changes
  if (!$("#high-score").hasClass("score-updated")) {
    $("#high-score").addClass("score-updated");
    setTimeout(function() {
      $("#high-score").removeClass("score-updated");
    }, 500);
  }
}

// Start game function for both click and touch
function startGame() {
  // Reset game state properly
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  
  // Add start game animation
  $(".container").addClass("game-start");
  setTimeout(function() {
    $(".container").removeClass("game-start");
  }, 800);
  
  if (gameMode === 'vs') {
    // Reset player statuses for a new game
    for (let i = 1; i <= totalPlayers; i++) {
      activePlayers[i] = true;
    }
    remainingPlayers = totalPlayers;
    currentPlayer = 1;
    
    // Clear any winner classes
    $("body").removeClass(function(index, className) {
      return (className.match(/(^|\s)winner-player\S+/g) || []).join(' ');
    });
    $(".container").removeClass("victory-glow");
    
    // Set up VS mode display with enhanced styling
    $("#level-title").html(`
      <div class="vs-mode-title">VS Mode</div>
    `);
    
    // Apply fade-in effect to title
    $("#level-title").css("opacity", "0").addClass("vs-mode-title");
    setTimeout(() => {
      $("#level-title").css({
        "opacity": "1",
        "transform": "translateY(0)"
      });
    }, 100);
    
    // Update player statuses and VS mode visuals
    updatePlayerStatuses();
    updateVsModeVisuals();
  } else {
    // Solo mode
    $("#level-title").text("Level " + level);
  }
  
  nextSequence();
  started = true;
  waitingForRestart = false; // Ensure the flag is reset when game starts
}

// Click handler for desktop
$(document).click(function(event) {
  // Skip clicks on buttons when in restart state - let them bubble up to document
  if ($(event.target).closest('.btn').length && waitingForRestart) {
    return;
  }
  
  // Skip clicks on the high score container
  if ($(event.target).closest('#high-score-container').length) {
    return;
  }
  
  if (!started) {
    if (waitingForRestart) {
      // If we're waiting for a restart, reset the flag and start the game
      waitingForRestart = false;
      startGame();
    } else {
      // If this is the first game, just start normally
      startGame();
    }
  }
});

// Modify button click handler to work well on mobile
$(".btn").on("mousedown touchstart", function(event) {
  // Only stop propagation if we're in active gameplay
  if (!waitingForRestart) {
    event.stopPropagation();
  }
  
  // Prevent default browser behavior which might cause outline/focus issues
  event.preventDefault();
  
  // If waiting for restart, let the click bubble up to document for restart handling
  if (waitingForRestart) {
    return;
  }
  
  // Always provide visual and audio feedback for button presses
  var userChosenColour = $(this).attr("id");
  
  // Always animate and play sound for user feedback
  playSound(userChosenColour);
  animatePress(userChosenColour);
  
  // Only process game logic if the game has started
  if (started && !touchEnabled) {
    if (event.type === "touchstart") {
      touchEnabled = true;
      setTimeout(function() {
        touchEnabled = false;
      }, 300);
    }
    
    userClickedPattern.push(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
  }
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    // Correct button clicked
    if (userClickedPattern.length === gamePattern.length) {
      // Sequence completed successfully
      
      if (gameMode === 'solo') {
        // Solo mode - add a new color to pattern
        setTimeout(function () {
          nextSequence();
        }, 1500); // Increased delay to make the game more accessible
      } 
      else if (gameMode === 'vs') {
        // VS Mode - current player succeeded, now move to next player
        // Find next active player
        let nextPlayer = findNextActivePlayer(currentPlayer);
        
        if (nextPlayer === currentPlayer) {
          // If we've gone full circle back to same player, it means they're the only one left
          // Declare them the winner
          declareVsModeWinner([currentPlayer]);
          return;
        }
        
        // Move to next player and add a new color for them
        setTimeout(function() {
          // No success message display
          
          currentPlayer = nextPlayer;
          updatePlayerStatuses();
          updateVsModeVisuals();
          
          // Clear current player's pattern
          userClickedPattern = [];
          
          // Add new color for the next player's turn
          setTimeout(function() {
            addNewColorForCurrentPlayer();
          }, 1500);
        }, 1000);
      }
    }
  } else {
    // Wrong button clicked
    playSound("wrong");
    $("body").addClass("game-over");
    
    if (gameMode === 'solo') {
      // Solo mode game over
      $("#level-title").text("Game Over, Click Anywhere to Restart");
      
      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);

      // Check if current level is a new high score
      if (level > highScore) {
        highScore = level;
        localStorage.setItem("simonHighScore", highScore);
        
        // Animate high score container
        $("#high-score-container").addClass("high-score-update");
        setTimeout(function() {
          $("#high-score-container").removeClass("high-score-update");
        }, 1500);
        
        updateHighScoreDisplay();
        
        // Show a message about the new high score
        setTimeout(function() {
          $("#level-title").text("New High Score: " + highScore + "! Click to Play Again");
        }, 1000);
      }
      
      startOver();
    } 
    else if (gameMode === 'vs') {
      // VS Mode - player made a mistake, eliminate them
      activePlayers[currentPlayer] = false;
      remainingPlayers--;
      
      // Update player display with enhanced styling
      $(`#p${currentPlayer}-score`).addClass("eliminated");
      $(`#p${currentPlayer}-score`).html(`<strong>Player ${currentPlayer}</strong> <span class="eliminated-text">(Eliminated)</span>`);
      
      // Add dramatic elimination effect
      $("body").addClass("player-eliminated");
      
      // No elimination message display
      
      // Check if only one player remains (the winner)
      if (remainingPlayers === 1) {
        // Find the last player standing
        let winner = 0;
        for (let i = 1; i <= totalPlayers; i++) {
          if (activePlayers[i]) {
            winner = i;
            break;
          }
        }
        
        // Enhanced winner announcement with delay
        setTimeout(function() {
          $("body").removeClass("player-eliminated game-over");
          declareVsModeWinner([winner]);
        }, 1500);
      } 
      else {
        // More than one player still in the game
        let nextPlayer = findNextActivePlayer(currentPlayer);
        
        setTimeout(function() {
          // No elimination message display
          $("body").removeClass("player-eliminated game-over");
          
          setTimeout(function() {
            currentPlayer = nextPlayer;
            updatePlayerStatuses();
            updateVsModeVisuals();
            
            // Reset for next player's turn
            userClickedPattern = [];
            
            // Add new color for the next player (they still get to add to sequence)
            addNewColorForCurrentPlayer();
          }, 1500);
        }, 1500);
      }
    }
  }
}

// Add a new color for the current player's turn in VS mode
function addNewColorForCurrentPlayer() {
  // Add a new random color to the sequence
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  level++;
  
  // No subtitle display - just flash the new color
  
  // Flash the new color
  $("#" + randomChosenColour).addClass("flash");
  playSound(randomChosenColour);
  
  setTimeout(function() {
    $("#" + randomChosenColour).removeClass("flash");
  }, 500);
}

function nextSequence() {
  userClickedPattern = [];
  
  // Different behavior based on game mode
  if (gameMode === 'vs') {
    // In VS mode, this function is only called for the very first turn
    level++;
    
    // Add first color for Player 1
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    
    // No subtitle display - just flash the color
    
    // Flash the first color
    $("#" + randomChosenColour).addClass("flash");
    playSound(randomChosenColour);
    
    setTimeout(function() {
      $("#" + randomChosenColour).removeClass("flash");
    }, 500);
  } else {
    // Solo mode - original logic
    level++;
    $("#level-title").text("Level " + level);
    
    // Add a new color to the sequence
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    // Solo mode - flash only the newest color
    $("#" + randomChosenColour).addClass("flash");
    playSound(randomChosenColour);
    
    setTimeout(function() {
      $("#" + randomChosenColour).removeClass("flash");
    }, 500);
  }
}


function animatePress(currentColor) {
  const $button = $("#" + currentColor);
  $button.addClass("pressed");
  
  // Add player-specific effects in VS mode
  if (gameMode === 'vs') {
    // Get player color
    const playerColor = getPlayerColor(currentPlayer);
    
    // Create a ripple effect with player color
    const $ripple = $("<div>").addClass("player-ripple");
    $ripple.css({
      "background-color": playerColor,
      "opacity": "0.7"
    });
    
    // Add ripple to button and animate it
    $button.append($ripple);
    $ripple.animate({
      width: "300px",
      height: "300px",
      opacity: "0"
    }, 400, function() {
      $(this).remove(); // Remove after animation completes
    });
  }
  
  setTimeout(function () {
    $button.removeClass("pressed");
  }, 300); // Increased to 300ms to match our new animation duration
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  waitingForRestart = true; // Flag to indicate we're waiting for user click to restart
  console.log("Game over - waiting for user click to restart");
  
  // If in VS mode, reset player-specific variables
  if (gameMode === 'vs') {
    // Reset all player statuses
    for (let i = 1; i <= totalPlayers; i++) {
      activePlayers[i] = true;
    }
    remainingPlayers = totalPlayers;
    currentPlayer = 1;
    
    // Reset the player displays
    $(".player-score").removeClass("eliminated active-player");
    
    // Reset VS mode visual indicators but maintain VS mode styling
    $(".player-indicator").removeClass("active");
    setTimeout(function() {
      $(".player-indicator").remove();
    }, 300);
  }
}

// Function to update player statuses in VS mode
function updatePlayerStatuses() {
  if (gameMode === 'vs') {
    // Update all player statuses
    for (let i = 1; i <= totalPlayers; i++) {
      // Skip updating if player is already marked as eliminated
      if ($("#p" + i + "-score").hasClass("eliminated")) {
        continue;
      }
      
      // Enhanced player status with better formatting
      let playerStatus = activePlayers[i] 
        ? `<strong>Player ${i}</strong>` 
        : `<strong>Player ${i}</strong> <span class="eliminated-text">(Eliminated)</span>`;
      $("#p" + i + "-score").html(playerStatus);
      
      // Update active class with enhanced animations
      if (i === currentPlayer && activePlayers[i]) {
        $("#p" + i + "-score").addClass("active-player");
        
        // Calculate CSS color variables based on player number
        const playerColor = getPlayerColor(i);
        $("#p" + i + "-score").css("--player-color", playerColor);
      } else {
        $("#p" + i + "-score").removeClass("active-player");
      }
      
      // Add eliminated class if player is out
      if (!activePlayers[i]) {
        $("#p" + i + "-score").addClass("eliminated");
      }
    }
  }
}

// Helper function to get player colors
function getPlayerColor(playerNumber) {
  const colors = [
    "rgb(255, 107, 107)", // P1: Red
    "rgb(77, 171, 247)",  // P2: Blue
    "rgb(255, 212, 59)",  // P3: Yellow
    "rgb(56, 217, 169)",  // P4: Green
    "rgb(204, 93, 232)"   // P5: Purple
  ];
  return colors[playerNumber - 1] || colors[0];
}

// Play the current sequence of colors for VS mode (NOT USED IN NEW VS MODE LOGIC)
// This function is kept for reference but VS mode now uses individual color display
function playCurrentSequence() {
  // Disable buttons during sequence playback
  $(".btn").css("pointer-events", "none");
  
  let i = 0;
  const interval = 800; // Time between color flashes
  
  // Play each color in sequence with delay
  function playNextInSequence() {
    if (i < gamePattern.length) {
      const color = gamePattern[i];
      
      // Flash button and play sound
      $("#" + color).addClass("flash");
      playSound(color);
      
      setTimeout(function() {
        $("#" + color).removeClass("flash");
        i++;
        
        // Wait before showing next color
        setTimeout(playNextInSequence, interval * 0.5);
      }, interval * 0.5);
    } else {
      // Enable buttons after sequence finishes
      $(".btn").css("pointer-events", "auto");
      
      // No UI update needed - players just start clicking
    }
  }
  
  // Start the sequence playback
  playNextInSequence();
}

// Find the next active player in VS mode
function findNextActivePlayer(currentPlayerNum) {
  let nextPlayer = currentPlayerNum;
  
  // Loop through players (max once through all players)
  for (let i = 0; i < totalPlayers; i++) {
    nextPlayer = (nextPlayer % totalPlayers) + 1; // Move to next player
    
    if (activePlayers[nextPlayer]) {
      return nextPlayer;
    }
  }
  
  // If we couldn't find another active player, return the current one
  return currentPlayerNum;
}

// Find the first active player
function findFirstActivePlayer() {
  for (let i = 1; i <= totalPlayers; i++) {
    if (activePlayers[i]) {
      return i;
    }
  }
  return 1; // Default to player 1 if none found (shouldn't happen)
}

// Declare winner(s) for VS mode
function declareVsModeWinner(winners) {
  // Create the final result message
  let resultMessage = "";
  if (winners.length === 1) {
    resultMessage = "Player " + winners[0] + " wins!";
    // Add winner class to body to style with winner's color
    $("body").addClass("winner-player" + winners[0]);
  } else {
    resultMessage = "Players " + winners.join(", ") + " tied!";
  }
  
  // Add special winner class to the container
  $(".container").addClass("victory-glow");
  
  // Display winner message with enhanced styling and better visibility
  $("#level-title").html(`<div class="vs-mode-title victory-title">Game Over!</div>
                         <div class="vs-mode-subtitle winner-message" style="font-size: 1.8rem !important; margin-top: 20px !important; color: gold !important; text-shadow: 0 0 15px rgba(255, 215, 0, 0.9) !important;">${resultMessage}</div>
                         <div class="vs-mode-subtitle" style="margin-top: 25px !important; font-size: 1.2rem !important;">Click to Play Again</div>`);
  
  // Style the winner's player score display
  winners.forEach(winner => {
    $(`#p${winner}-score`).addClass("winner-player");
  });
                         
  // Create victory celebration effect for winner(s)
  celebrateVsModeWinner(winners);
  
  // Reset the game-over effect
  setTimeout(function() {
    $("body").removeClass("game-over");
  }, 200);
  
  // Reset for a new game
  startOver();
}

// Function to update visual indicators for VS mode
function updateVsModeVisuals() {
  if (gameMode === 'vs') {
    // Add VS mode specific class to body
    $("body").addClass("vs-mode-active");
    
    // Update player turn classes
    $("body").removeClass("player1-turn player2-turn player3-turn player4-turn player5-turn");
    $("body").addClass(`player${currentPlayer}-turn`);
    
    // Add subtle pulse effect to container
    $(".container").addClass("vs-mode-pulse");
    setTimeout(() => {
      $(".container").removeClass("vs-mode-pulse");
    }, 600);
    
    // Update player score indicators to show current player
    for (let i = 1; i <= totalPlayers; i++) {
      if (i === currentPlayer) {
        $("#p" + i + "-score").addClass("active-player");
        $("#p" + i + "-score").css("--player-color", getPlayerColor(i));
      } else {
        $("#p" + i + "-score").removeClass("active-player");
      }
    }
  } else {
    // Remove VS mode specific classes
    $("body").removeClass("vs-mode-active player1-turn player2-turn player3-turn player4-turn player5-turn");
    $(".container").removeClass("vs-mode-pulse");
  }
}

// Function to create victory celebration effects
function celebrateVsModeWinner(winnerPlayers) {
  // Create confetti-like celebration
  const confettiColors = winnerPlayers.map(player => getPlayerColor(player));
  
  // Add gold color for winners
  confettiColors.push("gold", "#FEF2BF", "white");
  
  // Create confetti particles
  const $gameContainer = $("body");
  const gameRect = $gameContainer[0].getBoundingClientRect();
  
  // Create trophy animation in the center
  const $trophy = $("<div>").addClass("trophy-animation");
  $trophy.html('<svg viewBox="0 0 24 24"><path fill="gold" d="M18 5V2H6V5H4V6C4 8.77 6.23 11 9 11C9.83 11 10.58 10.71 11.21 10.21C11.76 11.5 12.8 12.5 14 12.92V15H10V17H14V20H8V22H16V20H10V17H14V15H10V12.92C11.2 12.5 12.24 11.5 12.79 10.21C13.42 10.71 14.17 11 15 11C17.77 11 20 8.77 20 6V5H18M6 6V5H8V6C8 7.82 6.82 9 5 9C5.46 7.77 5.46 7.23 6 6M18 6V5H16V6C16.54 7.23 16.54 7.77 17 9C18.82 9 20 7.82 20 6V5H18V6Z"/></svg>');
  $trophy.css({
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0)',
    width: '100px',
    height: '100px',
    zIndex: 1000,
    animation: 'trophy-appear 1.5s forwards'
  });
  $gameContainer.append($trophy);
  
  // Remove trophy after animation
  setTimeout(() => {
    $trophy.remove();
  }, 3000);
  
  // Create more particles for a richer effect
  for (let i = 0; i < 150; i++) {
    const $confetti = $("<div>").addClass("confetti");
    const size = Math.random() * 12 + 5;
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const delay = Math.random() * 3;
    const duration = Math.random() * 3 + 3;
    const startX = Math.random() * gameRect.width;
    
    $confetti.css({
      width: size + "px",
      height: size + "px",
      background: color,
      left: startX + "px",
      top: -20 + "px",
      opacity: Math.random() * 0.8 + 0.2,
      animation: `fall ${duration}s cubic-bezier(0.22, 1, 0.36, 1) forwards ${delay}s`,
      boxShadow: `0 0 ${size/2}px rgba(255, 255, 255, 0.5)`
    });
    
    // Create different shapes for more visual variety
    if (i % 7 === 0) {
      $confetti.css({
        borderRadius: "50%"
      });
    } else if (i % 7 === 1) {
      $confetti.css({
        transform: "rotate(45deg)",
        borderRadius: "3px"
      });
    } else if (i % 7 === 2) {
      $confetti.css({
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
      });
    } else if (i % 7 === 3) {
      $confetti.css({
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
      });
    } else if (i % 7 === 4) {
      $confetti.css({
        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
      });
      $confetti.text("+1");
      $confetti.css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: size / 2 + "px",
        fontWeight: "bold"
      });
    } else if (i % 7 === 5) {
      const starPlayer = winnerPlayers[Math.floor(Math.random() * winnerPlayers.length)];
      $confetti.text("P" + starPlayer);
      $confetti.css({
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        fontSize: size / 2 + "px",
        fontWeight: "bold"
      });
    }
    
    $gameContainer.append($confetti);
    
    // Remove confetti after animation ends to prevent memory leaks
    setTimeout(function() {
      $confetti.remove();
    }, (duration + delay + 1) * 1000);
  }
}

