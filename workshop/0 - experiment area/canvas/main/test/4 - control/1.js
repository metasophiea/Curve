// workspace.control.scene.addUnit(15,50,0,'audio_duplicator','misc');
// workspace.control.scene.addUnit(100,50,0,'audio_duplicator','misc');
// workspace.control.scene.addUnit(200,50,1.5,'audio_duplicator','misc');
// workspace.control.scene.addUnit(300,50,0,'audio_duplicator','misc');
// workspace.control.scene.removeUnit( workspace.control.scene.getUnitByName(1) );
// workspace.control.scene.addUnit(10,150,0,'basicSynthesizer','synthesizers');


// workspace.system.pane.mm.getChildByName('2').io.audio.output_1.connectTo( workspace.system.pane.mm.getChildByName('0').io.audio.input );

// console.log( workspace.control.scene.getUnitsWithinPoly([{x:0,y:0}, {x:120,y:0}, {x:120,y:100}, {x:0,y:100}]) );

// workspace.control.selection.selectEverything();
// workspace.control.selection.copy();
// workspace.control.selection.paste({x:500,y:0});

// workspace.control.viewport.scale(11.6);
// workspace.control.viewport.position(-50, 15);

// workspace.control.scene.save();




// var basicMixer = workspace.control.scene.addUnit(15,50,0,'basicMixer','misc');
// var basicSynthesizer_1 = workspace.control.scene.addUnit(175,50,0,'basicSynthesizer','synthesizers');
// var basicSynthesizer_2 = workspace.control.scene.addUnit(175,200,0,'basicSynthesizer','synthesizers');
// basicSynthesizer_1.io.audio.audioOut.connectTo( basicMixer.io.audio.input_0 );
// basicSynthesizer_2.io.audio.audioOut.connectTo( basicMixer.io.audio.input_1 );
// workspace.control.scene.save();