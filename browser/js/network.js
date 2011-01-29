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
		if (d.code == 100) {
			// Player Joined
		} else if (d.code == 110) {
			hideLobby();
			enablePaddle(playerNum);
		} else if (d.code == 160) {
			setPlayerReady(d.data.id, d.data.ready);
		} else if (d.code == 200) {
			playerNum = d.data.id;
			playerName = d.data.name;
			showLobby();
		} else if (d.code == 600) {
			// Player left	
		} else {
			alert(d.text + "\n" + msg.data);
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
	};
	socket.send(JSON.stringify(message));
}

function updatePaddle(newPos) {
	var message = {
		code : 150,
		data : {
			pos : newPos
		}
	};
	socket.send(JSON.stringify(message));
}
		
