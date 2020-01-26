// // momentaryAmplitudeMeter
// _canvas_.library.go.add( function(){
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const gain = new GainNode(_canvas_.library.audio.context);
//     const MAM = _canvas_.library.audio.context.createMomentaryAmplitudeMeter();
    
//     osc.connect(gain).connect(MAM);

//     MAM.port.onmessage = function(msg){ console.log(msg.data); }

//     // osc.type = 'square';
//     osc.frequency.setTargetAtTime(10, _canvas_.library.audio.context.currentTime, 0);
//     osc.start();

//     // gain.gain.linearRampToValueAtTime(0, _canvas_.library.audio.context.currentTime+10);
// });


// // amplitudeInverter
// _canvas_.library.go.add( function(){
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const AI = _canvas_.library.audio.context.createAmplitudeInverter();
    
//     osc.connect(AI).connect(_canvas_.library.audio.context.destination);

//     osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     osc.start();
// });


// // amplitudePeakAttenuator
// _canvas_.library.go.add( function(){
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const gain = new GainNode(_canvas_.library.audio.context);
//     const APA = _canvas_.library.audio.context.createAmplitudePeakAttenuator();
//     const MAM = _canvas_.library.audio.context.createMomentaryAmplitudeMeter();
    
//     osc.connect(gain)/*.connect(APA)./*connect(MAM).*/.connect(_canvas_.library.audio.context.destination);

//     osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     osc.start();

//     MAM.port.onmessage = function(msg){ console.log(msg.data); }

//     gain.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime+1);
// });


// // modulon / amplitudeControledModulator
// _canvas_.library.go.add( function(){
//     const osc_1 = new OscillatorNode(_canvas_.library.audio.context);
//     const osc_2 = new OscillatorNode(_canvas_.library.audio.context);
//     const gain_1 = new GainNode(_canvas_.library.audio.context);
//     const gain_2 = new GainNode(_canvas_.library.audio.context);
//     const m = _canvas_.library.audio.context.createModulon();
    
//     osc_1.connect(gain_1).connect(m,undefined,0).connect(_canvas_.library.audio.context.destination);
//     osc_2.connect(gain_2).connect(m,undefined,1).connect(_canvas_.library.audio.context.destination);

//     osc_2.type = 'sine';


//     gain_1.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);
//     gain_2.gain.linearRampToValueAtTime(1, _canvas_.library.audio.context.currentTime);

//     osc_1.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     osc_1.start();

//     osc_2.frequency.setTargetAtTime(220, _canvas_.library.audio.context.currentTime, 0);
//     osc_2.start();
// });


// // amplitudeModifier
// _canvas_.library.go.add( function(){
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const AM = _canvas_.library.audio.context.createAmplitudeModifier();
    
//     osc.connect(AM).connect(_canvas_.library.audio.context.destination);

//     osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     osc.start();

//     // AM.parameters.get('invert').setValueAtTime(true,0);
// });


// // sqasherDoubler
// _canvas_.library.go.add( function(){
//     const osc = new OscillatorNode(_canvas_.library.audio.context);
//     const SD = _canvas_.library.audio.context.createSqasherDoubler();
    
//     osc.connect(SD).connect(_canvas_.library.audio.context.destination);

//     osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
//     osc.start();
// });