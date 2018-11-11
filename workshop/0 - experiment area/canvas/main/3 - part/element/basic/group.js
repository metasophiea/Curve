this.group = function(name=null, x=0, y=0, angle=0){
    var temp = canvas.core.element.create('group');
    temp.name = name;
    temp.x = x; temp.y = y;
    temp.angle = angle;
    return temp;
};