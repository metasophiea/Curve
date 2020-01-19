_canvas_.curve.go.add( function(){
    _canvas_.control.viewport.scale(2);
    _canvas_.control.viewport.position(530,170);


    const effectBox = _canvas_.control.scene.addUnit(20, 20, 0, 'test_a', 'development');

    const audio_duplicator_1 = _canvas_.control.scene.addUnit(-130, 130, -Math.PI/2, 'audio_duplicator', 'alpha');
    const audio_duplicator_2 = _canvas_.control.scene.addUnit(-70, 30, 0, 'audio_duplicator', 'alpha');
    const audio_scope = _canvas_.control.scene.addUnit(-260, -70, 0, 'audio_scope', 'alpha');
    const amplifier = _canvas_.control.scene.addUnit(-300, 50, 0, 'amplifier', 'alpha');
    const basic_synthesizer = _canvas_.control.scene.addUnit(170, 40, 0, 'basic_synthesizer', 'alpha');
    const musicalKeyboard = _canvas_.control.scene.addUnit(140, 190, 0, 'musicalKeyboard', 'alpha');

    musicalKeyboard.io.data.midiOut.connectTo(basic_synthesizer.io.data.io_midiNoteInput);
    basic_synthesizer.io.audio.io_output.connectTo(effectBox.io.audio.input_1);
    effectBox.io.audio.output.connectTo(audio_duplicator_2.io.audio.input);
    audio_duplicator_2.io.audio.output_1.connectTo(audio_scope.io.audio.input);
    // audio_duplicator_2.io.audio.output_2.connectTo(audio_duplicator_1.io.audio.input);
    audio_duplicator_1.io.audio.output_1.connectTo(amplifier.io.audio.input_R);
    audio_duplicator_1.io.audio.output_2.connectTo(amplifier.io.audio.input_L);

    musicalKeyboard.i.velocity(1);
    musicalKeyboard.io.signal.activateKey_12.set(true);
    basic_synthesizer.i.outputGain(1);
    audio_scope.i.framerate(30);
});