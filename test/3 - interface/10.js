_canvas_.layers.registerFunctionForLayer("interface", function(){
    synthesizer_1 = new _canvas_.interface.circuit.synthesizer_1(_canvas_.library.audio.context);
    rapidAmplitudeModulator_1 = new _canvas_.interface.circuit.rapidAmplitudeModulator(_canvas_.library.audio.context);


    synthesizer_1.out().connect( rapidAmplitudeModulator_1.signalToModulate() );
    rapidAmplitudeModulator_1.out().connect(_canvas_.library.audio.destination);

    synthesizer_1.perform({num:_canvas_.library.audio.name2num('4A'),velocity:1});
});