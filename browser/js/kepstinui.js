function setPlayerScore(playerNum, playerScore) {
	scoreBox = document.getElementById("player" + playerNum + "score");
	scoreBox.innerText = playerScore;
}

function setPlayerName(playerNum, playerName) {
	nameBox = document.getElementById("player" + playerNum + "name");
	nameBox.innerText = playerName;
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
