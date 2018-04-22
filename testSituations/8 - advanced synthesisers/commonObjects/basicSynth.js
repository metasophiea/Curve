// __globals.objects.make_basicSynth = function(x,y){
//     //set numbers
//         var type = 'basicSynth';
//         var shape = {
//             base: [[0,0],[240,0],[240,40],[200,80],[0,80]],
//             connector: { width: 30, height: 30 }
//         };
//         var style = {
//             background: 'fill:rgba(200,200,200,1); stroke:none;',
//             h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
//             h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
//             text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',
    
//             markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
    
//             handle: 'fill:rgba(220,220,220,1)',
//             slot: 'fill:rgba(50,50,50,1)',
//             needle: 'fill:rgba(250,150,150,1)'
//         };



//     //main
//     var _mainObject = parts.basic.g(type, x, y);
//         _mainObject._type = type;

//     //circuitry
//         _mainObject.__synthesizer = new parts.audio.synthesizer(__globals.audio.context);

//     //elements
//         //backing
//         var backing = parts.basic.path(null, shape.base, 'L', style.background);
//             _mainObject.append(backing);
//             __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

//         //generate selection area
//         __globals.utility.generateSelectionArea(shape.base, _mainObject);

//         //panic button
//             var panicButton = parts.control.button_rect('panicButton', 197.5, 47.5, 20, 20, Math.PI/4, 'fill:rgba(175,175,175,1)', 'fill:rgba(220,220,220,1)', 'fill:rgba(150,150,150,1)');
//                 _mainObject.append(panicButton);
//                 panicButton.onclick = function(){ _mainObject.__synthesizer.panic(); }

//         //dials
//             var x = 0;
//             var y = 3;
//             var spacing = 40;

//             //gain
//             _mainObject.append(parts.display.label(null, x+11,   y+40, 'gain', style.h1));
//             _mainObject.append(parts.display.label(null, x+7,    y+34, '0',    style.h2));
//             _mainObject.append(parts.display.label(null, x+16.5, y+5,  '1/2',  style.h2));
//             _mainObject.append(parts.display.label(null, x+30,   y+34, '1',    style.h2));
//             var dial_gain = parts.control.dial_continuous(
//                 'dial_gain', x+20, y+20, 12,
//                 (3*Math.PI)/4, 1.5*Math.PI,
//                 style.handle, style.slot, style.needle, 1.2, style.markings
//             );
//             _mainObject.append(dial_gain);

//             x += spacing;

//             //attack
//             _mainObject.append(parts.display.label(null, x+7,    y+40, 'attack', style.h1));
//             _mainObject.append(parts.display.label(null, x+7,    y+34, '0',      style.h2));
//             _mainObject.append(parts.display.label(null, x+18.5, y+4,  '5',      style.h2));
//             _mainObject.append(parts.display.label(null, x+30,   y+34, '10',     style.h2));
//             var dial_attack = parts.control.dial_continuous(
//                 'dial_attack', x+20, y+20, 12,
//                 (3*Math.PI)/4, 1.5*Math.PI,
//                 style.handle, style.slot, style.needle, 1.2, style.markings
//             );
//             _mainObject.append(dial_attack);

//             x += spacing;

//             //release
//             _mainObject.append(parts.display.label(null, x+5,    y+40, 'release', style.h1));
//             _mainObject.append(parts.display.label(null, x+7,    y+34, '0',       style.h2));
//             _mainObject.append(parts.display.label(null, x+18.5, y+4,  '5',       style.h2));
//             _mainObject.append(parts.display.label(null, x+30,   y+34, '10',      style.h2));
//             var dial_release = parts.control.dial_continuous(
//                 'dial_release', x+20, y+20, 12,
//                 (3*Math.PI)/4, 1.5*Math.PI,
//                 style.handle, style.slot, style.needle, 1.2, style.markings
//             );
//             _mainObject.append(dial_release);

//             x += spacing;

//             //detune
//             _mainObject.append(parts.display.label(null, x+7,     y+40, 'detune', style.h1));
//             _mainObject.append(parts.display.label(null, x+2,     y+34, '-100',   style.h2));
//             _mainObject.append(parts.display.label(null, x+18.75, y+4,  '0',      style.h2));
//             _mainObject.append(parts.display.label(null, x+28,    y+34, '+100',   style.h2));
//             var dial_detune = parts.control.dial_continuous(
//                 'dial_detune', x+20, y+20, 12,
//                 (3*Math.PI)/4, 1.5*Math.PI,
//                 style.handle, style.slot, style.needle, 1.2, style.markings
//             );
//             _mainObject.append(dial_detune);

//             x += spacing;

//             //octave
//             _mainObject.append(parts.display.label(null, x+7,     y+40, 'octave', style.h1));
//             _mainObject.append(parts.display.label(null, x+4,     y+32, '-3',     style.h2));
//             _mainObject.append(parts.display.label(null, x+0,     y+21, '-2',     style.h2));
//             _mainObject.append(parts.display.label(null, x+4,     y+10, '-1',     style.h2));
//             _mainObject.append(parts.display.label(null, x+18.75, y+5,  '0',      style.h2));
//             _mainObject.append(parts.display.label(null, x+30,    y+10, '+1',     style.h2));
//             _mainObject.append(parts.display.label(null, x+35,    y+21, '+2',     style.h2));
//             _mainObject.append(parts.display.label(null, x+30,    y+32, '+3',     style.h2));
//             var dial_octave = parts.control.dial_discrete(
//                 'dial_octave', x+20, y+20, 12,
//                 7, (3*Math.PI)/4, 1.5*Math.PI,
//                 style.handle, style.slot, style.needle
//             );
//             _mainObject.append(dial_octave);

//             x += spacing;

//             //type
//             _mainObject.append(parts.display.label(null, x+11, y+40, 'type', style.h1));
//             _mainObject.append(parts.display.label(null, x+0,  y+32, 'sine', style.h2));
//             _mainObject.append(parts.display.label(null, x+0,  y+18, 'tri',  style.h2));
//             _mainObject.append(parts.display.label(null, x+10, y+6,  'squ',  style.h2));
//             _mainObject.append(parts.display.label(null, x+27, y+7,  'saw',  style.h2));
//             _mainObject.append(parts.basic.rect(null, x+35, y+19, 5, 2, 0, style.slot));
//             var dial_type = parts.control.dial_discrete(
//                 'dial_type', x+20, y+20, 12,
//                 5, (3*Math.PI)/4, (5*Math.PI)/4,
//                 style.handle, style.slot, style.needle
//             );
//             _mainObject.append(dial_type);

//         //connection nodes
//             _mainObject.io = {};

//             //audio out
//             var s = 30;
//             _mainObject.io.audioOut = parts.dynamic.connectionNode_audio('_mainObject.io.audioOut', 1, -s/2, 20-s/2, s, s, __globals.audio.context);
//             _mainObject.prepend(_mainObject.io.audioOut);

//             //gain data in
//             s = 15;
//             _mainObject.io.dataIn_gain = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_gain', 20-s/2, -s/2, s, s);
//             _mainObject.prepend(_mainObject.io.dataIn_gain);

//             //attack data in
//             _mainObject.io.dataIn_attack = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_attack', 20+spacing-s/2, -s/2, s, s);
//             _mainObject.prepend(_mainObject.io.dataIn_attack);

//             //release data in
//             _mainObject.io.dataIn_release = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_release', 20+2*spacing-s/2, -s/2, s, s);
//             _mainObject.prepend(_mainObject.io.dataIn_release);

//             //detune data in
//             _mainObject.io.dataIn_detune = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_detune', 20+3*spacing-s/2, -s/2, s, s);
//             _mainObject.prepend(_mainObject.io.dataIn_detune);

//             //octave data in
//             _mainObject.io.dataIn_octave = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_octave', 20+4*spacing-s/2, -s/2, s, s);
//             _mainObject.prepend(_mainObject.io.dataIn_octave);

//             //type data in
//             _mainObject.io.dataIn_type = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_type', 20+5*spacing-s/2, -s/2, s, s);
//             _mainObject.prepend(_mainObject.io.dataIn_type);

//             //periodicWave data in
//             _mainObject.io.dataIn_periodicWave = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_periodicWave', 240-s/2, 20-s/2, s, s);
//             _mainObject.prepend(_mainObject.io.dataIn_periodicWave);

//             //midiNote data in
//             s = 30;
//             var rotation = Math.PI/4;
//             var temp = __globals.utility.getCartesian(rotation, -s);
//             _mainObject.io.dataIn_midiNote = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_midiNote', 240+temp.x, 60+temp.y, s, s, rotation);
//             _mainObject.prepend(_mainObject.io.dataIn_midiNote);

//     //wiring
//     _mainObject.__synthesizer.out().connect( _mainObject.io.audioOut.in() );

//         dial_gain.onChange = function(value){ _mainObject.__synthesizer.gain( value ); };
//         dial_attack.onChange = function(value){ _mainObject.__synthesizer.attack( value*10 ); };
//         dial_release.onChange = function(value){ _mainObject.__synthesizer.release( value*10 ); };
//         dial_detune.onChange = function(value){ _mainObject.__synthesizer.detune( value*200 - 100 ); };
//         dial_octave.onChange = function(value){ _mainObject.__synthesizer.octave(value-3); };
//         dial_type.onChange = function(value){_mainObject.__synthesizer.type(['sine','triangle','square','sawtooth','custom'][value]);};

//         _mainObject.io.dataIn_gain.receive =    function(address,data){ if(address != '%'){return;} dial_gain.set(data); };
//         _mainObject.io.dataIn_attack.receive =  function(address,data){ if(address != '%'){return;} dial_attack.set(data); }; 
//         _mainObject.io.dataIn_release.receive = function(address,data){ if(address != '%'){return;} dial_release.set(data); };    
//         _mainObject.io.dataIn_detune.receive =  function(address,data){ if(address != '%'){return;} dial_detune.set(data); };
//         _mainObject.io.dataIn_octave.receive =  function(address,data){ if(address != 'discrete'){return;} dial_octave.select(data); };
//         _mainObject.io.dataIn_type.receive =    function(address,data){ if(address != 'discrete'){return;} dial_type.select(data); };
//         _mainObject.io.dataIn_midiNote.receive = function(address,data){ if(address != 'midiNumber'){return;} _mainObject.__synthesizer.perform(data); };

//     //setup
//         dial_gain.set(0);
//         dial_detune.set(0.5);
//         dial_octave.select(3);

//     return _mainObject;
// };