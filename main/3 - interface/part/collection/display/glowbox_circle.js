this.glowbox_circle = function(
    name='glowbox_circle',
    x, y, radius=10,
    glowStyle = {r:0.95,g:0.91,b:0.55,a:1},
    dimStyle = {r:0.31,g:0.31,b:0.31,a:1},
){
    //elements 
        var object = interfacePart.builder('basic','group',name,{x:x, y:y});
        var circle = interfacePart.builder('basic','circle','light',{ radius:radius, colour:dimStyle });
            object.append(circle);

    //methods
        object.on = function(){
            circle.colour = glowStyle;
        };
        object.off = function(){
            circle.colour = dimStyle;
        };

    return object;
};

interfacePart.partLibrary.display.glowbox_circle = function(name,data){ 
    return interfacePart.collection.display.glowbox_circle( name, data.x, data.y, data.radius, data.style.glow, data.style.dim );
};