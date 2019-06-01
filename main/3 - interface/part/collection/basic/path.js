this.path = function( name=null, points=[], thickness=1, ignored=false, colour={r:0,g:0,b:0,a:1}, pointsAsXYArray=[], jointType='sharp', capType='none', looping=false, jointDetail=25, sharpLimit=4 ){
    var temp = _canvas_.core.shape.create('path');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    if(points.length != 0){ temp.points(points); }
    else{ temp.pointsAsXYArray(pointsAsXYArray); }
    temp.thickness(thickness); 
    temp.jointType(jointType);
    temp.capType(capType);
    temp.looping(looping);
    temp.jointDetail(jointDetail);
    temp.sharpLimit(sharpLimit);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
}