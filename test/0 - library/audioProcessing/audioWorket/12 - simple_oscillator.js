osc_1 = new _canvas_.library.audio.audioWorklet.workshop.wasm.simple_oscillator(_canvas_.library.audio.context);
gain_1 = new _canvas_.library.audio.audioWorklet.production.wasm.gain(_canvas_.library.audio.context);

osc_1.connect(gain_1).connect(_canvas_.library.audio.context.destination);

osc_1.frequency.setValueAtTime(220,0);
gain_1.gain.setValueAtTime(0.1,0);

setInterval(function(){
    osc_1.start(0.5);
    setTimeout(function(){ osc_1.stop(); },500);
},1000);