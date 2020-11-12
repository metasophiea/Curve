const osc = new OscillatorNode(_canvas_.library.audio.context);
const BC = new _canvas_.library.audio.audioWorklet.production.wasm.bitcrusher(_canvas_.library.audio.context);

BC.amplitudeResolution = 10;
BC.sampleFrequency = 16;

osc.connect(BC).connect(_canvas_.library.audio.context.destination);

osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
osc.start();