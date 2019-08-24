//view positioning
// _canvas_.core.viewport.scale(5);
// _canvas_.core.viewport.position(-1000,0);



//pulse generators
    _canvas_.control.scene2.addUnit(10,25,0,'pulseGenerator_signal');
    _canvas_.control.scene2.addUnit(10,75,0,'pulseGenerator_signal_hyper');
    _canvas_.control.scene2.addUnit(10,125,0,'pulseGenerator_voltage');
    _canvas_.control.scene2.addUnit(10,175,0,'pulseGenerator_voltage_hyper');
    _canvas_.control.scene2.addUnit(10,225,0,'pulseGenerator_data');
    _canvas_.control.scene2.addUnit(10,275,0,'pulseGenerator_data_hyper');

//direct human input units
    _canvas_.control.scene2.addUnit(175,25,0,'musicalKeyboard');

//duplicators
    _canvas_.control.scene2.addUnit(515,25,0,'signal_duplicator');
    _canvas_.control.scene2.addUnit(515,85,0,'voltage_duplicator');
    _canvas_.control.scene2.addUnit(515,145,0,'data_duplicator');
    _canvas_.control.scene2.addUnit(515,205,0,'audio_duplicator');

//mixing units
    _canvas_.control.scene2.addUnit(595,25,0,'basicMixer');

//audio effect units
    _canvas_.control.scene2.addUnit(720,25,0,'distortionUnit');
    _canvas_.control.scene2.addUnit(720,125,0,'distortionUnit_stereo');
    _canvas_.control.scene2.addUnit(845,25,0,'reverbUnit');
    _canvas_.control.scene2.addUnit(845,100,0,'reverbUnit_stereo');
    _canvas_.control.scene2.addUnit(970,25,0,'filterUnit');
    _canvas_.control.scene2.addUnit(970,130,0,'filterUnit_stereo');
    _canvas_.control.scene2.addUnit(1120,25,0,'multibandFilter');

//audio output
    _canvas_.control.scene2.addUnit(1330,25,0,'audioSink');

// //audio input
//     _canvas_.control.scene2.addUnit(1385,25,0,'audioIn');

//visualisation
    _canvas_.control.scene2.addUnit(1640,25,0,'universalreadout2');
    _canvas_.control.scene2.addUnit(1640,85,0,'audioScope');

//audio playback units
    _canvas_.control.scene2.addUnit(1860,25,0,'player');
    _canvas_.control.scene2.addUnit(1860,110,0,'looper');
    _canvas_.control.scene2.addUnit(1860,170,0,'oneShot_single');
    _canvas_.control.scene2.addUnit(1860,230,0,'oneShot_multi');
    _canvas_.control.scene2.addUnit(1860,290,0,'oneShot_multi_multiTrack');

//recording units
    _canvas_.control.scene2.addUnit(2095,25,0,'recorder');

//synthesizer
    _canvas_.control.scene2.addUnit(2300,25,0,'basicSynthesizer');
    _canvas_.control.scene2.addUnit(2300,135,0,'basicSynthesizer_img');

//sequencers
    _canvas_.control.scene2.addUnit(2560,25,0,'launchpad');
    _canvas_.control.scene2.addUnit(2560,135,0,'basicSequencer');
    _canvas_.control.scene2.addUnit(2560,370,0,'basicSequencer2');
    _canvas_.control.scene2.addUnit(2560,605,0,'basicSequencer_midiOut');
















// _canvas_.core.stats.active(true);
// var averages = [];
// var rollingAverage = 0;
// var rollingAverageIndex = 1;
// setInterval(function(){
//     var tmp = _canvas_.core.stats.getReport();
//     averages.push(tmp.framesPerSecond);
//     if(averages.length > 10){averages.shift();}
//     console.log( 'rollingAverage:',_canvas_.library.math.averageArray(averages),tmp );
// },1000);

_canvas_.core.render.activeLimitToFrameRate(true);
_canvas_.core.render.frameRateLimit(25);