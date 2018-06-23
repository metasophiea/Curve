{{include:parts/*}}
{{include:objects/*}}
/**/



//create objects
    var audioIn_1 = objects.make_audioIn(200, 50);
    __globals.panes.middleground.append( audioIn_1 );

    var audioSink_1 = objects.audio_sink(50,50);
    __globals.panes.middleground.append( audioSink_1 );

//do connections
    audioIn_1.io.audioOut.connectTo(audioSink_1.io.right );

//viewport position
    __globals.utility.workspace.gotoPosition(-106.304, -98.9442, 2.57551, 0);