// Rush Hour in the Sky
// Dorsa Zare

"use strict";


// Global Variables
let state = `loading`; // Program state: loading, title, running
let video; // User's webcam
let modelName = `Handpose`; // Name of the model
let handpose; // Handpose object
let predictions = []; // Predictions made by Handpose

// Images
let cloudImg;
let birdImg;
let balloonImg;
let airplaneImg;
let ufoImg;

// Cloud
let cloud;

// Bird
let bird = {
  tip: { x: undefined, y: undefined },
  head: { x: undefined, y: undefined },
  alive: true
};

// Balloon
let balloon = {
  x: undefined,
  y: undefined,
  size: 170,
  vx: 0, // No horizontal movement
  vy: -6 // Move upward
};

// Plane
let airplane = {
  x: 0, // Starting position
  y: 0,
  size: 160,
  speed: 6 // Speed of the airplane
};

// UFO
let ufo = {
  x: 0, // Starting position
  y: 0,
  size: 120,
  speed: 7 // Speed of the ufo
};

let titleState;
let endingState;

let startTime; // Variable to store the start time
const gameDuration = 40000; // 40 seconds in milliseconds



// Preload function to load images
function preload() {
  cloudImg = loadImage('assets/images/cloud.png');
  birdImg = loadImage('assets/images/bird.png');
  balloonImg = loadImage('assets/images/balloon.png');
  airplaneImg = loadImage('assets/images/plane.png');
  ufoImg = loadImage('assets/images/ufo.png');
}

// Setup function
function setup() {
  createCanvas(700, 500);
  video = createCapture(VIDEO); // Start webcam
  video.hide(); // Hide the video element

  // Initialize Handpose model
  handpose = ml5.handpose(video, { flipHorizontal: true }, () => {
    state = `title`; // Switch to title state when model loads
  });

  handpose.on(`predict`, results => {
    predictions = results; // Store predictions when they occur
  });

  resetAirplane(); // Create airplane
  resetCloud(); // Create cloud
  resetBalloon(); // Create balloon

  titleState = new TitleState(); // Instantiate the TitleState class
  endingState = new EndingState(); // Instantiate the EndingState class
}


// Draw function
function draw() {
  if (state === `loading`) {
    loading(); // Display loading screen
  } else if (state === `title`) {
    titleState.display(); // Display the title screen using the TitleState class
  } else if (state === `running`) {
    running(); // Run the program
  } else if (state === `ending`) {
    endingState.display(); // Display the ending screen using the endingstate class
  }
}


// Loading screen function
function loading() {
  background(158, 206, 232); // Set background color
  push();
  textSize(32);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(`Loading ${modelName}...`, width / 2, height / 2);
  pop();
}


// Main program function
function running() {
  // Set the start time when the game starts
  startTime = startTime || millis();
  state = 'running'; // Ensure that the state is set to running

  background(158, 206, 232); // Set background color
  // Check for collisions
  checkCollisions();
  // Display bird
  if (bird.alive) {
    // Check for hand predictions
    if (predictions.length > 0) {
      updateBird(predictions[0]); // Update bird position based on hand pose
    }
    // Display bird
    displayBird();
  } else {
    gameOver();
  }

  // Check if 2 seconds have passed since the game started
  if (millis() - startTime >= 2000) {
    // Once 2 seconds have passed, start displaying and moving the obstacles
    // move and display Airplane
    moveAirplane();
    displayAirplane();
    // Move and display cloud
    moveCloud();
    displayCloud();
    // Move and display balloon
    moveBalloon();
    displayBalloon();
    // Move and display UFO
    moveUFO();
    displayUFO();

    // Check if the game duration has passed and the bird is alive
    if (millis() - startTime >= gameDuration && bird.alive) {
      state = `ending`; // Transition to ending state
    }
  }
}


// Function to update bird position based on hand prediction
function updateBird(prediction) {
  bird.tip.x = prediction.annotations.indexFinger[3][0];
  bird.tip.y = prediction.annotations.indexFinger[3][1];
  bird.head.x = prediction.annotations.indexFinger[0][0];
  bird.head.y = prediction.annotations.indexFinger[0][1];
}

// Function to reset cloud position
function resetCloud() {
  cloud = {
    x: width,
    y: random(height),
    size: 120,
    vx: -6,
    vy: 0
  };
}

// Function to reset airplane position
function resetAirplane() {
  airplane.x = 0;
  airplane.y = height;
}

// Function to move airplane
function moveAirplane() {
  airplane.x += airplane.speed;
  airplane.y -= airplane.speed;
  // Reset cloud if it moves off screen
  if (airplane.x > width && airplane.y < 0) {
    resetAirplane();
  }
}

// Function to isplay airplane
function displayAirplane() {
  image(airplaneImg, airplane.x, airplane.y, airplane.size, airplane.size);
}


// Function to move cloud
function moveCloud() {
  cloud.x += cloud.vx;
  cloud.y += cloud.vy;

  // Reset cloud if it moves off screen
  if (cloud.x + cloud.size / 2 < 0) {
    resetCloud();
  }
}

// Function to display cloud
function displayCloud() {
  image(cloudImg, cloud.x - cloud.size / 2, cloud.y - cloud.size / 2, cloud.size, cloud.size);
}

// Function to display bird
function displayBird() {
  push();
  imageMode(CENTER);
  image(birdImg, bird.tip.x, bird.tip.y, 100, 100);
  pop();
}

// Function to reset balloon position
function resetBalloon() {
  balloon.x = random(width);
  balloon.y = height;
}

// Function to move balloon
function moveBalloon() {
  balloon.y += balloon.vy;

  // Reset balloon if it reaches top of screen
  if (balloon.y < -balloon.size / 2) {
    resetBalloon();
  }
}

// Function to display balloon
function displayBalloon() {
  image(balloonImg, balloon.x - balloon.size / 2, balloon.y - balloon.size / 2, balloon.size, balloon.size);
}

// Function to reset airplane's position
function resetAirplane() {
  airplane.x = constrain(random(-100, 400), 0, width - airplane.size); // Random X position constrained between 0 and 300
  airplane.y = height;
}

// Function to reset UFO position
function resetUFO() {
  ufo.x = width;
  ufo.y = random(height);
}

// Function to move UFO diagonally across the canvas
function moveUFO() {
  // Move UFO diagonally
  ufo.x += ufo.speed;
  ufo.y += ufo.speed;

  // Check if UFO reaches the opposite corner of the canvas
  if (ufo.x > width && ufo.y > height) {
    // Reset UFO position to start from (0, 0)
    ufo.x = 0;
    ufo.y = 0;
  }
}


// Function to display UFO
function displayUFO() {
  image(ufoImg, ufo.x - ufo.size / 2, ufo.y - ufo.size / 2, ufo.size, ufo.size);
}

// Function to check for collisions with cloud, balloon, and airplane
function checkCollisions() {
  // Check for collision with cloud
  let dCloud = dist(bird.tip.x, bird.tip.y, cloud.x, cloud.y);
  if (dCloud < cloud.size / 2) {
    bird.alive = false; // Set bird to not alive if it collides with cloud
    console.log("Bird collided with cloud!");
  }

  // Check for collision with balloon
  let dBalloon = dist(bird.tip.x, bird.tip.y, balloon.x, balloon.y);
  if (dBalloon < balloon.size / 2) {
    bird.alive = false; // Set bird to not alive if it collides with balloon
    console.log("Bird collided with balloon!");
  }

  // Check for collision with airplane
  let dAirplane = dist(bird.tip.x, bird.tip.y, airplane.x, airplane.y);
  if (dAirplane < airplane.size / 8) {
    bird.alive = false; // Set bird to not alive if it collides with airplane
    console.log("Bird collided with airplane!");
  }

  // Check for collision with UFO
  let dUFO = dist(bird.tip.x, bird.tip.y, ufo.x, ufo.y);
  if (dUFO < ufo.size / 2) {
    bird.alive = false; // Set bird to not alive if it collides with UFO
    console.log("Bird collided with UFO!");
  }
}

function gameOver() {
  push(); // Save the current drawing state
  translate(bird.tip.x, bird.tip.y); // Move the origin to the bird's position
  rotate(PI); // Rotate the bird by 180 degrees. Reference: https://p5js.org/reference/#/p5/rotate
  imageMode(CENTER);
  image(birdImg, 0, 0, 100, 100); // Display the rotated bird image
  pop(); // Restore the previous drawing state
  bird.tip.y += 5; // Move bird down if not alive

  // Display "Game Over" text if bird falls off screen
  if (bird.tip.y > height) {
    push();
    textSize(64);
    fill(255, 50, 50);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    pop();
  }
}

// Mouse pressed function
function mousePressed() {
  if (state === `title`) {
    state = `running`; // Transition to running state when mouse is pressed on the title screen
  }
}