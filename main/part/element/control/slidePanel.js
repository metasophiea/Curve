this.slidePanel = function(
    id='slidePanel', 
    x, y, width, height, count, angle=0,
    handleHeight=0.1, startValue=0, resetValue=0.5,
    handleStyle = 'fill:rgba(180,180,180,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    //elements
        //main
            var object = part.builder('g',id,{x:x, y:y, r:angle});
        //slides
            for(var a = 0; a < count; a++){
                var temp = part.builder(
                    'slide',a,{
                        x:a*(width/count), y:0,
                        width:width/count, height:height,
                        value:startValue, resetValue:resetValue,
                        style:{handle:handleStyle, backing:backingStyle, slot:slotStyle}
                    }
                );
                temp.onchange = function(value){ object.onchange(this.id,value); };
                temp.onrelease = function(value){ object.onrelease(this.id,value); };
                temp.__calculationAngle = angle;
                object.appendChild(temp);
            }

    //methods
        object.slide = function(index){ return object.children[index]; };
        object.get = function(){
            var outputArray = [];
            for(var a = 0; a < count; a++){
                outputArray.push(this.slide(a).get());
            }
            return outputArray;
        };
        object.set = function(values,update=true){
            for(var a = 0; a < values.length; a++){
                this.slide(a).set(values[a],update);
            }
        };
        object.setAll = function(value,update=true){
            this.set( Array.apply(null, Array(count)).map(Number.prototype.valueOf,value),false );
            if(update){this.onchange('all',value);}
        };
        object.smoothSet = function(values,time,curve,update=true){
            for(var a = 0; a < values.length; a++){
                this.slide(a).smoothSet(values[a],time,curve,update);
            }
        };
        object.smoothSetAll = function(value, time, curve, update=true){
            this.smoothSet( Array.apply(null, Array(count)).map(Number.prototype.valueOf,value), time, curve, false );
            if(update){this.onchange('all',value);}
        };

    //callbacks
        object.onchange = function(slide,value){};
        object.onrelease = function(slide,value){};
    
    return object;
};