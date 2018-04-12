{{include:*}}

// (function(){


    var noteTestProducer_1 = makeNoteTestProducer(300,10);
    __globals.panes.middleground.append( noteTestProducer_1 );

    var universalReadout_1 = makeUniversalReadout(500,10);
    __globals.panes.middleground.append( universalReadout_1 );

    var dataDuplicator_1 = makeDataDuplicator(400,200);
    var dataDuplicator_2 = makeDataDuplicator(500,350);
    __globals.panes.middleground.append( dataDuplicator_1 );
    __globals.panes.middleground.append( dataDuplicator_2 );


    var simpleSynthsizer_1 = makeSimpleSynthsizer(100,350);
    var simpleSynthsizer_2 = makeSimpleSynthsizer(100,450);
    __globals.panes.middleground.append( simpleSynthsizer_1 );
    __globals.panes.middleground.append( simpleSynthsizer_2 );


    var audioCombiner_1 = makeAudioCombiner(10,200);
    __globals.panes.middleground.append( audioCombiner_1 );

    var audioSink_1 = makeAudioSink(10, 10);
    __globals.panes.middleground.append( audioSink_1 );

    var simpleDial = makeSimpleDial(200, 300);
    __globals.panes.middleground.append(simpleDial);




    noteTestProducer_1.io.out.connectTo(dataDuplicator_1.io.in);

    dataDuplicator_1.io.out_1.connectTo(dataDuplicator_2.io.in);
    // dataDuplicator_1.io.out_2.connectTo(universalReadout_1.io.in);

    dataDuplicator_2.io.out_1.connectTo( simpleSynthsizer_1.io.dataIn_musicalNote );
    dataDuplicator_2.io.out_2.connectTo( simpleSynthsizer_2.io.dataIn_musicalNote );

    simpleSynthsizer_1.io.audioOut.connectTo(audioCombiner_1.io.in_2);
    simpleSynthsizer_2.io.audioOut.connectTo(audioCombiner_1.io.in_1);

    audioCombiner_1.io.out.connectTo(audioSink_1.io.in);





    __globals.utility.gotoPosition(-125.755, -566.773, 1.5625, 0);



// })();