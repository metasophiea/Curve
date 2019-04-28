this.basicSynthesizer_img = function(x,y,angle){
    var attributes = {
        detuneLimits: {min:-100, max:100}
    };
    var style = {
        background:'/images/units/alpha/basicSynthesizer_2.png',

        dial:{
            handle:'/images/units/alpha/basicSynthesizer_2_dial_handle.png',
            slot:'/images/units/alpha/basicSynthesizer_2_dial_slot.png',
            needle:'/images/units/alpha/basicSynthesizer_2_dial_needle.png',
        },
        button:{
            background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:150/255,b:150/255,a:1},
        }
    };
    var design = {
        name:'basicSynthesizer_img',
        category:'synthesizers',
        collection: 'alpha',
        x:x, y:y, angle:angle,
        space:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90},{x:0,y:0}], 
        // spaceOutline: true,
        elements:[
            {type:'image', name:'imgBacking', data:{ x:0, y:0, width:240, height:90, url:style.background, points:[{x:0,y:0},{x:1,y:0},{x:1,y:4/9},{x:19/24,y:1},{x:0,y:1}] } },

            {type:'connectionNode_audio', name:'audioOut', data: {
                type: 1, x: -15, y: 5, width: 15, height: 30, isAudioOutput:true 
            }},
            {type:'connectionNode_data', name:'port_gain', data:{
                x: 12.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    switch(address){
                        case '%': object.elements.dial_continuous_image.gain.set(data); break;
                        case '%t': 
                            object.__synthesizer.gain(data.target,data.time,data.curve);
                            object.elements.dial_continuous_image.gain.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }
            }},
            {type:'connectionNode_data', name:'port_attack', data:{
                x: 52.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous_image.attack.set(data);
                } 
            }},
            {type:'connectionNode_data', name:'port_release', data:{
                x: 92.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous_image.release.set(data);
                } 
            }},
            {type:'connectionNode_data', name:'port_detune', data:{
                x: 132.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){ 
                    switch(address){
                        case '%': object.elements.dial_continuous_image.detune.set(data); break;
                        case '%t': 
                            object.__synthesizer.detune((data.target*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min),data.time,data.curve);
                            object.elements.dial_continuous_image.detune.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }
            }},
            {type:'connectionNode_data', name:'port_octave', data:{
                x: 170.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != 'discrete'){return;}
                    object.elements.dial_discrete_image.octave.select(data);
                } 
            }},
            {type:'connectionNode_data', name:'port_waveType', data:{
                x: 210.5, y: -7.5, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != 'discrete'){return;}
                    object.elements.dial_discrete_image.waveType.select(data);
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
                    object.elements.dial_continuous_image.gainWobblePeriod.set(data);
                }
            }},
            {type:'connectionNode_data', name:'port_gainWobbleDepth', data:{
                x: 57.5, y: 90, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous_image.gainWobbleDepth.set(data);
                }
            }},
            {type:'connectionNode_data', name:'port_detuneWobblePeriod', data:{
                x: 107.5, y: 90, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous_image.detuneWobblePeriod.set(data);
                }
            }},
            {type:'connectionNode_data', name:'port_detuneWobbleDepth', data:{
                x: 142.5, y: 90, width: 15, height: 7.5,
                onreceive: function(address,data){
                    if(address != '%'){return;}
                    object.elements.dial_continuous_image.detuneWobbleDepth.set(data);
                }
            }},

            //gain dial
                {type:'dial_continuous_image',name:'dial_gain',data:{
                    x: 20, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},
            //attack dial
                {type:'dial_continuous_image',name:'dial_attack',data:{
                    x: 60, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},
            //release dial
                {type:'dial_continuous_image',name:'dial_release',data:{
                    x: 100, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},
            //detune dial
                {type:'dial_continuous_image',name:'dial_detune',data:{
                    x: 140, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, value:0.5, resetValue:0.5,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},
            //octave dial
                {type:'dial_discrete_image',name:'dial_octave',data:{
                    x: 180, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, optionCount: 7, value:3,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},
            //waveType dial
                {type:'dial_discrete_image',name:'dial_waveType',data:{
                    x: 220, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: (5*Math.PI)/4, optionCount: 5,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},
            //gainWobblePeriod dial
                {type:'dial_continuous_image', name:'dial_gainWobblePeriod',data:{
                    x: 30, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},
            //gainWobbleDepth dial
                {type:'dial_continuous_image',name:'dial_gainWobbleDepth',data:{
                    x: 65, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},
            //detuneWobblePeriod dial
                {type:'dial_continuous_image',name:'dial_detuneWobblePeriod',data:{
                    x: 114, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},
            //detuneWobbleDepth dial
                {type:'dial_continuous_image',name:'dial_detuneWobbleDepth',data:{
                    x: 149, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    handleURL:style.dial.handle, slotURL:style.dial.slot, needleURL:style.dial.needle,
                }},

            {type:'button_rectangle', name:'panicButton', data: {
                x:197.5, y: 47.5, width:20, height:20, angle: Math.PI/4,
                style:style.button, 
            }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.basicSynthesizer_img,design);

    //import/export
        object.exportData = function(){
            return {
                gain: object.elements.dial_continuous_image.dial_gain.get(),
                attack: object.elements.dial_continuous_image.dial_attack.get()*10,
                release: object.elements.dial_continuous_image.dial_release.get()*10,
                detune: 100*((object.elements.dial_continuous_image.dial_detune.get()*2)-1),
                octave: object.elements.dial_discrete_image.dial_octave.get()-3,
                waveType: ['sine','triangle','square','sawtooth','custom'][object.elements.dial_discrete_image.dial_waveType.get()],
                gainWobble:{
                    rate: object.elements.dial_continuous_image.dial_gainWobblePeriod.get()*100,
                    depth: object.elements.dial_continuous_image.dial_gainWobbleDepth.get()
                },
                detuneWobble:{
                    rate: object.elements.dial_continuous_image.dial_detuneWobblePeriod.get()*100,
                    depth: object.elements.dial_continuous_image.dial_detuneWobbleDepth.get()
                },
            };
        };
        object.importData = function(data){
            if(data == undefined){return;}

            object.elements.dial_continuous_image.dial_gain.set(data.gain);
            object.elements.dial_continuous_image.dial_attack.set(data.attack/10);
            object.elements.dial_continuous_image.dial_release.set(data.release/10);
            object.elements.dial_continuous_image.dial_detune.set( (1+(data.detune/100))/2 );
            object.elements.dial_discrete_image.dial_octave.set(data.octave+3);
            object.elements.dial_discrete_image.dial_waveType.set( ['sine','triangle','square','sawtooth','custom'].indexOf(data.waveType) );
            object.elements.dial_continuous_image.dial_gainWobblePeriod.set(data.gainWobble.rate/100);
            object.elements.dial_continuous_image.dial_gainWobbleDepth.set(data.gainWobble.depth);
            object.elements.dial_continuous_image.dial_detuneWobblePeriod.set(data.detuneWobble.rate/100);
            object.elements.dial_continuous_image.dial_detuneWobbleDepth.set(data.detuneWobble.depth);
        };

    //circuitry
        object.__synthesizer = new _canvas_.interface.circuit.synthesizer(_canvas_.library.audio.context);
        object.__synthesizer.out().connect( object.elements.connectionNode_audio.audioOut.in() );

    //wiring
        object.elements.dial_continuous_image.dial_gain.onchange = function(value){ object.__synthesizer.gain( value ); };
        object.elements.dial_continuous_image.dial_attack.onchange = function(value){ object.__synthesizer.attack( value ); }
        object.elements.dial_continuous_image.dial_release.onchange = function(value){ object.__synthesizer.release( value ); }
        object.elements.dial_continuous_image.dial_detune.onchange = function(value){ object.__synthesizer.detune( value*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min ); }
        object.elements.dial_discrete_image.dial_octave.onchange = function(value){ object.__synthesizer.octave(value-3); }
        object.elements.dial_discrete_image.dial_waveType.onchange = function(value){ object.__synthesizer.waveType(['sine','triangle','square','sawtooth','custom'][value]); }
        object.elements.dial_continuous_image.dial_gainWobblePeriod.onchange = function(value){ object.__synthesizer.gainWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
        object.elements.dial_continuous_image.dial_gainWobbleDepth.onchange = function(value){ object.__synthesizer.gainWobbleDepth(value); },
        object.elements.dial_continuous_image.dial_detuneWobblePeriod.onchange = function(value){ object.__synthesizer.detuneWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
        object.elements.dial_continuous_image.dial_detuneWobbleDepth.onchange = function(value){ object.__synthesizer.detuneWobbleDepth(value*100); }
        object.elements.button_rectangle.panicButton.onpress = function(){ object.__synthesizer.panic(); },

    //interface
        object.i = {
            gain:function(value){object.elements.dial_continuous_image.dial_gain.set(value);},
            attack:function(value){object.elements.dial_continuous_image.dial_attack.set(value);},
            release:function(value){object.elements.dial_continuous_image.dial_release.set(value);},
            detune:function(value){object.elements.dial_continuous_image.dial_detune.set(value);},
            octave:function(value){object.elements.dial_discrete_image.dial_octave.set(value);},
            waveType:function(value){object.elements.dial_discrete_image.dial_waveType.set(value);},
            periodicWave:function(data){object.__synthesizer.periodicWave(data);},
            midiNote:function(data){object.__synthesizer.perform(data);},
            gainWobblePeriod:function(value){object.elements.dial_continuous_image.dial_gainWobblePeriod.set(value);},
            gainWobbleDepth:function(value){object.elements.dial_continuous_image.dial_gainWobbleDepth.set(value);},
            detuneWobblePeriod:function(value){object.elements.dial_continuous_image.dial_detuneWobblePeriod.set(value);},
            detuneWobbleDepth:function(value){object.elements.dial_continuous_image.dial_detuneWobbleDepth.set(value);},
        };

    //setup
        object.elements.dial_continuous_image.dial_gain.set(0.5);
        object.elements.dial_continuous_image.dial_detune.set(0.5);
        object.elements.dial_discrete_image.dial_octave.set(3);

    return object;
};

this.basicSynthesizer_img.metadata = {
    name:'Basic Synthesizer With Image',
    dev:true,
    category:'synthesizer',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/basicSynthesizer_img/'
};