this.polygon = function(name=null, points=[], fillStyle='rgba(255,100,255,1)', strokeStyle='rgba(0,0,0,0)', lineWidth=1){
    var temp = canvas.core.element.create('polygon');
    temp.name = name;
    temp.points = points;
    temp.fillStyle = fillStyle;
    temp.strokeStyle = strokeStyle;
    temp.lineWidth = lineWidth;
    return temp;
};