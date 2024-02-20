// AI jam
// Dorsa Zare

"use strict";

// Current state of program
let state = `loading`; // loading, running
// User's webcam
let video;
// The name of our model
let modelName = `Handpose`;
// Handpose object (using the name of the model for clarity)
let handpose;
// The current set of predictions made by Handpose once it's running
let predictions = [];

// The cloud 
let cloud;

// The bird
let bird = {
  tip: {
    x: undefined,
    y: undefined
  },
  head: {
    x: undefined,
    y: undefined
  },
  alive: true
};


// Variable to hold the cloud image
let cloudImg;
// Variable to hold the cloud image
let birdImg;

function preload() {
  // Load the cloud image
  cloudImg = loadImage('assets/images/cloud.png');
  birdImg = loadImage('assets/images/bird.png');
}

function setup() {
  createCanvas(700, 500);

  // Start webcam and hide the resulting HTML element
  video = createCapture(VIDEO);
  video.hide();

  // Start the Handpose model and switch to our running state when it loads
  handpose = ml5.handpose(video, {
    flipHorizontal: true
  }, function () {
    // Switch to the running state
    state = `running`;
  });

  // Listen for prediction events from Handpose and store the results in our
  // predictions array when they occur
  handpose.on(`predict`, function (results) {
    predictions = results;
  });

  // Create our basic cloud
  resetCloud();
}

function draw() {
  if (state === `loading`) {
    loading();
  }
  else if (state === `running`) {
    running();
  }
}

function loading() {
  push();
  textSize(32);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(`Loading ${modelName}...`, width / 2, height / 2);
  pop();
}

function running() {
  // Use these lines to see the video feed
  // const flippedVideo = ml5.flipImage(video);
  // image(flippedVideo, 0, 0, width, height);

  background(158, 206, 232);

  if (bird.alive) {
    // Check if there currently predictions to display
    if (predictions.length > 0) {
      // If yes, then get the positions of the tip and base of the index finger
      updateBird(predictions[0]);

      // Check if the tip of the "bird" is touching the cloud
      let d = dist(bird.tip.x, bird.tip.y, cloud.x, cloud.y);
      if (d < cloud.size / 2) {
        bird.alive = false;
        console.log("Bird collided with the cloud!");
      }
    } 
  } else {
    bird.tip.y += 5;
    bird.head.y += 7;
  }

 // Display the current position of the bird
 displayBird();

  // Handle the cloud's movement and display (independent of hand detection
  // so it doesn't need to be inside the predictions check)
  moveCloud();
  checkOutOfBounds();
  displayCloud();
}


/**
Updates the position of the bird according to the latest prediction
*/
function updateBird(prediction) {
  bird.tip.x = prediction.annotations.indexFinger[3][0];
  bird.tip.y = prediction.annotations.indexFinger[3][1];
  bird.head.x = prediction.annotations.indexFinger[0][0];
  bird.head.y = prediction.annotations.indexFinger[0][1];
}

/**
Resets the cloud 
*/
function resetCloud() {
  cloud = {
    x: width,
    y: random(height),
    size: 150,
    vx: -3, // Move from right to left
    vy: 0
  };
}

/**
Moves the cloud according to its velocity
*/
function moveCloud() {
  cloud.x += cloud.vx;
  cloud.y += cloud.vy;
}

/**
Resets the cloud if it moves off the left side of the canvas
*/
function checkOutOfBounds() {
  if (cloud.x + cloud.size / 2 < 0) {
    resetCloud();
  }
}

/**
Displays the cloud as a cloud
*/
function displayCloud() {
  // Draw the cloud image at the cloud's position
  image(cloudImg, cloud.x - cloud.size / 2, cloud.y - cloud.size / 2, cloud.size, cloud.size);
}

/**
Displays the bird based on the finger tip coordinates. 
*/
function displayBird() {
  // Draw bird
  push();
  // Center the bird image at the tip of the finger
  imageMode(CENTER);
  image(birdImg, bird.tip.x, bird.tip.y, 100, 100);
  pop();
}
