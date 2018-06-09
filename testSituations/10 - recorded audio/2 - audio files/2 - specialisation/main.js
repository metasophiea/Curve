{{include:parts/*}}
{{include:objects/*}}
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

        var audioSink_1 = objects.audio_sink(150, 275);
        __globals.panes.middleground.append( audioSink_1 );

    //connections
        audioDuplicator_1.io.output_1.connectTo( audioScope_1.io.input );
        audioDuplicator_2.io.output_1.connectTo( audioScope_2.io.input );;

        audioDuplicator_1.io.output_2.connectTo( audioSink_1.io.right );
        audioDuplicator_2.io.output_2.connectTo( audioSink_1.io.left );

    //test objects (and floating labels)
        var testObject_oneShot_single_1 = objects.testObject_oneShot_single(400,50);
        __globals.panes.middleground.append( testObject_oneShot_single_1 );
        __globals.panes.background.append( __globals.utility.experimental.elementMaker('label','',{x:640, y:82.5, text:'oneShot_single' }) );
        
        var testObject_oneShot_multi_1 = objects.testObject_oneShot_multi(400,110);
        __globals.panes.middleground.append( testObject_oneShot_multi_1 );
        __globals.panes.background.append( __globals.utility.experimental.elementMaker('label','',{x:640, y:142.5, text:'oneShot_multi' }) );
        
        var testObject_looper_1 = objects.testObject_looper(400,170);
        __globals.panes.middleground.append( testObject_looper_1 );
        __globals.panes.background.append( __globals.utility.experimental.elementMaker('label','',{x:640, y:202.5, text:'looper' }) );

        var testObject_player_1 = objects.testObject_player(400,230);
        __globals.panes.middleground.append( testObject_player_1 );
        __globals.panes.background.append( __globals.utility.experimental.elementMaker('label','',{x:640, y:262.5, text:'player' }) );

    //connections
        testObject_player_1.io.outRight.connectTo( audioDuplicator_1.io.input );
        testObject_player_1.io.outLeft.connectTo( audioDuplicator_2.io.input );

//viewport position
    // __globals.utility.workspace.gotoPosition(-3630.89, -2815.88, 10, 0);