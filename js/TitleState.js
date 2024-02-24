class TitleState {
    constructor() {
    }

    display() {
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
}