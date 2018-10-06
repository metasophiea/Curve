{{include:*}}

//audio duplicator
    var audio_duplicator_1 = system.utility.workspace.placeAndReturnObject( object.alpha.audio_duplicator(50,50) );

//data duplicator
    var data_duplicator_1 = system.utility.workspace.placeAndReturnObject( object.alpha.data_duplicator(875, 50) );

//audio_scope
    var audio_scope_1 = system.utility.workspace.placeAndReturnObject( object.alpha.audio_scope(150,50) );

//audio_sink
    var audio_sink_1 = system.utility.workspace.placeAndReturnObject( object.alpha.audio_sink(400,50) );

//basic audio mixer
    var audio_mixer_1 = system.utility.workspace.placeAndReturnObject( object.alpha.basicMixer(925, 110) );

//basicSynthesizer
    var basicSynthesizer_1 = system.utility.workspace.placeAndReturnObject( object.alpha.basicSynthesizer(550,50) );

//audio effect objects
    //distortionUnit
        var distortionUnit_1 = system.utility.workspace.placeAndReturnObject( object.alpha.distortionUnit(25, 120) );
    //filterUnit
        var filterUnit_1 = system.utility.workspace.placeAndReturnObject( object.alpha.filterUnit(150, 175) );
    //reverbUnit
        var reverbUnit_1 = system.utility.workspace.placeAndReturnObject( object.alpha.reverbUnit(280, 170) );
    //multiband filter
        var multibandFilter = system.utility.workspace.placeAndReturnObject( object.alpha.multibandFilter(200,410) );

//audio player objects
    //oneShot_single
        var oneShot_single_1 = system.utility.workspace.placeAndReturnObject( object.alpha.oneShot_single(425, 160) );
    //oneShot_multi
        var oneShot_multi_1 = system.utility.workspace.placeAndReturnObject( object.alpha.oneShot_multi(425, 220) );
    //looper
        var looper_1 = system.utility.workspace.placeAndReturnObject( object.alpha.looper(425,280) );
    //standard player
        var player_1 = system.utility.workspace.placeAndReturnObject( object.alpha.player(425,340) );
    //oneShot_multi_multiTrack
        var oneShot_multi_multiTrack_1 = system.utility.workspace.placeAndReturnObject( object.alpha.oneShot_multi_multiTrack(675, 160) );


//audio recorder
    var recorder_1 = system.utility.workspace.placeAndReturnObject( object.alpha.recorder(355, 110) );

//audio input
    var audioIn_1 = system.utility.workspace.placeAndReturnObject( object.alpha.audioIn(15, 275, false) );

//launchpad
    var launchpad_1 = system.utility.workspace.placeAndReturnObject( object.alpha.launchpad(270, 225) );

//basic sequencer
    var basicSequencer_1 = system.utility.workspace.placeAndReturnObject( object.alpha.basicSequencer(925, 325) );

//basic sequencer (midi output)
    var basicSequencer_midiOut_1 = system.utility.workspace.placeAndReturnObject( object.alpha.basicSequencer_midiOut(925, 560) );

//universalreadout
    var universalreadout_1 = system.utility.workspace.placeAndReturnObject( object.alpha.universalreadout(820, 60) );

//pulseGenerator
    var pulseGenerator_1 = system.utility.workspace.placeAndReturnObject( object.alpha.pulseGenerator(790, 110) );

//musical keyboard
    var musicalkeyboard_1 = system.utility.workspace.placeAndReturnObject( object.alpha.musicalkeyboard(80, 330) );



// system.utility.workspace.gotoPosition(-1597.19, -596.058, 1.92284, 0);