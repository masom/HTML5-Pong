/*
Author: Shawn Simister

The GameBoard class implements a container that maintains the state of the game board and 
keeps track of the objects on the game board.
*/

function GameBoard(context){
	this.context = context;
	this.width = context.canvas.scrollWidth;
	this.height = context.canvas.scrollHeight;
	this.context.canvas.width = this.width;
	this.context.canvas.height = this.height;
	this.objects = [];
}

GameBoard.prototype.addObject = function(object) {
	object.setBoard(this);
	this.objects.push(object);
}

GameBoard.prototype.update = function() {
	for (var i in this.objects) {
		this.objects[i].update();
	}
}

GameBoard.prototype.draw = function() {
	this.context.clearRect(0, 0, this.width, this.height);
	for (var i in this.objects) {
		this.objects[i].draw(this.context);
	}
}

GameBoard.prototype.relativeX = function(value) {
	return value * this.width;
}

GameBoard.prototype.relativeY = function(value) {
	return value * this.height;
}