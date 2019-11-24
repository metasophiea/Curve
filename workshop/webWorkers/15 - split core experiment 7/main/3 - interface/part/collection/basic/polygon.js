this.polygon = function(name=null, points=[], pointsAsXYArray=[], ignored=false, colour={r:1,g:0,b:1,a:1}){
    dev.log.partBasic('.polygon('+name+','+JSON.stringify(points)+','+JSON.stringify(pointsAsXYArray)+','+ignored+','+JSON.stringify(colour)+')'); //#development
    
    return new Promise((resolve, reject) => {
        _canvas_.core.element.create('polygon',name).then(polygon => { 
            polygon.unifiedAttribute({ ignored:ignored, colour:colour });
            if(points.length != 0){ polygon.points(points); }
            else{ polygon.pointsAsXYArray(pointsAsXYArray); }
            resolve(polygon);
        });
    });
}

interfacePart.partLibrary.basic.polygon = function(name,data){ 
    return interfacePart.collection.basic.polygon(
        name, data.points, data.pointsAsXYArray, data.ignored, data.colour
    );
};