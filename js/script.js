// AI jam
// Dorsa Zare

"use strict";



// Global Variables
let state = `loading`; // Program state: loading, running
let video; // User's webcam
let modelName = `Handpose`; // Name of the model
let handpose; // Handpose object
let predictions = []; // Predictions made by Handpose

// Cloud
let cloud;

// Bird
let bird = {
  tip: { x: undefined, y: undefined },
  head: { x: undefined, y: undefined },
  alive: true
};

// Images
let cloudImg;
let birdImg;
let balloonImg;

// Balloon
let balloon = {
  x: undefined,
  y: undefined,
  size: 200,
  vx: 0, // No horizontal movement
  vy: -2 // Move upward
};


// Preload function to load images
function preload() {
  cloudImg = loadImage('assets/images/cloud.png');
  birdImg = loadImage('assets/images/bird.png');
  balloonImg = loadImage('assets/images/balloon.png');
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

  resetCloud(); // Create cloud
  resetBalloon(); // Create balloon
}

// Draw function
function draw() {
  if (state === `loading`) {
    loading(); // Display loading screen
  } else if (state === `title`) {
    title(); // Display title screen
  } else if (state === `running`) {
    running(); // Run the program
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

// Title screen function
function title() {
  background(158, 206, 232); // Set background color
  push();
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0); // Set text color to black
  text("Welcome to Handpose Bird", width / 2, height / 2 - 120);
  textSize(18);
  text("Use your index finger to control the bird and dodge obstacles in the sky.", width / 2, height / 2 + 40);
  text("Click anywhere to start", width / 2, height / 2 + 100);
  image(birdImg, width / 2 - 50, height / 2 - 100, 100, 100);
  pop();


}

// Main program function
function running() {
  background(158, 206, 232); // Set background color

  // Check if the bird is alive
  if (bird.alive) {
    // Check for hand predictions
    if (predictions.length > 0) {
      updateBird(predictions[0]); // Update bird position based on hand pose

      // Check for collision with cloud
      let d = dist(bird.tip.x, bird.tip.y, cloud.x, cloud.y);
      if (d < cloud.size / 2) {
        bird.alive = false; // Set bird to not alive if it collides with cloud
      }
    }
  } else {
    bird.tip.y += 5; // Move bird down if not alive

    // Display "Game Over" text if bird falls off screen
    if (bird.tip.y > height) {
      push();
      textSize(64);
      fill(255, 0, 0); // Red color
      textAlign(CENTER, CENTER);
      text("Game Over", width / 2, height / 2);
      pop();
    }
  }

  // Display bird
  displayBird();

  // Move and display cloud
  moveCloud();
  displayCloud();

  // Move and display balloon
  moveBalloon();
  displayBalloon();

  // Check for balloon collision
  checkBalloonCollision();
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
    size: 150,
    vx: -3,
    vy: 0
  };
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

// Function to check for balloon collision
function checkBalloonCollision() {
  let d = dist(bird.tip.x, bird.tip.y, balloon.x, balloon.y);
  if (d < balloon.size / 2) {
    bird.alive = false; // Set bird to not alive if it collides with balloon
  }
}

// Mouse pressed function
function mousePressed() {
  if (state === `title`) {
    state = `running`; // Transition to running state when mouse is pressed on the title screen
  }
}