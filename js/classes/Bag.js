let Bag = function() {
    //constructor
    function Bag(owner) {
        this.owner = owner;
        this.inventoryElem = this.owner.side.children('.inventory');

        this.items = function() {
            let items = new Map();

            for (let i=0; i < Bag.items.length; i++) {
                items.set(Bag.items[i], 0);
            }

            return items;
        }();

        this.setQuantity('hut', Bag.startingHutQuantity);
    }

    //attributes
    Bag.startingHutQuantity = 2;
    Bag.items = ['water', 'grain', 'wood', 'ore', 'bread', 'livestock', 'iron', 'alcohol', 'cloth', 'hut', 'cotton', 'meat'];

    //static methods
    Bag.multiplyResources = function(resources, mult) {
        let resources2 = {};

        for (let res in resources) {
            resources2[res] = resources[res] * mult;
        }

        return resources2;
    };

    //methods
    Bag.prototype.canAlterQuantity = function(item, difference) {
        let currentQty = this.getQuantity(item);

        return currentQty + difference >= 0;
    };
    Bag.prototype.alterQuantity = function(item, difference, update) {
        let qty = this.getQuantity(item);
        this.setQuantity(item, qty + difference, update);
    };
    Bag.prototype.alterTheseQuantities = function(resources, update) {
        for (let res in resources) {
            this.alterQuantity(res, resources[res], update);
        }
    };
    Bag.prototype.setQuantity = function(item, qty, update) {
        this.items.set(item, qty);
        if (update !== false) this.updateQuantity(item);
    };
    Bag.prototype.getQuantity = function(item) {
        return this.items.get(item);
    };
    Bag.prototype.updateQuantity = function(item) {
        let newQty = this.getQuantity(item);
        this.inventoryElem.find('[data-item=' + item + ']').children('.quantity').html(newQty);
    };
    Bag.prototype.mostMultiples = function(resources) {
        let possibleMultipliers = [];

        for (let item in resources) {

            if (item === 'population') { //special case
                possibleMultipliers.push(Math.floor(Math.floor(workers * resources[item]) / resources[item]));

                let mostPossible = this.owner.population.limit - this.owner.population.population;
                let maxMultiplier = Math.floor(mostPossible / resources[item]);

                possibleMultipliers.push(maxMultiplier);

            } else if (resources[item] < 0) {
                //add to the possibilities the number of times (rounded down divide) the amount can subtract from the number of items
                possibleMultipliers.push( Math.floor(this.getQuantity(item) / Math.abs(resources[item])) );
            }
        }

        return possibleMultipliers.min();
    };



    return Bag;
}();