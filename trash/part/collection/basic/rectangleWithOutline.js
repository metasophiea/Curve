this.rectangleWithOutline = function( name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, colour={r:1,g:0,b:1,a:1}, thickness=0, lineColour={r:0,g:0,b:0,a:0} ){
    var temp = _canvas_.core.shape.create('rectangleWithOutline');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    temp.lineColour = lineColour;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    temp.x(x); 
    temp.y(y);
    temp.width(width); 
    temp.height(height);
    temp.angle(angle);
    temp.anchor(anchor);
    temp.thickness(thickness);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
};