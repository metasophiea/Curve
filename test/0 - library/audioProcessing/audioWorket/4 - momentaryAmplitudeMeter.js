const osc = new OscillatorNode(_canvas_.library.audio.context);
const gain = new GainNode(_canvas_.library.audio.context);
const MAM = new _canvas_.library.audio.audioWorklet.production.only_js.momentaryAmplitudeMeter(_canvas_.library.audio.context);

osc.connect(gain).connect(MAM);

MAM.reading = function(data){
    console.log(data);
};
MAM.updateMode = 1;
setTimeout( function(){ MAM.requestReading(); }, 500 );

osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
osc.start();
gain.gain.linearRampToValueAtTime(0, _canvas_.library.audio.context.currentTime+10);