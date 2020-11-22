osc_1 = new _canvas_.library.audio.audioWorklet.production.wasm.oscillator_type_1(_canvas_.library.audio.context);
is_1 = new _canvas_.library.audio.audioWorklet.workshop.wasm.integrated_synthesizer_type_1(_canvas_.library.audio.context);

osc_1.connect(is_1, undefined, 1);
is_1.connect(_canvas_.library.audio.context.destination);
is_1.detune_useControl = true;

is_1.waveform = 'triangle';
// gain_1.gain.setValueAtTime(0.1,0);
// // _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, osc_1.detune, 1.0, 3, 'linear', true );
// _canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, osc_1.dutyCycle, 0.99, 3, 'linear', true );


_canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, osc_1.frequency, 0.1, 0, 'instant', true );
_canvas_.library.audio.changeAudioParam( _canvas_.library.audio.context, osc_1.frequency, 55, 10, 'linear', false );


setInterval(function(){
    
    setTimeout(function(){ is_1.perform(110, 0.25); },0);
    setTimeout(function(){ is_1.perform(110, 0); },550);

    setTimeout(function(){ is_1.perform(220, 0.25); },250);
    setTimeout(function(){ is_1.perform(220, 0); },800);

    setTimeout(function(){ is_1.perform(440, 0.25); },500);
    setTimeout(function(){ is_1.perform(440, 0); },1050);

    setTimeout(function(){ is_1.perform(880, 0.25); },750);
    setTimeout(function(){ is_1.perform(880, 0); },1300);

    // setTimeout(function(){ is_1.perform(524, 0.25); },0);
    // setTimeout(function(){ is_1.perform(524, 0); },550);

    // setTimeout(function(){ is_1.perform(437, 0.25); },250);
    // setTimeout(function(){ is_1.perform(437, 0); },800);

    // setTimeout(function(){ is_1.perform(349, 0.25); },500);
    // setTimeout(function(){ is_1.perform(349, 0); },1050);

    // setTimeout(function(){ is_1.perform(219, 0.25); },750);
    // setTimeout(function(){ is_1.perform(219, 0); },1300);
},1000);