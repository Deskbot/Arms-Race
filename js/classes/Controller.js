let Controller = function() {
    //constructor
    function Controller(owner) {
        this.owner = owner;
        this.side = owner.side;
        this.items = this.side.children('.control-list').children('.option');
        this.pointer = this.items.first();
        this.pointer.addClass(Controller.selected);
    }

    //attributes
    Controller.selected = 'selected';


    //methods
    Controller.prototype.next = function() {
        let resultPointer = this.pointer.nextAll('.option').first();

        this.pointer.removeClass(Controller.selected);

        if (resultPointer.length != 0) {
            this.pointer = resultPointer;
        } else {
            this.pointer = this.items.first();
        }

        this.pointer.addClass(Controller.selected);
        
        return this.pointer;
    }

    Controller.prototype.prev = function() {
        let resultPointer = this.pointer.prevAll('.option').first();

        this.pointer.removeClass(Controller.selected);

        if (resultPointer.length != 0) {
            this.pointer = resultPointer;
        } else {
            this.pointer = this.items.last();
        }

        this.pointer.addClass(Controller.selected);
        
        return this.pointer;
    }

    Controller.prototype.increase = function() {
        let option = this.pointer.data('job');

        if (Military.roles.hasOwnProperty(option)) {
            let resources = Military.roles[option].resources;

            for (let item in resources) {
                if (this.owner.bag.getQuantity(item) + resources[item] >= 0) {
                    this.owner.military.increase(option);
                } else {
                    break; //not enough materials
                }
            }
            
        } else {
            this.owner.population.increase(option);
        }
    }

    Controller.prototype.decrease = function() {
        let job = this.pointer.data('job');
        this.owner.population.decrease(job);
    }

    Controller.prototype.isAtMilitary = function() {
        return this.pointer.hasClass('military');
    }


    return Controller;
}();