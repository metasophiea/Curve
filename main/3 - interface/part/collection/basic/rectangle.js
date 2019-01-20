this.rectangle = function(
    name=null, 
    x=0, 
    y=0, 
    width=10, 
    height=10, 
    angle=0,
    anchor={x:0,y:0}, 
    ignored=false,
    fillStyle='rgba(255,100,255,1)', 
    strokeStyle='rgba(0,0,0,0)', 
    lineWidth=1,
    lineJoin='round',
    miterLimit=2,
){
    var temp = workspace.core.arrangement.createElement('rectangle');
    temp.name = name;
    temp.x = x; temp.y = y;
    temp.width = width; temp.height = height;
    temp.angle = angle;
    temp.anchor = anchor;
    temp.ignored = ignored;
    temp.style.fill = fillStyle;
    temp.style.stroke = strokeStyle;
    temp.style.lineWidth = lineWidth;
    temp.style.lineJoin = lineJoin;
    temp.style.miterLimit = miterLimit;
    return temp;
};