/**
 * PongUI
 * 
 * @author Martin Samson
 * @author Calvin Walton
 */
function PongUI(){
	this.ScoreBoards = {};
	this.PlayerNames = {};
	this.ReadyBoxes = {};
	this.Buttons = {};
	this.Lobby = null;
	this.Labels = {};
	this.MyPaddle = null;
}

/**
 * init
 * 
 * Initialize UI bindings.
 */
PongUI.prototype.init(){
	this.ScoreBoards['one'] = document.getElementById('scoreboards_player_one');
	this.ScoreBoards['two'] = document.getElementById('scoreboards_player_two');
	this.PlayerNames['one'] = document.getElementById('players_name_one');
	this.PlayerNames['two'] = document.getElementById('players_name_two');
	this.ReadyBoxes['one'] = document.getElementById('readyboxes_one');
	this.ReadyBoxes['two'] = document.getElementById('readyboxes_two');
	this.Buttons['connect'] = document.getElementById('buttons_connect');
	this.Lobby = document.getElementById('lobby');
	this.Labels['lobby_name'] = document.getElementById('labels_lobby_name');
};

/**
 * setPlayerScore
 * 
 * Sets a player's score.
 * 
 * @param string player Player id
 * @param string score Score value
 */
PongUI.prototype.setPlayerScore(player, score){
	this.ScoreBoards[player].innerText = score;
};

/**
 * setPlayerName
 * 
 * Displays the name of a player
 * 
 * @param string player Player id
 * @param string name Player name
 */
PongUI.prototype.setPlayerName(player, name){
	this.PlayerNames[player].innerText = name;
};

/**
 * setPlayerReady
 * 
 * Display the state of a player as ready or not.
 * @param string player Player id
 * @param boolean ready Ready state
 */
PongUI.prototype.setPlayerReady(player, ready){
	var state = '';

	if (ready){
		state = 'Ready';
	}else{
		state = 'Not Ready';
	}

	this.ReadyBoxes[player].innerText = state;
};

/**
 * showButton
 * 
 * Shows a button
 * 
 * @param string button Button id to be shown.
 */
PongUI.prototype.showButton(button){
	this.Buttons[button].style.display = 'block';
};

/**
 * hideButton
 * 
 * Hides a button
 * 
 * @param string button Button id to be hidden.
 */
PongUI.prototype.hideButton(button){
	this.Buttons[button].style.display = 'none';
};

/**
 * showLobby
 * 
 * Shows the lobby.
 */
PongUI.prototype.showLobby(){
	this.Labels['lobby_name'].innerText = "You are " + this.PlayerNames[PongData.Players.me];
	this.Lobby.style.display = 'block';
};

/**
 * hideLobby
 * 
 * Hides the lobby.
 */
PongUI.prototype.hideLobby(){
	this.Lobby.style.display = 'none';
};

/**
 * enablePaddles
 * 
 * Initialize paddles and binds the mouse move event to onPaddleMove
 */
PongUI.prototype.enablePaddles(){
	switch(PongData.Players.me){
	default:
		//TODO: Better handling of this exception
		alert("PongUI.enablePaddles error: Invalid player id.");
		return;
		break;
	case 'one':
		this.MyPaddle = document.getElementById('paddles_player_one');
		break;
	case 'two':
		this.MyPaddle = document.getElementById('paddles_player_two');
		break;
	}
	document.addEventListener("mousemove", this.onPaddleMove);
};

/**
 * onPaddleMove
 * 
 * Moves a paddle on the board. Triggered after a mousemove event.
 * @param event evt Mouse move event.
 */
PongUI.prototype.onPaddleMove(evt){
	PongUI.Paddles.mine.setTarget(evt.x, evt.y - PongUI.Canvas.offsetTop);
	PongNetwork.updatePaddle((evt.y - PongUI.Canvas.offsetTop) / PongUI.Canvas.clientHeight);
};

/**
 * updatePaddleLocation
 * 
 * Updates the other player paddle location
 * 
 * @param float pos Paddle position
 */
PongUI.prototype.updatePaddleLocation(pos){
		PongUI.Paddles.other.setTarget(0, pos * this.Canvas.clientHeight);	
};

