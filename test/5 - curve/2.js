_canvas_.control.scene2.addUnit(15,50,0,'audio_duplicator');
_canvas_.control.scene2.addUnit(100,50,0,'audio_duplicator');
_canvas_.control.scene2.addUnit(200,50,1.5,'audio_duplicator');
_canvas_.control.scene2.addUnit(300,50,0,'audio_duplicator');
_canvas_.control.scene2.removeUnit( _canvas_.control.scene2.getUnitByName(1) );
_canvas_.control.scene2.addUnit(10,150,0,'basicSynthesizer');


_canvas_.system.pane.mm.getChildByName('2').io.audio.output_1.connectTo( _canvas_.system.pane.mm.getChildByName('0').io.audio.input );

console.log( _canvas_.control.scene2.getUnitsWithinPoly([{x:0,y:0}, {x:120,y:0}, {x:120,y:100}, {x:0,y:100}]) );

_canvas_.control.selection.selectEverything();
_canvas_.control.selection.copy();
_canvas_.control.selection.paste({x:500,y:0});

// _canvas_.control.viewport.scale(11.6);
// _canvas_.control.viewport.position(-50, 15);

// _canvas_.control.scene2.save();



