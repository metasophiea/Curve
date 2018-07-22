{{include:*}}

//audio duplicator
    var audio_duplicator_1 = __globals.utility.workspace.placeAndReturnObject( objects.audio_duplicator(50,50) );

//data duplicator
    var data_duplicator_1 = __globals.utility.workspace.placeAndReturnObject( objects.data_duplicator(875, 50) );

//audio_scope
    var audio_scope_1 = __globals.utility.workspace.placeAndReturnObject( objects.audio_scope(150,50) );

//audio_sink
    var audio_sink_1 = __globals.utility.workspace.placeAndReturnObject( objects.audio_sink(400,50) );

//basic audio mixer
    var audio_mixer_1 = __globals.utility.workspace.placeAndReturnObject( objects.basicMixer(925, 110) );

//basicSynthesizer
    var basicSynthesizer_1 = __globals.utility.workspace.placeAndReturnObject( objects.basicSynthesizer(550,50) );

//audio effect objects
    //distortionUnit
        var distortionUnit_1 = __globals.utility.workspace.placeAndReturnObject( objects.distortionUnit(25, 120) );
    //filterUnit
        var filterUnit_1 = __globals.utility.workspace.placeAndReturnObject( objects.filterUnit(150, 175) );
    //reverbUnit
        var reverbUnit_1 = __globals.utility.workspace.placeAndReturnObject( objects.reverbUnit(280, 170) );

//audio player objects
    //oneShot_single
        var oneShot_single_1 = __globals.utility.workspace.placeAndReturnObject( objects.oneShot_single(425, 160) );
    //oneShot_multi
        var oneShot_multi_1 = __globals.utility.workspace.placeAndReturnObject( objects.oneShot_multi(425, 220) );
    //looper
        var looper_1 = __globals.utility.workspace.placeAndReturnObject( objects.looper(425,280) );
    //standard player
        var player_1 = __globals.utility.workspace.placeAndReturnObject( objects.player(425,340) );
    //oneShot_multi_multiTrack
        var oneShot_multi_multiTrack_1 = __globals.utility.workspace.placeAndReturnObject( objects.oneShot_multi_multiTrack(675, 160) );


//audio recorder
    var recorder_1 = __globals.utility.workspace.placeAndReturnObject( objects.recorder(355, 110) );

//audio input
    var audioIn_1 = __globals.utility.workspace.placeAndReturnObject( objects.audioIn(15, 275, false) );

//launchpad
    var launchpad_1 = __globals.utility.workspace.placeAndReturnObject( objects.launchpad(270, 225) );

//basic sequencer
    var basicSequencer_1 = __globals.utility.workspace.placeAndReturnObject( objects.basicSequencer(925, 325) );

//basic sequencer (midi output)
    var basicSequencer_midiOut_1 = __globals.utility.workspace.placeAndReturnObject( objects.basicSequencer_midiOut(925, 560) );

//universalreadout
    var universalreadout_1 = __globals.utility.workspace.placeAndReturnObject( objects.universalreadout(820, 60) );

//pulseGenerator
    var pulseGenerator_1 = __globals.utility.workspace.placeAndReturnObject( objects.pulseGenerator(790, 110) );

//musical keyboard
    var musicalkeyboard_1 = __globals.utility.workspace.placeAndReturnObject( objects.musicalkeyboard(80, 330) );




