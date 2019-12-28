this.rectangle = function(name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, colour={r:1,g:0,b:1,a:1}){
    return new Promise((resolve, reject) => {
        _canvas_.core.element.create('rectangle',name).then(id => {
            _canvas_.core.boatload.element.executeMethod.load({
                id:id, method:'unifiedAttribute',
                argumentList:[{ignored:ignored, colour:colour, x:x, y:y, width:width, height:height, angle:angle, anchor:anchor}]
            });
            _canvas_.core.boatload.element.executeMethod.ship();
            resolve(id);
        });
    });
};

interfacePart.partLibrary.basic.rectangle = function(name,data){ 
    return interfacePart.collection.basic.rectangle( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour );
};