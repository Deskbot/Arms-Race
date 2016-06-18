let Population = function() {
    //constructor
    function Population(owner) {
        this.owner = owner;
        this.population = 5;
        this.unoccupied = this.population;

        this.workers = new Map();
        for (key of Population.jobs.keys()) {
            this.setQuantity(key, 0);
        }

        this.setQuantity('being-merry', this.population);

        this.displayPopulation();
    }

    //attributes
    Population.jobs = function() {
        let jobs = new Map();
        jobs.set('being-merry', {
            name: 'Being Merry',
            resources: {
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
            name: 'Water Carrier',
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

        return jobs;
    }();


    //methods
    Population.prototype.alter = function(change) {
        this.population += change;
        this.alterQuantity('being-merry', change);
        this.displayPopulation();
        
    };
    Population.prototype.displayPopulation = function() {
        this.owner.side.find('.population').children('.quantity').html(this.population);
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
        this.updateQuantity();
    }
    Population.prototype.updateQuantity = function(job) {
        this.owner.side.find('.' + job).find('.quantity').html(this.getQuantity(job));
    };

    Population.prototype.increase = function(job) {
        if (this.unoccupied >= 1) {
            this.setQuantity(job, this.workers.get(job) + 1);
            this.unoccupied--;
            this.setQuantity('being-merry', this.unoccupied);

            this.updateQuantity(job);
        }
    }

    Population.prototype.decrease = function(job) {
        if (this.getQuantity(job) >= 1) {
            this.setQuantity(job, this.workers.get(job) - 1);
            this.unoccupied++;
            this.setQuantity('being-merry', this.unoccupied);

            this.updateQuantity(job);
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

    



    return Population;
}();