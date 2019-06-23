this.group = function( name=null, x=0, y=0, angle=0, ignored=false ){
    var temp = _canvas_.core.shape.create('group');
    temp.name = name;
    temp.ignored = ignored;

    temp.stopAttributeStartedExtremityUpdate = true;
    temp.x(x); 
    temp.y(y);
    temp.angle(angle);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
}