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

/**
 * toArray
 * 
 * http://javascriptweblog.wordpress.com/2010/04/05/curry-cooking-up-tastier-functions/
 */
function toArray(enum) {
    return Array.prototype.slice.call(enum);
}

/**
 * PongObject
 * 
 * Base object extended by pong components.
 * @returns {PongObject}
 */
function PongObject(){}

/**
 * bind
 * @see http://javascriptweblog.wordpress.com/2010/04/05/curry-cooking-up-tastier-functions/
 * @returns function
 */
PongObject.prototype.bind = function(){
    if (arguments.length<1) {
        return this; //nothing to curry with - return function
    }
    var __method = this;
    var args = toArray(arguments);
    return function() {
        return __method.apply(this, args.concat(toArray(arguments)));
    };
};
