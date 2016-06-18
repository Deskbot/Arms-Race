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
        let resultPointer = this.pointer.next('.option');

        if (resultPointer.length != 0) {
            this.pointer.removeClass(Controller.selected);
            this.pointer = resultPointer;
            this.pointer.addClass(Controller.selected);
        }
        
        return this.pointer;
    }

    Controller.prototype.prev = function() {
        let resultPointer = this.pointer.prev('.option');

        if (resultPointer.length != 0) {
            this.pointer.removeClass(Controller.selected);
            this.pointer = resultPointer;
            this.pointer.addClass(Controller.selected);
        }
        
        return this.pointer;
    }

    Controller.prototype.increase = function() {
        let job = this.pointer.data('job');
        this.owner.population.increase(job);
    }

    Controller.prototype.decrease = function() {
        let job = this.pointer.data('job');
        this.owner.population.decrease(job);
    }



    return Controller;
}();