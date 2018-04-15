this.glowbox_rect = function(
    id='glowbox_rect',
    x, y, width, height, angle=0,
    glowStyle = 'fill:rgba(240,240,240,1)',
    dimStyle = 'fill:rgba(80,80,80,1)'
){

    // elements 
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, angle, dimStyle);
        object.appendChild(rect);

    //methods
    object.on = function(){
        __globals.utility.setStyle(rect,glowStyle);
    };
    object.off = function(){
        __globals.utility.setStyle(rect,dimStyle);
    };

    return object;
};