this.glowbox_image = function(
    name='glowbox_image',
    x=0, y=0, width=30, height=30, angle=0,
    glowURL='',
    dimURL='',
){
    dev.log.partDisplay('.glowbox_image('+name+','+x+','+y+','+width+','+height+','+angle+','+glowURL+','+dimURL+')'); //#development
    
    //elements 
        const object = interfacePart.builder('basic','group',name,{x:x, y:y});
        const backing = interfacePart.builder('basic','image','backing',{width:width, height:height, angle:angle, url:dimURL});
        object.append(backing);

    //methods
        object.on = function(){
            dev.log.partDisplay('.glowbox_image.on()'); //#development
            backing.url(glowURL);
        };
        object.off = function(){
            dev.log.partDisplay('.glowbox_image.off()'); //#development
            backing.url(dimURL);
        };

    return object;
};

interfacePart.partLibrary.display.glowbox_image = function(name,data){ 
    return interfacePart.collection.display.glowbox_image(
        name, data.x, data.y, data.width, data.height, data.angle, data.glowURL, data.dimURL
    );
};