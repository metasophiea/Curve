var fontName = new URL(window.location.href).searchParams.get("fontName");
if(fontName == undefined){fontName = 'Roboto-Regular';}
var customText = new URL(window.location.href).searchParams.get("text");
if(customText == undefined){customText = 'CORE';}

function rc(){return {r:Math.random(),g:Math.random(),b:Math.random(),a:1};}

_canvas_.core.go.add( function(){ 

    let rectangle_1 = _canvas_.core.element.create('rectangle','rectangle_1');
    rectangle_1.unifiedAttribute({ x:10, y:10, width:50, height:50, colour:rc() });
    _canvas_.core.arrangement.append(rectangle_1);

    let rectangle_2 = _canvas_.core.element.create('rectangle','rectangle_2');
    rectangle_2.unifiedAttribute({ x:10, y:10, width:50, height:50, colour:rc() });
    _canvas_.core.arrangement.append(rectangle_2);

    let characterString_1 = _canvas_.core.element.create('characterString','characterString_1');
    _canvas_.core.arrangement.append(characterString_1);
    characterString_1.unifiedAttribute({
        string:customText, font:fontName, x:10, y:10, width:50, height:50, colour:rc(),
        printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'top'},
    });
    characterString_1.attachCallback('onFontUpdateCallback',(data) => {
        rectangle_2.x(10 + characterString_1.resultingWidth());
        _canvas_.core.render.frame();
    });

} );