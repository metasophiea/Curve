var fontName = new URL(window.location.href).searchParams.get("fontName");
if(fontName == undefined){fontName = 'Roboto-Regular';}
var customText = new URL(window.location.href).searchParams.get("text");
if(customText == undefined){customText = 'How are you today?';}

function rc(){return {r:Math.random(),g:Math.random(),b:Math.random(),a:1};}

_canvas_.layers.registerFunctionForLayer("core", function(){

    let group_1 = _canvas_.core.element.create('Group','group_1');
    group_1.heedCamera(true);
    _canvas_.core.arrangement.append(group_1);

    setTimeout(() => {
        // _canvas_.core.viewport.scale(2);

        let rectangle_1 = _canvas_.core.element.create('Rectangle','rectangle_1');
        rectangle_1.unifiedAttribute({ x:10, y:10, width:50, height:50, colour:rc() });
        group_1.append(rectangle_1);
        let characterString_1 = _canvas_.core.element.create('CharacterString','characterString_1');
        characterString_1.unifiedAttribute({
            string:'circle', font:fontName, x:10, y:10, width:50, height:50, colour:rc(),
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'top'},
        });
        group_1.append(characterString_1);

        let rectangle_2 = _canvas_.core.element.create('Rectangle','rectangle_2');
        rectangle_2.unifiedAttribute({ x:10, y:95, width:50, height:50, colour:rc() });
        group_1.append(rectangle_2);
        let characterString_2 = _canvas_.core.element.create('CharacterString','characterString_2');
        characterString_2.unifiedAttribute({
            string:'circle', font:fontName, x:10, y:95, width:50, height:50, colour:rc(),
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
        });
        group_1.append(characterString_2);

        let rectangle_3 = _canvas_.core.element.create('Rectangle','rectangle_3');
        rectangle_3.unifiedAttribute({ x:10, y:160, width:50, height:50, colour:rc() });
        group_1.append(rectangle_3);
        let characterString_3 = _canvas_.core.element.create('CharacterString','characterString_3');
        characterString_3.unifiedAttribute({
            string:'circle', font:fontName, x:10, y:160, width:50, height:50, colour:rc(),
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'bottom'},
        });
        group_1.append(characterString_3);


        let rectangle_4 = _canvas_.core.element.create('Rectangle','rectangle_4');
        rectangle_4.unifiedAttribute({ x:275, y:10, width:50, height:50, colour:rc() });
        group_1.append(rectangle_4);
        let characterString_4 = _canvas_.core.element.create('CharacterString','characterString_4');
        characterString_4.unifiedAttribute({
            string:'circle', font:fontName, x:275, y:10, width:50, height:50, colour:rc(),
            printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'top'},
        });
        group_1.append(characterString_4);

        let rectangle_5 = _canvas_.core.element.create('Rectangle','rectangle_5');
        rectangle_5.unifiedAttribute({ x:275, y:95, width:50, height:50, colour:rc() });
        group_1.append(rectangle_5);
        let characterString_5 = _canvas_.core.element.create('CharacterString','characterString_5');
        characterString_5.unifiedAttribute({
            string:'circle', font:fontName, x:275, y:95, width:50, height:50, colour:rc(),
            printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'middle'},
        });
        group_1.append(characterString_5);

        let rectangle_6 = _canvas_.core.element.create('Rectangle','rectangle_6');
        rectangle_6.unifiedAttribute({ x:275, y:160, width:50, height:50, colour:rc() });
        group_1.append(rectangle_6);
        let characterString_6 = _canvas_.core.element.create('CharacterString','characterString_6');
        characterString_6.unifiedAttribute({
            string:'circle', font:fontName, x:275, y:160, width:50, height:50, colour:rc(),
            printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'bottom'},
        });
        group_1.append(characterString_6);


        let rectangle_7 = _canvas_.core.element.create('Rectangle','rectangle_7');
        rectangle_7.unifiedAttribute({ x:540, y:10, width:50, height:50, colour:rc() });
        group_1.append(rectangle_7);
        let characterString_7 = _canvas_.core.element.create('CharacterString','characterString_7');
        characterString_7.unifiedAttribute({
            string:'circle', font:fontName, x:540, y:10, width:50, height:50, colour:rc(),
            printingMode:{widthCalculation:'absolute', horizontal:'right', vertical:'top'},
        });
        group_1.append(characterString_7);

        let rectangle_8 = _canvas_.core.element.create('Rectangle','rectangle_8');
        rectangle_8.unifiedAttribute({ x:540, y:95, width:50, height:50, colour:rc() });
        group_1.append(rectangle_8);
        let characterString_8 = _canvas_.core.element.create('CharacterString','characterString_8');
        characterString_8.unifiedAttribute({
            string:'circle', font:fontName, x:540, y:95, width:50, height:50, colour:rc(),
            printingMode:{widthCalculation:'absolute', horizontal:'right', vertical:'middle'},
        });
        group_1.append(characterString_8);

        let rectangle_9 = _canvas_.core.element.create('Rectangle','rectangle_9');
        rectangle_9.unifiedAttribute({ x:540, y:160, width:50, height:50, colour:rc() });
        group_1.append(rectangle_9);
        let characterString_9 = _canvas_.core.element.create('CharacterString','characterString_9');
        characterString_9.unifiedAttribute({
            string:'circle', font:fontName, x:540, y:160, width:50, height:50, colour:rc(),
            printingMode:{widthCalculation:'absolute', horizontal:'right', vertical:'bottom'},
        });
        group_1.append(characterString_9);


    

        setTimeout(_canvas_.core.render.frame,200);
        setTimeout(_canvas_.core.render.frame,1000);

    }, 500);
} );