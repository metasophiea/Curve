//audio duplicator
    var audio_duplicator_1 = objects.audio_duplicator(50,50);
    __globals.panes.middleground.append( audio_duplicator_1 );

//audio_scope
    var audio_scope_1 = objects.audio_scope(150,50);
    __globals.panes.middleground.append( audio_scope_1 );

//audio_sink
    var audio_sink_1 = objects.audio_sink(400,50);
    __globals.panes.middleground.append( audio_sink_1 );

//basicSynthesizer
    var basicSynthesizer_1 = objects.basicSynthesizer(550,50);
    __globals.panes.middleground.append( basicSynthesizer_1 );

//audio effect objects
    //distortionUnit
        var distortionUnit_1 = objects.distortionUnit(25, 120);
        __globals.panes.middleground.append( distortionUnit_1 );
    //filterUnit
        var filterUnit_1 = objects.filterUnit(150, 175);
        __globals.panes.middleground.append( filterUnit_1 );
    //reverbUnit
        var reverbUnit_1 = objects.reverbUnit(280, 170);
        __globals.panes.middleground.append( reverbUnit_1 );

//audio player objects
    //oneShot_single
        var oneShot_single_1 = objects.oneShot_single(425, 160);
        __globals.panes.middleground.append( oneShot_single_1 );
    //oneShot_multi
        var oneShot_multi_1 = objects.oneShot_multi(425, 220);
        __globals.panes.middleground.append( oneShot_multi_1 );
    //looper
        var looper_1 = objects.looper(425,280);
        __globals.panes.middleground.append( looper_1 );
    //standard player
        var player_1 = objects.player(425,340);
        __globals.panes.middleground.append( player_1 );
    //oneShot_multi_multiTrack
        var oneShot_multi_multiTrack_1 = objects.oneShot_multi_multiTrack(675, 160);
        __globals.panes.middleground.append( oneShot_multi_multiTrack_1 );


//audio recorder
    var recorder_1 = objects.recorder(355, 110);
    __globals.panes.middleground.append( recorder_1 );

//audio input
    var audioIn_1 = objects.audioIn(15, 275);
    __globals.panes.middleground.append( audioIn_1 );

//launchpad
    var launchpad_1 = objects.launchpad(270, 225);
    __globals.panes.middleground.append( launchpad_1 );

//universalreadout
    var universalreadout_1 = objects.universalreadout(820, 60);
    __globals.panes.middleground.append( universalreadout_1 );

//pulseGenerator
    var pulseGenerator_1 = objects.pulseGenerator(790, 110);
    __globals.panes.middleground.append( pulseGenerator_1 );

//musical keyboard
    var musicalkeyboard_1 = objects.musicalkeyboard(80, 330);
    __globals.panes.middleground.append( musicalkeyboard_1 );








