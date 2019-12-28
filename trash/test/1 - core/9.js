var fontName = new URL(window.location.href).searchParams.get("fontName");
if(fontName == undefined){fontName = 'Roboto-Regular';}
var customText = new URL(window.location.href).searchParams.get("text");
if(customText == undefined){customText = 'How are you today?';}

_canvas_.core.meta.go = function(){
    _canvas_.core.meta.createSetAppend(
        'rectangle','rectangle_1', 
        { 
            x:10, y:125, width:100, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'character','character_1', 
        { 
            character:'A',
            font:fontName,
            x:10, y:125, width:300, height:300, 
            printingMode:{horizontal:'left',vertical:'top'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'rectangle','rectangle_2', 
        { 
            x:200, y:125, width:100, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'character','character_2', 
        { 
            character:'A',
            font:fontName,
            x:200, y:125, width:300, height:300, anchor:{x:0,y:0},
            printingMode:{horizontal:'middle',vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'rectangle','rectangle_3', 
        { 
            x:350, y:320, width:200, height:200, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'character','character_3', 
        { 
            character:'o',
            font:fontName,
            x:350, y:320, width:200, height:200,  anchor:{x:0,y:0},
            printingMode:{horizontal:'left',vertical:'top'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'rectangle','rectangle_4', 
        { 
            x:600, y:370, width:300, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_1', 
        { 
            string:'hcave',
            font:fontName,
            x:600, y:370, width:200, height:100, 
            printingMode:{widthCalculation:'filling', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_2', 
        { 
            string:'cave',
            font:fontName,
            x:800, y:370, width:200, height:100, 
            printingMode:{widthCalculation:'filling', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'rectangle','rectangle_5', 
        { 
            x:10, y:400, width:300, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_3', 
        { 
            string:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            font:fontName,
            x:10, y:500, width:300, height:100, 
            printingMode:{widthCalculation:'filling', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_4', 
        { 
            string:'abcdefghijklmnopqrstuvwxyz',
            font:fontName,
            x:10, y:600, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_5', 
        { 
            string:'0123456789',
            font:fontName,
            x:10, y:700, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_6', 
        { 
            string:'.,:;?!/\\()[]{}#-_\'"|><+=&*~%',
            font:fontName,
            x:10, y:800, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_7', 
        { 
            string:'Look',
            font:fontName,
            x:10, y:900, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'rectangle','rectangle_6', 
        { 
            x:350, y:100, width:100, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_8', 
        { 
            string:customText,
            font:fontName,
            x:350, y:100, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'rectangle','rectangle_7', 
        { 
            x:350, y:200, width:200, height:100, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_9', 
        { 
            string:'How are you today?',
            font:fontName,
            x:350, y:200, width:100, height:100, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    setTimeout(()=>{_canvas_.core.render.frame();},500);
    setTimeout(()=>{ _canvas_.core.render.frame();},1500);
};