this.text = function(name=null, text='Hello', x=0, y=0, width=10, height=10, angle=0, ignored=false, colour={r:1,g:0,b:1,a:1}, fontName='Roboto-Regular', printingMode={widthCalculation:'filling', horizontal:'left', vertical:'top'}, spacing=0.5, interCharacterSpacing=0.0){
    dev.log.partBasic('.text('+name+','+text+','+x+','+y+','+width+','+height+','+angle+','+ignored+','+JSON.stringify(colour)+','+fontName+','+JSON.stringify(printingMode)+','+spacing+','+interCharacterSpacing+')'); //#development

    const element = _canvas_.core.element.create('characterString',name);
    element.unifiedAttribute({
        x:x, 
        y:y, 
        width:width,
        height:height,
        angle:angle,
        ignored:ignored, 
        colour:colour,
        font:fontName,
        string:text,
        printingMode:printingMode,
        spacing:spacing,
        interCharacterSpacing:interCharacterSpacing,
    });
    return element;
};

interfacePart.partLibrary.basic.text = function(name,data){ 
    return interfacePart.collection.basic.text(
        name, data.text, data.x, data.y, data.width, data.height, data.angle, data.ignored, data.colour, data.font, data.printingMode, data.spacing, data.interCharacterSpacing
    );
};