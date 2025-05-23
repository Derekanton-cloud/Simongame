var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var waitingForRestart = false; // Flag to indicate if we're waiting for user click to restart
var level = 0;
var highScore = 0;
var touchEnabled = false; // Track if touch is in progress to prevent double actions

// Variables for high score reset feature
var highScoreClicks = 0;
var highScoreClickTimer = null;

// Load the high score from localStorage when the page loads
$(document).ready(function() {
  if (localStorage.getItem("simonHighScore")) {
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
    $(document).on("touchstart", function() {
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
$(document).click(function() {
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
  event.stopPropagation();
  
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
      setTimeout(function () {
        nextSequence();
      }, 1500); // Increased delay to make the game more accessible
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
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

    startOver(); // This sets waitingForRestart = true
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
  waitingForRestart = true; // Add a flag to indicate we're waiting for user input to restart
}

