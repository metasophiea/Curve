this.polygonWithOutline = function( name=null, points=[], pointsAsXYArray=[], ignored=false, colour={r:1,g:0,b:1,a:1}, thickness=1, lineColour={r:0,g:0,b:0,a:1} ){
    var temp = _canvas_.core.shape.create('polygonWithOutline');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    temp.lineColour = lineColour;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    if(points.length != 0){ temp.points(points); }
    else{ temp.pointsAsXYArray(pointsAsXYArray); }
    temp.thickness(thickness);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
}

interfacePart.partLibrary.basic.polygonWithOutline = function(name,data){ 
    return interfacePart.collection.basic.polygonWithOutline( name, data.points, data.pointsAsXYArray, data.ignored, data.colour, data.thickness, data.lineColour );
};