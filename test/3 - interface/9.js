_canvas_.core.render.active(true);


var cn_reg_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_1', { x:10, y:10 } );
var cn_reg_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_2', { x:110,  y:10 } );
var cn_reg_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_3', { x:110,  y:30 } );
var cn_reg_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_4', { x:130,  y:15 } );
var cn_reg_4 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_5', { x:130,  y:40 } );
_canvas_.system.pane.mm.append( cn_reg_0 );
_canvas_.system.pane.mm.append( cn_reg_1 );
_canvas_.system.pane.mm.append( cn_reg_2 );
_canvas_.system.pane.mm.append( cn_reg_3 );
_canvas_.system.pane.mm.append( cn_reg_4 );


// cn_reg_0.allowConnections(false);
// cn_reg_0.allowDisconnections(false);