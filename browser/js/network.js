var socket;
var playerNum = 0;

function serverConnect(serverName) {
	socket = new WebSocket(serverName);
	socket.onopen = function() {
		hideConnect();
	};
	socket.onmessage = function(msg) {
		var d = JSON.parse(msg.data);
		if (d.code == 100) {
			if (d.data.id > 0) {
				playerNum = d.data.id;
			}
		}
	}
	socket.onerror = function(err) {
		alert(err);
	}
}
