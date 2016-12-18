let Military = function() {
    //constructor
    function Military(owner) {
        this.owner = owner;
        this.inAction = {
            arsonist: 0,
            footsoldier: 0,
            horseman: 0,
            'tank-driver': 0
        };

        this.inActionElem = this.owner.side.children('.military');
    }

    //attributes
    Military.roles = {
        arsonist: {
            name: 'Arsonist',
            strength: 0,
            resources: {
                alcohol: -5,
                cloth: -5,
                wood: -10
            },
            effect: {
                hut: -1
            },
            event: function() { //needs binding to military
                this.killInAction('arsonist', 1);
            }
        },
        footsoldier: {
            name: 'Footsoldier',
            strength: 1,
            resources: {
                iron: -20,
                cloth: -5
            },
            effect: {
                population: -2
            }
        },
        horseman: {
            name: 'Horseman',
            strength: 2,
            resources: {
                iron: -10,
                cloth: -10
            },
            effect: {
                population: -5
            }
        },
        "tank-driver": {
            name: 'Tank Driver',
            strength: 3,
            resources: {
                iron: -100
            },
            effect: {
                population: -10
            }
        }
    };
    Military.strengthToRole = {
        0: 'arsonist',
        1: 'footsoldier',
        2: 'horseman',
        3: 'tank-driver'
    };

    //methods
    Military.prototype.kill = function(role, quantity) {
        //prioritise kill on opp military
        let killsRemaining = quantity;
        let opponent = this.owner.getOpponent();
        let foe = opponent.military;

        for (let targetStrength = role.strength; targetStrength >= 0 && killsRemaining >= 0; targetStrength--) {
            let targetRole = Military.strengthToRole[targetStrength];
            let targets = foe.getNumActive(targetRole);
            let reduction;

            if (targets > killsRemaining) {
                reduction = killsRemaining;
            } else {
                reduction = targets;
            }

            foe.alterInAction(targetRole, reduction);

            killsRemaining -= reduction;
        }

        //kill civilians
        let job;
        if (killsRemaining > 0) {
            job = opponent.population.killRandom();
            console.log(job);
        }

        //add to log
        let jobData = Population.jobs.get(job);
        let deathName = typeof jobData.deathName !== 'undefined' ? jobData.deathName : jobData.name;
        this.owner.game.log.put(opponent.getClass() + "'s " + deathName + " was killed.", this.owner);

        game.stopTime(); //provisional

    };
    Military.prototype.killInAction = function(role, qty) {
        this.alterInAction(role, -qty);
        this.owner.population.population -= qty;
        this.owner.population.updatePopulation();
    };
    Military.prototype.increase = function(role) {
        if (this.owner.population.getQuantity('being-merry') >= 1) {
            this.setNumActive(role, this.getNumActive(role) + 1);
            this.owner.population.alterQuantity('being-merry', -1);
        }
    }
    Military.prototype.setNumActive = function(role, qty) {
        this.inAction[role] = qty;
        this.updateInAction(role);
    }
    Military.prototype.getNumActive = function(role) {
        return this.inAction[role];
    }
    Military.prototype.totalActive = function() {
        return this.inAction.arsonist + this.inAction.footsoldier + this.inAction.horseman + this.inAction['tank-driver']
    }

    Military.prototype.alterInAction = function(role, amount) {
        this.inAction[role] += amount;
        this.updateInAction(role);
    }
    Military.prototype.updateInAction = function(role) {
        this.inActionElem.find('[data-role=' + role + ']').children('.quantity').html(this.inAction[role]);
        this.owner.side.find('.military[data-job=' + role + ']').children('.buttons').children('.quantity').html(this.inAction[role]);
    }
    Military.prototype.removeAll = function() {
        for (let role in this.inAction) {
            //this.owner.population.alter(-this.inAction[role], false);
            this.owner.population.population -= this.inAction[role];
            this.owner.population.updatePopulation();
            this.inAction[role] = 0;
            this.updateInAction(role);
        }
    }
    Military.prototype.roleKillerQty = function(roleName) {
        let roleQty = this.getNumActive(roleName);
        let roleData = Military.roles[roleName];
        
		//min of num of tanks, most constrained by resources, min needed to win, 
        return [
        	roleQty,
        	this.owner.bag.mostMultiples(roleData.resources),
        	Math.ceil(Math.abs(this.owner.opponent.population.population / roleData.effect.population))
    	].min();
    };

    return Military;
}();