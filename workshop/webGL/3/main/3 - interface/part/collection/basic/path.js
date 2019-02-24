this.path = function( name=null, points=[], thickness=1, ignored=false, colour={r:0,g:0,b:0,a:1}, pointsAsXYArray=[] ){
    var temp = _canvas_.core.shape.create('path');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    
    if(points.length != 0){ temp.points(points); }
    else{ temp.pointsAsXYArray(pointsAsXYArray); }
    temp.thickness(thickness); 
    return temp;
}