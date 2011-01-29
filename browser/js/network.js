var socket;
playerNum = 0;
playerName = "Player";

function serverConnect(serverName) {
	socket = new WebSocket(serverName);
	socket.onopen = function() {
		hideConnect();
	};
	socket.onmessage = function(msg) {
		var d = JSON.parse(msg.data);
		alert(d.text + "\n" + msg.data);
		if (d.code == 200) {
			playerNum = d.data.id;
			playerName = d.data.name;
			showLobby();
		}
	}
	socket.onerror = function(err) {
		alert(err);
	}
}

function serverReady() {
	var message = {
		code : 155,
		data : {},
		text : playerName + " is ready",
		version : 1
	};
	alert(JSON.stringify(message));
	socket.send(JSON.stringify(message));
}
