{{include:*}}

//developing object
    var distortionUnit_1 = objects.distortionUnit(440, 15);
    __globals.panes.middleground.append( distortionUnit_1 );

//objects supporting test

    var basicSynthesizer_1 = objects.basicSynthesizer(600, 15);
    __globals.panes.middleground.append( basicSynthesizer_1 );
    //kick it
        basicSynthesizer_1.io.midiNote.receive('midiNumber',{'num':80, 'velocity':1});

    var audioScope_1 = objects.audio_scope(130,5);
    __globals.panes.middleground.append( audioScope_1 );

    var audioDuplicator_1 = objects.audio_duplicator(230, 120);
    __globals.panes.middleground.append( audioDuplicator_1 );
    var audioDuplicator_2 = objects.audio_duplicator(350, 50);
    __globals.panes.middleground.append( audioDuplicator_2 );

    var audioSink_1 = objects.audio_sink(100, 120);
    __globals.panes.middleground.append( audioSink_1 );

//connections
    basicSynthesizer_1.io.audioOut.connectTo( distortionUnit_1.io.audioIn );

    distortionUnit_1.io.audioOut.connectTo( audioDuplicator_2.io.input );

    audioDuplicator_2.io.output_1.connectTo( audioScope_1.io.input );
    audioDuplicator_2.io.output_2.connectTo( audioDuplicator_1.io.input );

    audioDuplicator_1.io.output_1.connectTo( audioSink_1.io.right );
    audioDuplicator_1.io.output_2.connectTo( audioSink_1.io.left );

//viewport adjust
    __globals.utility.workspace.gotoPosition(-1105.22, -20.1853, 2.57551, 0);


