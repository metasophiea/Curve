var player_1 = new _canvas_.interface.circuit.player2(_canvas_.library.audio.context);
player_1.load('url',function(){},'https://metasophiea.com/apps/partyCalculator/tracks/1-bassSynth_08.wav');
player_1.out_left().connect(_canvas_.library.audio.destination);
player_1.out_right().connect(_canvas_.library.audio.destination);

var player_2 = new _canvas_.interface.circuit.player2(_canvas_.library.audio.context);
player_2.load('url',function(){},'https://metasophiea.com/apps/partyCalculator/tracks/0-drums_05.wav');
player_2.out_left().connect(_canvas_.library.audio.destination);
player_2.out_right().connect(_canvas_.library.audio.destination);