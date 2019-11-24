this.glowbox_rectangle = function(
    name='glowbox_rectangle',
    x=0, y=0, width=30, height=30, angle=0,
    glowStyle = {r:0.95,g:0.91,b:0.55,a:1},
    dimStyle = {r:0.31,g:0.31,b:0.31,a:1},
){
    dev.log.partDisplay('.glowbox_rectangle('+name+','+x+','+y+','+width+','+height+','+angle+','+JSON.stringify(glowStyle)+','+JSON.stringify(dimStyle)+')'); //#development
    return new Promise((resolve, reject) => { (async () => {
        
        //elements
            const [object, rectangle] = await Promise.all([
                _canvas_.interface.part.builder('basic', 'group', name, {x:x, y:y}),
                _canvas_.interface.part.builder('basic', 'rectangle', 'light', {width:width, height:height, angle:angle, colour:dimStyle}),
            ]);
            object.append(rectangle);

        //methods
            object.on = function(){ 
                dev.log.partDisplay('.glowbox_rectangle.on()'); //#development
                rectangle.colour(glowStyle);
            };
            object.off = function(){ 
                dev.log.partDisplay('.glowbox_rectangle.off()'); //#development
                rectangle.colour(dimStyle);
            };

        resolve(object);
    })() });
};

interfacePart.partLibrary.display.glowbox_rectangle = function(name,data){ 
    return interfacePart.collection.display.glowbox_rectangle(
        name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim
    );
};