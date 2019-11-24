this.rectangle = function(name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, colour={r:1,g:0,b:1,a:1}){
    dev.log.partBasic('.rectangle('+name+','+x+','+y+','+width+','+height+','+angle+','+JSON.stringify(anchor)+','+ignored+','+JSON.stringify(colour)+')'); //#development

    return new Promise((resolve, reject) => {
        _canvas_.core.element.create('rectangle',name).then(rectangle => { 
            rectangle.unifiedAttribute({ 
                x:x, 
                y:y, 
                width:width, 
                height:height, 
                angle:angle, 
                anchor:anchor, 
                ignored:ignored, 
                colour:colour 
            });
            resolve(rectangle);
        });
    });
};

interfacePart.partLibrary.basic.rectangle = function(name,data){ 
    return interfacePart.collection.basic.rectangle(
        name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour
    );
};