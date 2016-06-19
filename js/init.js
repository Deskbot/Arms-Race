$(document).ready(steadyGo);

//globals
let game;

function steadyGo() {
    game = new Game($('main'), 1000);

    //listeners
    let body = $('body');

    body.keydown(function(event) {
        switch(event.which) {
            //traversing options
            case 87: //w
                game.player1.controller.prev();
                break;

            case 83: //s
                game.player1.controller.next();
                break;

            case 38: //up
                game.player2.controller.prev();
                break;

            case 40: //down
                game.player2.controller.next();
                break;

            case 65: //a
                if (!game.player1.controller.isAtMilitary()) {
                    game.player1.controller.decrease();
                }
                
                break;

            case 68: //d
                game.player1.controller.increase();
                
                break;

            case 37: //left
                if (!game.player2.controller.isAtMilitary()) {
                    game.player2.controller.decrease();
                }

                break;

            case 39: //right
                game.player2.controller.increase();
                
                break;
        }
    });
}