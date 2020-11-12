const osc_1 = new OscillatorNode(_canvas_.library.audio.context);
const gain_1 = new GainNode(_canvas_.library.audio.context);
lag_1 = new _canvas_.library.audio.audioWorklet.production.only_js.lagProcessor(_canvas_.library.audio.context);

osc_1.connect(gain_1).connect(lag_1).connect(_canvas_.library.audio.context.destination);

osc_1.type = 'sawtooth';
osc_1.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
osc_1.start();

gain_1.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);

lag_1.samples = 25;