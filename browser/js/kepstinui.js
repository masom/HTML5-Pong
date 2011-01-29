function setPlayerScore(playerNum, playerScore) {
	scoreBox = document.getElementById("player" + playerNum + "score");
	scoreBox.innerText = playerScore;
}

function setPlayerName(playerNum, playerName) {
	nameBox = document.getElementById("player" + playerNum + "name");
	nameBox.innerText = playerName;
}

function setPlayerReady(playerNum, playerReady) {
	readyBox = document.getElementById("player" + playerNum + "ready");
	if (playerReady) {
		readyBox.innerText = "Ready";
	} else {
		readyBox.innerText = "Not Ready";
	}
}

function hideConnect() {
	dialogue = document.getElementById("connect");
	dialogue.style.display = "none";
}

function showLobby() {
	dialogue = document.getElementById("lobby");
	
	playerinfo = document.getElementById("playerinfo");
	playerinfo.innerText = "You are " + playerName;
	
	dialogue.style.display = "block";
}

function hideLobby() {
	dialogue = document.getElementById("lobby");
	dialogue.style.display = "none";
}

function enablePaddle(playerNum) {
	if (playerNum == 1) {
		document.addEventListener("mousemove", function(e) {
			p1.setTarget(e.x, e.y - canvas.offsetTop);
			updatePaddle((e.y - canvas.offsetTop) / canvas.clientHeight);
		});
	} else {
		document.addEventListener("mousemove", function(e) {
			p2.setTarget(e.x, e.y - canvas.offsetTop);
			updatePaddle(e.y - canvas.offsetTop / canvas.clientHeight);
		});
	}
}
