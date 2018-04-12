{{include:*}}


var audioSink_1 = makeAudioSink(10, 10);
__globals.panes.middleground.append( audioSink_1 );
var audioCombiner_1 = makeAudioCombiner(10,100);
__globals.panes.middleground.append( audioCombiner_1 );
audioCombiner_1.io.out.connectTo(audioSink_1.io.in);


var simpleSynthsizer_1 = makeSimpleSynthsizer(100,200);
__globals.panes.middleground.append( simpleSynthsizer_1 );
simpleSynthsizer_1.io.dataIn_gain.receive('%',0.9);
simpleSynthsizer_1.io.audioOut.connectTo(audioCombiner_1.io.in_2);
var simpleSynthsizer_2 = makeSimpleSynthsizer(100,300);
__globals.panes.middleground.append( simpleSynthsizer_2 );
simpleSynthsizer_2.io.audioOut.connectTo(audioCombiner_1.io.in_1);



var noteTestProducer_1 = makeNoteTestProducer(300,10);
__globals.panes.middleground.append( noteTestProducer_1 );
var launchpad2_1 = makeLaunchpad2(500,10);
__globals.panes.middleground.append( launchpad2_1 );
var dataDuplicator_1 = makeDataDuplicator(400,150);
__globals.panes.middleground.append( dataDuplicator_1 );
launchpad2_1.io.out.connectTo(dataDuplicator_1.io.in);
dataDuplicator_1.io.out_1.connectTo( simpleSynthsizer_1.io.dataIn_midiNote );
dataDuplicator_1.io.out_2.connectTo( simpleSynthsizer_2.io.dataIn_midiNote );




var pulseClock_1 = makePulseClock(150,50);
__globals.panes.middleground.append( pulseClock_1 );
pulseClock_1.io.pulseOut.connectTo(launchpad2_1.io.pulseIn);








var dataDuplicator_2 = makeDataDuplicator(500,150);
__globals.panes.middleground.append( dataDuplicator_2 );