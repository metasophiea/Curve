this.circle = function( name=null, x=0, y=0, angle=0, radius=10, detail=25, ignored=false, colour={r:1,g:0,b:1,a:1} ){
    var temp = _canvas_.core.shape.create('circle');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    temp.x(x);
    temp.y(y);
    temp.angle(angle);
    temp.radius(radius);
    temp.detail(detail);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
};

interfacePart.partLibrary.basic.circle = function(name,data){ 
    return interfacePart.collection.basic.circle( name, data.x, data.y, data.angle, data.radius, data.detail, data.ignored, data.colour );
};