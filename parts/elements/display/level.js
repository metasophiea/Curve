this.level = function(
    id='level',
    x, y, angle,
    width, height,
    backingStyle='fill:rgb(10,10,10)',
    levelStyles=['fill:rgb(250,250,250)','fill:rgb(200,200,200)']
){
    var values = Array.apply(null, Array(levelStyles.length)).map(Number.prototype.valueOf,0);

    // elements
        var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y});

        //level layers are layered from back forward, so backing must go on last
        var levels = [];
        for(var a = 0; a < levelStyles.length; a++){
            var tempStyle = levelStyles[a]!=undefined ? levelStyles[a] : levelStyles[0];

            var temp = __globals.utility.experimental.elementMaker('rect','movingRect_'+a,{
                x:(-height*Math.sin(angle) + width*Math.cos(angle)).toFixed(10), 
                y:(height*Math.cos(angle) + width*Math.sin(angle)).toFixed(10),
                width:width,
                height:0, 
                angle:angle+Math.PI,
                style:tempStyle
            });
            levels.push(temp);
            object.prepend(temp);
        }

        var backing = __globals.utility.experimental.elementMaker('rect','movingRect_'+a,{width:width, height:height, angle:angle, style:backingStyle});
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