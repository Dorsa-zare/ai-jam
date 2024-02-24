class EndingState {
    constructor() {
        this.balloons = []; // Array to store balloon objects
        this.numBalloons = 20; // Number of balloons
        this.balloonImg = balloonImg; // Image for the balloons
        this.balloonSize = 150; // Size of the balloons
        this.resetBalloons(); // Initialize balloons
    }

    display() {
        background(158, 206, 232); // Set background color
        push();
        textSize(50);
        textAlign(CENTER, CENTER);
        fill(0); // Set text color 
        text("You won!", width / 2, height / 2); // Display "You won!" text
        pop();

        // Call celebrate method to animate balloons
        this.celebrate();
    }

   // Method to initialize balloons
resetBalloons() {
    for (let i = 0; i < this.numBalloons; i++) {
        // Set random x position and start balloons at the top of the canvas
        let x = random(50, width - 50); // Ensure balloons stay inside the canvas
        let y = random(-200, -50); // Start above the canvas
        let validPosition = false;

        // Check if the balloon position is at least 50 pixels away from other balloons
        while (!validPosition) {
            validPosition = true; // Assume the position is valid unless proven otherwise
            // Check against existing balloons
            for (let j = 0; j < this.balloons.length; j++) {
                let existingBalloon = this.balloons[j];
                let distance = dist(x, y, existingBalloon.x, existingBalloon.y);
                if (distance < 50) {
                    // Balloon is too close to an existing balloon, choose a new position
                    x = random(50, width - 50);
                    y = random(-200, -100);
                    validPosition = false;
                    break; // Exit the loop to check the new position against other balloons
                }
            }
        }

        let balloon = { x: x, y: y, vy: random(5, 9) }; // Random vertical velocity
        this.balloons.push(balloon); // Add balloon to array
    }
}


    // Method to animate balloons
    celebrate() {
        for (let i = 0; i < this.balloons.length; i++) {
            let balloon = this.balloons[i];
            // Move balloon down
            balloon.y += balloon.vy;

            // If balloon reaches bottom of canvas, reset its position
            if (balloon.y > height) {
                balloon.y = random(-200, -100); // Start above the canvas again
                balloon.x = random(width); // Random x position
            }

            // Display balloon image with specified size
            image(this.balloonImg, balloon.x, balloon.y, this.balloonSize, this.balloonSize);
        }
    }

}
