SWG = new _canvas_.library.audio.audioWorklet.workshop.wasm.squareWaveGenerator_wasm(_canvas_.library.audio.context);
gain = new GainNode(_canvas_.library.audio.context);
SWG.connect(gain).connect(_canvas_.library.audio.context.destination);
gain.gain.linearRampToValueAtTime(0.01, _canvas_.library.audio.context.currentTime);