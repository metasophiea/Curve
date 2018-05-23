{{include:parts/*}}
{{include:objects/*}}
/**/



//create objects
    var audioScope_1 = objects.audio_scope(50,10);
    __globals.panes.middleground.append( audioScope_1 );
    var audioScope_2 = objects.audio_scope(50,130);
    __globals.panes.middleground.append( audioScope_2 );

    var audioDuplicator_1 = objects.audio_duplicator(300,30);
    __globals.panes.middleground.append( audioDuplicator_1 );
    var audioDuplicator_2 = objects.audio_duplicator(300,130);
    __globals.panes.middleground.append( audioDuplicator_2 );

    var testAudioObject_1 = objects.testAudioObject(400,50);
    __globals.panes.middleground.append( testAudioObject_1 );

    var audioSink_1 = objects.audio_sink(150, 275);
    __globals.panes.middleground.append( audioSink_1 );

//do connections
    testAudioObject_1.io.outRight.connectTo( audioDuplicator_1.io.input );
    testAudioObject_1.io.outLeft.connectTo( audioDuplicator_2.io.input );

    audioDuplicator_1.io.output_1.connectTo( audioScope_1.io.input );
    audioDuplicator_2.io.output_1.connectTo( audioScope_2.io.input );;

    audioDuplicator_1.io.output_2.connectTo( audioSink_1.io.right );
    audioDuplicator_2.io.output_2.connectTo( audioSink_1.io.left );

//viewport position
    __globals.utility.workspace.gotoPosition(-85.5379, -8.1652, 2.24189, 0);