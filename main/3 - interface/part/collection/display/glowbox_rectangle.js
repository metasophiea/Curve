this.glowbox_rect = function(
    name='glowbox_rect',
    x, y, width=30, height=30, angle=0,
    glowStyle = {r:0.95,g:0.91,b:0.55,a:1},
    dimStyle = {r:0.31,g:0.31,b:0.31,a:1},
){
    //elements 
        var object = interfacePart.builder('basic','group',name,{x:x, y:y});
        var rect = interfacePart.builder('basic','rectangle','light',{ width:width, height:height, angle:angle, colour:dimStyle });
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

interfacePart.partLibrary.display.glowbox_rectangle = function(name,data){ 
    return interfacePart.collection.display.glowbox_rect( name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim );
};
interfacePart.partLibrary.display.glowbox_rect = function(name,data){
    console.warn('depreciated - please use glowbox_rectangle instead');
    return interfacePart.partLibrary.display.glowbox_rectangle(name,data);
};