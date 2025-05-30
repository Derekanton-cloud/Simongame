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
var currentPlayer = 1;  // For VS mode: 1 or 2
var player1Score = 0;
var player2Score = 0;

// Variables for high score reset feature
var highScoreClicks = 0;
var highScoreClickTimer = null;

// Load the high score from localStorage when the page loads
$(document).ready(function() {
  // Get the game mode from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  gameMode = urlParams.get('mode') || 'solo';
  
  // Update UI based on game mode
  if (gameMode === 'vs') {
    $("#level-title").text("VS Mode: Player 1's Turn");
    // Create player score displays if in VS mode
    $(".game-header").append('<div id="player-scores"><div id="p1-score">P1: 0</div><div id="p2-score">P2: 0</div></div>');
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
  
  $("#level-title").text("Level " + level);
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
  
  if (started && !touchEnabled) {
    if (event.type === "touchstart") {
      touchEnabled = true;
      setTimeout(function() {
        touchEnabled = false;
      }, 300);
    }
    
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
  
    playSound(userChosenColour);
    animatePress(userChosenColour);
  
    checkAnswer(userClickedPattern.length - 1);
  }
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      // Handle different behaviors based on game mode
      if (gameMode === 'solo') {
        setTimeout(function () {
          nextSequence();
        }, 1500); // Increased delay to make the game more accessible
      } else if (gameMode === 'vs') {
        // VS Mode: Update score for current player and switch players
        if (currentPlayer === 1) {
          player1Score = level;
          updatePlayerScores();
          currentPlayer = 2;
          $("#level-title").text("Great! Player 2's Turn");
        } else {
          player2Score = level;
          updatePlayerScores();
          currentPlayer = 1;
          $("#level-title").text("Great! Player 1's Turn");
        }
        
        // Show who has the better score after both players have played
        if (player1Score > 0 && player2Score > 0) {
          if (player1Score > player2Score) {
            $("#level-title").html("Player 1 leads: " + player1Score + "-" + player2Score + "<br>Player " + currentPlayer + "'s Turn");
          } else if (player2Score > player1Score) {
            $("#level-title").html("Player 2 leads: " + player2Score + "-" + player1Score + "<br>Player " + currentPlayer + "'s Turn");
          } else {
            $("#level-title").html("Tied: " + player1Score + "-" + player2Score + "<br>Player " + currentPlayer + "'s Turn");
          }
        }
        
        setTimeout(function () {
          startNextVsRound();
        }, 2000);
      }
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    
    if (gameMode === 'solo') {
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
    } else if (gameMode === 'vs') {
      // For VS mode, record the score and switch players
      if (currentPlayer === 1) {
        player1Score = level - 1; // Last successful level
        updatePlayerScores();
        currentPlayer = 2;
        setTimeout(function() {
          $("#level-title").text("Player 1 scored " + player1Score + ". Player 2's Turn");
          $("body").removeClass("game-over");
          setTimeout(function() {
            startNextVsRound();
          }, 1500);
        }, 1000);
      } else {
        player2Score = level - 1; // Last successful level
        updatePlayerScores();
        
        // Determine the winner
        let resultMessage = "";
        if (player1Score > player2Score) {
          resultMessage = "Player 1 wins: " + player1Score + "-" + player2Score + "!";
        } else if (player2Score > player1Score) {
          resultMessage = "Player 2 wins: " + player2Score + "-" + player1Score + "!";
        } else {
          resultMessage = "It's a tie: " + player1Score + "-" + player2Score + "!";
        }
        
        $("#level-title").text(resultMessage + " Click to Play Again");
        setTimeout(function() {
          $("body").removeClass("game-over");
        }, 200);
        
        // Reset for a new game
        startOver();
      }
    } else {
      startOver(); // Default behavior
    }
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Flash only the newest color in the sequence
  $("#" + randomChosenColour).addClass("flash");
  playSound(randomChosenColour);
  
  setTimeout(function() {
    $("#" + randomChosenColour).removeClass("flash");
  }, 500); // Increased to 500ms for better visibility
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
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
  waitingForRestart = true; // Add a flag to indicate we're waiting for user click to restart
  console.log("Game over - waiting for user click to restart");
  
  // If in VS mode, reset player-specific variables
  if (gameMode === 'vs') {
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    updatePlayerScores();
  }
}

// Function to update player scores in VS mode
function updatePlayerScores() {
  if (gameMode === 'vs') {
    $("#p1-score").text("P1: " + player1Score);
    $("#p2-score").text("P2: " + player2Score);
    
    // Highlight current player
    if (currentPlayer === 1) {
      $("#p1-score").addClass("active-player");
      $("#p2-score").removeClass("active-player");
    } else {
      $("#p2-score").addClass("active-player");
      $("#p1-score").removeClass("active-player");
    }
  }
}

// Start a new round in VS mode
function startNextVsRound() {
  userClickedPattern = [];
  gamePattern = [];
  level = 0;
  started = true;
  waitingForRestart = false;
  $("#level-title").text("Player " + currentPlayer + "'s Turn");
  updatePlayerScores();
  nextSequence();
}

