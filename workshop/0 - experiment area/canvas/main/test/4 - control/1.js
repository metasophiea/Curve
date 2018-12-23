workspace.control.scene.addUnit('audio_duplicator',10,10);
workspace.control.scene.addUnit('audio_duplicator',100,10);
workspace.control.scene.addUnit('audio_duplicator',200,10);
workspace.control.scene.addUnit('audio_duplicator',300,10);
workspace.control.scene.removeUnit( workspace.control.scene.getUnitByName(1) );

console.log( workspace.control.scene.getUnitsWithinPoly([{x:0,y:0}, {x:120,y:0}, {x:120,y:100}, {x:0,y:100}]) );