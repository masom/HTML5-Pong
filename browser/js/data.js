/**
 * PongData
 * 
 * Data store
 */
function PongData(){
	this.Players = {
		one: '',
		two: '',
		Me: '',
		Other: ''
	};
}

/**
 * setPlayers
 * 
 * Sets the players based on who is the current player
 * @param string me Identify of the current player
 */
PongData.prototype.setPlayers = function(me){
	if(me == 'one'){
		this.Players.Me  = 'one';
		this.Players.Other = 'two';
	}else{
		this.Players.Me = 'two';
		this.Players.Other = 'one';
	}
};

PongData.prototype.registerPlayer = function(player, name){
	this.Players[player] = name;
};

PongData.prototype.unregisterPlayer = function(player){
	this.Players[player] = '';
};