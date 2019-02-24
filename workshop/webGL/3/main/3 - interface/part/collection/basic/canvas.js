this.canvas = function( name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, resolution=1 ){
    var temp = _canvas_.core.shape.create('canvas');
    temp.name = name;
    temp.ignored = ignored;
    
    temp.x(x); 
    temp.y(y);
    temp.width(width); 
    temp.height(height);
    temp.angle(angle);
    temp.anchor(anchor);
    temp.resolution(resolution);
    return temp;
};