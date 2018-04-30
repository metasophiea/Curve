this.level = function(
    id='level',
    x, y, angle,
    width, height,
    layerCount=1,
    backingStyle='fill:rgb(10,10,10)',
    levelStyles=['fill:rgb(250,250,250)','fill:rgb(200,200,200)']
){
    var values = Array.apply(null, Array(layerCount)).map(Number.prototype.valueOf,0);

    // elements
        var object = parts.basic.g(id, x, y);

        //level layers are layered from back forward, so backing must go on last
        var levels = [];
        for(var a = 0; a < layerCount; a++){
            var tempStyle = levelStyles[a]!=undefined ? levelStyles[a] : levelStyles[0];
            var temp = parts.basic.rect(
                'movingRect_'+a,
                (-height*Math.sin(angle) + width*Math.cos(angle)).toFixed(10),
                (height*Math.cos(angle) + width*Math.sin(angle)).toFixed(10),
                width,
                0,
                angle+Math.PI,
                tempStyle
            );
            levels.push(temp);
            object.prepend(temp);
        }

        var backing = parts.basic.rect('backing', 0, 0, width, height, angle, backingStyle);
            object.prepend(backing);

    //methods
        object.set = function(a, layer=0){
            if(a==null){return value;}

            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            value = a;

            levels[layer].height.baseVal.valueInSpecifiedUnits = height*value;
        };
        object.getLevelStyle = function(levelLayer){
            return levels[levelLayer].style;
        };

    return object;
};