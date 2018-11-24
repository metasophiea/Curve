this.glowbox_rect = function(
    name='glowbox_rect',
    x, y, width=30, height=30, angle=0,
    glowStyle = 'rgba(244,234,141,1)',
    dimStyle = 'rgba(80,80,80,1)'
){
    //elements 
        var object = canvas.part.builder('group',name,{x:x, y:y});
        var rect = canvas.part.builder('rectangle','light',{ width:width, height:height, angle:angle, style:{fill:dimStyle} });
            object.append(rect);

    //methods
        object.on = function(){
            rect.style.fill = glowStyle;
        };
        object.off = function(){
            rect.style.fill = dimStyle;
        };

    return object;
};