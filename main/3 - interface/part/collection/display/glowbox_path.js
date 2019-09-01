this.glowbox_path = function(
    name='glowbox_path',
    x, y, points=[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}], angle=0, 
    looping=false, jointType='sharp', capType='none', 
    glowStyle = {r:0.95,g:0.91,b:0.55,a:1},
    dimStyle = {r:0.31,g:0.31,b:0.31,a:1},
){
    //elements 
        var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        var path = interfacePart.builder('basic','path','light',{ 
            pointsAsXYArray:points, 
            looping:looping, 
            colour:dimStyle,
            jointType:jointType,
            capType:capType,
        });
            object.append(path);

    //methods
        object.on = function(){
            path.colour = glowStyle;
        };
        object.off = function(){
            path.colour = dimStyle;
        };

    return object;
};

interfacePart.partLibrary.display.glowbox_path = function(name,data){ 
    return interfacePart.collection.display.glowbox_path( name, data.x, data.y, data.points, data.angle, data.looping, data.jointType, data.capType, data.style.glow, data.style.dim );
};