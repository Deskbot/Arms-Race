let Player = function() {
    //constructor
    function Player(game, number) {
        this.game = game;
        this.number = number;

        this.class = 'player' + number;
        this.sideName = number == 1 ? 'left' : 'right';
        this.side = game.container.children('#' + this.sideName);
        this.bag = new Bag(this);
        this.military = new Military(this);
        this.population = new Population(this);
        this.controller = new Controller(this);
    }

    //attributes
        


    //methods
    Player.prototype.getClass = function() {
        return 'player' + this.number;
    }

    Player.prototype.getOpponent = function() {
        if (typeof this.opponent === 'undefined') {
            this.opponent = this.game.getPlayer(this.number === 1 ? 2 : 1);
        }
        
        return this.opponent;
    }



    return Player;
}();