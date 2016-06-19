let Population = function() {
    //constructor
    function Population(owner) {
        this.owner = owner;
        this.population = 5;

        //elements
        this.populationElem = this.owner.side.find('.population');
        this.populationQtyElem = this.populationElem.children('.quantity');
        this.limitElem = this.populationElem.children('.limit');

        this.setLimit(Population.hutSize);

        this.workers = new Map();

        //prepare
        for (key of Population.jobs.keys()) {
            this.setQuantity(key, 0);
        }
        
        this.setQuantity('being-merry', this.population);

        this.updatePopulation();
    }

    //attributes
    Population.prototype.limit = 5;
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
                grain: -10,
                livestock: 1
            }
        });
        jobs.set('builder', {
            name: 'Builder',
            resources: {
                wood: -10,
                hut: 1
            },
            event: function() { //requires binding to the population
                this.setLimit(this.correctLimit());
            }
        });
        jobs.set('refiner', {
            name: 'Refiner',
            resources: {
                iron: 1,
                ore: -1
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
                cloth: 1
            }
        });

        return jobs;
    }();


    //methods
    Population.prototype.correctLimit = function() {
        return this.owner.bag.getQuantity('hut') * Population.hutSize;
    }
    Population.prototype.setLimit = function(limit) {
        this.limit = limit;
        this.updateLimit();
    };
    Population.prototype.updateLimit = function() {
        this.limitElem.html(this.limit);
    };
    Population.prototype.alter = function(change) {
        let maxPopulation = this.owner.bag.getQuantity('hut') * Population.hutSize;
        let newPopulation = this.population + change;

        if (newPopulation > maxPopulation) {
            newPopulation = maxPopulation;
            change = newPopulation - this.population;
        }

        this.population = newPopulation;
        
        this.alterQuantity('being-merry', change);
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
        let currentQty = this.workers.get(job);
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
        if (typeof job === undefined) {
            let total = 0;
            for (let val of this.workers.values()) {
                total += val;
            }
            return total - this.inJob('being-merry');
        }

        return this.workers.get(job);
    };

    Population.prototype.killRandom = function() {
        let workerNumber = Math.floor(Math.random() * this.population);
        let totalSoFar = 0;
        let vicitm;

        for (let job of this.workers.keys()) {
            totalSoFar += this.getQuantity(job);

            if (workerNumber < totalSoFar) {
                vicitm = job;
            }
        }

        this.kill(job);

        return job;
    }

    Population.prototype.kill = function(job) {
        this.alterQuantity(job, -1);
        this.alter(-1);
    }



    return Population;
}();