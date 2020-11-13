const osc = new OscillatorNode(_canvas_.library.audio.context);
const S = new _canvas_.library.audio.audioWorklet.production.wasm.sigmoid(_canvas_.library.audio.context);

S.gain.setTargetAtTime(0.01, _canvas_.library.audio.context.currentTime, 0);
S.sharpness.setTargetAtTime(0.2, _canvas_.library.audio.context.currentTime, 0);

osc.connect(S).connect(_canvas_.library.audio.context.destination);

osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
osc.start();