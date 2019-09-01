_canvas_.core.render.active(true);

var cn_reg_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode1', { x:10, y:10, cableConnectionPosition:{x:0,y:0} } );
var cn_reg_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode2', { x:110,y:10, cableConnectionPosition:{x:1,y:1} } );
_canvas_.system.pane.mm.append( cn_reg_0 );
_canvas_.system.pane.mm.append( cn_reg_1 );
cn_reg_0.connectTo(cn_reg_1);



var rect_1 = _canvas_.interface.part.builder( 'basic', 'rectangle', 'rect_1', { x:10, y:60, height:20, width:20, colour:{r:0.75,g:0.75,b:0.75,a:1}} );
var rect_2 = _canvas_.interface.part.builder( 'basic', 'rectangle', 'rect_2', { x:110, y:80, height:20, width:20, colour:{r:0.75,g:0.75,b:0.75,a:1}} );
_canvas_.system.pane.mm.append( rect_1 );
_canvas_.system.pane.mm.append( rect_2 );

var cn_reg_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode3', { 
    x:10-40*0.25, y:60-40*0.25, width:40, height:40, cableConnectionPosition:{x:0.75,y:0.5}, cableVersion:2, 
    style:{ dim:{r:1,g:0.75,b:0.75,a:0}, glow:{r:0,g:0,b:0,a:0} }
} );
var cn_reg_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode4', { 
    x:110+40*0.75, y:80+40*0.75, width:40, height:40, angle:Math.PI, cableConnectionPosition:{x:0.75,y:0.5}, cableVersion:2, 
    style:{ dim:{r:1,g:0.75,b:0.75,a:0}, glow:{r:0,g:0,b:0,a:0} }
} );
_canvas_.system.pane.mm.append( cn_reg_2 );
_canvas_.system.pane.mm.append( cn_reg_3 );
cn_reg_2.connectTo(cn_reg_3);