_canvas_.layers.registerFunctionForLayer("core", function(){

    let characterString_1 = _canvas_.core.element.create('CharacterString','test_characterString_1');
        characterString_1.unifiedAttribute({
            string:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            font:'defaultThick',
            x:10, y:10, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_1);
    let characterString_2 = _canvas_.core.element.create('CharacterString','test_characterString_2');
        characterString_2.unifiedAttribute({
            string:'abcdefghijklmnopqrstuvwxyz',
            font:'defaultThick',
            x:10, y:40, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_2);
    let characterString_3 = _canvas_.core.element.create('CharacterString','test_characterString_3');
        characterString_3.unifiedAttribute({
            string:'0123456789',
            font:'defaultThick',
            x:10, y:90, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_3);
    let characterString_4 = _canvas_.core.element.create('CharacterString','test_characterString_4');
        characterString_4.unifiedAttribute({
            string:'.,:;?!/\\()[]{}#-_\'"|><+=&*~%^$',
            font:'defaultThick',
            x:10, y:130, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_4);
    let characterString_5 = _canvas_.core.element.create('CharacterString','test_characterString_5');
        characterString_5.unifiedAttribute({
            string:'How are you today?',
            font:'defaultThick',
            x:10, y:170, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_5);
    let characterString_6 = _canvas_.core.element.create('CharacterString','test_characterString_6');
        characterString_6.unifiedAttribute({
            string:'(Kepp) [Yaaj] {Qua?}',
            font:'defaultThick',
            x:10, y:210, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_6);
    let characterString_7 = _canvas_.core.element.create('CharacterString','test_characterString_7');
        characterString_7.unifiedAttribute({
            string:'vo wo xo ao default',
            font:'defaultThick',
            x:10, y:250, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_7);
    let characterString_8 = _canvas_.core.element.create('CharacterString','test_characterString_8');
        characterString_8.unifiedAttribute({
            string:'defaultThin',
            font:'defaultThin',
            x:10, y:350, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_8);
    let characterString_9 = _canvas_.core.element.create('CharacterString','test_characterString_9');
        characterString_9.unifiedAttribute({
            string:'abcdefghijklmnopqrstuvwxyz',
            font:'defaultThin',
            x:10, y:390, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_9);
    let characterString_10 = _canvas_.core.element.create('CharacterString','test_characterString_10');
        characterString_10.unifiedAttribute({
            string:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            font:'defaultThin',
            x:10, y:440, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_10);
    let characterString_11 = _canvas_.core.element.create('CharacterString','test_characterString_11');
        characterString_11.unifiedAttribute({
            string:'0123456789',
            font:'defaultThin',
            x:10, y:490, width:35, height:35, 
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_11);
    let characterString_12 = _canvas_.core.element.create('CharacterString','test_characterString_12');
        characterString_12.unifiedAttribute({
            string:'.,:;?!/\\()[]{}#-_\'"|><+=&*~%^$',
            font:'defaultThin',
            x:10, y:540, width:35, height:35, spacing:0.2,
            printingMode:{ widthCalculation:'absolute', horizontal:'left', vertical:'top' },
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString_12);

    setTimeout(()=>{_canvas_.core.render.frame();},100);

    // _canvas_.core.viewport.position(-50,325);
    // _canvas_.core.viewport.scale(8);
} );