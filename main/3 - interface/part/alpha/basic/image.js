this.image = function(name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, url=''){
    var temp = workspace.core.arrangement.createElement('image');
    temp.name = name;
    temp.x = x; temp.y = y;
    temp.width = width; temp.height = height;
    temp.angle = angle;
    temp.anchor = anchor;
    temp.ignored = ignored;
    temp.url = url;
    return temp;
};