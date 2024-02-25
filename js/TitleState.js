class TitleState {
    constructor() {
    }

    display() {
        background(158, 206, 232); // Set background color to blue
        push();
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(0); // Set text color to black
        text("Welcome to Rush Hour in the Sky", width / 2, height / 2 - 140);
        textSize(18);
        text("Use your index finger to control the bird and dodge obstacles in the sky.", width / 2, height / 2 + 60);

        fill(255); // Set text color to white
        text("Click anywhere to start", width / 2, height / 2 + 150);

        // Images
        image(airplaneImg, width / 2 - 260, height / 2 - 90, 120, 120);
        image(birdImg, width / 2 - 140, height / 2 - 90, 100, 100);
        image(cloudImg, width / 2 - 20, height / 2 - 90, 100, 100);
        image(balloonImg, width / 2 + 50, height / 2 - 80, 110, 110);
        image(ufoImg, width / 2 + 150, height / 2 - 90, 100, 100);

        pop();
    }
}