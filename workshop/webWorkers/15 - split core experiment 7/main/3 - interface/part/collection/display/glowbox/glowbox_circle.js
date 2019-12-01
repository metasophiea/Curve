this.glowbox_circle = function(
    name='glowbox_circle',
    x=0, y=0, radius=12.5,
    glowStyle = {r:0.95,g:0.91,b:0.55,a:1},
    dimStyle = {r:0.31,g:0.31,b:0.31,a:1},
){
    dev.log.partDisplay('.glowbox_circle('+name+','+x+','+y+','+radius+','+JSON.stringify(glowStyle)+','+JSON.stringify(dimStyle)+')'); //#development

    //elements 
        const object = interfacePart.builder('basic','group',name,{x:x, y:y});
        const circle = interfacePart.builder('basic','circle','light',{ radius:radius, colour:dimStyle });
            object.append(circle);

    //methods
        object.on = function(){
            dev.log.partDisplay('.glowbox_circle.on()'); //#development
            circle.colour(glowStyle);
        };
        object.off = function(){
            dev.log.partDisplay('.glowbox_circle.off()'); //#development
            circle.colour(dimStyle);
        };

    return object;
};

interfacePart.partLibrary.display.glowbox_circle = function(name,data){ 
    return interfacePart.collection.display.glowbox_circle(
        name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim
    );
};