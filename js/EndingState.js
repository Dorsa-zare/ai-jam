class EndingState {
    constructor() {

    }

    display() {
        background(158, 206, 232); // Set background color
        push();
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(0); // Set text color to black
        text("You won!", width / 2, height / 2); // Display "You won!" text
        pop();
    }
}