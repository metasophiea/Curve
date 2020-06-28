_canvas_.layers.registerFunctionForLayer("library", function(){

    osc_1 = new _canvas_.library.audio.audioWorklet.oscillator(_canvas_.library.audio.context);
    gain_1 = new _canvas_.library.audio.audioWorklet.gain(_canvas_.library.audio.context);
    gain_1.gain.setValueAtTime(0.1,0);
    osc_1.gain_envelope = {
        front:[
            {elapse:1,destination:1},
            // {elapse:0.1,destination:0.025},
            // {elapse:1,destination:0},
        ],
        back:[
            {elapse:0.1,destination:0},
        ],
    };
    osc_1.frequency.setValueAtTime(220,0);
    // osc_1.waveform = 'additiveSynthesis';

    // sin:(new Array(64)).fill().map((a,index) => (1/(index+1)) ), //sawtooth
    // sin:(new Array(64)).fill().map((a,index) => index%2==0 ? (1/(index+1)) : 0 ), //square

    osc_1.connect(gain_1).connect(_canvas_.library.audio.context.destination);

    setInterval(function(){
        osc_1.start(0.5);//osc_1.stop(); 
        setTimeout(function(){ osc_1.stop(); },500);
    },1000);

});