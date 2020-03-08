_canvas_.interface.go.add( function(){

    synth_1 = new _canvas_.interface.circuit.synthesizer_3(_canvas_.library.audio.context);
    gain_1 = new GainNode(_canvas_.library.audio.context);
    gain_1.gain.setTargetAtTime(0.1, _canvas_.library.audio.context.currentTime, 0);
    synth_1.out().connect(gain_1).connect(_canvas_.library.audio.destination);
    synth_1.gain.envelope(
        {
            front:[
                {elapse:0.05,destination:1},
                {elapse:0.5,destination:0},
            ],
            back:[
                {elapse:0,destination:0},
            ],
        }
    );

    // setInterval(() => {
    //     console.log('click');
    //     synth_1.perform({num:70,velocity:0.5});
    //     setTimeout(function(){ synth_1.perform({num:70,velocity:0}); },600);
    // },700);

} );