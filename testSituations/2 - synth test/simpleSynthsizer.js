function makeSimpleSynthsizer(x,y){
    //styling
    var style = {
        'backing':'fill:rgba(200,200,200,1); stroke:none;',
        'h1':'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
        'h2':'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',

        'markings':'fill:none; stroke:rgb(150,150,150); stroke-width:1;',

        'handle':'fill:rgba(220,220,220,1)',
        'slot':'fill:rgba(50,50,50,1)',
        'needle':'fill:rgba(250,150,150,1)'
    };



    //elements
        //main
            var _mainObject = parts.basic.g('simpleSynthsizer2', x, y);
            __globals.utility.element.makeUnselectable(_mainObject);

            var path = [{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:200,y:80},{x:0,y:80}];
            var backing = parts.basic.path(null, path, 'L', style.backing);
                _mainObject.append(backing);
                parts.modifier.bestowMovement(backing, backing.parentElement);

        //circuitry
            var synthesizer = new parts.audio.synthesizer_basic(__globals.audio.context);

        //dials
            var x = 0;
            var y = 3;
            var spacing = 40;

            //gain
            _mainObject.append(parts.display.label(null, x+11,   y+40, 'gain', style.h1));
            _mainObject.append(parts.display.label(null, x+7,    y+34, '0',    style.h2));
            _mainObject.append(parts.display.label(null, x+16.5, y+5,  '1/2',  style.h2));
            _mainObject.append(parts.display.label(null, x+30,   y+34, '1',    style.h2));
            var dial_gain = parts.control.dial_continuous(
                'dial_gain', x+20, y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle, 1.2, style.markings
            );
            _mainObject.append(dial_gain);

            x += spacing;

            //attack
            _mainObject.append(parts.display.label(null, x+7,    y+40, 'attack', style.h1));
            _mainObject.append(parts.display.label(null, x+7,    y+34, '0',      style.h2));
            _mainObject.append(parts.display.label(null, x+18.5, y+4,  '5',      style.h2));
            _mainObject.append(parts.display.label(null, x+30,   y+34, '10',     style.h2));
            var dial_attack = parts.control.dial_continuous(
                'dial_attack', x+20, y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle, 1.2, style.markings
            );
            _mainObject.append(dial_attack);

            x += spacing;

            //release
            _mainObject.append(parts.display.label(null, x+5,    y+40, 'release', style.h1));
            _mainObject.append(parts.display.label(null, x+7,    y+34, '0',       style.h2));
            _mainObject.append(parts.display.label(null, x+18.5, y+4,  '5',       style.h2));
            _mainObject.append(parts.display.label(null, x+30,   y+34, '10',      style.h2));
            var dial_release = parts.control.dial_continuous(
                'dial_release', x+20, y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle, 1.2, style.markings
            );
            _mainObject.append(dial_release);

            x += spacing;

            //detune
            _mainObject.append(parts.display.label(null, x+7,     y+40, 'detune', style.h1));
            _mainObject.append(parts.display.label(null, x+2,     y+34, '-100',   style.h2));
            _mainObject.append(parts.display.label(null, x+18.75, y+4,  '0',      style.h2));
            _mainObject.append(parts.display.label(null, x+28,    y+34, '+100',   style.h2));
            var dial_detune = parts.control.dial_continuous(
                'dial_detune', x+20, y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle, 1.2, style.markings
            );
            _mainObject.append(dial_detune);

            x += spacing;

            //octave
            _mainObject.append(parts.display.label(null, x+7,     y+40, 'octave', style.h1));
            _mainObject.append(parts.display.label(null, x+4,     y+32, '-3',     style.h2));
            _mainObject.append(parts.display.label(null, x+0,     y+21, '-2',     style.h2));
            _mainObject.append(parts.display.label(null, x+4,     y+10, '-1',     style.h2));
            _mainObject.append(parts.display.label(null, x+18.75, y+5,  '0',      style.h2));
            _mainObject.append(parts.display.label(null, x+30,    y+10, '+1',     style.h2));
            _mainObject.append(parts.display.label(null, x+35,    y+21, '+2',     style.h2));
            _mainObject.append(parts.display.label(null, x+30,    y+32, '+3',     style.h2));
            var dial_octave = parts.control.dial_discrete(
                'dial_octave', x+20, y+20, 12,
                7, (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle
            );
            _mainObject.append(dial_octave);

            x += spacing;

            //type
            _mainObject.append(parts.display.label(null, x+11, y+40, 'type', style.h1));
            _mainObject.append(parts.display.label(null, x+0,  y+32, 'sine', style.h2));
            _mainObject.append(parts.display.label(null, x+0,  y+18, 'tri',  style.h2));
            _mainObject.append(parts.display.label(null, x+10, y+6,  'squ',  style.h2));
            _mainObject.append(parts.display.label(null, x+27, y+7,  'saw',  style.h2));
            _mainObject.append(parts.basic.rect(null, x+35, y+19, 5, 2, 0, 'fill:rgba(50,50,50,1)'));
            var dial_type = parts.control.dial_discrete(
                'dial_type', x+20, y+20, 12,
                5, (3*Math.PI)/4, (5*Math.PI)/4,
                style.handle, style.slot, style.needle
            );
            _mainObject.append(dial_type);

        //connection nodes
            _mainObject.io = {};

            //audio out
            var s = 30;
            _mainObject.io.audioOut = parts.dynamic.connectionNode_audio('_mainObject.io.audioOut', 1, -s/2, 20-s/2, s, s, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.audioOut);

            //gain data in
            var s = 15;
            _mainObject.io.dataIn_gain = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_gain', 20-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_gain);

            //attack data in
            var s = 15;
            _mainObject.io.dataIn_attack = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_attack', 20+spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_attack);

            //release data in
            var s = 15;
            _mainObject.io.dataIn_release = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_release', 20+2*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_release);

            //detune data in
            var s = 15;
            _mainObject.io.dataIn_detune = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_detune', 20+3*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_detune);

            //octave data in
            var s = 15;
            _mainObject.io.dataIn_octave = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_octave', 20+4*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_octave);

            //type data in
            var s = 15;
            _mainObject.io.dataIn_type = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_type', 20+5*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_type);

            //periodicWave data in
            var s = 15;
            _mainObject.io.dataIn_periodicWave = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_periodicWave', 240-s/2, 20-s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_periodicWave);

            //musicalNote data in
            var s = 30;
            var rotation = Math.PI/4;
            var temp = __globals.utility.math.polar2cartesian(rotation, -s);
            _mainObject.io.dataIn_musicalNote = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_musicalNote', 240+temp.x, 60+temp.y, s, s, rotation);
            _mainObject.prepend(_mainObject.io.dataIn_musicalNote);


            //movement redraw
            _mainObject.movementRedraw = function(){
                _mainObject.io.audioOut.redraw();
                _mainObject.io.dataIn_gain.redraw();
                _mainObject.io.dataIn_attack.redraw();
                _mainObject.io.dataIn_release.redraw();
                _mainObject.io.dataIn_detune.redraw();
                _mainObject.io.dataIn_octave.redraw();
                _mainObject.io.dataIn_type.redraw();
                _mainObject.io.dataIn_periodicWave.redraw();
                _mainObject.io.dataIn_musicalNote.redraw();
            };



    //wiring
        synthesizer.out().connect( _mainObject.io.audioOut.in() );

        dial_gain.onChange = function(value){ synthesizer.gain( value ); };
        dial_attack.onChange = function(value){ synthesizer.attack( value*10 ); };
        dial_release.onChange = function(value){ synthesizer.release( value*10 ); };
        dial_detune.onChange = function(value){ synthesizer.detune( value*200 - 100 ); };
        dial_octave.onChange = function(value){ synthesizer.octave(value-3); };
        dial_type.onChange = function(value){synthesizer.type(['sine','triangle','square','sawtooth','custom'][value]);};

        _mainObject.io.dataIn_gain.receive =    function(address,data){ if(address != '%'){return;} dial_gain.set(data); };
        _mainObject.io.dataIn_attack.receive =  function(address,data){ if(address != '%'){return;} dial_attack.set(data); }; 
        _mainObject.io.dataIn_release.receive = function(address,data){ if(address != '%'){return;} dial_release.set(data); };    
        _mainObject.io.dataIn_detune.receive =  function(address,data){ if(address != '%'){return;} dial_detune.set(data); };
        _mainObject.io.dataIn_octave.receive =  function(address,data){ if(address != 'discrete'){return;} dial_octave.select(data); };
        _mainObject.io.dataIn_type.receive =    function(address,data){ if(address != 'discrete'){return;} dial_type.select(data); };
        _mainObject.io.dataIn_musicalNote.receive = function(address,data){ if(address != 'musicalNote'){return;} synthesizer.perform(data); };

    //setup
        dial_gain.set(0);
        dial_detune.set(0.5);
        dial_octave.select(3);

    return _mainObject;
}