// _canvas_.interface.go.add( function(){

//     // synth_1 = new _canvas_.interface.circuit.synthesizer(_canvas_.library.audio.context);
//     // synth_1.out().connect(_canvas_.library.audio.destination);
//     // synth_1.gain(0.1);

//     // synth_1.perform({num:70,velocity:1});
//     // setTimeout(function(){
//     //     synth_1.perform({num:70,velocity:0});
//     // },1000);


//     synth_2 = new _canvas_.interface.circuit.synthesizer(_canvas_.library.audio.context);
//     synth_2.out().connect(_canvas_.library.audio.destination);
//     synth_2.gain(0.5);
//     // synth_2.attack(1);
//     synth_2.waveType('sawtooth');
//     // synth_2.perform({num:70,velocity:0.1});
//     // setTimeout(function(){
//     //     synth_2.perform({num:70,velocity:0});
//     // },2000);

//     // setInterval(() => {
//     //     console.log('click');
//     //     synth_2.perform({num:70,velocity:0});
//     //     synth_2.perform({num:70,velocity:0.5});
//     // },1000);




//     synth_2.release(1);
//     setInterval(() => {
//         console.log('click');
//         synth_2.perform({num:70,velocity:0});
//         synth_2.perform({num:70,velocity:0.5});
//     },500);

// });



















_canvas_.interface.go.add( function(){
    oscillator_1 = new _canvas_.interface.circuit.oscillator(_canvas_.library.audio.context);
    gain_1 = new GainNode(_canvas_.library.audio.context);
    oscillator_1.out().connect(gain_1);
    gain_1.connect(_canvas_.library.audio.destination);
    gain_1.gain.linearRampToValueAtTime(0.0001, _canvas_.library.audio.context.currentTime);
});

