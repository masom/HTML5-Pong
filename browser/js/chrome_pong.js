/*
Author: Shawn Simister

This file constructs the game board and sets up the main event loop.
*/

var canvas = document.getElementById("game_board");
var context = canvas.getContext("2d");

var board = new GameBoard(context);
var ball = new Ball(
    0.2, 0.5,
    0.05, 0.05,
    -0.005, 0.005
);
board.addObject(ball);

var p1 = new Paddle(0.03, 0.5, 0.02, 0.3, 0, 0.03);
board.addObject(p1);

var p2 = new Paddle(0.97, 0.5, 0.02, 0.3, 0, 0.03);
board.addObject(p2);

setInterval(onTimerTick, 16);

function onTimerTick() {
	board.update();
	board.draw();
}

document.addEventListener("mousemove", function(e) {
	p1.setTarget(e.x, e.y);
});

document.addEventListener("out_of_bounds", function(e) {
	ball.x = 0.5;
	ball.y = Math.random();
	ball.dx = -ball.dx;
	ball.dy = -ball.dy;
});