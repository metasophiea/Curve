__globals.objects = {};
{{include:../../../9 - audio effect units/objects/audioSink.js}}
{{include:parts/*}}
{{include:objects/*}}
/**/



//create objects
    var audioIn_1 = __globals.objects.make_audioIn(300, 50);
    __globals.panes.middleground.append( audioIn_1 );

    var audioSink_1 = objects.audio_sink(50,50);
    __globals.panes.middleground.append( audioSink_1 );

//do connections
    audioIn_1.io.audioOut.connectTo(audioSink_1.io.right );

// __globals.utility.workspace.gotoPosition(-389.066, 78.6368, 2.3409, 0);