this.group = function(name=null, x=0, y=0, angle=0, ignored=false){
    var temp = canvas.core.arrangement.createElement('group');
    temp.name = name;
    temp.x = x; 
    temp.y = y;
    temp.angle = angle;
    temp.ignored = ignored;
    return temp;
};