{{include:*}}

//audio duplicator
    var audio_duplicator_1 = system.utility.workspace.placeAndReturnObject( object.audio_duplicator(50,50) );

//data duplicator
    var data_duplicator_1 = system.utility.workspace.placeAndReturnObject( object.data_duplicator(875, 50) );

//audio_scope
    var audio_scope_1 = system.utility.workspace.placeAndReturnObject( object.audio_scope(150,50) );

//audio_sink
    var audio_sink_1 = system.utility.workspace.placeAndReturnObject( object.audio_sink(400,50) );

//basic audio mixer
    var audio_mixer_1 = system.utility.workspace.placeAndReturnObject( object.basicMixer(925, 110) );

//basicSynthesizer
    var basicSynthesizer_1 = system.utility.workspace.placeAndReturnObject( object.basicSynthesizer(550,50) );

//audio effect objects
    //distortionUnit
        var distortionUnit_1 = system.utility.workspace.placeAndReturnObject( object.distortionUnit(25, 120) );
    //filterUnit
        var filterUnit_1 = system.utility.workspace.placeAndReturnObject( object.filterUnit(150, 175) );
    //reverbUnit
        var reverbUnit_1 = system.utility.workspace.placeAndReturnObject( object.reverbUnit(280, 170) );
    //multiband filter
        var multibandFilter = system.utility.workspace.placeAndReturnObject( object.multibandFilter(200,410) );

//audio player objects
    //oneShot_single
        var oneShot_single_1 = system.utility.workspace.placeAndReturnObject( object.oneShot_single(425, 160) );
    //oneShot_multi
        var oneShot_multi_1 = system.utility.workspace.placeAndReturnObject( object.oneShot_multi(425, 220) );
    //looper
        var looper_1 = system.utility.workspace.placeAndReturnObject( object.looper(425,280) );
    //standard player
        var player_1 = system.utility.workspace.placeAndReturnObject( object.player(425,340) );
    //oneShot_multi_multiTrack
        var oneShot_multi_multiTrack_1 = system.utility.workspace.placeAndReturnObject( object.oneShot_multi_multiTrack(675, 160) );


//audio recorder
    var recorder_1 = system.utility.workspace.placeAndReturnObject( object.recorder(355, 110) );

//audio input
    var audioIn_1 = system.utility.workspace.placeAndReturnObject( object.audioIn(15, 275, false) );

//launchpad
    var launchpad_1 = system.utility.workspace.placeAndReturnObject( object.launchpad(270, 225) );

//basic sequencer
    var basicSequencer_1 = system.utility.workspace.placeAndReturnObject( object.basicSequencer(925, 325) );

//basic sequencer (midi output)
    var basicSequencer_midiOut_1 = system.utility.workspace.placeAndReturnObject( object.basicSequencer_midiOut(925, 560) );

//universalreadout
    var universalreadout_1 = system.utility.workspace.placeAndReturnObject( object.universalreadout(820, 60) );

//pulseGenerator
    var pulseGenerator_1 = system.utility.workspace.placeAndReturnObject( object.pulseGenerator(790, 110) );

//musical keyboard
    var musicalkeyboard_1 = system.utility.workspace.placeAndReturnObject( object.musicalkeyboard(80, 330) );



// system.utility.workspace.gotoPosition(-1597.19, -596.058, 1.92284, 0);