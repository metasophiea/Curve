this.checkbox_rect = function(
    id='checkbox_rect',
    x, y, width, height, angle=0,
    checkStyle = 'fill:rgba(150,150,150,1)',
    backingStyle = 'fill:rgba(200,200,200,1)',
    checkGlowStyle = 'fill:rgba(220,220,220,1)',
    backingGlowStyle = 'fill:rgba(220,220,220,1)',
){
    // elements 
    var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y, r:angle});
        object._checked = false;
        object.styles = {
            'check':checkStyle,
            'uncheck':'fill:rgba(0,0,0,0)',
            'backing':backingStyle
        };

    var rect = __globals.utility.experimental.elementMaker('rect',null,{width:width,height:height, style:backingStyle});
        object.appendChild(rect);
    var checkrect = __globals.utility.experimental.elementMaker('rect',null,{x:width*0.1,y:height*0.1,width:width*0.8,height:height*0.8, style:object.styles.uncheck});
        object.appendChild(checkrect);


    function updateGraphics(){
        if(object._checked){ __globals.utility.element.setStyle(checkrect,object.styles.check); }
        else{ __globals.utility.element.setStyle(checkrect,object.styles.uncheck); }
        __globals.utility.element.setStyle(rect,object.styles.backing);
    }

    //methods
    object.get = function(){ return object._checked; };
    object.set = function(value, update=true){
        object._checked = value;
        
        updateGraphics();

        if(update&&this.onchange){ this.onchange(value); }
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
    object.onchange = function(){};


    //mouse interaction
    object.onclick = function(event){
        object.set(!object.get());
    };


    return object;
};