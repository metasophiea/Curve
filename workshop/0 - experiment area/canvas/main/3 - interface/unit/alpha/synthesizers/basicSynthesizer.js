this.basicSynthesizer = function(x,y){
    var attributes = {
        detuneLimits: {min:-100, max:100}
    };
    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        h1:{fill:'rgba(0,0,0,1)', font:'4pt Courier New'},
        h2:{fill:'rgba(0,0,0,1)', font:'3pt Courier New'},

        dial:{
            handle:{fill:'rgba(220,220,220,1)'},
            slot:{fill:'rgba(50,50,50,1)'},
            needle:{fill:'rgba(250,150,150,1)'},
        },
        button:{
            background__up__fill:'rgba(175,175,175,1)', 
            background__hover__fill:'rgba(220,220,220,1)', 
            background__hover_press__fill:'rgba(150,150,150,1)',
        }
    };
    var design = {
        name:'basicSynthesizer',
        collection: 'alpha',
        x:x, y:y,
        space:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90},{x:0,y:0}], 
        // spaceOutline: true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90},{x:0,y:0}], style:style.background }},

            {type:'connectionNode_audio', name:'audioOut', data: {
                type: 1, x: -15, y: 5, width: 15, height: 30, isAudioOutput:true 
            }},
            {type:'connectionNode_data', name:'port_gain', data:{
                x: 12.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    switch(address){
                        case '%': object.elements.dial_continuous.gain.set(data); break;
                        case '%t': 
                            object.__synthesizer.gain(data.target,data.time,data.curve);
                            object.elements.dial_continuous.gain.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }
            }},
            {type:'connectionNode_data', name:'port_attack', data:{
                x: 52.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous.attack.set(data);
                } 
            }},
            {type:'connectionNode_data', name:'port_release', data:{
                x: 92.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous.release.set(data);
                } 
            }},
            {type:'connectionNode_data', name:'port_detune', data:{
                x: 132.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){ 
                    switch(address){
                        case '%': object.elements.dial_continuous.detune.set(data); break;
                        case '%t': 
                            object.__synthesizer.detune((data.target*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min),data.time,data.curve);
                            object.elements.dial_continuous.detune.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }
            }},
            {type:'connectionNode_data', name:'port_octave', data:{
                x: 170.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != 'discrete'){return;}
                    object.elements.dial_discrete.octave.select(data);
                } 
            }},
            {type:'connectionNode_data', name:'port_waveType', data:{
                x: 210.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != 'discrete'){return;}
                    object.elements.dial_discrete.waveType.select(data);
                }
            }},
            {type:'connectionNode_data', name:'port_periodicWave', data:{
                x: 240, y: 12.5, width: 7.5, height: 15,
                onreceive: function(address,data){
                    if(address != 'periodicWave'){return;}
                    object.__synthesizer.periodicWave(data);
                }
            }},
            {type:'connectionNode_data', name:'port_midiNote', data:{
                x:225, y:55, width: 15, height: 30, angle:Math.PI/4,
                onreceive: function(address,data){
                    if(address != 'midinumber'){return;}
                    object.__synthesizer.perform(data);
                }
            }},
            {type:'connectionNode_data', name:'port_gainWobblePeriod', data:{
                x: 22.5, y: 90, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous.gainWobblePeriod.set(data);
                }
            }},
            {type:'connectionNode_data', name:'port_gainWobbleDepth', data:{
                x: 57.5, y: 90, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous.gainWobbleDepth.set(data);
                }
            }},
            {type:'connectionNode_data', name:'port_detuneWobblePeriod', data:{
                x: 107.5, y: 90, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous.detuneWobblePeriod.set(data);
                }
            }},
            {type:'connectionNode_data', name:'port_detuneWobbleDepth', data:{
                x: 142.5, y: 90, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous.detuneWobbleDepth.set(data);
                }
            }},

            //gain dial
                {type:'text', name:'gain_gain', data:{x: 13,   y: 43, text: 'gain', size:style.h1.size, style: style.h1}},
                {type:'text', name:'gain_0',    data:{x: 7,    y: 37, text: '0',    size:style.h2.size, style: style.h2}},
                {type:'text', name:'gain_1/2',  data:{x: 16.5, y: 8,  text: '1/2',  size:style.h2.size, style: style.h2}},
                {type:'text', name:'gain_1',    data:{x: 31,   y: 37, text: '1',    size:style.h2.size, style: style.h2}},
                {type:'dial_continuous',name:'dial_gain',data:{
                    x: 20, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},
            //attack dial
                {type:'text', name:'attack_gain', data:{x: 50,    y: 43, text: 'attack', size:style.h1.size, style: style.h1}},
                {type:'text', name:'attack_0',    data:{x: 47,    y: 37, text: '0',      size:style.h2.size, style: style.h2}},
                {type:'text', name:'attack_5',    data:{x: 58.75, y: 8,  text: '5',      size:style.h2.size, style: style.h2}},
                {type:'text', name:'attack_10',   data:{x: 71,    y: 37, text: '10',     size:style.h2.size, style: style.h2}},
                {type:'dial_continuous',name:'dial_attack',data:{
                    x: 60, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},
            //release dial
                {type:'text', name:'release_gain', data:{x: 89,    y: 43, text: 'release', style: style.h1}},
                {type:'text', name:'release_0',    data:{x: 87,    y: 37, text: '0',      size:style.h2.size, style: style.h2}},
                {type:'text', name:'release_5',    data:{x: 98.75, y: 8,  text: '5',      size:style.h2.size, style: style.h2}},
                {type:'text', name:'release_10',   data:{x: 111,   y: 37, text: '10',     size:style.h2.size, style: style.h2}},
                {type:'dial_continuous',name:'dial_release',data:{
                    x: 100, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},
            //detune dial
                {type:'text', name:'detune_gain', data:{x: 131,    y: 43, text: 'detune', style: style.h1}},
                {type:'text', name:'detune_-100', data:{x: 122,    y: 37, text: '-100',   style: style.h2}},
                {type:'text', name:'detune_0',    data:{x: 138.75, y: 8,  text: '0',      style: style.h2}},
                {type:'text', name:'detune_100',  data:{x: 148,    y: 37, text: '100',    style: style.h2}},
                {type:'dial_continuous',name:'dial_detune',data:{
                    x: 140, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, value:0.5, resetValue:0.5,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},
            //octave dial
                {type:'text', name:'octave_gain', data:{x: 170,    y: 43, text: 'octave', style: style.h1}},
                {type:'text', name:'octave_-3',   data:{x: 165,    y: 35, text: '-3',     style: style.h2}},
                {type:'text', name:'octave_-2',   data:{x: 161,    y: 24, text: '-2',     style: style.h2}},
                {type:'text', name:'octave_-1',   data:{x: 165,    y: 13, text: '-1',     style: style.h2}},
                {type:'text', name:'octave_0',    data:{x: 178.75, y: 8,  text: '0',      style: style.h2}},
                {type:'text', name:'octave_1',    data:{x: 190,    y: 13, text: '1',      style: style.h2}},
                {type:'text', name:'octave_2',    data:{x: 195,    y: 24, text: '2',      style: style.h2}},
                {type:'text', name:'octave_3',    data:{x: 190,    y: 35, text: '3',      style: style.h2}},
                {type:'dial_discrete',name:'dial_octave',data:{
                    x: 180, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, optionCount: 7, value:3,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},
            //waveType dial
                {type:'text', name:'waveType_gain', data:{x: 214, y: 43, text: 'wave', style: style.h1}},
                {type:'text', name:'waveType_sin',  data:{x: 202, y: 35, text: 'sin',  style: style.h2}},
                {type:'text', name:'waveType_tri',  data:{x: 199, y: 21, text: 'tri',  style: style.h2}},
                {type:'text', name:'waveType_squ',  data:{x: 210, y: 9,  text: 'squ',  style: style.h2}},
                {type:'text', name:'waveType_saw',  data:{x: 227, y: 10, text: 'saw',  style: style.h2}},
                {type:'rectangle', name:'periodicWaveType', data:{
                    x: 230, y: 21.75, angle: 0,
                    width: 10, height: 2.5,
                    style:style.dial.slot,
                }},
                {type:'dial_discrete',name:'dial_waveType',data:{
                    x: 220, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: (5*Math.PI)/4,  optionCount: 5,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},
            //gainWobblePeriod dial
                {type:'text', name:'gainWobble', data:{x: 13, y: 70, angle: -Math.PI/2,text: 'gain', style: style.h2}}, 
                {type:'text', name:'gainWobblePeriod_gain', data:{x: 23,   y: 84,      text: 'rate', style: style.h1}},
                {type:'text', name:'gainWobblePeriod_0',    data:{x: 17,   y: 79,      text: '0',    style: style.h2}},
                {type:'text', name:'gainWobblePeriod_50',   data:{x: 27.5, y: 50,      text: '50',   style: style.h2}},
                {type:'text', name:'gainWobblePeriod_100',  data:{x: 41,   y: 79,      text: '100',  style: style.h2}},
                {type:'dial_continuous', name:'dial_gainWobblePeriod',data:{
                    x: 30, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},
            //gainWobbleDepth dial
                {type:'text', name:'gainWobbleDepth_gain', data:{x: 57, y: 84, text: 'depth', style: style.h1}},
                {type:'text', name:'gainWobbleDepth_0',    data:{x: 52, y: 79, text: '0',     style: style.h2}},
                {type:'text', name:'gainWobbleDepth_50',   data:{x: 61, y: 50, text: '1/2',   style: style.h2}},
                {type:'text', name:'gainWobbleDepth_100',  data:{x: 76, y: 79, text: '1',     style: style.h2}},
                {type:'dial_continuous',name:'dial_gainWobbleDepth',data:{
                    x: 65, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},
            //detuneWobblePeriod dial
                {type:'text', name:'detuneWobble', data:{x: 98, y: 70, angle: -Math.PI/2, text: 'detune', style: style.h2}},    
                {type:'text', name:'detuneWobblePeriod_gain', data:{x: 108,   y: 84,      text: 'rate',   style: style.h1}},
                {type:'text', name:'detuneWobblePeriod_0',    data:{x: 101,   y: 79,      text: '0',      style: style.h2}},
                {type:'text', name:'detuneWobblePeriod_50',   data:{x: 111.5, y: 50,      text: '50',     style: style.h2}},
                {type:'text', name:'detuneWobblePeriod_100',  data:{x: 125,   y: 79,      text: '100',    style: style.h2}},
                {type:'dial_continuous',name:'dial_detuneWobblePeriod',data:{
                    x: 114, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},
            //detuneWobbleDepth dial
                {type:'text', name:'detuneWobbleDepth_gain', data:{x: 141,   y: 84, text: 'depth', style: style.h1}},
                {type:'text', name:'detuneWobbleDepth_0',    data:{x: 136,   y: 79, text: '0',     style: style.h2}},
                {type:'text', name:'detuneWobbleDepth_50',   data:{x: 145.5, y: 50, text: '1/2',   style: style.h2}},
                {type:'text', name:'detuneWobbleDepth_100',  data:{x: 160,   y: 79, text: '1',     style: style.h2}},
                {type:'dial_continuous',name:'dial_detuneWobbleDepth',data:{
                    x: 149, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
                }},

            {type:'button_rect', name:'panicButton', data: {
                x:197.5, y: 47.5, width:20, height:20, angle: Math.PI/4,
                style:style.button, 
            }},
        ]
    };

    //main object
        var object = interfaceUnit.builder(this.basicSynthesizer,design);

    //import/export
        object.exportData = function(){
            return {
                gain: object.elements.dial_continuous.dial_gain.get(),
                attack: object.elements.dial_continuous.dial_attack.get()*10,
                release: object.elements.dial_continuous.dial_release.get()*10,
                detune: 100*((object.elements.dial_continuous.dial_detune.get()*2)-1),
                octave: object.elements.dial_discrete.dial_octave.get()-3,
                waveType: ['sine','triangle','square','sawtooth','custom'][object.elements.dial_discrete.dial_waveType.get()],
                gainWobble:{
                    rate: object.elements.dial_continuous.dial_gainWobblePeriod.get()*100,
                    depth: object.elements.dial_continuous.dial_gainWobbleDepth.get()
                },
                detuneWobble:{
                    rate: object.elements.dial_continuous.dial_detuneWobblePeriod.get()*100,
                    depth: object.elements.dial_continuous.dial_detuneWobbleDepth.get()
                },
            };
        };
        object.importData = function(data){
            if(data == undefined){return;}

            object.elements.dial_continuous.dial_gain.set(data.gain);
            object.elements.dial_continuous.dial_attack.set(data.attack/10);
            object.elements.dial_continuous.dial_release.set(data.release/10);
            object.elements.dial_continuous.dial_detune.set( (1+(data.detune/100))/2 );
            object.elements.dial_discrete.dial_octave.set(data.octave+3);
            object.elements.dial_discrete.dial_waveType.set( ['sine','triangle','square','sawtooth','custom'].indexOf(data.waveType) );
            object.elements.dial_continuous.dial_gainWobblePeriod.set(data.gainWobble.rate/100);
            object.elements.dial_continuous.dial_gainWobbleDepth.set(data.gainWobble.depth);
            object.elements.dial_continuous.dial_detuneWobblePeriod.set(data.detuneWobble.rate/100);
            object.elements.dial_continuous.dial_detuneWobbleDepth.set(data.detuneWobble.depth);
        };

    //circuitry
        object.__synthesizer = new interface.circuit.alpha.synthesizer(workspace.library.audio.context);
        object.__synthesizer.out().connect( object.elements.connectionNode_audio.audioOut.in() );

    //wiring
        object.elements.dial_continuous.dial_gain.onchange = function(value){ object.__synthesizer.gain( value ); };
        object.elements.dial_continuous.dial_attack.onchange = function(value){ object.__synthesizer.attack( value ); }
        object.elements.dial_continuous.dial_release.onchange = function(value){ object.__synthesizer.release( value ); }
        object.elements.dial_continuous.dial_detune.onchange = function(value){ object.__synthesizer.detune( value*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min ); }
        object.elements.dial_discrete.dial_octave.onchange = function(value){ object.__synthesizer.octave(value-3); }
        object.elements.dial_discrete.dial_waveType.onchange = function(value){ object.__synthesizer.waveType(['sine','triangle','square','sawtooth','custom'][value]); }
        object.elements.dial_continuous.dial_gainWobblePeriod.onchange = function(value){ object.__synthesizer.gainWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
        object.elements.dial_continuous.dial_gainWobbleDepth.onchange = function(value){ object.__synthesizer.gainWobbleDepth(value); },
        object.elements.dial_continuous.dial_detuneWobblePeriod.onchange = function(value){ object.__synthesizer.detuneWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
        object.elements.dial_continuous.dial_detuneWobbleDepth.onchange = function(value){ object.__synthesizer.detuneWobbleDepth(value*100); }
        object.elements.button_rect.panicButton.onpress = function(){ object.__synthesizer.panic(); },

    //interface
        object.i = {
            gain:function(value){object.elements.dial_continuous.dial_gain.set(value);},
            attack:function(value){object.elements.dial_continuous.dial_attack.set(value);},
            release:function(value){object.elements.dial_continuous.dial_release.set(value);},
            detune:function(value){object.elements.dial_continuous.dial_detune.set(value);},
            octave:function(value){object.elements.dial_discrete.dial_octave.set(value);},
            waveType:function(value){object.elements.dial_discrete.dial_waveType.set(value);},
            periodicWave:function(data){object.__synthesizer.periodicWave(data);},
            midiNote:function(data){object.__synthesizer.perform(data);},
            gainWobblePeriod:function(value){object.elements.dial_continuous.dial_gainWobblePeriod.set(value);},
            gainWobbleDepth:function(value){object.elements.dial_continuous.dial_gainWobbleDepth.set(value);},
            detuneWobblePeriod:function(value){object.elements.dial_continuous.dial_detuneWobblePeriod.set(value);},
            detuneWobbleDepth:function(value){object.elements.dial_continuous.dial_detuneWobbleDepth.set(value);},
        };

    //setup
        object.elements.dial_continuous.dial_gain.set(0.5);
        object.elements.dial_continuous.dial_detune.set(0.5);
        object.elements.dial_discrete.dial_octave.set(3);

    return object;
};

this.basicSynthesizer.metadata = {
    name:'Basic Synthesizer',
    helpURL:'https://metasophiea.com/curve/help/units/alpha/basicSynthesizer/'
};