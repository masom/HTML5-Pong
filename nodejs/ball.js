/*
Author: Shawn Simister

The Ball class implements a bouncing ball object.
*/

Ball = function (x, y, width, height, dx, dy) {
	this.x = x;
	this.y = y;
	this. width = width;
	this.height = height;
	this.dx = dx;
	this.dy = dy;
};

Ball.prototype.update = function() {
	this.x += this.dx;
	this.y += this.dy;
	collisionDetection(this);
};

function collisionDetection(ball) {
	if (ball.x < 0 || ball.x > 1.0 - ball.width) {
		ball.dx = -ball.dx;
	}
	if (ball.y < 0 || ball.y > 1.0 - ball.height) {
		ball.dy = -ball.dy;
	}
}