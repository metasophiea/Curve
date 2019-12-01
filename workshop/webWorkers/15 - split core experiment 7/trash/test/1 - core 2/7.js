_canvas_.core.meta.go = function(){
    _canvas_.core.element.create('characterString','characterString_1').then(characterString => {
        characterString.unifiedAttribute({
            string:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            font:'defaultThick',
            x:10, y:10, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_2').then(characterString => {
        characterString.unifiedAttribute({
            string:'abcdefghijklmnopqrstuvwxyz',
            font:'defaultThick',
            x:10, y:40, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_3').then(characterString => {
        characterString.unifiedAttribute({
            string:'0123456789',
            font:'defaultThick',
            x:10, y:90, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_4').then(characterString => {
        characterString.unifiedAttribute({
            string:'.,:;?!/\\()[]{}#-_\'"|><+=&*~%$',
            font:'defaultThick',
            x:10, y:130, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_5').then(characterString => {
        characterString.unifiedAttribute({
            string:'How are you today?',
            font:'defaultThick',
            x:10, y:170, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_6').then(characterString => {
        characterString.unifiedAttribute({
            string:'(Kepp) [Yaaj] {Qua?}',
            font:'defaultThick',
            x:10, y:210, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_7').then(characterString => {
        characterString.unifiedAttribute({
            string:'vo wo xo ao default',
            font:'defaultThick',
            x:10, y:250, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_8').then(characterString => {
        characterString.unifiedAttribute({
            string:'defaultThin',
            font:'defaultThin',
            x:10, y:350, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_9').then(characterString => {
        characterString.unifiedAttribute({
            string:'abcdefghijklmnopqrstuvwxyz',
            font:'defaultThin',
            x:10, y:390, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_10').then(characterString => {
        characterString.unifiedAttribute({
            string:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            font:'defaultThin',
            x:10, y:440, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_11').then(characterString => {
        characterString.unifiedAttribute({
            string:'0123456789',
            font:'defaultThin',
            x:10, y:490, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });
    _canvas_.core.element.create('characterString','characterString_12').then(characterString => {
        characterString.unifiedAttribute({
            string:'.,:;?!/\\()[]{}#-_\'"|><+=&*~%$',
            font:'defaultThin',
            x:10, y:540, width:35, height:35, spacing:0.2,
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);
    });

    setTimeout(()=>{_canvas_.core.render.frame();},100);
};
