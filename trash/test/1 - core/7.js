_canvas_.core.meta.go = function(){
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_1', 
        { 
            string:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            font:'defaultThick',
            x:10, y:10, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_2', 
        { 
            string:'abcdefghijklmnopqrstuvwxyz',
            font:'defaultThick',
            x:10, y:40, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_3', 
        { 
            string:'0123456789',
            font:'defaultThick',
            x:10, y:90, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_4', 
        { 
            string:'.,:;?!/\\()[]{}#-_\'"|><+=&*~%$',
            font:'defaultThick',
            x:10, y:130, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_5', 
        { 
            string:'How are you today?',
            font:'defaultThick',
            x:10, y:170, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_6', 
        { 
            string:'(Kepp) [Yaaj] {Qua?}',
            font:'defaultThick',
            x:10, y:210, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_7', 
        { 
            string:'vo wo xo ao default',
            font:'defaultThick',
            x:10, y:250, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_8', 
        { 
            string:'defaultThin',
            font:'defaultThin',
            x:10, y:350, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_9', 
        { 
            string:'abcdefghijklmnopqrstuvwxyz',
            font:'defaultThin',
            x:10, y:390, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_10', 
        { 
            string:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            font:'defaultThin',
            x:10, y:440, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_11', 
        { 
            string:'0123456789',
            font:'defaultThin',
            x:10, y:490, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );
    _canvas_.core.meta.createSetAppend(
        'characterString','characterString_12', 
        { 
            string:'.,:;?!/\\()[]{}#-_\'"|><+=&*~%$',
            font:'defaultThin',
            x:10, y:540, width:35, height:35, spacing:0.2,
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        }
    );

    setTimeout(()=>{_canvas_.core.render.frame();},100);
};
