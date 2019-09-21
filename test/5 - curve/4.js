// _canvas_.control.scene.addUnit(10,10,0,'ruler','beta');


// _canvas_.control.scene.addUnit(70,10,0,'eightTrackMixer','beta');

// _canvas_.control.scene.addUnit(70,10,0,'amplifier','beta');
// _canvas_.control.scene.addUnit(70,10,0,'data_readout','beta');
// _canvas_.control.scene.addUnit(70,10,0,'signal_readout','beta');
// _canvas_.control.scene.addUnit(70,10,0,'voltage_readout','beta');
// _canvas_.control.scene.addUnit(70,10,0,'audio_scope','beta');

// _canvas_.control.scene.addUnit(70,10,0,'signal_switch','beta');
// _canvas_.control.scene.addUnit(70,10,0,'voltage_dial','beta');

// _canvas_.control.scene.addUnit(70,30,0,'signal_duplicator','beta');
// _canvas_.control.scene.addUnit(70,30,0,'voltage_duplicator','beta');
// _canvas_.control.scene.addUnit(125,30,0,'data_duplicator','beta');
// _canvas_.control.scene.addUnit(125,85,0,'audio_duplicator','beta');
// _canvas_.control.scene.addUnit(70,30,0,'signal_combiner','beta');
// _canvas_.control.scene.addUnit(70,30,0,'voltage_combiner','beta');
// _canvas_.control.scene.addUnit(70,30,0,'data_combiner','beta');

// _canvas_.control.scene.addUnit(70,10,0,'pulse_generator','beta');
// _canvas_.control.scene.addUnit(70,10,0,'eightStepSequencer','beta');
// _canvas_.control.scene.addUnit(70,10,0,'launchpad','beta');

// _canvas_.control.scene.addUnit(70,10,0,'basic_synthesizer','beta');

// _canvas_.control.scene.addUnit(70,10,0,'musicalKeyboard','beta');

// _canvas_.control.scene.addUnit(70,10,0,'distortion','beta');
// _canvas_.control.scene.addUnit(70,10,0,'reverb','beta');
//// _canvas_.control.scene.addUnit(70,10,0,'filter','beta');

// _canvas_.control.scene.addUnit(10,10,0,'audio_in','beta');
// var player = _canvas_.control.scene.addUnit(10,10,0,'audio_file_player','beta');
//     player.i.loadByURL('https://metasophiea.com/apps/partyCalculator/tracks/1-bassSynth_08.wav');
//     var amp = _canvas_.control.scene.addUnit(-200,10,0,'amplifier','beta');
//     amp.io.audio.input_R.connectTo(player.io.audio.io_output_R);
//     amp.io.audio.input_L.connectTo(player.io.audio.io_output_L);

var player = _canvas_.control.scene.addUnit(10,10,0,'audio_recorder','beta');






_canvas_.control.viewport.scale(6);
// _canvas_.control.viewport.position(-630,-15);