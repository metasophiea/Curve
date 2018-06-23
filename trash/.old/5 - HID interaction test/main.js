{{include:*}}

var dataDuplicator_1 = makeDataDuplicator(150,100);
__globals.panes.middleground.append( dataDuplicator_1 );

var dataDuplicator_2 = makeDataDuplicator(100,200);
__globals.panes.middleground.append( dataDuplicator_2 );

var dataDuplicator_3 = makeDataDuplicator(200,200);
__globals.panes.middleground.append( dataDuplicator_3 );

dataDuplicator_1.io.out_1.connectTo( dataDuplicator_2.io.in );
dataDuplicator_1.io.out_2.connectTo( dataDuplicator_3.io.in );


var keyboard_1 = makeKeyboard(400,200);
__globals.panes.middleground.append( keyboard_1 );


var musicalKeyboard_1 = makeMusicalKeyboard(400,100);
__globals.panes.middleground.append( musicalKeyboard_1 );


var universalReadout_1 = makeUniversalReadout(600,200);
__globals.panes.middleground.append( universalReadout_1 );


var noteName2midiNumber_1 = makeNoteName2midiNumber(700,200);
__globals.panes.middleground.append( noteName2midiNumber_1 );

var simpleSynthesizer_1 = makeSimpleSynthesizer(500,300);
__globals.panes.middleground.append( simpleSynthesizer_1 );


var audioSink_1 = makeAudioSink(300,300);
__globals.panes.middleground.append( audioSink_1 );