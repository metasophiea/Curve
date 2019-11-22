this.rectangleWithOutline = function( name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, colour={r:1,g:0,b:1,a:1}, thickness=1, lineColour={r:0,g:0,b:0,a:1} ){
    return new Promise((resolve, reject) => {
        _canvas_.core.element.create('rectangleWithOutline',name).then(rectangleWithOutline => { 
            rectangleWithOutline.unifiedAttribute({ 
                x:x, 
                y:y, 
                width:width, 
                height:height, 
                angle:angle, 
                anchor:anchor, 
                ignored:ignored, 
                colour:colour,
                lineColour:lineColour,
                thickness:thickness,
            });
            resolve(rectangleWithOutline);
        });
    });
};

interfacePart.partLibrary.basic.rectangleWithOutline = function(name,data){ 
    return interfacePart.collection.basic.rectangleWithOutline( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour, data.thickness, data.lineColour );
};