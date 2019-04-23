this.text = function( name=null, text='Hello', x=0, y=0, width=10, height=10, angle=0, ignored=false, colour={r:1,g:0,b:1,a:1}, fontName='Roboto-Regular', printingMode={widthCalculation:'filling', horizontal:'left', vertical:'top'}, spacing=0.1, interCharacterSpacing=0.0 ){
    var temp = _canvas_.core.shape.create('characterString');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour(colour);

    temp.stopAttributeStartedExtremityUpdate = true;
    temp.printingMode(printingMode);
    temp.x(x);
    temp.y(y);
    temp.width(width); 
    temp.height(height);
    temp.font(fontName);
    temp.angle(angle);
    temp.string(text);
    temp.spacing(spacing);
    temp.interCharacterSpacing(interCharacterSpacing);
    temp.stopAttributeStartedExtremityUpdate = false;
    
    return temp;
};