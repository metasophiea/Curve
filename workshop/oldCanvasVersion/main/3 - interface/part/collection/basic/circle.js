this.circle = function(
    name=null, 
    x=0, 
    y=0, 
    r=2,
    ignored=false,
    fillStyle='rgba(255,100,255,1)', 
    strokeStyle='rgba(0,0,0,0)', 
    lineWidth=1,
    lineJoin='round',
    miterLimit=2,
){
    var temp = workspace.core.arrangement.createElement('circle');
    temp.name = name;
    temp.x = x; temp.y = y;
    temp.r = r;
    temp.ignored = ignored;
    temp.style.fill = fillStyle;
    temp.style.stroke = strokeStyle;
    temp.style.lineWidth = lineWidth;
    temp.style.lineJoin = lineJoin;
    temp.style.miterLimit = miterLimit;
    return temp;
};