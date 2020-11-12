const osc = new OscillatorNode(_canvas_.library.audio.context);
const AM = new _canvas_.library.audio.audioWorklet.production.only_js.amplitudeModifier(_canvas_.library.audio.context);

// AM.invert = false;
// AM.offset = 0;
// AM.divisor = 1;
// AM.ceiling = 10;
// AM.floor = -10;

_canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, AM.divisor, 16, 5, 'linear', true);

osc.connect(AM).connect(_canvas_.library.audio.context.destination);

osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
osc.start();