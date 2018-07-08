{{include:*}}

//established objects
    //audio_sink
    var audio_sink_1 = objects.audio_sink(15,10);
    __globals.panes.middleground.append( audio_sink_1 );
    //audio duplicator
    var audio_duplicator_1 = objects.audio_duplicator(150,10);
    __globals.panes.middleground.append( audio_duplicator_1 );
    //basicSynthesizer
    var basicSynthesizer_1 = objects.basicSynthesizer(250,15);
    __globals.panes.middleground.append( basicSynthesizer_1 );
    //universalreadout
    var universalreadout_1 = objects.universalreadout(30, 100);
    __globals.panes.middleground.append( universalreadout_1 );

    basicSynthesizer_1.io.audioOut.connectTo( audio_duplicator_1.io.input );
    audio_duplicator_1.io.output_1.connectTo( audio_sink_1.io.right );
    audio_duplicator_1.io.output_2.connectTo( audio_sink_1.io.left );

//objects in development
    var musicalkeyboard_1 = objects.musicalkeyboard(490, 85);
    __globals.panes.middleground.append( musicalkeyboard_1 );
    var musicalkeyboard_2 = objects.musicalkeyboard(835, 85);
    __globals.panes.middleground.append( musicalkeyboard_2 );
    var pianoroll_1 = objects.pianoroll(85, 160);
    __globals.panes.middleground.append( pianoroll_1 );

    musicalkeyboard_2.io.midiout.connectTo( musicalkeyboard_1.io.midiin);
    musicalkeyboard_1.io.midiout.connectTo(basicSynthesizer_1.io.midiNote);
    pianoroll_1.io.midiout.connectTo(universalreadout_1.io.in);



    __globals.utility.workspace.gotoPosition(-145.538, -306.003, 2.03767, 0);
    // __globals.utility.workspace.gotoPosition(46.0541, 46.5064, 6.35268, 0);