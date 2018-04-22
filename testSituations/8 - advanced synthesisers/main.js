__globals.objects = {};
{{include:*}}




// var synth = new parts.audio.synthesizer( __globals.audio.context );

// synth.out().connect(__globals.audio.context.destination);
// synth.gain(1);
// synth.perform({'num':80,'velocity':0.9});


var audioSink_1 = __globals.objects.make_audioSink(25,25);
__globals.panes.middleground.append( audioSink_1 );

var audioDuplicator_1 = __globals.objects.make_audioDuplicator(150,200);
__globals.panes.middleground.append( audioDuplicator_1 );

var basicSynth_1 = __globals.objects.make_basicSynth(200,25);
__globals.panes.middleground.append( basicSynth_1 );

var launchpad_1 = __globals.objects.make_launchpad(500,25);
__globals.panes.middleground.append( launchpad_1 );

var pulseClock_1 = __globals.objects.make_pulseClock(700,25);
__globals.panes.middleground.append( pulseClock_1 );



basicSynth_1.io.dataIn_gain.receive('%',1/2);

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















var periodicWaveMaker_1 = __globals.objects.make_periodicWaveMaker(700,125);
__globals.panes.middleground.append( periodicWaveMaker_1 );

var audioScope_1 = __globals.objects.make_audioScope(400,200);
__globals.panes.middleground.append( audioScope_1 );












periodicWaveMaker_1.io.out.connectTo(basicSynth_1.io.dataIn_periodicWave);

pulseClock_1.io.out.connectTo(launchpad_1.io.pulseIn);
launchpad_1.io.out.connectTo(basicSynth_1.io.dataIn_midiNote);

basicSynth_1.io.audioOut.connectTo(audioDuplicator_1.io.in);
audioDuplicator_1.io.out_1.connectTo(audioScope_1.io.audioIn);
audioDuplicator_1.io.out_2.connectTo(audioSink_1.io.audio_in);