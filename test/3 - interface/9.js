var units = {};

_canvas_.interface.go.add( function(){

    _canvas_.core.render.active(true);
    // _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(10);
    _canvas_.core.viewport.stopMouseScroll(true);


        units.testUnit_3_1 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_1',10,100);
        _canvas_.system.pane.mm.append( units.testUnit_3_1 );
        units.testUnit_3_2 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_2',400,150);
        units.testUnit_3_2.angle(-1);
        _canvas_.system.pane.mm.append( units.testUnit_3_2 );
        
        units.testUnit_3_1.io._.test_connectionNode1.connectTo(units.testUnit_3_2.io._.test_connectionNode1);


        units.testUnit_3_3 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_3',260,150);
        _canvas_.system.pane.mm.append( units.testUnit_3_3 );







        units.testUnit_3_4 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_4',10,400);
        _canvas_.system.pane.mm.append( units.testUnit_3_4 );
        units.testUnit_3_5 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_5',400,450);
        units.testUnit_3_5.angle(-Math.PI/2);
        _canvas_.system.pane.mm.append( units.testUnit_3_5 );
        units.testUnit_3_6 = _canvas_.interface.unit.collection.test.testUnit_3('testUnit_3_6',500,350);
        _canvas_.system.pane.mm.append( units.testUnit_3_6 );

        units.testUnit_3_4.io._.test_connectionNode1.connectTo(units.testUnit_3_5.io._.test_connectionNode1);




        _canvas_.interface.part.collection.dynamic.cable2.globalDraw();






});