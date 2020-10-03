this.group = function(name=null, x=0, y=0, angle=0, ignored=false, clipActive=false){
    dev.log.partBasic('.group('+name+','+x+','+y+','+angle+','+ignored+')'); //#development

    const element = _canvas_.core.element.create('Group',String(name));
    element.unifiedAttribute({
        x:x, 
        y:y, 
        angle:angle, 
        ignored:ignored,
        clipActive:clipActive,
    });
    return element;
}

interfacePart.partLibrary.basic.group = function(name,data){ 
    return interfacePart.collection.basic.group(
        name, data.x, data.y, data.angle, data.ignored, data.clipActive,
    );
};