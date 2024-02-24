// AI jam
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
  size: 200,
  vx: 0, // No horizontal movement
  vy: -2 // Move upward
};

// Plane
let airplane = {
  x: 0, // Starting position
  y: 0,
  size: 200,
  speed: 10 // Speed of the airplane
};

let titleState;
let endingState;

let startTime; // Variable to store the start time
const gameDuration = 50000; // 50 seconds in milliseconds


// Preload function to load images
function preload() {
  cloudImg = loadImage('assets/images/cloud.png');
  birdImg = loadImage('assets/images/bird.png');
  balloonImg = loadImage('assets/images/balloon.png');
  airplaneImg = loadImage('assets/images/plane.png');
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

  // Initialize airplane's starting position
  airplane.x = 0;
  airplane.y = height;

  resetCloud(); // Create cloud
  resetBalloon(); // Create balloon

  titleState = new TitleState(); // Instantiate the TitleState class
  endingState = new EndingState(); // Instantiate the EndingState class

  // Check if the timer has started
  if (!startTime) {
    startTime = millis(); // Start the timer
  }
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
  background(158, 206, 232); // Set background color

  // Update airplane's position
  airplane.x += airplane.speed;
  airplane.y -= airplane.speed;

  // Check if airplane reaches the opposite corner
  if (airplane.x > width && airplane.y < 0) {
    resetAirplane(); // Reset airplane's position
  }

  // Display airplane
  image(airplaneImg, airplane.x, airplane.y, airplane.size, airplane.size);


  // Check if the bird is alive
  if (bird.alive) {
    // Check for hand predictions
    if (predictions.length > 0) {
      updateBird(predictions[0]); // Update bird position based on hand pose

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
      if (dAirplane < airplane.size / 4) {
        bird.alive = false; // Set bird to not alive if it collides with airplane
        console.log("Bird collided with airplane!");
      }
    }
    // Display bird
    displayBird(); // Call displayBird() if the bird is alive

  } else {
    push(); // Save the current drawing state
    translate(bird.tip.x, bird.tip.y); // Move the origin to the bird's position
    rotate(PI); // Rotate the bird by 180 degrees. Reference: https://p5js.org/reference/#/p5/rotate
    imageMode(CENTER);
    image(birdImg, 0, 0, 100, 100); // Display the rotated bird image
    pop(); // Restore the previous drawing state
    bird.tip.y += 7; // Move bird down if not alive


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

  // Move and display cloud
  moveCloud();
  displayCloud();

  // Move and display balloon
  moveBalloon();
  displayBalloon();

  // Check for balloon collision
  checkBalloonCollision();

  // Check if the game duration has passed
  if (millis() - startTime >= gameDuration && bird.alive) {
    state = `ending`; // Transition to ending state
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
    size: 150,
    vx: -6,
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

// Function to reset airplane's position
function resetAirplane() {
  airplane.x = constrain(random(-100, 400), 0, width - airplane.size); // Random X position constrained between 0 and 300
  airplane.y = height;
}

// Mouse pressed function
function mousePressed() {
  if (state === `title`) {
    state = `running`; // Transition to running state when mouse is pressed on the title screen
  }
}