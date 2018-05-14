__globals.objects = {};
{{include:*}}

//audio effect units
    var distortionUnit_1 = __globals.objects.make_distortionUnit(310, 35);
    __globals.panes.middleground.append( distortionUnit_1 );
    var reverbUnit_1 = __globals.objects.make_reverbUnit(185, 40);
    __globals.panes.middleground.append( reverbUnit_1 );
    var filterUnit_1 = __globals.objects.make_filterUnit(40, 35);
    __globals.panes.middleground.append( filterUnit_1 );

//add objects
    var audioSink_1 = __globals.objects.make_audioSink(-300,-35);
    __globals.panes.middleground.append( audioSink_1 );

    var audioDuplicator_1 = __globals.objects.make_audioDuplicator(-50,25);
    __globals.panes.middleground.append( audioDuplicator_1 );
    var audioDuplicator_2 = __globals.objects.make_audioDuplicator(-150,-35);
    __globals.panes.middleground.append( audioDuplicator_2 );

    var launchpad_1 = __globals.objects.make_launchpad(750,25);
    __globals.panes.middleground.append( launchpad_1 );

    var basicSynth2_1 = __globals.objects.make_basicSynth2(450,25);
    __globals.panes.middleground.append( basicSynth2_1 );

    var pulseClock_1 = __globals.objects.make_pulseClock(950,25);
    __globals.panes.middleground.append( pulseClock_1 );

    var periodicWaveMaker_1 = __globals.objects.make_periodicWaveMaker(750,-100);
    __globals.panes.middleground.append( periodicWaveMaker_1 );

    var audioScope_1 = __globals.objects.make_audioScope(-295,80);
    __globals.panes.middleground.append( audioScope_1 );

    var universalReadout_1 = makeUniversalReadout(850,200);
    __globals.panes.middleground.append( universalReadout_1 );

//do connections
    periodicWaveMaker_1.io.out.connectTo(basicSynth2_1.io.periodicWave);
    pulseClock_1.io.out.connectTo(launchpad_1.io.pulseIn);
    launchpad_1.io.out.connectTo(basicSynth2_1.io.midiNote);

    basicSynth2_1.io.audioOut.connectTo(distortionUnit_1.io.audioIn);
    distortionUnit_1.io.audioOut.connectTo(reverbUnit_1.io.audioIn);
    reverbUnit_1.io.audioOut.connectTo(filterUnit_1.io.audioIn);
    filterUnit_1.io.audioOut.connectTo(audioDuplicator_1.io.in);

    audioDuplicator_1.io.out_1.connectTo(audioDuplicator_2.io.in);
    audioDuplicator_1.io.out_2.connectTo(audioScope_1.io.audioIn);
    audioDuplicator_2.io.out_1.connectTo(audioSink_1.io['audioSink.io.audio.in:right']);
    audioDuplicator_2.io.out_2.connectTo(audioSink_1.io['audioSink.io.audio.in:left']);

//additional setting up
    launchpad_1.importData({
        pages: 
        [
            [
                [false, false, false, false, false, false, false, false],
                [false, false, true,  false, false, false, false, false],
                [false, false, false, false, true,  false, true,  false],
                [true,  false, true,  false, false, false, false, true ],
                [false, false, false, false, false, false, true,  false],
                [false, false, false, true,  false, false, false, false],
                [false, false, false, false, true,  false, false, false],
                [true,  false, false, false, false, false, false, false]
            ]
        ],
        currentPage: 0,
        velocityDial: 1/2
    });
    pulseClock_1.children.dial_tempo.set(0.22)

//viewport adjust
<<<<<<< HEAD
    __globals.utility.workspace.gotoPosition(317, 111, 1, 0);
    // __globals.utility.workspace.gotoPosition(-267.126, -572.177, 7.29808, 0);
=======
    // __globals.utility.workspace.gotoPosition(317, 111, 1, 0);
    __globals.utility.workspace.gotoPosition(167.589, -95.771, 4.33547, 0);
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c
