var ws = require('./ws');

/**
 * Pong Server that uses HTML WebSockets for its main form of
 * communication.
 * @param {number} port The port number to run the server.
 */
PongServer = function(port) {
  this.port_ = port;
  this.server_ = ws.createServer();
  this.players_ = {
	  1 :null, 
	  2 : null, 
	  'add' : function(player){
	  		if(this.one == null){
	  			player = 'one';
	  		}else if(this.two == null){
	  			player = 'two';
	  		}else{
	  			player = null;
	  		}
	  		return player;
	  },
	  'get' : function(conn_id){ 
  }};
  this.log_ = [];
  this.commands_ = {};
  this.init();
};

/**
 * Initialize the listeners to handle the various notifications..
 */
PongServer.prototype.init = function() {
  
  this.commands_ = {
    'NICK': NickCommand,
    'MSG': MsgCommand,
    'NICKLIST': NicklistCommand
  };
  
  this.server_.addListener('request', this.onWebRequest.bind(this));
  this.server_.addListener('listening', this.onListen.bind(this));
  this.server_.addListener('disconnect', this.onDisconnect.bind(this));
  this.server_.addListener('connection', function(conn) {
    this.onConnection(conn);
    conn.addListener('message', this.onMessage.bind(this, [conn]));
  }.bind(this));
  setInterval(this.onCleanup.bind(this), 10000);
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

  var player = null;

  // Store this user to the map so we can do quick retreivals.
  this.players_[player] = {
    conn_id: conn.id,
    nick: 'Player ' + player,
    data: {
      message_count: 0
    }
  };
};

/**
 * Fires when the connection sent a message.
 */
PongServer.prototype.onMessage = function(conn, message) {
  var player = this.players_[conn.id];
  syslog('> ' + message);
  var obj = JSON.parse(message);
  var cmd = this.commands_[obj.command];
  if (cmd) {
    cmd.onMessage(this, conn, obj.message);
  } else {
    syslog('ERROR MESSAGE: ' + obj.command)
  }
};

/**
 * Fires when a user is being disconnected.
 */
PongServer.prototype.onDisconnect = function(conn) {
  var user = this.users_[conn.id].nick;
  syslog('onDisconnect: ' + user);
  this.broadcast({nick: user, id: conn.id}, NotificationCommand.PART);
  delete this.users_[conn.id];
};

/**
 * Fired when its time to free up resources.
 */
PongServer.prototype.onCleanup = function() {
  // Only keep the last 100 messages in the log. Dispose the rest.
  if (this.log_.length > 100) {
    this.log_ = this.log_.slice(100);
  }
};

/**
 * @returns {object} List of connected users.
 */
PongServer.prototype.getUsers = function() {
  return this.users_;
};

/**
 * @returns {object} A single user.
 */
PongServer.prototype.getUser = function(id) {
  return this.users_[id];
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
  this.log_.push(message);
  this.server_.broadcast(JSON.stringify({
    command: command ? command : NotificationCommand.MSG,
    protocol: protocol ? protocol : NotificationProtocol.CHAT,
    message: message
  }));
};

PongServer.prototype.send = function(conn, message, command, protocol) {
  conn.send(JSON.stringify({
    command: command ? command : NotifiationCommand.MSG,
    protocol: protocol ? protocol : NotificationProtocol.CHAT,
    message: message
  }));
};