this.path = function(
    name=null, 
    points=[],
    strokeStyle='rgba(0,0,0,1)', 
    lineWidth=1,
    lineCap='round',
    lineJoin='round',
    miterLimit=2,
    shadowColour='rgba(0,0,0,0)',
    shadowBlur=20,
    shadowOffset={x:20, y:20},
){
    var temp = canvas.core.arrangement.createElement('path');
    temp.name = name;
    temp.points = points;
    temp.style.stroke = strokeStyle;
    temp.style.lineWidth = lineWidth;
    temp.style.lineCap = lineCap;
    temp.style.lineJoin = lineJoin;
    temp.style.miterLimit = miterLimit;
    temp.style.shadowColour = shadowColour;
    temp.style.shadowBlur = shadowBlur;
    temp.style.shadowOffset = shadowOffset;
    
    return temp;
};