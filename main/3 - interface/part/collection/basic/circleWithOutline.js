this.circleWithOutline = function(name=null, x=0, y=0, radius=10, detail=25, ignored=false, colour={r:1,g:0,b:1,a:1}, thickness=1, lineColour={r:0,g:0,b:0,a:1}){
    dev.log.partBasic('.circleWithOutline('+name+','+x+','+y+','+radius+','+detail+','+ignored+','+JSON.stringify(colour)+','+thickness+','+JSON.stringify(lineColour)+')'); //#development

    const element = _canvas_.core.element.create('circleWithOutline',name);
    element.unifiedAttribute({
        x:x, 
        y:y, 
        radius:radius, 
        detail:detail, 
        thickness:thickness,
        ignored:ignored, 
        colour:colour,
        lineColour:lineColour,
    });
    return element;
};

interfacePart.partLibrary.basic.circleWithOutline = function(name,data){ 
    return interfacePart.collection.basic.circleWithOutline(
        name, data.x, data.y, data.radius, data.detail, data.ignored, data.colour, data.thickness, data.lineColour
    );
};