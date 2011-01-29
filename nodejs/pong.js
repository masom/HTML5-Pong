var ws = require('./websocket/ws/server');
require('./functions');
require('./ball');

Message = function(){
	this.message = {};
	this.code = 0;
	this.data = {};
};

Message.prototype.parse = function(message){
	this.message = JSON.parse(message);
	this.code = message.code;
	this.data = message.data;
}

Message.prototype.isPaddleMove = function(){
	return (this.code == 150 && data.hasOwnProperty('pos'));
};

Message.prototype.isPlayerReady = function(){
	return (this.code == 155);
};

Response = function(){
	this.response = {
			code : 0,
			data : {}, 
			version : 1
	};
};

Response.prototype.welcome = function(player){
	this.response.code = 200;
	this.response.data = player;
	return this.response;
};
Response.prototype.isFull = function(){
	this.response.code = 503;
	this.response.data = {reason: 'Server is full'};
	return this.response;
};
Response.prototype.playerLeft = function(){
	this.response.code = 600;
	this.response.data = {};
	return this.response;
};
Response.prototype.playerJoined = function(player){
	this.response.code = 100;
	this.response.data = player;
	return this.response;
};
Response.prototype.gameStart = function(){
	this.response.code = 110;
	return this.response;
};
Response.prototype.gameEnd = function(){
	this.response.code = 120;
	return this.response;
};
Response.prototype.paddleMoved = function(player, pos){
	this.response.code = 900;
	this.response.data = {player: player, pos: pos};
	return this.response;
};
Response.prototype.gameState = function(ball, p1, p2) {
	this.response.code = 300;
	//TODO: grab this info from a central place
	this.response.data = {ball: ball, playerOne:p1, playerTwo:p2};
	return this.response;
};
Response.prototype.ballData = function(data){
	
};
/**
 * Pong Server that uses HTML WebSockets for its main form of
 * communication.
 * @param {number} port The port number to run the server.
 */
PongServer = function(port) {
	this.port_ = port;
	this.server_ = ws.createServer();
	this.started = false;
	this.ball = null;
	this.ballUpdater = null;
  this.players_ = {
	  connections : {},
	  One : null, 
	  Two : null,
	  add : function(conn_id){
		    var player = {
		    	conn_id : conn_id,
		    	name : 'Player ',
		    	data: {
		    		position : 0,
		    		ready : false 
		    	}
		    };
	  		if(this.One == null){
	  			player.name += "One";
	  			this.connections[player.conn_id] = 'One';
	  			this.One = player;
	  			syslog("Player One set as: " + player.conn_id);
	  		}else if(this.Two == null){
	  			player.name += "Two";
	  			this.connections[player.conn_id] = 'Two';
	  			this.Two = player;
	  			syslog("Player Two set as: " + player.conn_id);
	  		}else{
	  			return false;
	  		}
	  		return player;
	  },
	  getFromConn : function(conn_id){
		  if(this.connections.hasOwnProperty(conn_id)){
			  return this[this.connections[conn_id]];
		  }
		  return null;
	  },
	  removeByConn : function(conn_id){
		  var player = this.getFromConn(conn_id);
		  if(player){
			  this[this.connections[conn_id]] = null;
			  delete this.connections[conn_id];
		  }
	  },
	  allReady : function(){
		  if (this.One.data.ready && this.Two.data.ready){
			  return true;
		  }
		  return false;
	  }
  };
  this.init();
};
PongServer.prototype.startGame = function(){
	delete(this.ball);
	this.ball = new Ball(
		0.2, 0.5,
		0.05, 0.05,
		0.005, 0.005
	);
	this.ballUpdater = setInterval(this.ball.update, 60);
	
	var response = new Response();
	this.broadcast(response.gameStart());
};
/**
 * Initialize the listeners to handle the various notifications..
 */
PongServer.prototype.init = function() {
  this.server_.addListener('listening', this.onListen.bind(this));
  this.server_.addListener('disconnect', this.onDisconnect.bind(this));
  this.server_.addListener('connection', function(conn) {
	    this.onConnection(conn);
	    conn.addListener('message', this.onMessage.bind(this, [conn]));
  }.bind(this));
  //setInterval(this.onCleanup.bind(this), 10000);
};

/**
 * Fires when server successfully listened.
 */
PongServer.prototype.onListen = function() {
  syslog('onListen: port ' + this.port_);
};

/**
 * Fires when a new connection has been made.
 */
PongServer.prototype.onConnection = function(conn) {
  syslog('onConnection: from ' + conn.id);
  var response = new Response();
  var player = this.players_['add'](conn.id);
  if(player){
	 this.send(conn, response.welcome());
	 this.broadcast(response.playerJoined(player));
  }else{
	 this.send(conn, response.isFull());
  }
};

/**
 * Fires when the connection sent a message.
 */
PongServer.prototype.onMessage = function(conn, message) {
	//TODO: handling messages
	var player = this.players_.getFromConn(conn.id);
	if(!player){
		syslog("Unknown player: " + conn.id);
		return;
	}
	var message = new Message(message);
	
	if ( message.isPaddleMove() ){
		if(this.started = true){
			player.data.position = message.data.pos;
			syslog(this.players_.getFromConn(conn.id));
		}else{
			syslog("Player: " + player.name + "; Attempting to move paddle when game is not started");
		}
	}else if ( message.isPlayerReady() ){
		player.ready = true;
		syslog(this.players_.getFromConn(conn.id));
		if(this.players_.allReady()){
			this.startGame();
		}
	}else{
		syslog("Player: " + player.name + "; Unknown message:" + message.message);
	}
};

/**
 * Fires when a user is being disconnected.
 */
PongServer.prototype.onDisconnect = function(conn) {
	syslog('onDisconnect:' + conn.id);
	var player = this.players_.getFromConn(conn.id);
	this.players_.removeByConn(conn.id);
	var response = new Response();
	this.broadcast(response.playerLeft(player));
};

/**
 * Start listening for connections.
 */
PongServer.prototype.start = function() {
	this.server_.listen(this.port_);
};

/**
 * Broadcast a message to all the available
 */
PongServer.prototype.broadcast = function(response) {
	syslog(JSON.stringify(response));
	this.server_.broadcast(JSON.stringify(response));
};

PongServer.prototype.send = function(conn, response) {
	syslog(JSON.stringify(response));
	conn.send(JSON.stringify(response));
};

var server = new PongServer(9001);
server.start();
