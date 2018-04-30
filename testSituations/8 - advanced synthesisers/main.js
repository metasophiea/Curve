__globals.objects = {};
{{include:*}}

//add objects
    var audioSink_1 = __globals.objects.make_audioSink(-150,-35);
    __globals.panes.middleground.append( audioSink_1 );

    var audioDuplicator_1 = __globals.objects.make_audioDuplicator(100,25);
    __globals.panes.middleground.append( audioDuplicator_1 );
    var audioDuplicator_2 = __globals.objects.make_audioDuplicator(0,-35);
    __globals.panes.middleground.append( audioDuplicator_2 );

    var basicSynth_1 = __globals.objects.make_basicSynth(200,25);
    __globals.panes.middleground.append( basicSynth_1 );

    var synthTester_1 = __globals.objects.make_basicWobbleSynth(200,125);//__globals.objects.make_synthTester(200,125,parts.audio.synthesizer_gainWobble);
    __globals.panes.middleground.append( synthTester_1 );

    var launchpad_1 = __globals.objects.make_launchpad(500,25);
    __globals.panes.middleground.append( launchpad_1 );

    var pulseClock_1 = __globals.objects.make_pulseClock(700,25);
    __globals.panes.middleground.append( pulseClock_1 );

    var periodicWaveMaker_1 = __globals.objects.make_periodicWaveMaker(500,-100);
    __globals.panes.middleground.append( periodicWaveMaker_1 );

    var warbler_1 = __globals.objects.make_warbler(345, -100);
    __globals.panes.middleground.append( warbler_1 );

    var audioScope_1 = __globals.objects.make_audioScope(-145,80);
    __globals.panes.middleground.append( audioScope_1 );

    var universalReadout_1 = makeUniversalReadout(600,200);
    __globals.panes.middleground.append( universalReadout_1 );

//do connections
    periodicWaveMaker_1.io.out.connectTo(basicSynth_1.io.periodicWave);
    pulseClock_1.io.out.connectTo(launchpad_1.io.pulseIn);
    // launchpad_1.io.out.connectTo(basicSynth_1.io.midiNote);
    launchpad_1.io.out.connectTo(synthTester_1.io.midiNote);
    synthTester_1.io.audioOut.connectTo(audioDuplicator_1.io.in);

    // warbler_1.io['io.data.out:%'].connectTo(basicSynth_1.io.dataIn_gain);

    audioDuplicator_1.io.out_1.connectTo(audioDuplicator_2.io.in);
    audioDuplicator_1.io.out_2.connectTo(audioScope_1.io.audioIn);
    audioDuplicator_2.io.out_1.connectTo(audioSink_1.io['audioSink.io.audio.in:right']);
    audioDuplicator_2.io.out_2.connectTo(audioSink_1.io['audioSink.io.audio.in:left']);

//additional setting up
    basicSynth_1.io.gain.receive('%',1/2);

    launchpad_1.importData({
        pages: 
        [
            [
                [false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, true,  false],
                [false, false, true,  false, false, false, false, false],
                [false, false, false, false, false, true,  false, true ],
                [false, true,  false, true,  false, false, false, false],
                [false, false, false, false, true,  false, false, false],
                [true, false,  false, false, false, false, false, false]
            ]
        ],
        currentPage: 0,
        velocityDial: 1/2
    });

//viewport adjust
    // __globals.utility.workspace.gotoPosition(166, 124, 1, 0);
    __globals.utility.workspace.gotoPosition(138.306, -105.076, 1.10022, 0);