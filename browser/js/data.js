/**
 * PongData
 * 
 * Data store
 */
function PongData(){
	this.Players = {
		me: '',
		other: ''
	};
}

/**
 * setPlayers
 * 
 * Sets the players based on who is the current player
 * @param string me Identify of the current player
 */
PongData.prototype.setPlayers(me){
	if(me == 'one'){
		this.Players.me = 'one';
		this.Players.other = 'two';
	}else{
		this.Players.me = 'two';
		this.Players.other = 'one';
	}
}