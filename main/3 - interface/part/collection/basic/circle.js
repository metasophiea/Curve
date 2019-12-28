this.circle = function(name=null, x=0, y=0, radius=10, detail=25, ignored=false, colour={r:1,g:0,b:1,a:1}){
    dev.log.partBasic('.circle('+name+','+x+','+y+','+radius+','+detail+','+ignored+','+JSON.stringify(colour)+')'); //#development

    const element = _canvas_.core.element.create('circle',name);
    element.unifiedAttribute({
        x:x, 
        y:y, 
        radius:radius, 
        detail:detail, 
        ignored:ignored, 
        colour:colour
    });
    return element;
};

interfacePart.partLibrary.basic.circle = function(name,data){ 
    return interfacePart.collection.basic.circle(
        name, data.x, data.y, data.radius, data.detail, data.ignored, data.colour
    );
};