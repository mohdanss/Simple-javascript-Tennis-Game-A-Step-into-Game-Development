// Declaring all the essential variables to be used
var canvas;
var canvasContext;

// this is basically the starting co-ordinates of the ballSet, when game is initilaized
var ballX = 50;
var ballY = 50;
// These variables help us to increase the speed of balls, PER FRAME
var ballSpeedX = 22;
var ballSpeedY = 13;

// To store the Score And attemps
var score = 0;
var lifeLeft = 3;

// Dsitanc of Paddles from top in canvas...
var paddle1Y = 250;
var paddle2Y = 250;

// Height of the Paddle
PADDLE_HEIGHT = 100;

// width of Paddle
const PADDLE_THICKNESS = 10;
// Distance of Paddle from the horizontal edge of canvas...
const PADDLE_DISTANCE_X = 5;

document.getElementById("lives").innerText = lifeLeft;

/* 
Whenever user select a level, one of these function is called,
Everythin is same, just we change the length of paddle and speed of ball to make levels work 
Then a function start is called, whic actually starts the game 
*/
function easy() {
  PADDLE_HEIGHT = 130;
  ballSpeedX = 25;
  ballSpeedY = 15;
  start();
}

function medium() {
  PADDLE_HEIGHT = 115;
  ballSpeedX = 35;
  ballSpeedY = 20;
  start();
}

function hard() {
  ballSpeedX = 50;
  ballSpeedY = 25;
  start();
}

//  ==================== Starting the Game,
function start() {
  // When Game starts we actually need to hide some Elements, according to need
  document.getElementById("level").style.display = "none";
  document.getElementById("header").style.display = "inline-block";
  document.getElementById("gameCanvas").style.border = "2px solid white";

  // Accessing the canvas element from html
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  // a variable to put smoothness in movement of balls, paddle etc...
  var fps = 30;

  // Endgame Func is called in interval of 30 (fps) times per second...
  setInterval(function () {
    endGame();
  }, 1000 / fps);

  // to control the mouse movement un the game, for PADDLE
  canvas.addEventListener("mousemove", function (event) {
    var mousePos = calcMousePosition(event);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
}

// This function checks for few things and decides whether to exit the Game or not, 
function endGame() {

// If attemps become zero, it will stop the game 
  if (lifeLeft == 0) {
    // this will draw a rectangle to show the "Game Over!" message and scores
    drawRect(canvas.width / 2 - 300, canvas.height / 2 - 100, 600, 200, "black");
    drawText();

    // This is html element (play again), this we make visible only when game ends,
    document.getElementById("linkPlayAgain").style.display = "block";
  } 
  // if attemps are availabe, then keep on the game 
  else {
    //as the name shows, each movement is carried through this function
    moveEverything();

    //as the name shows, each Element is Drawn through this function
    drawEverything();
  }
}


// ============= This function helpls us in Drawing text on canvas
function drawText() {
  canvasContext.font = "80px Montserrat";
  canvasContext.fillStyle = "white";
  canvasContext.fillText( "Game Over!", canvas.width / 2 - 235, canvas.height / 2);
  
  canvasContext.font = "40px Oswald";
  canvasContext.fillStyle = "red";
  canvasContext.fillText( "Your Score ", canvas.width / 2 - 110, canvas.height / 2 + 70 );
  canvasContext.fillStyle = "white";
  canvasContext.fillText(score, canvas.width / 2 + 70, canvas.height / 2 + 70);
}


// ============= This function helpls us in movements on canvas
function moveEverything() {
  // each time this function is called, ball's coordinates will be incremented.... 
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

// If ball is near to right side of canvas, then, to make it move back, 
// we need to make the above increment to opposite, for opposite movement
  if (ballX >= canvas.width - 40) {
    ballSpeedX = -ballSpeedX;
  }
  
/*
Similarly, If ball is near to LEFT side of canvas, then, 
We not only have to move it back, but to also check if it hits the paddle then 
move it back, and increase the score, and if it is missed, then make decrement 
in the attemps availabe.
*/ 
  if (ballX <= 14) {

    // if it hits the paddle 
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {

      // to move the ball back
      ballSpeedX = -ballSpeedX;

      // to update the score... 
      score = score + 10;
      document.getElementById("score").innerHTML = score;
    } 
    // if a ball is missed 
    else {

      // decrement in the attemps available..
      lifeLeft = lifeLeft - 1;
      document.getElementById("lives").innerHTML = lifeLeft;

      // Ball set, this will set a ball to a new position,
      // It will set the initial position of ball in the center of canvas...
      ballSet();
    }
  }

  // To make our AI : The Right Paddle work on its own 
  // if ball reaches in the middle (toward RIGHT side), 
  // Our AI paddle will move wherever the ball goes
  if (ballX >= canvas.width / 2) {
    // to make the ball hit on center of paddle
    paddle2Y = ballY - PADDLE_HEIGHT / 2;
  }

  // To control the vertical movement of the ball, whenever ball is near
  // the vertical edged it will force it to bounce back
  if (ballY >= canvas.height || ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }
}


// ==================== This function will draw, Canvas, Paddles, Balls and Scoreboard...
function drawEverything() {

  // Lets Selection, how things are dran on canas
  // first Two Numbers Represent the starting point of any canvas element
  // Like here we're using 0 , 0 Which means most top left startting point of canvas  
  
  // Next Two Numbers (height, width) Represents the Ending point of any canvas element
  // Like here we're using canvas.width, canvas.height Which means draw upto the extreme
  // of the canvas, 

  // Main canvas Element, Our tennis board (green color)
  drawRect(0, 0, canvas.width, canvas.height, "darkgreen");
  
  // Paddle Left
  drawRect(PADDLE_DISTANCE_X, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
  
  // Paddle Right
  drawRect(
    canvas.width - (PADDLE_DISTANCE_X + PADDLE_THICKNESS + 10),
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "yellow"
  );

  // The 'cenered line of small rectangles' We used loops(to make it handy), 
  // from Top edge to Bottom edge, (of canvas) and horizontally centered
  for (let index = 0; index < canvas.height; index += 30) {
    drawRect(canvas.width / 2 - 10, index + 3.5, 7, 20, "white");
  }
  // drawing the ball, 
  // First two numbers represent Initial Co-ordinates of object, from top left corner of canvas 
  // Then 3rs (10) is radius of ballSet
  drawCircle(ballX, ballY, 10, "white");
}


//  ==================== Function to draw rectangle
function drawRect(leftX, topY, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}



// ==================== Function to draw Circle
function drawCircle(centerX, centerY, redius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, redius, 0, Math.PI * 2, true);
  canvasContext.fill();
}


// ==================== Mouse Movement Control
function calcMousePosition(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = event.clientX - rect.left - root.scrollLeft;
  var mouseY = event.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

// Ball Set, after each times, use loses a point of paddle misses the ball
function ballSet() {
  ballSpeedX = -ballSpeedX;

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}


// Code By Anc