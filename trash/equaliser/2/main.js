{{include:*}}
var eq2 = system.utility.workspace.placeAndReturnObject( objects.multibandFilter(undefined,280,100) );
var audio_sink_1 = system.utility.workspace.placeAndReturnObject( objects.audio_sink(125,110) );
var player_1 = system.utility.workspace.placeAndReturnObject( objects.player(510,100) );

player_1.io.outRight.connectTo( eq2.io.audioIn_0 );
player_1.io.outLeft.connectTo( eq2.io.audioIn_1 );
eq2.io.audioOut_0.connectTo( audio_sink_1.io.right );
eq2.io.audioOut_1.connectTo( audio_sink_1.io.left );