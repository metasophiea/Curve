{{include:parts/*}}
{{include:objects/*}}
{{include:../../2 - audio files/2 - specialisation/parts/*}}
{{include:../../2 - audio files/2 - specialisation/objects/*}}
{{include:../../1 - microphones/3 - object v2/parts/*}}
{{include:../../1 - microphones/3 - object v2/objects/*}}
/**/

//create objects
    //established objects
        var audioScope_1 = objects.audio_scope(50,10);
        __globals.panes.middleground.append( audioScope_1 );
        var audioScope_2 = objects.audio_scope(50,130);
        __globals.panes.middleground.append( audioScope_2 );

        var audioDuplicator_1 = objects.audio_duplicator(300,30);
        __globals.panes.middleground.append( audioDuplicator_1 );
        var audioDuplicator_2 = objects.audio_duplicator(300,130);
        __globals.panes.middleground.append( audioDuplicator_2 );
        var audioDuplicator_3 = objects.audio_duplicator(525,30);
        __globals.panes.middleground.append( audioDuplicator_3 );
        var audioDuplicator_4 = objects.audio_duplicator(525,90);
        __globals.panes.middleground.append( audioDuplicator_4 );
        var audioDuplicator_5 = objects.audio_duplicator(600, 130);
        __globals.panes.middleground.append( audioDuplicator_5 );

        var audioSink_1 = objects.audio_sink(150, 275);
        __globals.panes.middleground.append( audioSink_1 );

        //connections
            audioDuplicator_1.io.output_1.connectTo( audioScope_1.io.input );
            audioDuplicator_2.io.output_1.connectTo( audioScope_2.io.input );;

            audioDuplicator_1.io.output_2.connectTo( audioSink_1.io.right );
            audioDuplicator_2.io.output_2.connectTo( audioSink_1.io.left );

            audioDuplicator_3.io.output_1.connectTo( audioDuplicator_1.io.input );
            audioDuplicator_4.io.output_1.connectTo( audioDuplicator_2.io.input );

    //imported objects
        var audioIn_1 = objects.make_audioIn(680, 150);
        __globals.panes.middleground.append( audioIn_1 );

        var testObject_player_1 = objects.testObject_player(675, 50);
        __globals.panes.middleground.append( testObject_player_1 );
        //connections
            testObject_player_1.io.outRight.connectTo( audioDuplicator_3.io.input );
            testObject_player_1.io.outLeft.connectTo( audioDuplicator_4.io.input );

    //test objects
        var testObject_recorder_1 = objects.testObject_recorder3(300,200);
        __globals.panes.middleground.append( testObject_recorder_1 );
        //connections
            audioDuplicator_3.io.output_2.connectTo( testObject_recorder_1.io.inRight );
            audioDuplicator_4.io.output_2.connectTo( testObject_recorder_1.io.inLeft );

//viewport position
    // __globals.utility.workspace.gotoPosition(-1242.22, -777.354, 4.61829, 0);