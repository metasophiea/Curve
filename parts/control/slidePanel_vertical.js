this.slidePanel_vertical = function(
    id='slidePanel_vertical', 
    x, y, width, height,
    count,
    handleStyle = 'fill:rgba(180,180,180,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    // elements
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    for(var a = 0; a < count; a++){
        var temp = parts.control.slide_vertical( id+'_'+a, a*(width/count), 0, width/count, height, handleStyle, backingStyle, slotStyle );
        object.appendChild(temp);
        temp.onChange = function(){ object.onChange(object.get()); };
    }


    //methods
    object.slide = function(index){ return object.children[object.id+'_'+index]; };
    object.get = function(){
        var outputArray = [];
        for(var b = 0; b < count; b++){
            outputArray.push(this.slide(b).get());
        }
        return outputArray;
    };
    object.set = function(a, update=true){
        for(var b = 0; b < a.length; b++){
            this.slide(b).set(a[b],false);
        }
        for(var b = a.length; b < count; b++){
            this.slide(b).set(1/2,false);
        }

        if(update&&this.onChange){ this.onChange(a); }
    };
    object.setAll = function(a){
        for(var b = 0; b < count; b++){
            this.slide(b).set(a,false);
        }
    };
    object.onChange = function(){};

    return object;
};