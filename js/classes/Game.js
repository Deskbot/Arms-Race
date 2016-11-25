let Game = function() {
    //constructor
    function Game(container, speed) {
        this.container = container;
        this.blueLayer = $('#blue-layer');
        this.player1 = new Player(this, 1);
        this.player2 = new Player(this, 2);
        this.log = new Log(this);
        this.speed = speed; //milliseconds

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
        this.player1.bag.setQuantity('meat', 1000);
        this.player1.bag.setQuantity('cotton', 1000);
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
        this.player2.bag.setQuantity('meat', 1000);
        this.player2.bag.setQuantity('cotton', 1000);
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

    Game.prototype.updateScreen = function() {
        let percent = this.player2.population.population / (this.player1.population.population + this.player2.population.population);
        this.blueLayer.css('width', percent * 100 + "%");
    }

    Game.prototype.advance = function() {
        this.advancePlayer(this.player1);
        this.advancePlayer(this.player2);

        this.player1.population.killsToDo(this.player2.military.kills);
        this.player2.population.killsToDo(this.player1.military.kills);

        

        //console.log(this.player1.military.kills);
        //console.log(this.player2.military.kills);

        //total kills
        for (let key in this.player1.military.kills) {
            //console.log(this.player1.military.kills[key]);
            if (this.player1.military.kills[key] > 0) {
                shake($('body'),0,0,500,75,4);
                //console.log('it shakes');
                break;
            }
        }
        for (let key in this.player2.military.kills) {
            //console.log(this.player2.military.kills[key]);
            if (this.player2.military.kills[key] > 0) {
                shake($('body'),0,0,500,75,4);
                //console.log('it shakes');
                break;
            }
        }

        this.player1.military.removeAll();
        this.player2.military.removeAll();

        this.updateScreen();

        this.checkWinner();
    }

    Game.prototype.advancePlayer = function(player) {
        this.advancePlayerItems(player);
        this.advancePlayerMilitary(player);
    }

    Game.prototype.advancePlayerMilitary = function(player) {
        let military = player.military;
        let opponent = player.getOpponent();

        //arson

        let arsonists = military.getNumActive('arsonist');
        if (arsonists > 0) {
            let opponentHutQty = opponent.bag.getQuantity('hut');
            if (arsonists > opponentHutQty) {
                arsonists = opponentHutQty;
            }

            opponent.bag.alterQuantity('hut', -arsonists);
            opponent.population.correctLimit();
            military.killInAction('arsonist', arsonists);
        }

        //kills

        let kills = {
            'tank-driver': 0,
            horseman: 0,
            footsoldier: 0,
            arsonist: 0,
            civilian: 0
        }

        //console.log(military.getNumActive('tank-driver'), military.getNumActive('horseman'), military.getNumActive('footsoldier'), military.getNumActive('arsonist'));
        //console.log(opponent.military.getNumActive('tank-driver'), opponent.military.getNumActive('horseman'), opponent.military.getNumActive('footsoldier'), opponent.military.getNumActive('arsonist'));

        //tanks
        let deadHorsemen, deadFootsoldiers, deadArsonists, deadCivilians;

        let tankKillers = military.roleKillerQty('tank-driver');
        let tankData = Military.roles['tank-driver'];
        let tankKillsLeft = Math.abs(tankKillers * tankData.effect.population);

        deadTankDrivers = [opponent.military.getNumActive('tank-driver'), tankKillsLeft].min();
        tankKillsLeft -= deadTankDrivers;
        deadHorsemen = [opponent.military.getNumActive('horseman'), tankKillsLeft].min();
        tankKillsLeft -= deadHorsemen;
        deadFootsoldiers = [opponent.military.getNumActive('footsoldier'), tankKillsLeft].min();
        tankKillsLeft -= deadFootsoldiers;

        deadCivilians = [tankKillsLeft, opponent.population.population].min();

        //use up resources for the attack
        player.bag.alterTheseQuantities(Bag.multiplyResources(tankData.resources, tankKillers));

        kills['tank-driver'] += deadTankDrivers;
        kills.horseman += deadHorsemen;
        kills.footsoldier += deadFootsoldiers;
        kills.arsonist += deadArsonists;
        kills.civilian += deadCivilians;

        //horsemen

        let horsemen = military.getNumActive('horseman');
        let horsemanData = Military.roles['horseman'];
        let horsemanKillers = military.roleKillerQty('horseman');
        let horsemanKillsLeft = Math.abs(horsemanKillers * horsemanData.effect.population);

        deadHorsemen = [opponent.military.getNumActive('horseman'), horsemanKillsLeft].min();
        horsemanKillsLeft -= deadHorsemen;
        deadFootsoldiers = [opponent.military.getNumActive('footsoldier'), horsemanKillsLeft].min();
        horsemanKillsLeft -= deadFootsoldiers;

        deadCivilians = [horsemanKillsLeft, opponent.population.population].min();

        //use up resources for the attack
        player.bag.alterTheseQuantities(Bag.multiplyResources(horsemanData.resources, horsemanKillers));

        kills.horseman += deadHorsemen;
        kills.footsoldier += deadFootsoldiers;
        kills.arsonist += deadArsonists;
        kills.civilian += deadCivilians;

        //footsoldier

        let footsoldiers = military.getNumActive('footsoldier');
        let footsoldierData = Military.roles['footsoldier'];
        let footsoldierKillers = military.roleKillerQty('footsoldier');
        let footsoldierKillsLeft = Math.abs(footsoldierKillers * footsoldierData.effect.population);

        deadFootsoldiers = [opponent.military.getNumActive('footsoldier'), footsoldierKillsLeft].min();
        footsoldierKillsLeft -= deadFootsoldiers;
        
        deadCivilians = [footsoldierKillsLeft, opponent.population.population].min();

        //use up resources for the attack
        player.bag.alterTheseQuantities(Bag.multiplyResources(footsoldierData.resources, footsoldierKillers));

        kills.footsoldier += deadFootsoldiers;
        kills.arsonist += deadArsonists;
        kills.civilian += deadCivilians;

        military.kills = kills;
        //military.killedInActionQty = footsoldierKillers + horsemanKillers + tankKillers; //probably what it should be to determine which military people get killed but in fact it's already programmed to do all of them
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






/*

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

*/