this.glowbox_rect = function(
    id='glowbox_rect',
    x, y, width, height, angle=0,
    glowStyle = 'fill:rgba(240,240,240,1)',
    dimStyle = 'fill:rgba(80,80,80,1)'
){

    // elements 
    var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y});
    var rect = __globals.utility.experimental.elementMaker('rect',null,{width:width,height:height,sngle:angle,style:dimStyle});
        object.appendChild(rect);

    //methods
    object.on = function(){
        __globals.utility.element.setStyle(rect,glowStyle);
    };
    object.off = function(){
        __globals.utility.element.setStyle(rect,dimStyle);
    };

    return object;
};