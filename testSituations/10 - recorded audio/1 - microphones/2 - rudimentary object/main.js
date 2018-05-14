{{include:../../../9 - audio effect units/main.js}}
{{include:parts/*}}
{{include:objects/*}}
/**/

var audioIn_1 = __globals.objects.make_audioIn(450, 140);
__globals.panes.middleground.append( audioIn_1 );



//additional connections
    audioIn_1.io.audioOut.connectTo(distortionUnit_1.io.audioIn);

//viewport adjust
    // __globals.utility.workspace.gotoPosition(-1382.54, -434.933, 3.58158, 0);