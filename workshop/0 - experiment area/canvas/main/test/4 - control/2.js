workspace.control.scene.addUnit(15,50,0,'audio_duplicator','misc');
workspace.control.scene.addUnit(100,50,0,'audio_duplicator','misc');
workspace.control.scene.addUnit(200,50,1.5,'audio_duplicator','misc');
workspace.control.scene.addUnit(300,50,0,'audio_duplicator','misc');
workspace.control.scene.removeUnit( workspace.control.scene.getUnitByName(1) );
workspace.control.scene.addUnit(10,150,0,'basicSynthesizer','synthesizers');
workspace.system.pane.mm.getChildByName('2').io.audio.output_1.connectTo( workspace.system.pane.mm.getChildByName('0').io.audio.input );





workspace.control.switch.mouseWheelZoomEnabled = !true;
workspace.control.switch.mouseGripPanningEnabled = !true;
workspace.control.switch.mouseGroupSelect = !true;
workspace.control.switch.enableSceneSave = !true;
workspace.control.switch.enableSceneLoad = !true;
workspace.control.switch.enableMenubar = !true;
workspace.control.switch.enableWindowScrollbarAutomaticRemoval = !true;
workspace.control.switch.enableUnitSelection = !true;
workspace.control.switch.enableSceneModification = !true;

// workspace.control.switch.enablCableDisconnectionConnection = !true;
// workspace.control.switch.enableUnitInterface = !true;


workspace.control.gui.hideMenubar();
workspace.control.viewport.stopMouseScroll();