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
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);

    for(var y = 0; y < ycount; y++){
        for(var x = 0; x < xcount; x++){
            var temp = parts.control.checkbox_rect(y+'_'+x, x*(width/xcount), y*(height/ycount), width/xcount, height/ycount, 0, checkStyle, backingStyle, checkGlowStyle, backingGlowStyle);
            object.appendChild(temp);
            temp.onChange = function(){ object.onChange(object.get()); };
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
    object.onChange = function(){};


    return object;
};