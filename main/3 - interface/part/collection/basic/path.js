this.path = function(
    name=null, 
    points=[],
    ignored=false,
    strokeStyle='rgba(0,0,0,1)', 
    lineWidth=1,
    lineCap='butt',
    lineJoin='miter',
    miterLimit=2,
){
    var temp = workspace.core.arrangement.createElement('path');
    temp.name = name;
    temp.points = points;
    temp.ignored = ignored;
    temp.style.stroke = strokeStyle;
    temp.style.lineWidth = lineWidth;
    temp.style.lineCap = lineCap;
    temp.style.lineJoin = lineJoin;
    temp.style.miterLimit = miterLimit;
    
    return temp;
};