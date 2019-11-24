this.glowbox_path = function(
    name='glowbox_path',
    x=0, y=0, points=[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}], angle=0, 
    looping=false, jointType='sharp', capType='none', 
    glowStyle = {r:0.95,g:0.91,b:0.55,a:1},
    dimStyle = {r:0.31,g:0.31,b:0.31,a:1},
){
    dev.log.partDisplay('.glowbox_path('+name+','+x+','+y+','+JSON.stringify(points)+','+JSON.stringify(glowStyle)+','+JSON.stringify(dimStyle)+')'); //#development
    return new Promise((resolve, reject) => { (async () => {
        
        //elements 
            const [object, polygon] = await Promise.all([
                _canvas_.interface.part.builder('basic', 'group', name, {x:x, y:y, angle:angle}),
                _canvas_.interface.part.builder('basic', 'path', 'light', {pointsAsXYArray:points, looping:looping, jointType:jointType, capType:capType, colour:dimStyle}),
            ]);
            object.append(polygon);

        //methods
            object.on = function(){ 
                dev.log.partDisplay('.glowbox_path.on()'); //#development
                polygon.colour(glowStyle);
            };
            object.off = function(){ 
                dev.log.partDisplay('.glowbox_path.off()'); //#development
                polygon.colour(dimStyle);
            };

        resolve(object);
    })() });
};

interfacePart.partLibrary.display.glowbox_path = function(name,data){ 
    return interfacePart.collection.display.glowbox_path(
        name, data.x, data.y, data.points, data.angle, data.style.glow, data.style.dim
    );
};