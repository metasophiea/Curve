ab_1 = new _canvas_.library.audio.audioWorklet.workshop.wasm.audioBuffer_3(_canvas_.library.audio.context);
gain_1 = new _canvas_.library.audio.audioWorklet.production.wasm.gain(_canvas_.library.audio.context);
ab_1.connect(gain_1).connect(_canvas_.library.audio.context.destination);
gain_1.gain.setValueAtTime(0.05,0);

_canvas_.library.audio.loadAudioFile(result => {
    console.log(result.buffer);
    const data = result.buffer.getChannelData(0);
    console.log(data);


}, 'url', '/sounds/78/bass_1.wav', undefined, undefined);