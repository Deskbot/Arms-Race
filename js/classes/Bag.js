let Bag = function() {
    //constructor
    function Bag(owner) {
        this.owner = owner;
        this.inventoryElem = this.owner.side.children('.inventory');

        this.items = function() {
            let items = new Map();

            items.set('water', 0);
            items.set('grain', 0);
            items.set('bread', 0);
            items.set('ore', 0);
            items.set('wood', 0);
            items.set('livestock', 0);
            items.set('footsoldier', 0);
            items.set('horseman', 0);
            items.set('tank-driver', 0);

            return items;
        }();  
    }

    //attributes


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