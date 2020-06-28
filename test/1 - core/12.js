var fontName = new URL(window.location.href).searchParams.get("fontName");
if(fontName == undefined){fontName = 'Roboto-Regular';}
var customText = new URL(window.location.href).searchParams.get("text");
if(customText == undefined){customText = 'How are you today?';}

_canvas_.layers.registerFunctionForLayer("core", function(){

    let rectangle_1 = _canvas_.core.element.create('rectangle','rectangle_1');
    rectangle_1.unifiedAttribute({ 
        x:10, y:125, width:100, height:100, 
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(rectangle_1);
    let character_1 = _canvas_.core.element.create('character','test_character_1');
    character_1.unifiedAttribute({
        character:'A',
        font:fontName,
        x:10, y:125, width:300, height:300, 
        printingMode:{horizontal:'left',vertical:'top'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(character_1);

    let rectangle_2 = _canvas_.core.element.create('rectangle','rectangle_2');
    rectangle_2.unifiedAttribute({ 
        x:200, y:125, width:100, height:100, 
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(rectangle_2);
    let character_2 = _canvas_.core.element.create('character','test_character_2');
    character_2.unifiedAttribute({
        character:'A',
        font:fontName,
        x:200, y:125, width:300, height:300, anchor:{x:0,y:0},
        printingMode:{horizontal:'middle',vertical:'middle'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(character_2);

    let rectangle_3 = _canvas_.core.element.create('rectangle','rectangle_3');
    rectangle_3.unifiedAttribute({ 
        x:350, y:320, width:200, height:200, 
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(rectangle_3);
    let character_3 = _canvas_.core.element.create('character','test_character_3');
    character_3.unifiedAttribute({
        character:'o',
        font:fontName,
        x:350, y:320, width:200, height:200,  anchor:{x:0,y:0},
        printingMode:{horizontal:'left',vertical:'top'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(character_3);

    let rectangle_4 = _canvas_.core.element.create('rectangle','rectangle_4');
    rectangle_4.unifiedAttribute({ 
        x:600, y:370, width:300, height:100, 
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(rectangle_4);
    let characterString_1 = _canvas_.core.element.create('characterString','characterString_1');
    characterString_1.unifiedAttribute({
        string:'hcave',
        font:fontName,
        x:600, y:370, width:200, height:100, 
        printingMode:{widthCalculation:'filling', horizontal:'left', vertical:'middle'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(characterString_1);
    let characterString_2 = _canvas_.core.element.create('characterString','characterString_2');
    characterString_2.unifiedAttribute({
        string:'cave',
        font:fontName,
        x:800, y:370, width:200, height:100, 
        printingMode:{widthCalculation:'filling', horizontal:'left', vertical:'middle'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(characterString_2);

    let rectangle_5 = _canvas_.core.element.create('rectangle','rectangle_5');
    rectangle_5.unifiedAttribute({ 
        x:10, y:400, width:300, height:100, 
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(rectangle_5);
    let characterString_3 = _canvas_.core.element.create('characterString','characterString_3');
    characterString_3.unifiedAttribute({
        string:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        font:fontName,
        x:10, y:500, width:300, height:100, 
        printingMode:{widthCalculation:'filling', horizontal:'left', vertical:'middle'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(characterString_3);

    let characterString_4 = _canvas_.core.element.create('characterString','characterString_4');
    characterString_4.unifiedAttribute({
        string:'abcdefghijklmnopqrstuvwxyz',
        font:fontName,
        x:10, y:600, width:100, height:100, 
        printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(characterString_4);

    let characterString_5 = _canvas_.core.element.create('characterString','characterString_5');
    characterString_5.unifiedAttribute({
        string:'0123456789',
        font:fontName,
        x:10, y:700, width:100, height:100, 
        printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(characterString_5);

    let characterString_6 = _canvas_.core.element.create('characterString','characterString_6');
    characterString_6.unifiedAttribute({
        string:'.,:;?!/\\()[]{}#-_\'"|><+=&*~%',
        font:fontName,
        x:10, y:800, width:100, height:100, 
        printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(characterString_6);

    let characterString_7 = _canvas_.core.element.create('characterString','characterString_7');
    characterString_7.unifiedAttribute({
        string:'Look',
        font:fontName,
        x:10, y:900, width:100, height:100, 
        printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(characterString_7);

    let rectangle_6 = _canvas_.core.element.create('rectangle','rectangle_6');
    rectangle_6.unifiedAttribute({ 
        x:350, y:100, width:100, height:100, 
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(rectangle_6);
    let characterString_8 = _canvas_.core.element.create('characterString','characterString_8');
    characterString_8.unifiedAttribute({
        string:customText,
        font:fontName,
        x:350, y:100, width:100, height:100, 
        printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(characterString_8);

    let rectangle_7 = _canvas_.core.element.create('rectangle','rectangle_7');
    rectangle_7.unifiedAttribute({ 
        x:350, y:200, width:200, height:100, 
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(rectangle_7);
    let characterString_9 = _canvas_.core.element.create('characterString','characterString_9');
    characterString_9.unifiedAttribute({
        string:'How are you today?',
        font:fontName,
        x:350, y:200, width:100, height:100, 
        printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
        colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
    });
    _canvas_.core.arrangement.append(characterString_9);

    setTimeout(()=>{_canvas_.core.render.frame();},500);
    setTimeout(()=>{ _canvas_.core.render.frame();},1500);
} );