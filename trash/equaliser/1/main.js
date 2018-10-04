{{include:*}}

var eq = system.utility.workspace.placeAndReturnObject( equalizer(undefined,50,50) );



var audio_sink_1 = system.utility.workspace.placeAndReturnObject( objects.audio_sink(400,50) );
var player_1 = system.utility.workspace.placeAndReturnObject( objects.player(425,340) );
var audio_duplicator_1 = system.utility.workspace.placeAndReturnObject( objects.audio_duplicator(-50,50) );