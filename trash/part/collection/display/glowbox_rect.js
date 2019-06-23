this.glowbox_rect = function(
    name='glowbox_rect',
    x, y, width=30, height=30, angle=0,
    glowStyle = {r:0.95,g:0.91,b:0.55,a:1},
    dimStyle = {r:0.31,g:0.31,b:0.31,a:1},
){
    //elements 
        var object = interfacePart.builder('group',name,{x:x, y:y});
        var rect = interfacePart.builder('rectangle','light',{ width:width, height:height, angle:angle, colour:dimStyle });
            object.append(rect);

    //methods
        object.on = function(){
            rect.colour = glowStyle;
        };
        object.off = function(){
            rect.colour = dimStyle;
        };

    return object;
};