let Population = function() {
    //constructor
    function Population(owner) {
        this.owner = owner;
        this.population = Population.hutSize * Bag.startingHutQuantity;

        //elements
        this.populationElem = this.owner.side.find('.population');
        this.populationQtyElem = this.populationElem.children('.quantity');
        this.limitElem = this.populationElem.children('.limit');

        this.setLimit(this.population);

        this.workers = new Map();

        //prepare
        for (key of Population.jobs.keys()) {
            this.setQuantity(key, 0);
        }
        
        this.setQuantity('being-merry', this.population);

        this.updatePopulation();
    }

    //attributes
    Population.prototype.limit = 10;
    Population.hutSize = 5;

    Population.jobs = function() {
        let jobs = new Map();
        jobs.set('being-merry', {
            name: 'Being Merry',
            deathName: 'merry citizen',
            resources: {
                alcohol: -1,
                population: 0.5
            }
        });
        jobs.set('logger', {
            name: 'Logger',
            resources: {
                wood: 1
            }
        });
        jobs.set('farmer', {
            name: 'Farmer',
            resources: {
                grain: 1
            }
        });
        jobs.set('miner', {
            name: 'Miner',
            resources: {
                ore: 1,
                bread: -1
            }
        });
        jobs.set('baker', {
            name: 'Baker',
            resources: {
                water: -1,
                grain: -1,
                bread: 4
            }
        });
        jobs.set('water-carrier', {
            name: 'Water Collector',
            resources: {
                water: 1
            }
        });
        jobs.set('rearer', {
            name: 'Rearer',
            resources: {
                grain: -30,
                livestock: 1
            }
        });
        jobs.set('builder', {
            name: 'Builder',
            resources: {
                wood: -30,
                hut: 1
            },
            event: function() {//needs binding to a population
                this.correctLimit();
            }
        });
        jobs.set('refiner', {
            name: 'Refiner',
            resources: {
                iron: 1,
                ore: -1,
                bread: -1
            }
        });
        jobs.set('fermenter', {
            name: 'Fermenter',
            resources: {
                alcohol: 1,
                grain: -2,
                water: -1
            }
        });
        jobs.set('weaver', {
            name: 'Weaver',
            resources: {
                cotton: -1,
                cloth: 1
            }
        });
        jobs.set('cotton-picker', {
            name: 'Cotton Picker',
            resources: {
                cotton: 1
            }
        });
        jobs.set('butcher', {
            name: 'Butcher',
            resources: {
                meat: 4,
                livestock: -1
            }
        });
        jobs.set('super-logger', {
            name: 'Super Logger',
            resources: {
                meat: -1,
                wood: 20
            }
        });
        jobs.set('super-cotton-picker', {
            name: 'Super Cotton Picker',
            resources: {
                meat: -1,
                cotton: 20
            }
        });
        jobs.set('super-farmer', {
            name: 'Super Farmer',
            resources: {
                meat: -1,
                grain: 20
            }
        });
        jobs.set('super-water-carrier', {
            name: 'Super Water Collector',
            resources: {
                meat: -1,
                water: 20
            }
        });
        jobs.set('super-miner', {
            name: 'Super Miner',
            resources: {
                meat: -1,
                ore: 20
            }
        });

        return jobs;
    }();


    //methods
    Population.prototype.correctLimit = function() {
        this.setLimit(this.owner.bag.getQuantity('hut') * Population.hutSize);
    }
    Population.prototype.setLimit = function(limit) {
        this.limit = limit;
        this.updateLimit();
    };
    Population.prototype.updateLimit = function() {
        this.limitElem.html(this.limit);
    };
    Population.prototype.alter = function(change, alterMerry) {
        let maxPopulation = this.owner.bag.getQuantity('hut') * Population.hutSize;
        let newPopulation = this.population + change;

        if (newPopulation > maxPopulation) {
            newPopulation = maxPopulation;
            change = newPopulation - this.population;
        }

        this.population = newPopulation;
        
        if (alterMerry !== false) this.alterQuantity('being-merry', change);
        this.updatePopulation();
    };
    Population.prototype.updatePopulation = function() {
        this.populationQtyElem.html(this.population);
    };
    Population.prototype.getQuantity = function(job) {
        return this.workers.get(job);
    };

    Population.prototype.setQuantity = function(job, number) {
        this.workers.set(job, number);
        this.updateQuantity(job);
    };
    Population.prototype.alterQuantity = function(job, number) {
        let currentQty = this.getQuantity(job);
        this.setQuantity(job, currentQty + number);
        this.updateQuantity(job);
    }
    Population.prototype.updateQuantity = function(job) {
        this.owner.side.find('.' + job).find('.quantity').html(this.getQuantity(job));
    };

    Population.prototype.increase = function(job) {
        if (this.getQuantity('being-merry') >= 1) {
            this.setQuantity(job, this.workers.get(job) + 1);
            this.alterQuantity('being-merry', -1);
            //this.setQuantity('being-merry', this.getQuantity('being-merry'));

            //this.updateQuantity(job);
        }
    }

    Population.prototype.decrease = function(job) {
        if (this.getQuantity(job) >= 1) {
            this.setQuantity(job, this.workers.get(job) - 1);
            this.alterQuantity('being-merry', 1);
            //this.setQuantity('being-merry', this.getQuantity('being-merry'));

            //this.updateQuantity(job);
        }
    };

    Population.prototype.inJob = function(job) {
        if (typeof job === 'undefined') {
            let total = 0;
            for (let val of this.workers.values()) {
                total += val;
            }
            return total - this.inJob('being-merry');
        }

        return this.workers.get(job);
    };

    Population.prototype.killRandom = function() {
        let workerNumber = Math.floor(Math.random() * (this.population - this.owner.military.totalActive()));
        let totalSoFar = 0;
        let victim;

        //console.log('debug:', this.owner.military.totalActive(), this.population, workerNumber);

        for (let job of this.workers.keys()) {
            //console.log(workerNumber, totalSoFar);
            totalSoFar += this.getQuantity(job);

            if (workerNumber < totalSoFar) {
                victim = job;
                break;
            }
        }

        if (typeof victim === 'undefined') {
            return this.killRandom();
        }

        this.kill(victim, 1);

        return victim;
    }

    Population.prototype.kill = function(job, qty) {
        let deathName;
        
        try {
            if (Military.roles.hasOwnProperty(job)) {
                this.owner.military.killInAction(job, qty);
                deathName = typeof Military.roles[job].deathName === 'undefined' ? Military.roles[job].name : Military.roles[job].deathName;
            } else {
                this.alterQuantity(job, -qty);
                this.population -= qty;//this is done in the military class for millitary roles
                this.updatePopulation();
                deathName = typeof Population.jobs.get(job).deathName === 'undefined' ? Population.jobs.get(job).name : Population.jobs.get(job).deathName;
            }
        } catch (e) {
            //console.log(deathName, job);
        }
        
        this.owner.game.log.put(this.owner.getClass() + "'s " + deathName + " was killed. x" + qty, this.owner);
    }

    Population.prototype.killsToDo = function(obj) {
        //console.log(obj);
        for (let role in obj) {
            
            if (role === 'civilian') {
                
                for (let i=0; i < obj[role]; i++) {
                    console.log(this.killRandom());
                }
                
            } else {
                if (obj[role] > 0) {
                    this.kill(role, obj[role]);
                }
            }
        }
    }

    return Population;
}();