this.glowbox_image = function(
    name='glowbox_image',
    x, y, width=30, height=30, angle=0,
    glowURL='',
    dimURL='',
){
    //elements 
        var object = interfacePart.builder('basic','group',name,{x:x, y:y});
        var backing = interfacePart.builder('basic','image','backing',{width:width, height:height, angle:angle, url:dimURL});
        object.append(backing);

    //methods
        object.on = function(){
            backing.imageURL(glowURL);
        };
        object.off = function(){
            backing.imageURL(dimURL);
        };

    return object;
};

interfacePart.partLibrary.display.glowbox_image = function(name,data){ 
    return interfacePart.collection.display.glowbox_image( name, data.x, data.y, data.width, data.height, data.angle, data.glowURL, data.dimURL );
};