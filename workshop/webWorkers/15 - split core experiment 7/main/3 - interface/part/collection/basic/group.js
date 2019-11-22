this.group = function(name=null, x=0, y=0, angle=0, ignored=false){
    return new Promise((resolve, reject) => {
        _canvas_.core.element.create('group',name).then(group => { 
            group.unifiedAttribute({ 
                x:x, 
                y:y, 
                angle:angle, 
                ignored:ignored,
            });
            resolve(group);
        });
    });
}

interfacePart.partLibrary.basic.group = function(name,data){ 
    return interfacePart.collection.basic.group(name, data.x, data.y, data.angle, data.ignored);
};