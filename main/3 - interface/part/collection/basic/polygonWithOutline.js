this.polygonWithOutline = function(name=null, points=[], pointsAsXYArray=[], ignored=false, colour={r:1,g:0,b:1,a:1}, thickness=1, lineColour={r:0,g:0,b:0,a:1}){
    dev.log.partBasic('.polygonWithOutline('+name+','+JSON.stringify(points)+','+JSON.stringify(pointsAsXYArray)+','+ignored+','+JSON.stringify(colour)+','+thickness+','+JSON.stringify(lineColour)+')'); //#development

    const element = _canvas_.core.element.create('PolygonWithOutline',String(name));
    element.unifiedAttribute({
        ignored:ignored,
        colour:colour,
        lineColour:lineColour,
        thickness:thickness,
    });
    if(points.length != 0){ element.points(points); }
    else{ element.pointsAsXYArray(pointsAsXYArray); }
    return element;
}

interfacePart.partLibrary.basic.polygonWithOutline = function(name,data){ 
    return interfacePart.collection.basic.polygonWithOutline(
        name, data.points, data.pointsAsXYArray, data.ignored, data.colour, data.thickness, data.lineColour
    );
};