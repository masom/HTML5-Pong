var socket;
var playerNum = 0;
var playerName;

function serverConnect(serverName) {
	socket = new WebSocket(serverName);
	socket.onopen = function() {
		hideConnect();
	};
	socket.onmessage = function(msg) {
		var d = JSON.parse(msg.data);
		alert("Received message " + d.code);
		if (d.code == 100) {
		} else if (d.code == 200) {
			playerNum = d.data.id;
			playerName = d.data.name;
			showLobby();
		}
	}
	socket.onerror = function(err) {
		alert(err);
	}
}
