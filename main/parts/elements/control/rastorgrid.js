this.rastorgrid = function(
    id='rastorgrid', 
    x, y, width, height,
    xcount, ycount,
    backingStyle = 'fill:rgba(200,200,200,1)',
    checkStyle = 'fill:rgba(150,150,150,1)',
    backingGlowStyle = 'fill:rgba(220,220,220,1)',
    checkGlowStyle = 'fill:rgba(220,220,220,1)',
){
    // elements
    var object = system.utility.misc.elementMaker('g',id,{x:x, y:y});
    var rect = system.utility.misc.elementMaker('rect',null,{width:width,height:height, style:backingStyle});
        object.appendChild(rect);

    for(var y = 0; y < ycount; y++){
        for(var x = 0; x < xcount; x++){
            var temp = system.utility.misc.elementMaker('checkbox_rect',y+'_'+x,{
                x:x*(width/xcount), 
                y:y*(height/ycount), 
                width:width/xcount, 
                height:height/ycount, 
                style:{
                    check:checkStyle,
                    backing:backingStyle,
                    checkGlow:checkGlowStyle,
                    backingGlow:backingGlowStyle,
                }
            });
            object.appendChild(temp);
            temp.onchange = function(){ if(object.onchange){object.onchange(object.get());} };
        }
    }


    //methods
    object.box = function(x,y){ return object.children[y+'_'+x]; };
    object.get = function(){
        var outputArray = [];

        for(var y = 0; y < ycount; y++){
            var temp = [];
            for(var x = 0; x < xcount; x++){
                temp.push(this.box(x,y).get());
            }
            outputArray.push(temp);
        }

        return outputArray;
    };
    object.set = function(value, update=true){
        for(var y = 0; y < ycount; y++){
            for(var x = 0; x < xcount; x++){
                object.box(x,y).set(value[y][x],false);
            }
        }
    };
    object.clear = function(){
        for(var y = 0; y < ycount; y++){
            for(var x = 0; x < xcount; x++){
                object.box(x,y).set(false,false);
            }
        }
    };
    object.light = function(x,y,state){
        object.box(x,y).light(state);
    };


    //callback
    object.onchange = function(){};


    return object;
};