this.loopedPath = function( name=null, points=[], thickness=1, ignored=false, colour={r:0,g:0,b:0,a:1}, pointsAsXYArray=[] ){
    var temp = _canvas_.core.shape.create('loopedPath');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    if(points.length != 0){ temp.points(points); }
    else{ temp.pointsAsXYArray(pointsAsXYArray); }
    temp.thickness(thickness);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
}