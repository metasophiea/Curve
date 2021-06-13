osc_1 = new _canvas_.library.audio.audioWorklet.production.wasm.oscillator_type_1(_canvas_.library.audio.context);
gain_1 = new _canvas_.library.audio.audioWorklet.production.wasm.gain(_canvas_.library.audio.context);

osc_1.connect(gain_1).connect(_canvas_.library.audio.context.destination);

osc_1.waveform = 'triangle';
gain_1.gain.setValueAtTime(0.01,0);
// _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, osc_1.frequency, 880, 5, 'linear', true );
// _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, osc_1.detune, 1.0, 3, 'linear', true );
_canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, osc_1.dutyCycle, 0.99, 3, 'linear', true );

// setInterval(function(){
//     osc_1.start(0.1);
//     setTimeout(function(){ osc_1.stop(); },500);
// },1000);