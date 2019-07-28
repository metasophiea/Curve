this.image = function( name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, url='' ){
    var temp = _canvas_.core.shape.create('image');
    temp.name = name;
    temp.ignored = ignored;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    temp.x(x); 
    temp.y(y);
    temp.width(width); 
    temp.height(height);
    temp.angle(angle);
    temp.anchor(anchor);
    temp.imageURL(url);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
};

interfacePart.partLibrary.basic.image = function(name,data){ 
    return interfacePart.collection.basic.image( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.url );
};