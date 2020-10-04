_canvas_.layers.registerFunctionForLayer("interface", function(){

    // osc_1 = new _canvas_.interface.circuit.oscillator(_canvas_.library.audio.context);
    // gain_1 = new GainNode(_canvas_.library.audio.context);
    // gain_1.gain.setTargetAtTime(0.1, _canvas_.library.audio.context.currentTime, 0);
    // osc_1.out().connect(gain_1).connect(_canvas_.library.audio.destination);

    // // osc_1.onEnvelopeEvent = function(data){ console.log(data); };
    // osc_1.gain_envelope(
    //     {
    //         front:[
    //             {elapse:0.05,destination:1},
    //             {elapse:0.5,destination:0},
    //         ],
    //         back:[
    //             {elapse:0,destination:0},
    //         ],
    //     }
    // );
    // osc_1.frequency(440);
    // osc_1.start();
    // setTimeout(function(){ osc_1.stop(); },600);







    synth_1 = new _canvas_.interface.circuit.synthesizer_3(_canvas_.library.audio.context);
    gain_1 = new GainNode(_canvas_.library.audio.context);
    gain_1.gain.setTargetAtTime(0.1, _canvas_.library.audio.context.currentTime, 0);
    synth_1.out().connect(gain_1).connect(_canvas_.library.audio.destination);
    synth_1.gain.envelope(
        {
            front:[
                {elapse:0.01,destination:1},
                // {elapse:0.5,destination:0},
            ],
            back:[
                {elapse:0.001,destination:0},
            ],
        }
    );

    // let counter = 8;
    // let interval = setInterval(() => {
    //     if(--counter <= 0){ clearInterval(interval); }

    //     console.log('');
    //     console.log('start > ');
    //     synth_1.perform({num:70,velocity:0.5});
    //     setTimeout(function(){
    //         console.log('stop > ');
    //         synth_1.perform({num:70,velocity:0});
    //     },100);
    // },101);


    let counter = 8;
    synth_1.perform({num:70,velocity:0.5});
    let interval = setInterval(() => {
        if(--counter <= 0){ clearInterval(interval); }

        console.log('');
        synth_1.perform({num:70,velocity:0});
        synth_1.perform({num:70,velocity:0.5});
    },300);


    setTimeout(function(){
        console.log('');
        synth_1.perform({num:70,velocity:0});
    },300*(counter+1));






} );