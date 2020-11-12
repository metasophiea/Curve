O_1 = new _canvas_.library.audio.audioWorklet.oscillator(_canvas_.library.audio.context); 
const gain_1 = new GainNode(_canvas_.library.audio.context);
O_1.connect(gain_1);
gain_1.gain.linearRampToValueAtTime(0.001, _canvas_.library.audio.context.currentTime);

O_2 = new _canvas_.library.audio.audioWorklet.oscillator(_canvas_.library.audio.context); 
O_2.frequency.linearRampToValueAtTime(0.5, _canvas_.library.audio.context.currentTime);
const gain_2 = new GainNode(_canvas_.library.audio.context);
O_2.connect(gain_2);
gain_2.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);


// O_1.waveform = 2;
// O_1.dutyCycle_mode = 1;
// gain_2.connect(O_1,undefined,0);

// O_1.detune_mode = 1;
// gain_2.connect(O_1,undefined,1);

O_1.gain_mode = 1;
gain_2.connect(O_1,undefined,2);

gain_1.connect(_canvas_.library.audio.context.destination);















O_1 = new _canvas_.library.audio.audioWorklet.oscillatorWithMultiLevelPhaseModulation(_canvas_.library.audio.context); 
const gain_1 = new GainNode(_canvas_.library.audio.context);
O_1.connect(gain_1);
gain_1.gain.linearRampToValueAtTime(0.1, _canvas_.library.audio.context.currentTime);
gain_1.connect(_canvas_.library.audio.context.destination);