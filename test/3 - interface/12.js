_canvas_.interface.go.add( function(){

    oscillator_1 = new _canvas_.interface.circuit.oscillator(_canvas_.library.audio.context);
    gain_1 = new GainNode(_canvas_.library.audio.context);
    oscillator_1.out().connect(gain_1);
    gain_1.connect(_canvas_.library.audio.destination);


    frequencyResponseMeasure_1 = new _canvas_.interface.circuit.frequencyResponseMeasure(_canvas_.library.audio.context);
    frequencyResponseMeasure_1.onCompletion = function(data){
        console.log(data);
    };

    
    gain_1.gain.linearRampToValueAtTime(0.0001, _canvas_.library.audio.context.currentTime);

});