this.canvas = function(name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, resolution=1){
    var temp = workspace.core.arrangement.createElement('canvas');
    temp.name = name;
    temp.x = x; temp.y = y;
    temp.parameter.width(width);
    temp.parameter.height(height);
    temp.resolution(resolution);
    temp.angle = angle;
    temp.anchor = anchor;
    temp.ignored = ignored;
    return temp;
};