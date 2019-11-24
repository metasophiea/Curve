this.canvas = function(name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, resolution=1){
    dev.log.partBasic('.canvas('+name+','+x+','+y+','+width+','+height+','+angle+','+JSON.stringify(anchor)+','+ignored+','+resolution+')'); //#development
    
    return new Promise((resolve, reject) => {
        _canvas_.core.element.create('canvas',name).then(canvas => { 
            canvas.unifiedAttribute({ 
                x:x, 
                y:y, 
                width:width, 
                height:height, 
                angle:angle, 
                anchor:anchor, 
                ignored:ignored, 
                resolution:resolution,
            });
            resolve(canvas);
        });
    });
};

interfacePart.partLibrary.basic.canvas = function(name,data){ 
    return interfacePart.collection.basic.canvas(
        name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.resolution
    );
};