var testUnit_1 = _canvas_.interface.unit.collection.test.testUnit_3(10,10);
testUnit_1.name = '1';
_canvas_.system.pane.mm.append( testUnit_1 );
var testUnit_2 = _canvas_.interface.unit.collection.test.testUnit_3(200,10);
testUnit_2.name = '2';
_canvas_.system.pane.mm.append( testUnit_2 );

testUnit_1.io._.test_connectionNode1.connectTo(testUnit_2.io._.test_connectionNode1);



var testUnit_3 = _canvas_.interface.unit.collection.test.testUnit_3(10,200);
testUnit_3.name = '3';
_canvas_.system.pane.mm.append( testUnit_3 );
var testUnit_4 = _canvas_.interface.unit.collection.test.testUnit_3(300,200);
testUnit_4.name = '4';
testUnit_4.angle(1);
_canvas_.system.pane.mm.append( testUnit_4 );

testUnit_3.io._.test_connectionNode1.connectTo(testUnit_4.io._.test_connectionNode1);




var testUnit_5 = _canvas_.interface.unit.collection.test.testUnit_3(10,400);
testUnit_5.name = '5';
_canvas_.system.pane.mm.append( testUnit_5 );
var testUnit_6 = _canvas_.interface.unit.collection.test.testUnit_3(200,450);
testUnit_6.name = '6';
testUnit_6.angle(-1);
_canvas_.system.pane.mm.append( testUnit_6 );

testUnit_5.io._.test_connectionNode1.connectTo(testUnit_6.io._.test_connectionNode1);



_canvas_.core.render.frame();