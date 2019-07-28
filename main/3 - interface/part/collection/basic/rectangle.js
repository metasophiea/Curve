this.rectangle = function( name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, colour={r:1,g:0,b:1,a:1} ){
    var temp = _canvas_.core.shape.create('rectangle');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    temp.x(x); 
    temp.y(y);
    temp.width(width); 
    temp.height(height);
    temp.angle(angle);
    temp.anchor(anchor);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
};

interfacePart.partLibrary.basic.rectangle = function(name,data){ 
    return interfacePart.collection.basic.rectangle( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour );
};