/**
 * PongUI
 * 
 * @license GPL-2.0 License (http://opensource.org/licenses/GPL-2.0)
 * @author Martin Samson
 * @author Calvin Walton
 * @author Shawn Simister
 * @author mdu
 */
function PongUI(){
	this.ScoreBoards = {};
	this.PlayerNames = {};
	this.ReadyBoxes = {};
	this.Buttons = {};
	this.Lobby = null;
	this.Labels = {};
	this.Paddles = {one: null, two: null};

	this.Canvas = null;
	this.Context = null;

	this.Board = null;
	this.Ball = null;

	this.MessageBox = {window: null, title: null, message: null};
}

/**
 * init
 * 
 * Initialize UI bindings.
 */
PongUI.prototype.init = function(){
	this.ScoreBoards['one'] = document.getElementById('scoreboards_player_one');
	this.ScoreBoards['two'] = document.getElementById('scoreboards_player_two');
	this.PlayerNames['one'] = document.getElementById('players_name_one');
	this.PlayerNames['two'] = document.getElementById('players_name_two');
	this.ReadyBoxes['one'] = document.getElementById('readyboxes_one');
	this.ReadyBoxes['two'] = document.getElementById('readyboxes_two');
	this.Buttons['connect'] = document.getElementById('buttons_connect');
	this.Lobby = document.getElementById('lobby');
	this.Labels['lobby_name'] = document.getElementById('labels_lobby_name');

	this.MessageBox = {
		window: document.getElementById("message_box"),
		title: document.getElementById("message_box_title"),
		message: document.getElementById("message_box_message")
	};

	this.Canvas = document.getElementById("playarea");
	this.Context = this.Canvas.getContext("2d");
	this.Board = new PongGameBoard(this.Context);
	this.Ball = new PongBall(
		    0.2, 0.5,
		    0.05, 0.05,
		    -0.005, 0.005
	);

	this.Paddles['one'] = new PongPaddle(0.03, 0.5, 0.02, 0.3, 0, 0.03);
	this.Paddles['two'] = new PongPaddle(0.97, 0.5, 0.02, 0.3, 0, 0.03);

	this.Board.addObject(this.Ball);
	this.Board.addObject(this.Paddles['one']);
	this.Board.addObject(this.Paddles['two']);

	document.addEventListener("out_of_bounds", function(e) {
		PongUI.Ball.x = 0.5;
		PongUI.Ball.y = Math.random();
		PongUI.Ball.dx = -PongUI.Ball.dx;
		PongUI.Ball.dy = -PongUI.Ball.dy;
	});

	setInterval(PongUI.onTimerTick, 16);
};

PongUI.prototype.onTimerTick = function(){
	PongUI.Board.update();
	PongUI.Board.draw();
};

PongUI.prototype.alert = function(title, message){
	this.MessageBox.title.innerText = title;
	this.MessageBox.message.innerText = message;
	this.MessageBox.window.style.display = 'block';
	this.MessageBox.window.style.top = (document.height / 2 - this.MessageBox.window.clientHeight / 2 ) + 'px';
	this.MessageBox.window.style.left = (document.width / 2 - this.MessageBox.window.clientWidth / 2) + 'px';
};

/**
 * setPlayerScore
 * 
 * Sets a player's score.
 * 
 * @param string player Player id
 * @param string score Score value
 */
PongUI.prototype.setPlayerScore = function(player, score){
	this.ScoreBoards[player].innerText = score;
};

/**
 * setPlayerName
 * 
 * Displays the name of a player
 * 
 * @param string player Player id
 * @param string name Player name
 */
PongUI.prototype.setPlayerName = function(player, name){
	this.PlayerNames[player].innerText = name;
};

/**
 * setPlayerReady
 * 
 * Display the state of a player as ready or not.
 * @param string player Player id
 * @param boolean ready Ready state
 */
PongUI.prototype.setPlayerReady = function(player, ready){
	var state = '';

	if (ready){
		state = 'Ready';
	}else{
		state = 'Not Ready';
	}

	this.ReadyBoxes[player].innerText = state;
};

/**
 * showButton
 * 
 * Shows a button
 * 
 * @param string button Button id to be shown.
 */
PongUI.prototype.showButton = function(button){
	this.Buttons[button].style.display = 'block';
};

/**
 * hideButton
 * 
 * Hides a button
 * 
 * @param string button Button id to be hidden.
 */
PongUI.prototype.hideButton = function(button){
	this.Buttons[button].style.display = 'none';
};

/**
 * showLobby
 * 
 * Shows the lobby.
 */
PongUI.prototype.showLobby = function(){
	this.Labels['lobby_name'].innerText = "You are " + this.PlayerNames[PongData.Players.me];
	this.Lobby.style.display = 'block';
};

/**
 * hideLobby
 * 
 * Hides the lobby.
 */
PongUI.prototype.hideLobby = function(){
	this.Lobby.style.display = 'none';
};

/**
 * enablePaddles
 * 
 * Initialize paddles and binds the mouse move event to onPaddleMove
 */
PongUI.prototype.enablePaddles = function(){
	switch(PongData.Players.me){
	default:
		//TODO: Better handling of this exception
		alert("PongUI.enablePaddles error: Invalid player id.");
		return;
		break;
	case 'one':
	case 'two':
		this.MyPaddle = this.Paddles(PongData.Players.me);
		break;
	}
	document.addEventListener("mousemove", this.onPaddleMove);
};

PongUI.prototype.disablePaddles = function(){
	//TODO: Double check this. probably wrong
	document.removeEventListener("mousemove");
};
/**
 * onPaddleMove
 * 
 * Moves a paddle on the board. Triggered after a mousemove event.
 * @param event evt Mouse move event.
 */
PongUI.prototype.onPaddleMove = function(evt){
	var paddle = this.Paddles[PongData.Players.Me];

	paddle.setTarget(evt.x, evt.y - PongUI.Canvas.offsetTop);
	PongNetwork.updatePaddle((evt.y - PongUI.Canvas.offsetTop) / PongUI.Canvas.clientHeight);
};

/**
 * updatePaddleLocation
 * 
 * Updates the other player paddle location
 * 
 * @param string player Player id
 * @param float pos Paddle position
 */
PongUI.prototype.updatePaddle = function(player, pos){
	var paddle = null;
	if(player == this.Players.me){
		paddle = this.Paddles.mine;
	}else{
		paddle = this.Paddles.other;
	}
	paddle.setTarget(0, pos * this.Canvas.clientHeight);
};

PongUI.prototype.stop = function(){
	this.disablePaddles();
	//TODO: Stop and reset the game.
};

/**
 * PongBall
 * 
 * @param x
 * @param y
 * @param width
 * @param height
 * @param dx
 * @param dy
 */
function PongBall(x, y, width, height, dx, dy) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.dx = dx;
	this.dy = dy;
	this.image = new Image();
	this.image.src = "images/Chrome_Logo.svg";
}

PongBall.prototype.setBoard = function(board) {
	this.board = board;
};

PongBall.prototype.update = function() {
	this.x += this.dx;
	this.y += this.dy;
	this.collisionDetection();
};

PongBall.prototype.collisionDetection = function() {

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
};

PongBall.prototype.intersects = function(object) {
	return null;
};

PongBall.prototype.draw = function(context) {
	var w2 = this.width / 2.0;
	var h2 = this.height / 2.0;
	var x = this.board.relativeX(this.x - w2);
	var y = this.board.relativeY(this.y - h2);
	context.drawImage(this.image, x, y, this.board.relativeX(this.width), this.board.relativeX(this.height));
};


function PongPaddle(x, y, width, height, sx, sy) {
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

PongPaddle.prototype.setBoard = function(board) {
	this.board = board;
};

PongPaddle.prototype.setTarget = function(x, y) {
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

PongPaddle.prototype.update = function() {
	this.x += this.dx;
	this.y += this.dy;
	this.collisionDetection();
};

PongPaddle.prototype.collisionDetection = function() {
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

PongPaddle.prototype.intersects = function(object) {
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
	
	if (intersect_east && (intersect_north || intersect_south)) {
		return {x: -1, y: 1, type: 'east'};
	}
	if (intersect_west && (intersect_north || intersect_south)) {
		return {x: -1, y: 1, type: 'west'};
	}

	return null;
};

PongPaddle.prototype.draw = function(context) {
	context.fillStyle = '#fff';
	var w2 = this.width / 2.0;
	var h2 = this.height / 2.0;
	var x = this.board.relativeX(this.x - w2);
	var y = this.board.relativeY(this.y - h2);
	context.fillRect(x, y, this.board.relativeX(this.width), this.board.relativeY(this.height));
};

function PongGameBoard(context){
	this.context = context;
	this.width = context.canvas.scrollWidth;
	this.height = context.canvas.scrollHeight;
	this.context.canvas.width = this.width;
	this.context.canvas.height = this.height;
	this.objects = [];
};

PongGameBoard.prototype.addObject = function(object) {
	object.setBoard(this);
	this.objects.push(object);
};

PongGameBoard.prototype.update = function() {
	for (var i in this.objects) {
		this.objects[i].update();
	}
};

PongGameBoard.prototype.draw = function() {
	this.context.clearRect(0, 0, this.width, this.height);
	for (var i in this.objects) {
		this.objects[i].draw(this.context);
	}
};

PongGameBoard.prototype.relativeX = function(value) {
	return value * this.width;
};

PongGameBoard.prototype.relativeY = function(value) {
	return value * this.height;
};
