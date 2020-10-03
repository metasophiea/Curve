this.path = function(name=null, points=[], thickness=1, ignored=false, colour={r:0,g:0,b:0,a:1}, pointsAsXYArray=[], jointType='sharp', capType='none', looping=false, jointDetail=25, sharpLimit=4){
    dev.log.partBasic('.path('+name+','+JSON.stringify(points)+','+thickness+','+ignored+','+JSON.stringify(colour)+','+JSON.stringify(pointsAsXYArray)+','+jointType+','+capType+','+looping+','+jointDetail+','+sharpLimit+')'); //#development

    const element = _canvas_.core.element.create('Path',String(name));
    element.unifiedAttribute({
        ignored:ignored,
        colour:colour,
        thickness:thickness,
        jointType:jointType,
        capType:capType,
        looping:looping,
        jointDetail:jointDetail,
        sharpLimit:sharpLimit,
    });
    if(points.length != 0){ element.points(points); }
    else{ element.pointsAsXYArray(pointsAsXYArray); }
    return element;
}

interfacePart.partLibrary.basic.path = function(name,data){ 
    return interfacePart.collection.basic.path(
        name, data.points, data.thickness, data.ignored, data.colour, data.pointsAsXYArray, data.jointType, data.capType, data.looping, data.jointDetail, data.sharpLimit
    );
};