{{include:*}}

//established objects
    //audio_sink
    var audio_sink_1 = objects.audio_sink(-680, 295);
    __globals.panes.middleground.append( audio_sink_1 );
    //basicSynthesizer
    var basicSynthesizer_1 = objects.basicSynthesizer(-520, 250);
    __globals.panes.middleground.append( basicSynthesizer_1 );
    var basicSynthesizer_2 = objects.basicSynthesizer(-530, 360);
    __globals.panes.middleground.append( basicSynthesizer_2 );
    //universalreadout
    var universalreadout_1 = objects.universalreadout(50, 75);
    __globals.panes.middleground.append( universalreadout_1 );
    //pulseGenerator
    var pulseGenerator_1 = __globals.utility.workspace.placeAndReturnObject( objects.pulseGenerator_hyper(1100, 155, 999) );
    //data duplicator
    var data_duplicator_1 = __globals.utility.workspace.placeAndReturnObject( objects.data_duplicator(960, 225) );

    basicSynthesizer_1.io.audioOut.connectTo( audio_sink_1.io.right );
    basicSynthesizer_2.io.audioOut.connectTo( audio_sink_1.io.left  );

//objects in development
    var musicalkeyboard_1 = objects.musicalkeyboard(-260, 390);
    __globals.panes.middleground.append( musicalkeyboard_1 );
    var musicalkeyboard_2 = objects.musicalkeyboard(-260, 320);
    __globals.panes.middleground.append( musicalkeyboard_2 );
    var pianoroll_1 = objects.pianoroll(85, 160);
    __globals.panes.middleground.append( pianoroll_1 );
    var pianoroll_2 = objects.pianoroll(85, 375);
    __globals.panes.middleground.append( pianoroll_2 );

    pulseGenerator_1.io.out.connectTo(data_duplicator_1.io.input);
    data_duplicator_1.io.output_1.connectTo(pianoroll_1.io.pulse);
    data_duplicator_1.io.output_2.connectTo(pianoroll_2.io.pulse);
    musicalkeyboard_2.io.midiout.connectTo( musicalkeyboard_1.io.midiin);

    pianoroll_1.io.midiout.connectTo(musicalkeyboard_2.io.midiin);
    musicalkeyboard_2.io.midiout.connectTo(basicSynthesizer_1.io.midiNote);
    pianoroll_2.io.midiout.connectTo(musicalkeyboard_1.io.midiin);
    musicalkeyboard_1.io.midiout.connectTo(basicSynthesizer_2.io.midiNote);


    pulseGenerator_1.i.setTempo(580/999);

    __globals.utility.workspace.gotoPosition(-80.5151, -162.899,1.1593, 0);






//scripted setup
    pianoroll_1.i.loopSelect({start:0,end:0.94});
    pianoroll_2.i.loopSelect({start:0,end:0.94});
    pianoroll_1.i.restart();
    pianoroll_2.i.restart();

    basicSynthesizer_1.io.gain.receive('%',0.4);
    basicSynthesizer_1.io.release.receive('%',0.2);
    basicSynthesizer_1.io.octave.receive('discrete',4);
    basicSynthesizer_1.io.waveType.receive('discrete',1);

    basicSynthesizer_2.io.release.receive('%',0.3);
    basicSynthesizer_2.io.octave.receive('discrete',1);
    basicSynthesizer_2.io.waveType.receive('discrete',1);

    pianoroll_1.i.addNotes([
        {"line":20,"position":28,"length":1,"strength":1},
        {"line":15,"position":30,"length":1,"strength":1},
        {"line":20,"position":32,"length":1,"strength":1},
        {"line":13,"position":34,"length":1,"strength":1},
        {"line":20,"position":36,"length":1,"strength":1},
        {"line":17,"position":38,"length":1,"strength":1},
        {"line":15,"position":40,"length":1,"strength":1},
        {"line":20,"position":42,"length":1,"strength":1},
        {"line":12,"position":44,"length":1,"strength":1},
        {"line":20,"position":46,"length":1,"strength":1},
        {"line":10,"position":48,"length":1,"strength":1},
        {"line":20,"position":50,"length":1,"strength":1},
        {"line":13,"position":52,"length":1,"strength":1},
        {"line":12,"position":54,"length":1,"strength":1},
        {"line":20,"position":0,"length":1,"strength":1},
        {"line":15,"position":2,"length":1,"strength":1},
        {"line":20,"position":4,"length":1,"strength":1},
        {"line":13,"position":6,"length":1,"strength":1},
        {"line":20,"position":8,"length":1,"strength":1},
        {"line":17,"position":10,"length":1,"strength":1},
        {"line":15,"position":12,"length":1,"strength":1},
        {"line":20,"position":14,"length":1,"strength":1},
        {"line":12,"position":16,"length":1,"strength":1},
        {"line":20,"position":18,"length":1,"strength":1},
        {"line":10,"position":20,"length":1,"strength":1},
        {"line":20,"position":22,"length":1,"strength":1},
        {"line":13,"position":24,"length":1,"strength":1},
        {"line":12,"position":26,"length":1,"strength":1},
        {"line":20,"position":56,"length":1,"strength":1},
        {"line":13,"position":58,"length":1,"strength":1}
    ]);
    pianoroll_2.i.addNotes([
        {"length":1,"line":27,"position":2,"strength":1},
        {"length":4,"line":27,"position":6,"strength":1},
        {"length":4,"line":27,"position":14,"strength":1},
        {"line":27,"position":20,"length":1,"strength":1},
        {"length":1,"line":25,"position":21,"strength":1},
        {"line":24,"position":22,"length":1,"strength":1},
        {"length":1,"line":20,"position":24,"strength":1},
        {"length":1,"line":22,"position":26,"strength":1},
        {"length":1,"line":20,"position":28,"strength":1},
        {"length":1,"line":29,"position":30,"strength":1},
        {"length":4,"line":29,"position":34,"strength":1},
        {"length":6,"line":17,"position":42,"strength":1},
        {"length":4,"line":22,"position":50,"strength":1},
        {"line":24,"position":54,"length":2,"strength":1},
        {"length":2,"line":25,"position":56,"strength":1},
        {"line":29,"position":58,"length":2,"strength":1}
    ]);