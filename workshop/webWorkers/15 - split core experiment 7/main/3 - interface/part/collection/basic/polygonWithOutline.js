this.polygonWithOutline = function( name=null, points=[], pointsAsXYArray=[], ignored=false, colour={r:1,g:0,b:1,a:1}, thickness=1, lineColour={r:0,g:0,b:0,a:1} ){
    return new Promise((resolve, reject) => {
        _canvas_.core.element.create('polygonWithOutline',name).then(polygonWithOutline => { 
            polygonWithOutline.unifiedAttribute({ ignored:ignored, colour:colour, lineColour:lineColour, thickness:thickness });
            if(points.length != 0){ polygonWithOutline.points(points); }
            else{ polygonWithOutline.pointsAsXYArray(pointsAsXYArray); }
            resolve(polygonWithOutline);
        });
    });
}

interfacePart.partLibrary.basic.polygonWithOutline = function(name,data){ 
    return interfacePart.collection.basic.polygonWithOutline( name, data.points, data.pointsAsXYArray, data.ignored, data.colour, data.thickness, data.lineColour );
};