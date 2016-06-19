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
    Game.prototype.greatState = function() {
        this.player1.bag.setQuantity('water', 1000);
        this.player1.bag.setQuantity('grain', 1000);
        this.player1.bag.setQuantity('alcohol', 1000);
        this.player1.bag.setQuantity('wood', 1000);
        this.player1.bag.setQuantity('ore', 1000);
        this.player1.bag.setQuantity('bread', 1000);
        this.player1.bag.setQuantity('livestock', 1000);
        this.player1.bag.setQuantity('iron', 1000);
        this.player1.bag.setQuantity('hut', 1000);
        this.player1.bag.setQuantity('cloth', 1000);
        this.player1.population.alter(1000);
        this.player1.population.setLimit(5000);
        

        this.player2.bag.setQuantity('water', 1000);
        this.player2.bag.setQuantity('grain', 1000);
        this.player2.bag.setQuantity('alcohol', 1000);
        this.player2.bag.setQuantity('wood', 1000);
        this.player2.bag.setQuantity('ore', 1000);
        this.player2.bag.setQuantity('bread', 1000);
        this.player2.bag.setQuantity('livestock', 1000);
        this.player2.bag.setQuantity('iron', 1000);
        this.player2.bag.setQuantity('hut', 1000);
        this.player2.bag.setQuantity('cloth', 1000);
        this.player2.population.alter(1000);
        this.player2.population.setLimit(5000);
        
    }
    Game.prototype.checkWinner = function() {
        let p1Lose = game.player1.population.population <= 0;
        let p2Lose = game.player2.population.population <= 0;
        
        if (p1Lose && p2Lose) {
            //draw
            alert("It's a draw.");
        } else if (p1Lose) {
            //p2win
            alert("Player 2 wins");
        } else if (p2Lose) {
            //p1win
            alert("Player 1 wins");
        }

        if (p1Lose || p2Lose) {
            this.stopTime();
        }

        //else play on
    }
    Game.prototype.startTime = function() {
        this.intervalKey = setInterval(this.advance.bind(this), this.speed);
    }

    Game.prototype.stopTime = function() {
        clearInterval(this.intervalKey);
    }

    Game.prototype.getPlayer = function(number) {
        return number === 1 || number === 2 ? this['player' + number] : undefined;
    }

    Game.prototype.advance = function() {
        this.advancePlayer(this.player1);
        this.advancePlayer(this.player2);
    }

    Game.prototype.advancePlayer = function(player) {
        this.advancePlayerItems(player);
        this.advancePlayerMilitary(player);
        this.checkWinner();
    }

    Game.prototype.advancePlayerMilitary = function(player) {
        let military = player.military;
        let bag = player.bag;
        let opponent = player.getOpponent();

        //pay the cost

        for (let role in military.inAction) {
            
            let roleData = Military.roles[role];
            let active = military.getNumActive(role);

            let possibleMultipliers = [active];

            for (let item in roleData.resources) {
                let change = Math.floor(roleData.resources[item] * active);
                
                if (roleData.resources[item] < 0) {
                    //add to the possibilities the number of times (rounded down divide) the amount can subtract from the number of items
                    possibleMultipliers.push( Math.floor(bag.getQuantity(item) / Math.abs(roleData.resources[item])) );
                }
            }

            let multiplier = possibleMultipliers.min();

            if (multiplier !== 0) { //changes are to be made
                for (let item in roleData.resources) {
                    bag.alterQuantity(item, roleData.resources[item] * multiplier);
                }

                //put effect into effect

                for (let effectItem in roleData.effect) {
                    if (effectItem === 'population') { //special case
                        //opponent.population.alter(roleData.effect.population * multiplier);
                        military.kill(role, multiplier * roleData.effect[effectItem]);
                    } else {
                        opponent.bag.alterQuantity(roleData.effect[effectItem] * multiplier);
                    }

                    // activate event

                    if (typeof roleData.event === 'function') {
                        roleData.event.bind(player.military)();
                    }
                }

            }
        }


    }

    Game.prototype.advancePlayerItems = function(player) {
        let keys = Population.jobs.keys();
        let bag = player.bag;

        for (let key of keys) {
            
            let workers = player.population.inJob(key);
            let job = Population.jobs.get(key);
            let resources = job.resources;
            let possible = undefined;
            let changes = {};

            let possibleMultipliers = [workers];
            

            for (let item in resources) {

                if (item === 'population') { //special case

                    possibleMultipliers.push(Math.floor(Math.floor(workers * resources[item]) / resources[item]));

                    let mostPossible = player.population.limit - player.population.population;
                    let maxMultiplier = Math.floor(mostPossible / resources[item]);

                    possibleMultipliers.push(maxMultiplier);

                } else if (resources[item] < 0) {
                    //add to the possibilities the number of times (rounded down divide) the amount can subtract from the number of items
                    possibleMultipliers.push( Math.floor(bag.getQuantity(item) / Math.abs(resources[item])) );
                }
            }

            let multiplier = possibleMultipliers.min();

            if (resources.hasOwnProperty('population') && multiplier % 2 === 1) {
                multiplier--;
            }

            if (multiplier > 0) { //can do at least 1
                for (let item in resources) {
                    if (item === 'population') { //special case
                        player.population.alter(Math.floor(resources[item] * multiplier));
                    } else {
                        bag.alterQuantity(item, Math.floor(resources[item] * multiplier));
                    }
                }

                //do event

                if (typeof job.event === 'function') {
                    for (let i=0; i < multiplier; i++) job.event.bind(player.population)();
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