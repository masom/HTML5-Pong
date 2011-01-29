/*
Author: Shawn Simister

This file constructs the game board and sets up the main event loop.
*/

var canvas = document.getElementById("playarea");
var context = canvas.getContext("2d");

var board = new GameBoard(context);
var ball = new Ball(
    0.2, 0.5,
    0.05, 0.05,
    0.005, 0.005
);
board.addObject(ball);

setInterval(onTimerTick, 16);

function onTimerTick() {
	board.update();
	board.draw();
}
