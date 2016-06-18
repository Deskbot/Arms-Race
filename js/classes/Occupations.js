let Occupations = function() {
    function Occupations() {}

    //attributes
    Occupations.template = $('#occupation');

    //changes will have been made elsewhere
    Occupations.list = new Map();
    Occupations.list.set('being-merry', {
        name: 'Being Merry',
        resources: {
            population: 0.5
        }
    });
    Occupations.list.set('logger', {
        name: 'Logger',
        resources: {
            wood: 1
        }
    });
    Occupations.list.set('farmer', {
        name: 'Farmer',
        resources: {
            grain: 1
        }
    });
    Occupations.list.set('miner', {
        name: 'Miner',
        resources: {
            ore: 1,
            bread: -1
        }
    });
    Occupations.list.set('baker', {
        name: 'Baker',
        resources: {
            water: -1,
            grain: -1,
            bread: 4
        }
    });
    Occupations.list.set('water-carrier', {
        name: 'Water Carrier',
        resources: {
            water: 1
        }
    });


    //methods





    return Occupations;
}();




/*

    Occupations.buildInterface = function() {
        let output = "";
        let keys = Occupations.list.keys();
        
        for (key of keys) {
            output += Occupations.buildHtml(key);
        }

        return output;
    }

    Occupations.buildHtml = function(id) {
        let data = Occupations.list.get(id);
        let newOccupation = $(Occupations.template.html());

        newOccupation.find('.name').html(data.name);
        newOccupation.find('.resources').html(Occupations.buildResources(data.resources));
        
        let result = newOccupation.wrap('<div>').parent().html();

        return result;
    }

    Occupations.buildResources = function(resources) {
        let result = [];

        for (key in resources) {
            result.push(key + ' ' + resources[key]);
        }

        return '(' + result.join(',') + ')';
    }
    */