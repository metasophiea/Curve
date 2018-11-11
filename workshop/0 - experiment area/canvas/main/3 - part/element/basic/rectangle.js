this.rectangle = function(name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, fillStyle='rgba(255,100,255,1)', strokeStyle='rgba(0,0,0,0)', lineWidth=1){
    var temp = canvas.core.element.create('rectangle');
    temp.name = name;
    temp.x = x; temp.y = y;
    temp.width = width; temp.height = height;
    temp.angle = angle;
    temp.anchor = anchor;
    temp.fillStyle = fillStyle;
    temp.strokeStyle = strokeStyle;
    temp.lineWidth = lineWidth;
    return temp;
};