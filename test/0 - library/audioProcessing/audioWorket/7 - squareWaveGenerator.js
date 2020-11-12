const SWG = new _canvas_.library.audio.audioWorklet.workshop.only_js.squareWaveGenerator(_canvas_.library.audio.context);
const gain = new GainNode(_canvas_.library.audio.context);
SWG.connect(gain).connect(_canvas_.library.audio.context.destination);
gain.gain.linearRampToValueAtTime(0.01, _canvas_.library.audio.context.currentTime);

s = SWG;