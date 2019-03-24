this.circleWithOutline = function( name=null, x=0, y=0, angle=0, radius=10, detail=25, ignored=false, colour={r:1,g:0,b:1,a:1}, thickness=1, lineColour={r:0,g:0,b:0,a:1} ){
    var temp = _canvas_.core.shape.create('circleWithOutline');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    temp.lineColour = lineColour;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    temp.x(x);
    temp.y(y);
    temp.angle(angle);
    temp.radius(radius);
    temp.detail(detail);
    temp.thickness(thickness);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
};