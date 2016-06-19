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

        this.setQuantity('hut', 1);
    }

    //attributes
    Bag.items = ['water', 'grain', 'wood', 'ore', 'bread', 'livestock', 'iron', 'alcohol', 'cloth', 'hut'];

    //methods
    Bag.prototype.canAlterQuantity = function(item, difference) {
        let currentQty = this.getQuantity(item);

        return currentQty + difference >= 0;
    }
    Bag.prototype.alterQuantity = function(item, difference, update) {
        let qty = this.getQuantity(item);
        this.setQuantity(item, qty + difference, update);
    }
    Bag.prototype.setQuantity = function(item, qty, update) {
        this.items.set(item, qty);
        if (update !== false) this.updateQuantity(item);
    }
    Bag.prototype.getQuantity = function(item) {
        return this.items.get(item);
    }
    Bag.prototype.updateQuantity = function(item) {
        let newQty = this.getQuantity(item);
        this.inventoryElem.find('[data-item=' + item + ']').children('.quantity').html(newQty);
    }




    return Bag;
}();