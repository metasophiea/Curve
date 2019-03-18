_canvas_.control.scene.addUnit(20,10,0,'audio_duplicator');
_canvas_.control.scene.addUnit(100,10,0,'basicMixer');
_canvas_.control.scene.addUnit(230,10,0,'data_duplicator');
_canvas_.control.scene.addUnit(470,10,0,'pulseGenerator_hyper');
_canvas_.control.scene.addUnit(330,10,0,'pulseGenerator');
_canvas_.control.scene.addUnit(300,50,0,'universalreadout');

_canvas_.control.scene.addUnit(350,70,0,'basicSynthesizer');

_canvas_.control.scene.addUnit(10,225,0,'audioScope');
_canvas_.control.scene.addUnit(10,70,0,'audioSink');

_canvas_.control.scene.addUnit(350,175,0,'musicalKeyboard');
_canvas_.control.scene.addUnit(10,340,0,'audioIn');

_canvas_.control.scene.addUnit(225,85,0,'distortionUnit');
_canvas_.control.scene.addUnit(225,185,0,'filterUnit');
_canvas_.control.scene.addUnit(380,250,0,'multibandFilter');
// _canvas_.control.scene.addUnit(225,290,0,'reverbUnit');

// _canvas_.control.scene.addUnit(610,10,0,'launchpad');
// _canvas_.control.scene.addUnit(750,250,0,'basicSequencer_midiOut');
// _canvas_.control.scene.addUnit(750,10,0,'basicSequencer');

// _canvas_.control.scene.addUnit(20,525,0,'looper');
// _canvas_.control.scene.addUnit(20,705,0,'oneShot_multi_multiTrack');
// _canvas_.control.scene.addUnit(20,645,0,'oneShot_multi');
// _canvas_.control.scene.addUnit(20,585,0,'oneShot_single');
// _canvas_.control.scene.addUnit(20,395,0,'player');
// _canvas_.control.scene.addUnit(20,480,0,'recorder');


//view positioning
_canvas_.core.viewport.scale(3.5);
_canvas_.core.viewport.position(-370*_canvas_.core.viewport.scale(),-240*_canvas_.core.viewport.scale());




// console.log(_canvas_.core.stats.getReport());
// setInterval(function(){
//     console.log(_canvas_.core.stats.getReport());
// },1000);

