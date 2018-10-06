this.basicSynthesizer = function(x,y){
    var attributes = {
        detuneLimits: {min:-100, max:100}
    };
    var style = {
        background:'fill:rgba(200,200,200,1);',
        selectionGlow:{
            off:'pointer-events:none; fill:none; ',
            on: 'pointer-events:none; fill:none; stroke:rgb(255, 237, 147); stroke-width:2; stroke-linecap:round;',
        },
        h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
        h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',

        dial:{
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)',
            outerArc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
        }
    };
    var design = {
        type:'basicSynthesizer',
        x:x, y:y,
        base:{
            points:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90},{x:0,y:0}], 
            style:style.background,
        },
        elements:[
            {type:'connectionNode_audio', name:'audioOut', data: {
                type: 1, x: -15, y: 5, width: 15, height: 30
            }},
            {type:'connectionNode_data', name:'gain', data:{
                x: 12.5, y: -7.5, width: 15, height: 7.5,
                receive: function(address,data){
                    switch(address){
                        case '%': design.dial_continuous.gain.set(data); break;
                        case '%t': 
                            obj.__synthesizer.gain(data.target,data.time,data.curve);
                            design.dial_continuous.gain.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }
            }},
            {type:'connectionNode_data', name:'attack', data:{
                x: 52.5, y: -7.5, width: 15, height: 7.5,
                receive: function(address,data){
                    if(address != '%'){return;}
                    design.dial_continuous.attack.set(data);
                } 
            }},
            {type:'connectionNode_data', name:'release', data:{
                x: 92.5, y: -7.5, width: 15, height: 7.5,
                receive: function(address,data){
                    if(address != '%'){return;}
                    design.dial_continuous.release.set(data);
                } 
            }},
            {type:'connectionNode_data', name:'detune', data:{
                x: 132.5, y: -7.5, width: 15, height: 7.5,
                receive: function(address,data){ 
                    switch(address){
                        case '%': design.dial_continuous.detune.set(data); break;
                        case '%t': 
                            obj.__synthesizer.detune((data.target*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min),data.time,data.curve);
                            design.dial_continuous.detune.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }
            }},
            {type:'connectionNode_data', name:'octave', data:{
                x: 170.5, y: -7.5, width: 15, height: 7.5,
                receive: function(address,data){
                    if(address != 'discrete'){return;}
                    design.dial_discrete.octave.select(data);
                } 
            }},
            {type:'connectionNode_data', name:'waveType', data:{
                x: 210.5, y: -7.5, width: 15, height: 7.5,
                receive: function(address,data){
                    if(address != 'discrete'){return;}
                    design.dial_discrete.waveType.select(data);
                }
            }},
            {type:'connectionNode_data', name:'periodicWave', data:{
                x: 240, y: 12.5, width: 7.5, height: 15,
                receive: function(address,data){
                    if(address != 'periodicWave'){return;}
                    obj.__synthesizer.periodicWave(data);
                }
            }},
            {type:'connectionNode_data', name:'midiNote', data:{
                x:225, y:55, width: 15, height: 30, angle:Math.PI/4,
                receive: function(address,data){
                    if(address != 'midinumber'){return;}
                    obj.__synthesizer.perform(data);
                }
            }},
            {type:'connectionNode_data', name:'gainWobblePeriod', data:{
                x: 22.5, y: 90, width: 15, height: 7.5,
                receive: function(address,data){
                    if(address != '%'){return;}
                    design.dial_continuous.gainWobblePeriod.set(data);
                }
            }},
            {type:'connectionNode_data', name:'gainWobbleDepth', data:{
                x: 57.5, y: 90, width: 15, height: 7.5,
                receive: function(address,data){
                    if(address != '%'){return;}
                    design.dial_continuous.gainWobbleDepth.set(data);
                }
            }},
            {type:'connectionNode_data', name:'detuneWobblePeriod', data:{
                x: 107.5, y: 90, width: 15, height: 7.5,
                receive: function(address,data){
                    if(address != '%'){return;}
                    design.dial_continuous.detuneWobblePeriod.set(data);
                }
            }},
            {type:'connectionNode_data', name:'detuneWobbleDepth', data:{
                x: 142.5, y: 90, width: 15, height: 7.5,
                receive: function(address,data){
                    if(address != '%'){return;}
                    design.dial_continuous.detuneWobbleDepth.set(data);
                }
            }},

            //gain dial
                {type:'text', name:'gain_gain', data:{x: 11,   y: 43, text: 'gain', style: style.h1}},
                {type:'text', name:'gain_0',    data:{x: 7,    y: 37, text: '0',    style: style.h2}},
                {type:'text', name:'gain_1/2',  data:{x: 16.5, y: 7,  text: '1/2',  style: style.h2}},
                {type:'text', name:'gain_1',    data:{x: 30,   y: 37, text: '1',    style: style.h2}},
                {type:'dial_continuous',name:'gain',data:{
                    x: 20, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                    onchange: function(value){ obj.__synthesizer.gain( value ); }
                }},
            //attack dial
                {type:'text', name:'attack_gain', data:{x: 47,   y: 43, text: 'attack', style: style.h1}},
                {type:'text', name:'attack_0',    data:{x: 47,   y: 37, text: '0',      style: style.h2}},
                {type:'text', name:'attack_5',    data:{x: 58.5, y: 7,  text: '5',      style: style.h2}},
                {type:'text', name:'attack_10',   data:{x: 70,   y: 37, text: '10',     style: style.h2}},
                {type:'dial_continuous',name:'attack',data:{
                    x: 60, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                    onchange: function(value){ obj.__synthesizer.attack( value ); }
                }},
            //release dial
                {type:'text', name:'release_gain', data:{x: 85,   y: 43, text: 'release', style: style.h1}},
                {type:'text', name:'release_0',    data:{x: 85,   y: 37, text: '0',       style: style.h2}},
                {type:'text', name:'release_5',    data:{x: 98.5, y: 7,  text: '5',       style: style.h2}},
                {type:'text', name:'release_10',   data:{x: 110,  y: 37, text: '10',      style: style.h2}},
                {type:'dial_continuous',name:'release',data:{
                    x: 100, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                    onchange: function(value){ obj.__synthesizer.release( value ); }
                }},
            //detune dial
                {type:'text', name:'detune_gain', data:{x: 127,   y: 43, text: 'detune', style: style.h1}},
                {type:'text', name:'detune_-100', data:{x: 122,   y: 37, text: '-100',   style: style.h2}},
                {type:'text', name:'detune_0',    data:{x: 138.5, y: 7,  text: '0',      style: style.h2}},
                {type:'text', name:'detune_100',  data:{x: 150,   y: 37, text: '100',    style: style.h2}},
                {type:'dial_continuous',name:'detune',data:{
                    x: 140, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                    onchange: function(value){ obj.__synthesizer.detune( value*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min ); }
                }},
            //octave dial
                {type:'text', name:'octave_gain', data:{x: 167,    y: 43, text: 'octave', style: style.h1}},
                {type:'text', name:'octave_-3',   data:{x: 164,    y: 35, text: '-3',     style: style.h2}},
                {type:'text', name:'octave_-2',   data:{x: 160,    y: 24, text: '-2',     style: style.h2}},
                {type:'text', name:'octave_-1',   data:{x: 164,    y: 13, text: '-1',     style: style.h2}},
                {type:'text', name:'octave_0',    data:{x: 178.75, y: 8,  text: '0',      style: style.h2}},
                {type:'text', name:'octave_1',    data:{x: 190,    y: 13, text: '1',      style: style.h2}},
                {type:'text', name:'octave_2',    data:{x: 195,    y: 24, text: '2',      style: style.h2}},
                {type:'text', name:'octave_3',    data:{x: 190,    y: 35, text: '3',      style: style.h2}},
                {type:'dial_discrete',name:'octave',data:{
                    x: 180, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, optionCount: 7,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                    onchange: function(value){ obj.__synthesizer.octave(value-3); }
                }},
            //waveType dial
                {type:'text', name:'waveType_gain', data:{x: 211, y: 43, text: 'wave', style: style.h1}},
                {type:'text', name:'waveType_sin',  data:{x: 202, y: 35, text: 'sin',  style: style.h2}},
                {type:'text', name:'waveType_tri',  data:{x: 199, y: 21, text: 'tri',  style: style.h2}},
                {type:'text', name:'waveType_squ',  data:{x: 210, y: 9,  text: 'squ',  style: style.h2}},
                {type:'text', name:'waveType_saw',  data:{x: 227, y: 10, text: 'saw',  style: style.h2}},
                {type:'rect', name:'periodicWaveType', data:{
                    x: 230, y: 21.75, angle: 0,
                    width: 10, height: 2.5,
                    style:style.dial.slot,
                }},
                {type:'dial_discrete',name:'waveType',data:{
                    x: 220, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: (5*Math.PI)/4,  optionCount: 5,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                    onchange: function(value){ obj.__synthesizer.waveType(['sine','triangle','square','sawtooth','custom'][value]); }
                }},
            //gainWobblePeriod dial
                {type:'text', name:'gainWobble', data:{x: 13, y: 70, angle: -Math.PI/2,text: 'gain', style: style.h2}}, 
                {type:'text', name:'gainWobblePeriod_gain', data:{x: 21,   y: 84,      text: 'rate', style: style.h1}},
                {type:'text', name:'gainWobblePeriod_0',    data:{x: 16,   y: 77,      text: '0',    style: style.h2}},
                {type:'text', name:'gainWobblePeriod_50',   data:{x: 27.5, y: 49,      text: '50',   style: style.h2}},
                {type:'text', name:'gainWobblePeriod_100',  data:{x: 42,   y: 77,      text: '100',  style: style.h2}},
                {type:'dial_continuous',name:'gainWobblePeriod',data:{
                    x: 30, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                    onchange: function(value){ obj.__synthesizer.gainWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
                }},
            //gainWobbleDepth dial
                {type:'text', name:'gainWobbleDepth_gain', data:{x: 54, y: 84, text: 'depth', style: style.h1}},
                {type:'text', name:'gainWobbleDepth_0',    data:{x: 51, y: 77, text: '0',     style: style.h2}},
                {type:'text', name:'gainWobbleDepth_50',   data:{x: 61, y: 49, text: '1/2',   style: style.h2}},
                {type:'text', name:'gainWobbleDepth_100',  data:{x: 77, y: 77, text: '1',     style: style.h2}},
                {type:'dial_continuous',name:'gainWobbleDepth',data:{
                    x: 65, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                    onchange: function(value){ obj.__synthesizer.gainWobbleDepth(value); },
                }},
            //detuneWobblePeriod dial
                {type:'text', name:'detuneWobble', data:{x: 98, y: 70, angle: -Math.PI/2, text: 'detune', style: style.h2}},    
                {type:'text', name:'detuneWobblePeriod_gain', data:{x: 105,   y: 84,      text: 'rate',   style: style.h1}},
                {type:'text', name:'detuneWobblePeriod_0',    data:{x: 100,   y: 77,      text: '0',      style: style.h2}},
                {type:'text', name:'detuneWobblePeriod_50',   data:{x: 111.5, y: 49,      text: '50',     style: style.h2}},
                {type:'text', name:'detuneWobblePeriod_100',  data:{x: 126,   y: 77,      text: '100',    style: style.h2}},
                {type:'dial_continuous',name:'detuneWobblePeriod',data:{
                    x: 114, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                    onchange: function(value){ obj.__synthesizer.detuneWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
                }},
            //detuneWobbleDepth dial
                {type:'text', name:'detuneWobbleDepth_gain', data:{x: 140,   y: 84, text: 'depth', style: style.h1}},
                {type:'text', name:'detuneWobbleDepth_0',    data:{x: 135,   y: 77, text: '0',     style: style.h2}},
                {type:'text', name:'detuneWobbleDepth_50',   data:{x: 145.5, y: 49, text: '1/2',   style: style.h2}},
                {type:'text', name:'detuneWobbleDepth_100',  data:{x: 161,   y: 77, text: '1',     style: style.h2}},
                {type:'dial_continuous',name:'detuneWobbleDepth',data:{
                    x: 149, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                    onchange: function(value){ obj.__synthesizer.detuneWobbleDepth(value*100); }
                }},

            {type:'button_rect', name:'panicButton', data: {
                x:197.5, y: 47.5, width:20, height:20, angle: Math.PI/4,
                style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' }, 
                onpress:function(){ obj.__synthesizer.panic(); },
            }},

            {type:'path', name:'selectionGlow', data:{
                path:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90},{x:0,y:0}],
                style:style.selectionGlow.off,
            }},
        ]
    };

    //main object
        var obj = object.builder(object.alpha.basicSynthesizer,design);

    //import/export
        obj.exportData = function(){
            return {
                gain:design.dial_continuous.gain.get(),
                attack:design.dial_continuous.attack.get()*10,
                release:design.dial_continuous.release.get()*10,
                detune:100*((design.dial_continuous.detune.get()*2)-1),
                octave:design.dial_discrete.octave.select()-3,
                waveType:['sine','triangle','square','sawtooth','custom'][design.dial_discrete.waveType.select()],
                gainWobble:{
                    rate:design.dial_continuous.gainWobblePeriod.get()*100,
                    depth:design.dial_continuous.gainWobbleDepth.get()
                },
                detuneWobble:{
                    rate:design.dial_continuous.detuneWobblePeriod.get()*100,
                    depth:design.dial_continuous.detuneWobbleDepth.get()
                },
            };
        };
        obj.importData = function(data){
            design.dial_continuous.gain.set(data.gain);
            design.dial_continuous.attack.set(data.attack/10);
            design.dial_continuous.release.set(data.release/10);
            design.dial_continuous.detune.set( (1+(data.detune/100))/2 );
            design.dial_discrete.octave.select(data.octave+3);
            design.dial_discrete.waveType.select( ['sine','triangle','square','sawtooth','custom'].indexOf(data.waveType) );
            design.dial_continuous.gainWobblePeriod.set(data.gainWobble.rate/100);
            design.dial_continuous.gainWobbleDepth.set(data.gainWobble.depth);
            design.dial_continuous.detuneWobblePeriod.set(data.detuneWobble.rate/100);
            design.dial_continuous.detuneWobbleDepth.set(data.detuneWobble.depth);
        };

    //selection
        obj.onSelect = function(){
            system.utility.element.setStyle(design.path.selectionGlow,style.selectionGlow.on);
        };
        obj.onDeselect = function(){
            system.utility.element.setStyle(design.path.selectionGlow,style.selectionGlow.off);
        };

    //circuitry
        obj.__synthesizer = new part.circuit.audio.synthesizer2(system.audio.context);
        obj.__synthesizer.out().connect( design.connectionNode_audio.audioOut.in() );

    //interface
        obj.i = {
            gain:function(value){design.dial_continuous.gain.set(value);},
            attack:function(value){design.dial_continuous.attack.set(value);},
            release:function(value){design.dial_continuous.release.set(value);},
            detune:function(value){design.dial_continuous.detune.set(value);},
            octave:function(value){design.dial_discrete.octave.select(value);},
            waveType:function(value){design.dial_discrete.waveType.select(value);},
            periodicWave:function(data){obj.__synthesizer.periodicWave(data);},
            midiNote:function(data){obj.__synthesizer.perform(data);},
            gainWobblePeriod:function(value){design.dial_continuous.gainWobblePeriod.set(value);},
            gainWobbleDepth:function(value){design.dial_continuous.gainWobbleDepth.set(value);},
            detuneWobblePeriod:function(value){design.dial_continuous.detuneWobblePeriod.set(value);},
            detuneWobbleDepth:function(value){design.dial_continuous.detuneWobbleDepth.set(value);},
        };

    //setup
        design.dial_continuous.gain.set(0.5);
        design.dial_continuous.detune.set(0.5);
        design.dial_discrete.octave.select(3);

    return obj;
};

this.basicSynthesizer.metadata = {
    name:'Basic Synthesizer',
    helpurl:'https://metasophiea.com/curve/help/objects/basicSynthesizer/'
};