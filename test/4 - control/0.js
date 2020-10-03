_canvas_.layers.registerFunctionForLayer("control", function(){
    _canvas_.core.render.active(true);
    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(10);


    const temp_1 = _canvas_.control.scene.addUnit(10,10,0,'testUnit_2','test');
    const temp_2 = _canvas_.control.scene.addUnit(100,10,0,'testUnit_2','test');
    // _canvas_.control.scene.removeUnit(temp);
    _canvas_.control.scene.rectifyUnitPosition(temp_2);

    _canvas_.control.scene.printUnits(
        _canvas_.control.scene.documentUnits([temp_1])
    );

    // setTimeout( () => { _canvas_.control.selection.selectUnit(temp_1); }, 1000 );
    // setTimeout( () => { _canvas_.control.selection.deselectUnit(temp_1); }, 1500 );
    // setTimeout( () => { _canvas_.control.selection.selectUnit(temp_1); }, 2000 );


    // const temp_1 = _canvas_.control.scene.addUnit(10,10,0,'testUnit_5','test');

});