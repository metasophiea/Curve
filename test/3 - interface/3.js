//test of unit defined somewhere else

var testUnit = workspace.interface.unit.collection.test.testUnit_1(10,10);
workspace.system.pane.mm.append( testUnit );
workspace.core.render.active(true);
workspace.core.viewport.stopMouseScroll(true);

console.log( testUnit.interactable() );
testUnit.allowIOConnections(false);
testUnit.allowIODisconnections(false);