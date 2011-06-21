/**
 * PongData
 *
 * @license http://opensource.org/licenses/bsd-license.php The BSD License
 */
function PongData(){
	this.Players = {
		one: 'Player One',
		two: 'Player Two',
		Me: '',
		Other: ''
	};
}

PongData.prototype.getPlayerFromId = function(id){
	if (id == 1){
		return 'one';
	}else{
		return 'two';
	}
};
/**
 * setPlayers
 * 
 * Sets the players based on who is the current player
 * @param string me Identify of the current player
 */
PongData.prototype.setPlayers = function(id){
	if (id == 1){
		this.Players.Me  = 'one';
		this.Players.Other = 'two';
	}else{
		this.Players.Me = 'two';
		this.Players.Other = 'one';
	}
};

PongData.prototype.registerPlayer = function(id, name){
	this.Players[this.getPlayerFromId(id)] = name;
};

PongData.prototype.unregisterPlayer = function(id){
	this.Players[this.getPlayerFromId(id)] = '';
};