this.polygon = function( name=null, points=[], pointsAsXYArray=[], ignored=false, colour={r:1,g:0,b:1,a:1} ){
    var temp = _canvas_.core.shape.create('polygon');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    if(points.length != 0){ temp.points(points); }
    else{ temp.pointsAsXYArray(pointsAsXYArray); }
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
}