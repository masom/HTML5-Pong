/*
Author: Shawn Simister

The Paddle class implements a bouncing ball object.
*/

function Paddle(x, y, width, height, sx, sy) {
	this.x = x;
	this.y = y;
	this.target_x = x;
	this.target_y = y;
	this.width = width;
	this.height = height;
	this.speed_x = sx;
	this.speed_y = sy;
	this.dx = 0;
	this.dy = 0;
}

Paddle.prototype.setBoard = function(board) {
	this.board = board;
};

Paddle.prototype.setTarget = function(x, y) {
	this.target_x = x;
	this.target_y = y;
	var rx = this.board.relativeX(this.x);
	var ry = this.board.relativeY(this.y);
	var rspeed_x = this.board.relativeX(this.speed_x);
	var rspeed_y = this.board.relativeY(this.speed_y);
	if (rx < this.target_x - rspeed_x) {
		this.dx = this.speed_x;
	} else if (rx > this.target_x + rspeed_x) {
		this.dx = -this.speed_x;
	}
	if (ry < this.target_y - rspeed_y) {
		this.dy = this.speed_y;
	} else if (ry > this.target_y + rspeed_y) {
		this.dy = -this.speed_y;
	}
};

Paddle.prototype.update = function() {
	this.x += this.dx;
	this.y += this.dy;
	this.collisionDetection();
};

Paddle.prototype.collisionDetection = function() {
	var w2 = this.width / 2.0;
	var h2 = this.height / 2.0;
	if (this.x < w2) {
		this.x = w2;
	} else if (this.x > 1.0 - w2) {
		this.x = 1.0 - w2;
	}
	if (this.y < h2) {
		this.y = h2;
	} else if (this.y > 1.0 - h2) {
		this.y = 1.0 - h2;
	}
	var rx = this.board.relativeX(this.x);
	var ry = this.board.relativeY(this.y);
	var rspeed_x = this.board.relativeY(this.speed_x);
	var rspeed_y = this.board.relativeY(this.speed_y);
	if (Math.abs(rx - this.target_x) <= rspeed_x) {
		this.dx = 0;
		this.x = this.target_x / this.board.width;
	}
	if (Math.abs(ry - this.target_y) <= rspeed_y) {
		this.dy = 0;
		this.y = this.target_y / this.board.height;
	}
};

Paddle.prototype.intersects = function(object) {
	var this_w2 = this.width / 2.0;
	var this_h2 = this.height / 2.0;
	var object_w2 = object.width / 2.0;
	var object_h2 = object.height / 2.0;
	
	var object_north = object.y - object_h2;
	var object_south = object.y + object_h2;
	var object_east  = object.x + object_w2;
	var object_west  = object.x - object_w2;
	
	var this_north = this.y - this_h2;
	var this_south = this.y + this_h2;
	var this_east  = this.x + this_w2;
	var this_west  = this.x - this_w2;

	var intersect_north = false;
	var intersect_south = false;
	var intersect_east  = false;
	var intersect_west  = false;

	// North
	if (object_south >= this_north && object_south < this_south) {
		intersect_north = true;
	}
	// South
	if (object_north <= this_south && object_north > this_north) {
		intersect_south = true;
	}

	// East
	if (object_west <= this_east && object_west > this_west) {
		intersect_east = true;
	}
	// West
	if (object_east >= this_west && object_east < this_east) {
		intersect_west = true;
	}

	/*if (intersect_north && (intersect_east || intersect_west)) {
		return {x: 1, y: -1, type:'north'};
	}
	if (intersect_south && (intersect_east || intersect_west)) {
		return {x: 1, y: -1, type:'south'};
	}*/
	if (intersect_east && (intersect_north || intersect_south)) {
		return {x: -1, y: 1, type:'east'};
	}
	if (intersect_west && (intersect_north || intersect_south)) {
		return {x: -1, y: 1, type:'west'};
	}

	return null;
};

Paddle.prototype.draw = function(context) {
	context.fillStyle = '#fff';
	var w2 = this.width / 2.0;
	var h2 = this.height / 2.0;
	var x = this.board.relativeX(this.x - w2);
	var y = this.board.relativeY(this.y - h2);
	context.fillRect(x, y, this.board.relativeX(this.width), this.board.relativeY(this.height));
};