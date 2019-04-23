this.text = function(
    name=null,
    x=0,
    y=0, 
    text='Hello',
    angle=0, 
    anchor={x:0,y:0},
    size=1,
    ignored=false,
    font='30pt Arial',
    textAlign='start', //start/end/center/lief/right 
    textBaseline='alphabetic', //alphabetic/top/hanging/middle/ideographic/bottom
    fillStyle='rgba(255,100,255,1)', 
    strokeStyle='rgba(0,0,0,0)', 
    lineWidth=1,
    lineJoin='round',
    miterLimit=2,
){
    var temp = workspace.core.arrangement.createElement('text');
    temp.name = name;
    temp.x = x; 
    temp.y = y;
    temp.text = text;
    temp.angle = angle;
    temp.anchor = anchor;
    temp.size = size;
    temp.ignored = ignored;
    temp.style.font = font;
    temp.style.align = textAlign;
    temp.style.baseline = textBaseline;
    temp.style.fill = fillStyle;
    temp.style.stroke = strokeStyle;
    temp.style.lineWidth = lineWidth;
    temp.style.lineJoin = lineJoin;
    temp.style.miterLimit = miterLimit;
    return temp;
};