function setPlayerScore(playerNum, playerScore) {
	scoreBox = document.getElementById("player" + playerNum + "score");
	scoreBox.innerText = playerScore;
}

function setPlayerName(playerNum, playerName) {
	nameBox = document.getElementById("player" + playerNum + "name");
	nameBox.innerText = playerName;
}

function hideDialogue() {
	dialogue = document.getElementById("dialogue");
	dialogue.style.display = "none";
}
