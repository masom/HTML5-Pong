/*
Author: Shawn Simister

The Ball class implements a bouncing ball object.
*/

function Ball(x, y, width, height, dx, dy) {
	this.x = x;
	this.y = y;
	this. width = width;
	this.height = height;
	this.dx = dx;
	this.dy = dy;
	this.image = new Image();
	this.image.src = "images/Chrome_Logo.svg";
}

Ball.prototype.setBoard = function(board) {
	this.board = board;
}

Ball.prototype.update = function() {
	this.x += this.dx;
	this.y += this.dy;
	collisionDetection(this);
}

function collisionDetection(ball) {
	if (ball.x < 0 || ball.x > 1.0 - ball.width) {
		var changeEvent = document.createEvent(ball);
        changeEvent.initEvent("out_of_bounds", true, false);
        document.dispatchEvent(changeEvent);
	}
	if (ball.y < 0 || ball.y > 1.0 - ball.height) {
		ball.dy = -ball.dy;
	}
}

Ball.prototype.draw = function(context) {
	context.drawImage(this.image, this.board.relativeX(this.x), this.board.relativeY(this.y), this.board.relativeX(this.width), this.board.relativeX(this.height));
}
