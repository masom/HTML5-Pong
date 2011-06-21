/**
 * PongNetwork
 * 
 * Network interface class
 * 
 * @license http://opensource.org/licenses/bsd-license.php The BSD License
 */
PongNetwork.prototype = new PongObject();
function PongNetwork(){
	this.socket = null;

	this.SOCKET_NEW = 1;
	this.SOCKET_OPENING = 2;
	this.SOCKET_OPENED = 3;
	this.SOCKET_CLOSED = 4;

	this.socketState = this.SOCKET_NEW;

	this.MESSAGE_WELCOME = 200;
	this.MESSAGE_GAME_START = 110;
	this.MESSAGE_PLAYER_READY = 160;
	this.MESSAGE_PLAYER_JOINED = 100;
	this.MESSAGE_PLAYER_LEFT = 600;
	this.MESSAGE_PADDLE_MOVE = 900;

	//TODO: Wrap this up for other browsers.
	this.JSON = JSON;
	this.Protocol = new PongProtocol();
}
PongNetwork.Protocol = function(){};

/**
 * Connect
 */
PongNetwork.prototype.connect = function(serverName){
	//TODO: Verify WebSocket is accessible.
	this.socketState = this.SOCKET_OPENING;

	this.socket = new WebSocket(serverName);
	this.socket.addEventListener('open', this.onSocketOpen.bind(this));
	this.socket.addEventListener('close', this.onSocketClose.bind(this));
	this.socket.addEventListener('error', this.onSocketError.bind(this));
	this.socket.addEventListener('message', this.onSocketMessage.bind(this));
};

/**
 * onSocketError
 * 
 * Triggered when there is a WebSocket error.
 * @param object errorMESSAGE_WELCOME
 */
PongNetwork.prototype.onSocketError = function(error){
	//TODO: Better handling of the error message.
	alert(error);
};

/**
 * onSocketOpen
 * 
 * Triggered when the WebSocket connection is open.
 */
PongNetwork.prototype.onSocketOpen = function(){
	this.socketState = PongNetwork.SOCKET_OPENED;
	PongUI.hideConnect();
};

/**
 * onSocketMessage
 * 
 * Triggered when the WebSocket receives a message.
 * @param string message
 */
PongNetwork.prototype.onSocketMessage = function(message){
	var msg = this.JSON.parse(message.data);

	switch (msg.code){
	default:
		PongUI.alert("PongNetwork", "Unknown message code: " + msg.code);
		break;
	case this.MESSAGE_WELCOME:
		PongData.setPlayers(msg.data.id);
		PongUI.showLobby();
		break;
	case this.MESSAGE_GAME_START:
		PongUI.hideLobby();
		PongUI.enablePaddles();
		break;
	case this.MESSAGE_PLAYER_READY:
		var player = PongData.getPlayerFromId(msg.data.id);
		PongUI.setPlayerReady(player, true);
		break;
	case this.MESSAGE_PLAYER_JOINED:
		PongData.registerPlayer(msg.data.id, msg.data.name);
		PongUI.showLobby();
		break;
	case this.MESSAGE_PLAYER_LEFT:
		PongUI.unregisterPlayer(msg.data.id);
		PongUI.stop();
		PongUI.showLobby();
		break;
	case this.MESSAGE_PADDLE_MOVE:
		var player = PongData.getPlayerFromId(msg.data.player.id);
		PongUI.updatePaddle(player, msg.data.pos);
		break;
	}
};

/**
 * onSocketClose
 * 
 * Triggered when the WebSocket has closed.
 */
PongNetwork.prototype.onSocketClose = function(evt){
	//TODO: Better handling.
	switch(this.socketState){
		case this.SOCKET_OPENED:
		case this.SOCKET_CLOSED:
			PongUI.alert("Connection Lost", "The connection to the game server was lost.");
			break;
		default:
			PongUI.alert("Connection Error", "A connection to the game server could not be made.");
			break;
	}
};

PongNetwork.prototype.ready = function(){
	this.socket.send(this.JSON.stringify(this.Protocol.ready()));
};

function PongProtocol(){
	this.version = 1;
};

/**
 * ready
 * 
 * Sends a player ready message to the server.
 */
PongProtocol.prototype.ready = function(){
	return {
		code: 155,
		data: {},
		text: PongData.Players[PongData.Players.Me] + " is ready."
	};
};

/**
 * updatePaddle
 * 
 * Sends a paddle update message to the server.
 * 
 * @param float newPos New paddle position
 */
PongProtocol.prototype.updatePaddle = function(newPos){
	return {
		code: 150,
		data: {
			pos: newPos
		}
	};
};
