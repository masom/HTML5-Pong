/*
Author: Shawn Simister

The Ball class implements a bouncing ball object.
*/

function Ball(x, y, width, height, dx, dy) {
	this.x = x;
	this.y = y;
	this.width = width;
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
	this.collisionDetection();
}

Ball.prototype.collisionDetection = function() {

	for (var i in this.board.objects) {
		if (this != this.board.objects[i]) {
			var intersection = this.board.objects[i].intersects(this);
			if (intersection != null) {
				this.dx = intersection.x * this.dx;
				this.dy = intersection.y * this.dy;
			}
		}
	}
	
	var w2 = this.width / 2.0;
	var h2 = this.height / 2.0;

	if (this.x < w2 || this.x > 1.0 - w2) {
		var changeEvent = document.createEvent("Event");
        changeEvent.initEvent("out_of_bounds", true, false);
        document.dispatchEvent(changeEvent);
	}
	if (this.y < h2 || this.y > 1.0 - h2) {
		this.dy = -this.dy;
	}
}

Ball.prototype.intersects = function(object) {
	return null;
}

Ball.prototype.draw = function(context) {
	var w2 = this.width / 2.0;
	var h2 = this.height / 2.0;
	var x = this.board.relativeX(this.x - w2);
	var y = this.board.relativeY(this.y - h2);
	context.drawImage(this.image, x, y, this.board.relativeX(this.width), this.board.relativeX(this.height));
}
