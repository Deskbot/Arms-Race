let Player = function() {
	//constructor
	function Player(game, number) {
		this.number = number;
		this.class = 'player' + number;
		this.sideName = number == 1 ? 'left' : 'right';
		this.side = game.container.children('#' + this.sideName);
		this.bag = new Bag(this);
		this.controller = new Controller(this);
		this.population = new Population(this);
	}

	//attributes
	


	//methods
	Player.prototype.getClass = function() {
		return 'player' + this.number;
	}



	return Player;
}();