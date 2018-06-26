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

    var testAudiobject_1 = objects.testAudiobject(400,50);
    __globals.panes.middleground.append( testAudiobject_1 );

    var audioSink_1 = objects.audio_sink(150, 275);
    __globals.panes.middleground.append( audioSink_1 );

//do connections
    testAudiobject_1.io.outRight.connectTo( audioDuplicator_1.io.input );
    testAudiobject_1.io.outLeft.connectTo( audioDuplicator_2.io.input );

    audioDuplicator_1.io.output_1.connectTo( audioScope_1.io.input );
    audioDuplicator_2.io.output_1.connectTo( audioScope_2.io.input );;

    audioDuplicator_1.io.output_2.connectTo( audioSink_1.io.right );
    audioDuplicator_2.io.output_2.connectTo( audioSink_1.io.left );

//viewport position
    __globals.utility.workspace.gotoPosition(-301.538, 23.8348, 2.24189, 0);