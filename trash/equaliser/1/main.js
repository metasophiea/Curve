{{include:*}}

var eq = system.utility.workspace.placeAndReturnObject( equalizer(undefined,50,50) );



var audio_sink_1 = system.utility.workspace.placeAndReturnObject( object.audio_sink(400,50) );
var player_1 = system.utility.workspace.placeAndReturnObject( object.player(425,340) );
var audio_duplicator_1 = system.utility.workspace.placeAndReturnObject( object.audio_duplicator(-50,50) );