Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

//shake($('body'),10,10,10000,20)
function shake(elem, weightX, weightY, duration, vigourlessness, wildness) {
    let baseTop = Number(elem.css('top').replace(/\D/g,''));
    let baseLeft = Number(elem.css('left').replace(/\D/g,''));

    let offset = {
        x: 0,
        y: 0
    };

    let xRising = true;
    let yRising = true;

    console.log(baseTop, baseLeft);
    
    let interval = setInterval(function() {
        
        console.log(offset);

        if (xRising) {
            if (offset.x < weightX + wildness) {
                //rise x
                offset.x += wildness;
            } else {
                //lower x
                offset.x -= wildness;
                xRising = false;
            }
            
        } else { //is falling
            if (offset.x > weightX - wildness) {
                //rise x
                offset.x += wildness;
                xRising = true;
            } else {
                //lower x
                offset.x -= wildness;
            }
        }
        /*
        if (yRising) {
            if (offset.y < weightY + wildness) {
                //rise y
                offset.y += wildness;
            } else {
                //lower y
                offset.y -= wildness;
                yRising = false;
            }
            
        } else { //is falling
            if (offset.y > weightY - wildness) {
                //rise y
                offset.y += wildness;
                yRising = true;
            } else {
                //lower y
                offset.y -= wildness;
            }
        }*/

        //elem.css('top', baseTop + offset.y + 'px');
        elem.css('left', baseLeft + offset.x + 'px');

    }, vigourlessness);

    setTimeout(function() {
        clearInterval(interval);
    }, duration);
}


/*
let randX = Math.floor(Math.random() * 2);
let randY = Math.floor(Math.random() * 2);
*/