this.path = function( name=null, points=[], thickness=1, ignored=false, colour={r:0,g:0,b:0,a:1}, pointsAsXYArray=[], jointType='sharp', capType='none', looping=false, jointDetail=25, sharpLimit=4 ){
    return new Promise((resolve, reject) => {
        _canvas_.core.element.create('path',name).then(path => { 
            path.unifiedAttribute({ 
                ignored:ignored,
                colour:colour,
                thickness:thickness,
                jointType:jointType,
                capType:capType,
                looping:looping,
                jointDetail:jointDetail,
                sharpLimit:sharpLimit,
            });
            if(points.length != 0){ path.points(points); }
            else{ path.pointsAsXYArray(pointsAsXYArray); }
            resolve(path);
        });
    });
}

interfacePart.partLibrary.basic.path = function(name,data){ 
    return interfacePart.collection.basic.path( name, data.points, data.thickness, data.ignored, data.colour, data.pointsAsXYArray, data.jointType, data.capType, data.looping, data.jointDetail, data.sharpLimit );
};