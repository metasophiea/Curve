const osc_1 = new OscillatorNode(_canvas_.library.audio.context);
const osc_2 = new OscillatorNode(_canvas_.library.audio.context);
const gain_1 = new GainNode(_canvas_.library.audio.context);
const gain_2 = new GainNode(_canvas_.library.audio.context);

const ACM = new _canvas_.library.audio.audioWorklet.workshop.only_js.amplitudeControlledModulator(_canvas_.library.audio.context);

osc_1.connect(gain_1).connect(ACM,undefined,0).connect(_canvas_.library.audio.context.destination);
osc_2.connect(gain_2).connect(ACM,undefined,1).connect(_canvas_.library.audio.context.destination);

osc_1.type = 'sine';
osc_2.type = 'sine';

gain_1.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);
gain_2.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);

osc_1.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
osc_1.start();
osc_2.frequency.setTargetAtTime(2, _canvas_.library.audio.context.currentTime, 0);
osc_2.start();