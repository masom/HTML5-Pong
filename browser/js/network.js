/**
 * PongNetwork
 * 
 * Network interface class
 * 
 * @license GPL-2.0 License (http://opensource.org/licenses/GPL-2.0)
 * @author Martin Samson
 * @author Calvin Walton
 * @author Shawn Simister
 * @author mdu
 */

function PongNetwork(){
	this.socket = null;

	//TODO: Wrap this up for other browsers.
	this.JSON = JSON;
}

PongNetwork.Protocol = function(){};

/**
 * Connect
 */
PongNetwork.prototype.connect = function(serverName){
	//TODO: Verify WebSocket is accessible.
	this.socket = new WebSocket(serverName);
	this.socket.onopen = this.onSocketOpen;
	this.socket.onmessage = this.onSocketMessage;
	this.socket.onerror = this.onSocketError;
	this.socket.onclose = this.onSocketClose;
};

/**
 * onSocketError
 * 
 * Triggered when there is a WebSocket error.
 * @param object error
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
		//TODO: This is currently only for debug.
		alert(msg.code);
		break;
	case 100:
		//Current Player joined.
		break;
	case 110: // Game on
		PongUI.hideLobby();
		PongUI.enablePaddles();
		break;
	case 160: // A player is ready.
		PongUI.setPlayerReady(msg.data.id, true);
		break;
	case 200: // A player joined.
		PongData.registerPlayer(msg.data.id, d.data.name);
		PongUI.showLobby();
		break;
	case 600: // Other player left
		PongUI.unregisterPlayer(msg.data.id);
		PongUI.stop();
		PongUI.showLobby();
		break;
	case 900: // Paddle move.
		PongUI.updatePaddle(msg.data.player.id, msg.data.pos);
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
	PongUI.alert("Connection Lost", "The connection to the server was lost.");
};

/**
 * ready
 * 
 * Sends a player ready message to the server.
 */
PongNetwork.Protocol.prototype.ready = function(){
	var msg = {
			code: 155,
			data: {},
			text: PongUI.Player.name + " is ready."
	};

	this.socket.send(this.JSON.stringify(message));
};

/**
 * updatePaddle
 * 
 * Sends a paddle update message to the server.
 * 
 * @param float newPos New paddle position
 */
PongNetwork.Protocol.prototype.updatePaddle = function(newPos){
	var msg = {
		code: 150,
		data: {
			pos: newPos
		}
	};
	this.socket.send(this.JSON.stringify(msg));
};
