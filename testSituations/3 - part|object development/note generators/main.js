{{include:*}}

    //create objects
        //established objects
            var pulseGenerator_1 = __globals.utility.workspace.placeAndReturnObject( objects.pulseGenerator_hyper(1100, 155, 999) );
            var data_duplicator_1 = __globals.utility.workspace.placeAndReturnObject( objects.data_duplicator(960, 225) );
            var musicalkeyboard_1 = __globals.utility.workspace.placeAndReturnObject( objects.musicalkeyboard(-260, 320) );
            var basicSynthesizer_1 = __globals.utility.workspace.placeAndReturnObject( objects.basicSynthesizer(-520, 250) );
            var reverbUnit_1 = __globals.utility.workspace.placeAndReturnObject( objects.reverbUnit(-690, 270) );
            var audio_sink_1 = __globals.utility.workspace.placeAndReturnObject( objects.audio_sink(-860, 295) );
        //objects in development
            var pianoroll_1 = __globals.utility.workspace.placeAndReturnObject( objects.pianoroll(85, 160) );

    //connect objects
        pulseGenerator_1.io.out.connectTo(data_duplicator_1.io.input);
        data_duplicator_1.io.output_1.connectTo(pianoroll_1.io.pulse);
        pianoroll_1.io.midiout.connectTo(musicalkeyboard_1.io.midiin);
        musicalkeyboard_1.io.midiout.connectTo(basicSynthesizer_1.io.midiNote);
        basicSynthesizer_1.io.audioOut.connectTo(reverbUnit_1.io.audioIn);
        reverbUnit_1.io.audioOut.connectTo(audio_sink_1.io.right);

    pulseGenerator_1.i.setTempo(580/999);

    __globals.utility.workspace.gotoPosition(-80.5151, -162.899,1.1593, 0);