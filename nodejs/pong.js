var ws = require('./websocket/ws/server');
require('./functions');

Response = function(){
	this.response = {
			code : 0,
			data : {}, 
			version : 1
	};
	this.init();
};
Response.prototype.init = function(){
};
Response.prototype.welcome = function(player){
	this.response.code = 200;
	this.response.data = player;
	return this.response;
};
Response.prototype.isFull = function(){
	this.response.code = 503;
	this.response.data = {reason: 'Server is full'}
};
/**
 * Pong Server that uses HTML WebSockets for its main form of
 * communication.
 * @param {number} port The port number to run the server.
 */
PongServer = function(port) {
  this.port_ = port;
  this.server_ = ws.createServer();
  this.players_ = {
	  connections : {},
	  One : null, 
	  Two : null,
	  add : function(conn_id){
		    var player = {
		    	conn_id : conn_id,
		    	name : 'Player ',
		    	data: {
		    		position : 0
		    	}
		    };
	  		if(this.One == null){
	  			player.name += "One";
	  			this.connections[player.conn_id] = 'One';
	  			this.One = player;
	  		}else if(this.Two == null){
	  			player.name += "Two";
	  			this.connections[player.conn_id] = 'Two';
	  			this.Two = player;
	  		}else{
	  			return false;
	  		}
	  		return true;
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
	  }
  };
  this.init();
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
  if(this.players_['add'](conn.id)){
	  //TODO: Welcome message
  }
  //TODO: No more space left for players
};

/**
 * Fires when the connection sent a message.
 */
PongServer.prototype.onMessage = function(conn, message) {
	//TODO: handling messages
};

/**
 * Fires when a user is being disconnected.
 */
PongServer.prototype.onDisconnect = function(conn) {
	syslog('onDisconnect:' + conn.id);
	this.players_.removeByConn(conn.id);
  /**var user = this.users_[conn.id].nick;
  syslog('onDisconnect: ' + user);
  this.broadcast({nick: user, id: conn.id}, NotificationCommand.PART);
  delete this.users_[conn.id];
  */
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
PongServer.prototype.broadcast = function(message, command, protocol) {
  this.server_.broadcast(JSON.stringify({}));
};

PongServer.prototype.send = function(conn, message, command, protocol) {
  conn.send(JSON.stringify({}));
};

var server = new PongServer(9001);
server.start();