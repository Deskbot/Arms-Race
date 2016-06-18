let Game = function() {
    //constructor
    function Game(container, speed) {
        this.container = container;
        this.player1 = new Player(this, 1);
        this.player2 = new Player(this, 2);
        this.log = new Log(this);
        this.speed = speed; //miliseconds

        this.startTime();
    }

    //attributes
    Game.prototype.intervalKey = undefined;


    //methods
    Game.prototype.startTime = function() {
        this.intervalKey = setInterval(this.advance.bind(this), this.speed);
    }

    Game.prototype.getPlayer = function(number) {
        return number == 1 || number == 2 ? this['player' + number] : undefined;
    }

    Game.prototype.advance = function() {
        this.advancePlayer(this.player1);
        this.advancePlayer(this.player2);
    }

    Game.prototype.advancePlayer = function(player) {
        let keys = Population.jobs.keys();
        let bag = player.bag;

        for (let key of keys) {
            
            let workers = player.population.inJob(key);
            let job = Population.jobs.get(key);
            let resources = job.resources;
            let possible = undefined;
            let changes = {};

            for (let item in resources) {
                let change = Math.floor(resources[item] * workers);
                changes[item] = change;

                if (item === 'population') {
                    player.population.alter(change);

                } else if (!bag.canAlterQuantity(item, change)) {
                    possible = false;
                    break;
                }
            }

            if (possible !== false) {
                for (let item in changes) {
                    bag.alterQuantity(item, changes[item]);

                    let event = job.event;
                    if (typeof event === 'function') event.bind(player.population)(); //add context of the player's population and run
                }
            }
        }
    }

    return Game;
}();











/*
Game.prototype.displayInterface = function() {
    let occupationsElem = this.container.find('.occupations').html(Occupations.buildInterface());
}
*/