var fontName = new URL(window.location.href).searchParams.get("fontName");
if(fontName == undefined){fontName = 'Roboto-Regular';}
var customText = new URL(window.location.href).searchParams.get("text");
if(customText == undefined){customText = 'How are you today?';}

_canvas_.core.meta.go = function(){
    _canvas_.core.element.create('rectangle','rectangle_1').then(rectangle => {
        rectangle.unifiedAttribute({
            x:10, y:125, width:100, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(rectangle);
    });
    _canvas_.core.element.create('character','character_1').then(character => {
        character.unifiedAttribute({
            character:'A',
            font:fontName,
            x:10, y:125, width:300, height:300, 
            printingMode:{horizontal:'left',vertical:'top'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(character);
    });

    _canvas_.core.element.create('rectangle','rectangle_2').then(rectangle => {
        rectangle.unifiedAttribute({
            x:200, y:125, width:100, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(rectangle);
    });
    _canvas_.core.element.create('character','character_2').then(character => {
        character.unifiedAttribute({
            character:'A',
            font:fontName,
            x:200, y:125, width:300, height:300, anchor:{x:0,y:0},
            printingMode:{horizontal:'middle',vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(character);
    });

    _canvas_.core.element.create('rectangle','rectangle_3').then(rectangle => {
        rectangle.unifiedAttribute({
            x:350, y:320, width:200, height:200, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(rectangle);
    });
    _canvas_.core.element.create('character','character_3').then(character => {
        character.unifiedAttribute({
            character:'o',
            font:fontName,
            x:350, y:320, width:200, height:200,  anchor:{x:0,y:0},
            printingMode:{horizontal:'left',vertical:'top'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(character);
    });

    _canvas_.core.element.create('rectangle','rectangle_4').then(rectangle => {
        rectangle.unifiedAttribute({
            x:600, y:370, width:300, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(rectangle);
    });
    _canvas_.core.element.create('characterString','characterString_1').then(characterString => {
        characterString.unifiedAttribute({
            string:'hcave',
            font:fontName,
            x:600, y:370, width:200, height:100, 
            printingMode:{widthCalculation:'filling', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_2').then(characterString => {
        characterString.unifiedAttribute({
            string:'cave',
            font:fontName,
            x:800, y:370, width:200, height:100, 
            printingMode:{widthCalculation:'filling', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });

    _canvas_.core.element.create('rectangle','rectangle_5').then(rectangle => {
        rectangle.unifiedAttribute({
            x:10, y:400, width:300, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(rectangle);
    });
    _canvas_.core.element.create('characterString','characterString_3').then(characterString => {
        characterString.unifiedAttribute({
            string:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            font:fontName,
            x:10, y:500, width:300, height:100, 
            printingMode:{widthCalculation:'filling', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });

    _canvas_.core.element.create('characterString','characterString_4').then(characterString => {
        characterString.unifiedAttribute({
            string:'abcdefghijklmnopqrstuvwxyz',
            font:fontName,
            x:10, y:600, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });

    _canvas_.core.element.create('characterString','characterString_5').then(characterString => {
        characterString.unifiedAttribute({
            string:'0123456789',
            font:fontName,
            x:10, y:700, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });

    _canvas_.core.element.create('characterString','characterString_6').then(characterString => {
        characterString.unifiedAttribute({
            string:'.,:;?!/\\()[]{}#-_\'"|><+=&*~%',
            font:fontName,
            x:10, y:800, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });

    _canvas_.core.element.create('characterString','characterString_7').then(characterString => {
        characterString.unifiedAttribute({
            string:'Look',
            font:fontName,
            x:10, y:900, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });

    _canvas_.core.element.create('rectangle','rectangle_6').then(rectangle => {
        rectangle.unifiedAttribute({
            x:350, y:100, width:100, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(rectangle);
    });
    _canvas_.core.element.create('characterString','characterString_8').then(characterString => {
        characterString.unifiedAttribute({
            string:customText,
            font:fontName,
            x:350, y:100, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });

    _canvas_.core.element.create('rectangle','rectangle_7').then(rectangle => {
        rectangle.unifiedAttribute({
            x:350, y:200, width:200, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(rectangle);
    });
    _canvas_.core.element.create('characterString','characterString_9').then(characterString => {
        characterString.unifiedAttribute({
            string:'How are you today?',
            font:fontName,
            x:350, y:200, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });

    setTimeout(()=>{_canvas_.core.render.frame();},500);
    setTimeout(()=>{ _canvas_.core.render.frame();},1500);
};