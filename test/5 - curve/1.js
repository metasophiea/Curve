_canvas_.curve.go.add( function(){
    _canvas_.control.scene.addUnit(10,-135,0,'distortion','alpha');
    _canvas_.control.scene.addUnit(-145,-170,0,'reverb','alpha');
    _canvas_.control.scene.addUnit(-180,240,0,'filter','alpha');

    _canvas_.control.scene.addUnit(160,85,0,'musicalKeyboard','alpha');
    _canvas_.control.scene.addUnit(175,-95,0,'audio_in','alpha');
    _canvas_.control.scene.addUnit(140,-115,0,'signal_switch','alpha');
    _canvas_.control.scene.addUnit(-235,240,0,'voltage_dial','alpha');

    _canvas_.control.scene.addUnit(500,30,0,'signal_duplicator','alpha');
    _canvas_.control.scene.addUnit(385,30,0,'voltage_duplicator','alpha');
    _canvas_.control.scene.addUnit(435,-35,0,'data_duplicator','alpha');
    _canvas_.control.scene.addUnit(360,-90,0,'audio_duplicator','alpha');
    _canvas_.control.scene.addUnit(445,30,0,'signal_combiner','alpha');
    _canvas_.control.scene.addUnit(330,30,0,'voltage_combiner','alpha');
    _canvas_.control.scene.addUnit(370,-35,0,'data_combiner','alpha');
    _canvas_.control.scene.addUnit(-255,-60,0,'eightTrackMixer','alpha');

    _canvas_.control.scene.addUnit(10,-65,0,'amplifier','alpha');
    _canvas_.control.scene.addUnit(370,225,0,'audio_recorder','alpha');
    _canvas_.control.scene.addUnit(-280,85,0,'data_readout','alpha');
    _canvas_.control.scene.addUnit(-230,-110,0,'signal_readout','alpha');
    _canvas_.control.scene.addUnit(85,290,0,'voltage_readout','alpha');
    _canvas_.control.scene.addUnit(165,225,0,'audio_scope','alpha');

    _canvas_.control.scene.addUnit(370,275,0,'pulse_generator','alpha');
    _canvas_.control.scene.addUnit(-200,290,0,'eightStepSequencer','alpha');
    _canvas_.control.scene.addUnit(-70,85,0,'launchpad','alpha');

    _canvas_.control.scene.addUnit(175,-40,0,'basic_synthesizer','alpha');
    _canvas_.control.scene.addUnit(-170,-115,0,'audio_file_player','alpha');

    _canvas_.control.scene.addUnit(-10,-10,0,'ruler','alpha');

    // _canvas_.control.viewport.scale(6.5);
    _canvas_.control.viewport.position(300, 200);
});