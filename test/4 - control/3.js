_canvas_.control.viewport.activeRender(true);
_canvas_.control.scene.addUnit(10,10,0,'testUnit_2','test');
_canvas_.control.scene.addUnit(200,10,0.1,'testUnit_2','test');

var unit3 = _canvas_.control.scene.addUnit(10,150,0,'testUnit_3','test');
var unit4 = _canvas_.control.scene.addUnit(150,150,0,'testUnit_3','test');
unit3.io._.test_connectionNode1.connectTo(unit4.io._.test_connectionNode1);
_canvas_.control.actionRegistry.clearRegistry();




_canvas_.control.scene.removeUnit(unit3);



_canvas_.control.actionRegistry.undo();