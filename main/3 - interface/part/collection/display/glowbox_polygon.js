this.glowbox_polygon = function(
    name='glowbox_polygon',
    x, y, points=[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}], angle=0, 
    glowStyle = {r:0.95,g:0.91,b:0.55,a:1},
    dimStyle = {r:0.31,g:0.31,b:0.31,a:1},
){
    //elements 
        var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        var polygon = interfacePart.builder('basic','polygon','light',{ pointsAsXYArray:points, colour:dimStyle });
            object.append(polygon);

    //methods
        object.on = function(){
            polygon.colour = glowStyle;
        };
        object.off = function(){
            polygon.colour = dimStyle;
        };

    return object;
};

interfacePart.partLibrary.display.glowbox_polygon = function(name,data){ 
    return interfacePart.collection.display.glowbox_polygon( name, data.x, data.y, data.points, data.angle, data.style.glow, data.style.dim );
};