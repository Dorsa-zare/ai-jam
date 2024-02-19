// AI jam
// Dorsa Zare

// The user's webcam
let video = undefined;
// The handpose model
let handpose = undefined;
// The current set of predictions
let predictions = [];
//The bubble
let bubble = undefined;

function setup() {
  createCanvas(640, 480);

  // Access user's webcam
  video = createCapture(VIDEO);
  video.hide();

  // Load the handpose model
  handpose = ml5.handpose(video, {
    flipHorizontal: true
  }, function () {
    console.log(`Model loaded.`)
  });

  // Listen for predictions
  handpose.on(`predict`, function (results) {
    predictions = results;
  });

  // Our bubble
  bubble = {
    x: random(width),
    y: height,
    size: 100,
    vx: 0,
    vy: -2
  };
}


function draw() {
  background(0);

  // Check if there are any predictions
  if (predictions.length > 0) {
    let hand = predictions[0];
    let index = hand.annotations.indexFinger;
    let tip = index[3];
    let base = index[0];
    let tipX = tip[0];
    let tipY = tip[1];
    let baseX = base[0];
    let baseY = base[1];

    push();
    noFill();
    stroke(255, 255, 255)
    strokeWeight(2);
    line(baseX, baseY, tipX, tipY)
    pop();

    //pin head
    push();
    noStroke();
    fill(255, 0, 0);
    ellipse(baseX, baseY, 20)
    pop();
  }

  // Move bubble
  bubble.x += bubble.vx;
  bubble.y += bubble.vy;

  if (bubble.y < 0) {
    bubble.x = random(width);
    bubble.y = height;
  }

  push();
  fill(0, 100, 200);
  noStroke();
  ellipse(bubble.x, buble.y, bubble.size)
  pop();

}
