
var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
var highScore = 0;

// Load the high score from localStorage when the page loads
$(document).ready(function() {
  if (localStorage.getItem("simonHighScore")) {
    highScore = parseInt(localStorage.getItem("simonHighScore"));
    updateHighScoreDisplay();
  }
});

function updateHighScoreDisplay() {
  $("#high-score").text(highScore);
}

$(document).click(function() {
  if (!started) {
    // Add start game animation
    $(".container").addClass("game-start");
    setTimeout(function() {
      $(".container").removeClass("game-start");
    }, 800);
    
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

$(".btn").click(function(event) {
  event.stopPropagation(); 

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
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
        $("#level-title").text("New High Score: " + highScore + "!");
      }, 1000);
    }

    startOver();
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
  }, 400);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 200);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

