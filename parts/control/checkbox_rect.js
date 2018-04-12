this.checkbox_rect = function(
    id='checkbox_rect',
    x, y, width, height, angle=0,
    checkStyle = 'fill:rgba(150,150,150,1)',
    backingStyle = 'fill:rgba(200,200,200,1)',
    checkGlowStyle = 'fill:rgba(220,220,220,1)',
    backingGlowStyle = 'fill:rgba(220,220,220,1)',
){
    // elements 
    var object = parts.basic.g(id, x, y);
        object._checked = false;
        object.styles = {
            'check':checkStyle,
            'uncheck':'fill:rgba(0,0,0,0)',
            'backing':backingStyle
        };

    var rect = parts.basic.rect(null, 0, 0, width, height, angle, backingStyle);
        object.appendChild(rect);
    var checkrect = parts.basic.rect(null, width*0.1, height*0.1, width*0.8, height*0.8, angle, object.styles.uncheck);
        object.appendChild(checkrect);


    function updateGraphics(){
        if(object._checked){ __globals.utility.setStyle(checkrect,object.styles.check); }
        else{ __globals.utility.setStyle(checkrect,object.styles.uncheck); }
        __globals.utility.setStyle(rect,object.styles.backing);
    }

    //methods
    object.get = function(){ return object._checked; };
    object.set = function(value, update=true){
        object._checked = value;
        
        updateGraphics();

        if(update&&this.onChange){ this.onChange(value); }
    };
    object.light = function(state){
        if(state){
            object.styles.check = checkGlowStyle;
            object.styles.backing = backingGlowStyle;
        }else{
            object.styles.check = checkStyle;
            object.styles.backing = backingStyle;
        }
        updateGraphics();
    };


    //callback
    object.onChange = function(){};


    //mouse interaction
    object.onclick = function(event){
        object.set(!object.get());
    };


    return object;
};