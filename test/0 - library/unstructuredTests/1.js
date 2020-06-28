// //testWorklet
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const testWorklet = new _canvas_.library.audio.audioWorklet.testWorklet(_canvas_.library.audio.context)
    
//     osc.connect(testWorklet).connect(_canvas_.library.audio.context.destination);

//     // osc.type = 'sine';
//     // osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     // osc.start();

//     console.log( testWorklet.superImportantValue );
//     testWorklet.superImportantValue = 'butts';
//     console.log( testWorklet.superImportantValue );
//     testWorklet.doubleTheSuperImportantValue();
//     console.log( testWorklet.superImportantValue );


//     testWorklet.parameters.get('valueA').linearRampToValueAtTime(100, _canvas_.library.audio.context.currentTime+2);
//     testWorklet.parameters.get('valueB').linearRampToValueAtTime(100, _canvas_.library.audio.context.currentTime+2);
// });




// //amplitudeModifier
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const AM = new _canvas_.library.audio.audioWorklet.amplitudeModifier(_canvas_.library.audio.context);

//     // AM.invert = false;
//     // AM.offset = 0;
//     // AM.divisor = 1;
//     // AM.ceiling = 10;
//     // AM.floor = -10;
    
//     _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, AM.divisor, 16, 5, 'linear', true);
    
//     osc.connect(AM).connect(_canvas_.library.audio.context.destination);

//     // osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     // osc.start();
// });




// //bitcrusher
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const BC = new _canvas_.library.audio.audioWorklet.bitcrusher(_canvas_.library.audio.context);

//     BC.amplitudeResolution = 10;
//     BC.sampleFrequency = 16;
    
//     osc.connect(BC).connect(_canvas_.library.audio.context.destination);

//     // osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     // osc.start();

//     // AM.parameters.get('invert').setValueAtTime(true,0);
// });




// //momentaryAmplitudeMeter
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const gain = new GainNode(_canvas_.library.audio.context);
//     const MAM = new _canvas_.library.audio.audioWorklet.momentaryAmplitudeMeter(_canvas_.library.audio.context);
    
//     osc.connect(gain).connect(MAM);

//     MAM.reading = function(data){
//         console.log(data);
//     };
//     MAM.updateMode = 1;
//     setTimeout( function(){ MAM.requestReading(); }, 500 );

//     osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     osc.start();
//     gain.gain.linearRampToValueAtTime(0, _canvas_.library.audio.context.currentTime+10);
// });




// //amplitudeControlledModulator
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     const osc_1 = new OscillatorNode(_canvas_.library.audio.context);
//     const osc_2 = new OscillatorNode(_canvas_.library.audio.context);
//     const gain_1 = new GainNode(_canvas_.library.audio.context);
//     const gain_2 = new GainNode(_canvas_.library.audio.context);

//     const ACM = new _canvas_.library.audio.audioWorklet.amplitudeControlledModulator(_canvas_.library.audio.context);
    
//     osc_1.connect(gain_1).connect(ACM,undefined,0).connect(_canvas_.library.audio.context.destination);
//     osc_2.connect(gain_2).connect(ACM,undefined,1).connect(_canvas_.library.audio.context.destination);

//     osc_1.type = 'sine';
//     osc_2.type = 'sine';

//     gain_1.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);
//     gain_2.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);

//     osc_1.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     osc_1.start();
//     osc_2.frequency.setTargetAtTime(2, _canvas_.library.audio.context.currentTime, 0);
//     osc_2.start();
// });




// //whiteNoiseGenerator
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     const WNG = new _canvas_.library.audio.audioWorklet.whiteNoiseGenerator(_canvas_.library.audio.context);
//     WNG.connect(_canvas_.library.audio.context.destination);
// });




// //squareWaveGenerator
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     grap = grapher;

//     const SWG = new _canvas_.library.audio.audioWorklet.squareWaveGenerator(_canvas_.library.audio.context);
//     const gain = new GainNode(_canvas_.library.audio.context);
//     SWG.connect(gain).connect(_canvas_.library.audio.context.destination);
//     gain.gain.linearRampToValueAtTime(0.01, _canvas_.library.audio.context.currentTime);

//     s = SWG;


//     // const osc_1 = new OscillatorNode(_canvas_.library.audio.context);
//     // o = osc_1;
//     // // const osc_2 = new OscillatorNode(_canvas_.library.audio.context);
//     // const gain_1 = new GainNode(_canvas_.library.audio.context);
//     // // const gain_2 = new GainNode(_canvas_.library.audio.context);
    
//     // osc_1.connect(gain_1).connect(_canvas_.library.audio.context.destination);
//     // // osc_2.connect(gain_2).connect(_canvas_.library.audio.context.destination);

//     // osc_1.type = 'square';
//     // // osc_2.type = 'sine';

//     // gain_1.gain.linearRampToValueAtTime(0.05, _canvas_.library.audio.context.currentTime);
//     // // gain_2.gain.linearRampToValueAtTime(0.01, _canvas_.library.audio.context.currentTime);

//     // osc_1.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     // osc_1.start();
//     // // osc_2.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     // // osc_2.start();
// });




// //oscillator
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     grap = grapher;

//     O_1 = new _canvas_.library.audio.audioWorklet.oscillator(_canvas_.library.audio.context); 
//     const gain_1 = new GainNode(_canvas_.library.audio.context);
//     O_1.connect(gain_1);
//     gain_1.gain.linearRampToValueAtTime(0.001, _canvas_.library.audio.context.currentTime);
   
//     O_2 = new _canvas_.library.audio.audioWorklet.oscillator(_canvas_.library.audio.context); 
//     O_2.frequency.linearRampToValueAtTime(0.5, _canvas_.library.audio.context.currentTime);
//     const gain_2 = new GainNode(_canvas_.library.audio.context);
//     O_2.connect(gain_2);
//     gain_2.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);


//     // O_1.waveform = 2;
//     // O_1.dutyCycle_mode = 1;
//     // gain_2.connect(O_1,undefined,0);

//     // O_1.detune_mode = 1;
//     // gain_2.connect(O_1,undefined,1);

//     O_1.gain_mode = 1;
//     gain_2.connect(O_1,undefined,2);

//     gain_1.connect(_canvas_.library.audio.context.destination);
// });




// // oscillatorWithMultiLevelPhaseModulation
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     O_1 = new _canvas_.library.audio.audioWorklet.oscillatorWithMultiLevelPhaseModulation(_canvas_.library.audio.context); 
//     const gain_1 = new GainNode(_canvas_.library.audio.context);
//     O_1.connect(gain_1);
//     gain_1.gain.linearRampToValueAtTime(0.1, _canvas_.library.audio.context.currentTime);
//     gain_1.connect(_canvas_.library.audio.context.destination);

// });




// //lagProcessor
// _canvas_.layers.registerFunctionForLayer("library", function(){
//     const osc_1 = new OscillatorNode(_canvas_.library.audio.context);
//     const gain_1 = new GainNode(_canvas_.library.audio.context);
//     const lag_1 = new _canvas_.library.audio.audioWorklet.lagProcessor(_canvas_.library.audio.context);

//     osc_1.connect(gain_1).connect(lag_1).connect(_canvas_.library.audio.context.destination);

//     osc_1.type = 'sawtooth';
//     osc_1.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     osc_1.start();

//     gain_1.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);

//     lag_1.samples.setTargetAtTime(25, _canvas_.library.audio.context.currentTime, 1)
// });