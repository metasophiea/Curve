workspace.control.scene.addUnit(20,10,0,'audio_duplicator');
workspace.control.scene.addUnit(100,10,0,'basicMixer');
workspace.control.scene.addUnit(230,10,0,'data_duplicator');
workspace.control.scene.addUnit(470,10,0,'pulseGenerator_hyper');
workspace.control.scene.addUnit(330,10,0,'pulseGenerator');
workspace.control.scene.addUnit(300,50,0,'universalreadout');

workspace.control.scene.addUnit(350,70,0,'basicSynthesizer');

workspace.control.scene.addUnit(10,225,0,'audioScope');
workspace.control.scene.addUnit(10,70,0,'audioSink');

workspace.control.scene.addUnit(350,175,0,'musicalKeyboard');
// workspace.control.scene.addUnit(10,340,0,'audioIn');

workspace.control.scene.addUnit(225,85,0,'distortionUnit');
workspace.control.scene.addUnit(225,185,0,'filterUnit');
workspace.control.scene.addUnit(380,250,0,'multibandFilter');
workspace.control.scene.addUnit(225,290,0,'reverbUnit');

workspace.control.scene.addUnit(610,10,0,'launchpad');
workspace.control.scene.addUnit(750,250,0,'basicSequencer_midiOut');
workspace.control.scene.addUnit(750,10,0,'basicSequencer');

workspace.control.scene.addUnit(20,525,0,'looper');
workspace.control.scene.addUnit(20,705,0,'oneShot_multi_multiTrack');
workspace.control.scene.addUnit(20,645,0,'oneShot_multi');
workspace.control.scene.addUnit(20,585,0,'oneShot_single');
workspace.control.scene.addUnit(20,395,0,'player');
workspace.control.scene.addUnit(20,480,0,'recorder');


// // //view positioning
// workspace.core.viewport.scale(3.5);
// workspace.core.viewport.position(-4,-690)




// workspace.core.stats.active(true);
// console.log(workspace.core.stats.getReport());
// setInterval(function(){
//     console.log(workspace.core.stats.getReport());
// },1000);

