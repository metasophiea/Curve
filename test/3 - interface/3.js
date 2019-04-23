//test of unit defined somewhere else

var testUnit = _canvas_.interface.unit.collection.test.testUnit_1(10,10);
_canvas_.system.pane.mm.append( testUnit );
_canvas_.core.viewport.stopMouseScroll(true);

testUnit.interactable();
// testUnit.allowIOConnections(false);
// testUnit.allowIODisconnections(false);


_canvas_.core.render.active(true);
// _canvas_.core.render.frame();