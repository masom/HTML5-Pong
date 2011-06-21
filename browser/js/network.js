/**
 * PongNetwork
 * 
 * Network interface class
 * 
 * @author Martin Samson
 * @author Calvin Walton
 */

function PongNetwork(){
	this.socket = null;

	//TODO: Wrap this up for other browsers.
	this.JSON = JSON;

	this.Protocol = function(){};
}

/**
 * Connect
 */
PongNetwork.prototype.connect(serverName){
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
PongNetwork.prototype.onSocketError(error){
	//TODO: Better handling of the error message.
	alert(error);
};

/**
 * onSocketOpen
 * 
 * Triggered when the WebSocket connection is open.
 */
PongNetwork.prototype.onSocketOpen(){
	PongUI.hideConnect();
};

/**
 * onSocketMessage
 * 
 * Triggered when the WebSocket receives a message.
 * @param string message
 */
PongNetwork.prototype.onSocketMessage(message){
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
		PongUI.Paddles.enablePaddle();
		break;
	case 160: // A player is ready.
		PongUI.onPlayerReady(msg.data.id, true);
		break;
	case 200: // A player joined.
		PongUI.registerPlayer(msg.data.id, d.data.name);
		PongUI.showLobby();
		break;
	case 600: // Other player left
		PongUI.unregisterPlayer(msg.data.id);
		break;
	case 900: // Paddle move.
		PongUI.Paddles.move(msg.data.player.id, msg.data.pos);
		break;
	}
}

/**
 * onSocketClose
 * 
 * Triggered when the WebSocket has closed.
 */
PongNetwork.prototype.onSocketClose(evt){
	//TODO: Better handling.
	alert(evt);
};

/**
 * playerReady
 * 
 * Sends a player ready message to the server.
 */
PongNetwork.Protocol.prototype.playerReady(){
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
 */
PongNetwork.Protocol.prototype.updatePaddle(newPos){
	var msg = {
		code: 150,
		data: {
			pos: newPos
		}
	};
	this.socket.send(this.JSON.stringify(msg));
};
