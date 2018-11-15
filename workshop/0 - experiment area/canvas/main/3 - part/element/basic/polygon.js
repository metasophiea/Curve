this.polygon = function(
    name=null, 
    points=[], 
    fillStyle='rgba(255,100,255,1)', 
    strokeStyle='rgba(0,0,0,1)', 
    lineWidth=1,
    lineJoin='round',
    miterLimit=2,
    shadowColour='rgba(0,0,0,0)',
    shadowBlur=20,
    shadowOffset={x:20, y:20},
){
    var temp = canvas.core.arrangement.createElement('polygon');
    temp.name = name;
    temp.points = points;
    temp.style.fill = fillStyle;
    temp.style.stroke = strokeStyle;
    temp.style.lineWidth = lineWidth;
    temp.style.lineJoin = lineJoin;
    temp.style.miterLimit = miterLimit;
    temp.style.shadowColour = shadowColour;
    temp.style.shadowBlur = shadowBlur;
    temp.style.shadowOffset = shadowOffset;

    return temp;
};

this.advancedPolygon = function(
    name=null, 
    points=[], 
    fillStyle='rgba(255,100,255,1)', 
    strokeStyle='rgba(0,0,0,1)', 
    lineWidth=1,
    lineJoin='round',
    miterLimit=2,
    shadowColour='rgba(0,0,0,0)',
    shadowBlur=20,
    shadowOffset={x:20, y:20},
){
    var temp = canvas.core.arrangement.createElement('advancedPolygon');
    temp.name = name;
    temp.points = points;
    temp.style.fill = fillStyle;
    temp.style.stroke = strokeStyle;
    temp.style.lineWidth = lineWidth;
    temp.style.lineJoin = lineJoin;
    temp.style.miterLimit = miterLimit;
    temp.style.shadowColour = shadowColour;
    temp.style.shadowBlur = shadowBlur;
    temp.style.shadowOffset = shadowOffset;

    return temp;
};