{{include:*}}

var player_1 = __globals.utility.workspace.placeAndReturnObject( objects.player(675, 10) );
var filterUnit_1 = __globals.utility.workspace.placeAndReturnObject( objects.filterUnit(325, 55) );
var audio_duplicator_1 = __globals.utility.workspace.placeAndReturnObject( objects.audio_duplicator(135,10) );
var audio_sink_1 = __globals.utility.workspace.placeAndReturnObject( objects.audio_sink(10,10) );

player_1.io.outRight.connectTo(filterUnit_1.io.audioIn);
filterUnit_1.io.audioOut.connectTo(audio_duplicator_1.io.input);
audio_duplicator_1.io.output_1.connectTo(audio_sink_1.io.right);
audio_duplicator_1.io.output_2.connectTo(audio_sink_1.io.left);

__globals.utility.workspace.gotoPosition(-2352.04, -395.221, 7.37804, 0);