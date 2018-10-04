this.glowbox_rect = function(
    id='glowbox_rect',
    x, y, width, height, angle=0,
    glowStyle = 'fill:rgba(240,240,240,1)',
    dimStyle = 'fill:rgba(80,80,80,1)'
){

    // elements 
    var object = system.utility.misc.elementMaker('g',id,{x:x, y:y});
    var rect = system.utility.misc.elementMaker('rect',null,{width:width,height:height,sngle:angle,style:dimStyle});
        object.appendChild(rect);

    //methods
    object.on = function(){
        system.utility.element.setStyle(rect,glowStyle);
    };
    object.off = function(){
        system.utility.element.setStyle(rect,dimStyle);
    };

    return object;
};