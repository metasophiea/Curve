_canvas_.layers.registerFunctionForLayer("core", function(){

    middleground = _canvas_.core.element.create('Group','middleground');
    middleground.unifiedAttribute({heedCamera:true, heedCameraActive:true});
    _canvas_.core.arrangement.append(middleground);

        middle = _canvas_.core.element.create('Group','middle');
        middleground.append(middle);

            controlGroup = _canvas_.core.element.create('Group','controlGroup');
            middle.append(controlGroup);

                test_dial_1_continuous = _canvas_.core.element.create('Group','test_dial_1_continuous');
                controlGroup.append(test_dial_1_continuous);

                    needleGroup = _canvas_.core.element.create('Group','needleGroup');
                    needleGroup.unifiedAttribute({ x:50, y:10, angle:2.3561945 });
                    test_dial_1_continuous.append(needleGroup);

                        needle = _canvas_.core.element.create('Rectangle','needle');
                        needle.unifiedAttribute({ x:3.3333333, y:-1, width:10, height:2 });
                        needleGroup.append(needle);


    // setTimeout( () => {
    //     _canvas_.core.render.frame();
    // }, 1000);

    tick = 0;
    setInterval( () => {
        needleGroup.angle(tick+=0.1);
        _canvas_.core.render.frame()
    }, 100);
});