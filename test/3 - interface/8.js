_canvas_.interface.go.add( function(){

    _canvas_.core.render.active(true);
    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(10);
    _canvas_.core.viewport.stopMouseScroll(true);

    //testUnit_1
        // const testUnit = _canvas_.interface.unit.collection.test.testUnit_1('testUnit_1',10,10);
        // _canvas_.system.pane.mm.append( testUnit );
        // testUnit.interactable();
        // testUnit.allowIOConnections(false);
        // testUnit.allowIODisconnections(false);

    // //testUnit_2
    //     const testUnit_2_1 = _canvas_.interface.unit.collection.test.testUnit_2('testUnit_2_1',10,10);
    //     _canvas_.system.pane.mm.append( testUnit_2_1 );

    //testUnit_3
        const testUnit_3_1 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_1',10,10);
        _canvas_.system.pane.mm.append( testUnit_3_1 );
        const testUnit_3_2 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_2',200,10);
        _canvas_.system.pane.mm.append( testUnit_3_2 );
        
        testUnit_3_1.io._.test_connectionNode1.connectTo(testUnit_3_2.io._.test_connectionNode1);
        
        const testUnit_3_3 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_3',10,200);
        _canvas_.system.pane.mm.append( testUnit_3_3 );
        const testUnit_3_4 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_4',300,200);
        testUnit_3_4.angle(1);
        _canvas_.system.pane.mm.append( testUnit_3_4 );
        
        testUnit_3_3.io._.test_connectionNode1.connectTo(testUnit_3_4.io._.test_connectionNode1);
        
        
        const testUnit_3_5 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_5',10,400);
        _canvas_.system.pane.mm.append( testUnit_3_5 );
        const testUnit_3_6 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_6',200,450);
        testUnit_3_6.angle(-1);
        _canvas_.system.pane.mm.append( testUnit_3_6 );
        
        testUnit_3_5.io._.test_connectionNode1.connectTo(testUnit_3_6.io._.test_connectionNode1);

    // //testUnit_4
    //     const testUnit_4_1 = _canvas_.interface.unit.collection.test.testUnit_4('testUnit_4_1',10,10);
    //     _canvas_.system.pane.mm.append( testUnit_4_1 );
});