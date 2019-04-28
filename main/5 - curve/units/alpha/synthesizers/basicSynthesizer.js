this.basicSynthesizer = function(x,y,a){
    var attributes = {
        detuneLimits: {min:-100, max:100}
    };
    var style = { //regular
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3.5, ratio:1, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:1.75, ratio:1.5, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},


        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        },
        button:{
            background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:150/255,b:150/255,a:1},
        }
    };
    // var style = { //tron-like
    //     background:{
    //         fill:'rgba(200,200,200,0)',
    //         stroke:'rgba(255,255,255,1)',
    //         lineWidth:2,
    //         lineJoin:'miter',
    //     },
    //     h1:{fill:'rgba(255,255,255,1)', font:'4pt defaultThin'},
    //     h2:{fill:'rgba(255,255,255,1)', font:'3pt defaultThin'},

    //     dial:{
    //         handle:{
    //             fill:'rgba(220,220,220,0)',
    //             stroke:'rgba(255,255,255,1)',
    //         },
    //         slot:{fill:'rgba(50,50,50,0)'},
    //         needle:{fill:'rgba(250,255,255,1)'},
    //     },
    //     button:{
    //         background__up__fill:'rgba(0,0,0,0)',
    //         background__hover__fill:'rgba(255,255,255,1)',
    //         background__hover_press__fill:'rgba(255,0,0,1)',

    //         background__up__stroke:'rgba(255,255,255,1)', 
    //         background__hover__stroke:'rgba(255,255,255,1)', 
    //         background__hover_press__stroke:'rgba(255,255,255,1)',
    //     }
    // };


    var design = {
        name:'basicSynthesizer',
        category:'synthesizers',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90},{x:0,y:0}], 
        // spaceOutline: true,
        elements:[
            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90},{x:0,y:0}], colour:style.background }},

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
                {type:'text', name:'gain_gain', data:{x: 20, y: 40, text: 'gain', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'gain_0',    data:{x: 9,  y: 35, text: '0',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'gain_1/2',  data:{x: 20, y: 7,  text: '1/2',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'gain_1',    data:{x: 32, y: 35, text: '1',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'dial_continuous',name:'dial_gain',data:{
                    x: 20, y: 23, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},
            //attack dial
                {type:'text', name:'attack_gain', data:{x: 60, y: 40, text: 'attack', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'attack_0',    data:{x: 49, y: 35, text: '0',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'attack_5',    data:{x: 60, y: 7,  text: '5',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'attack_10',   data:{x: 73, y: 35, text: '10',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'dial_continuous',name:'dial_attack',data:{
                    x: 60, y: 23, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},
            //release dial
                {type:'text', name:'release_gain', data:{x: 100, y: 40, text: 'release', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'release_0',    data:{x: 89,  y: 35, text: '0',       width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'release_5',    data:{x: 100, y: 7,  text: '5',       width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'release_10',   data:{x: 113, y: 35, text: '10',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'dial_continuous',name:'dial_release',data:{
                    x: 100, y: 23, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},
            //detune dial
                {type:'text', name:'detune_gain', data:{x: 140, y: 40, text: 'detune', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'detune_-100', data:{x: 126, y: 35, text: '-100',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'detune_0',    data:{x: 140, y: 7,  text: '0',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'detune_100',  data:{x: 153, y: 35, text: '100',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'dial_continuous',name:'dial_detune',data:{
                    x: 140, y: 23, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, value:0.5, resetValue:0.5,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},
            //octave dial
                {type:'text', name:'octave_gain', data:{x: 180, y: 40, text: 'octave', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'octave_-3',   data:{x: 168, y: 35, text: '-3',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'octave_-2',   data:{x: 163, y: 24, text: '-2',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'octave_-1',   data:{x: 169, y: 11, text: '-1',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'octave_0',    data:{x: 180, y: 7,  text: '0',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'octave_1',    data:{x: 191, y: 11, text: '1',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'octave_2',    data:{x: 196, y: 24, text: '2',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'octave_3',    data:{x: 191, y: 35, text: '3',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'dial_discrete',name:'dial_octave',data:{
                    x: 180, y: 23, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, optionCount: 7, value:3,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},
            //waveType dial
                {type:'text', name:'waveType_gain', data:{x: 220, y: 40, text: 'wave', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'waveType_sin',  data:{x: 207, y: 35, text: 'sin',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'waveType_tri',  data:{x: 203, y: 19, text: 'tri',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'waveType_squ',  data:{x: 213, y: 7,  text: 'squ',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'waveType_saw',  data:{x: 231, y: 9,  text: 'saw',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'rectangle', name:'periodicWaveType', data:{
                    x: 232, y: 21.75, angle: 0, radius: 12, 
                    width: 8, height: 2.5,
                    colour:style.h1.colour,
                }},
                {type:'dial_discrete',name:'dial_waveType',data:{
                    x: 220, y: 23, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: (5*Math.PI)/4,  optionCount: 5,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},
            //gainWobblePeriod dial
                {type:'text', name:'gainWobble', data:{x: 8, y: 65, angle: -Math.PI/2, text: 'gain', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}}, 
                {type:'text', name:'gainWobblePeriod_gain', data:{x: 30, y: 82, text: 'rate', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'gainWobblePeriod_0',    data:{x: 19, y: 77, text: '0',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'gainWobblePeriod_50',   data:{x: 30, y: 49, text: '50',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'gainWobblePeriod_100',  data:{x: 42, y: 77, text: '100',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'dial_continuous', name:'dial_gainWobblePeriod',data:{
                    x: 30, y: 65, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},
            //gainWobbleDepth dial
                {type:'text', name:'gainWobbleDepth_gain', data:{x: 65, y: 82, text: 'depth', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'gainWobbleDepth_0',    data:{x: 54, y: 77, text: '0',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'gainWobbleDepth_50',   data:{x: 65, y: 49, text: '1/2',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'gainWobbleDepth_100',  data:{x: 77, y: 77, text: '1',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'dial_continuous',name:'dial_gainWobbleDepth',data:{
                    x: 65, y: 65, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},
            //detuneWobblePeriod dial
                {type:'text', name:'detuneWobble', data:{x: 93, y: 65, angle: -Math.PI/2, text: 'detune', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},    
                {type:'text', name:'detuneWobblePeriod_gain', data:{x: 114, y: 82, text: 'rate',   width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'detuneWobblePeriod_0',    data:{x: 103, y: 77, text: '0',      width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'detuneWobblePeriod_50',   data:{x: 114, y: 49, text: '50',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'detuneWobblePeriod_100',  data:{x: 126, y: 77, text: '100',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'dial_continuous',name:'dial_detuneWobblePeriod',data:{
                    x: 114, y: 65, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},
            //detuneWobbleDepth dial
                {type:'text', name:'detuneWobbleDepth_gain', data:{x: 149, y: 82, text: 'depth', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
                {type:'text', name:'detuneWobbleDepth_0',    data:{x: 138, y: 77, text: '0',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'detuneWobbleDepth_50',   data:{x: 149, y: 49, text: '1/2',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'text', name:'detuneWobbleDepth_100',  data:{x: 160, y: 77, text: '1',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                {type:'dial_continuous',name:'dial_detuneWobbleDepth',data:{
                    x: 149, y: 65, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                }},

            {type:'button_rectangle', name:'panicButton', data: {
                x:197.5, y: 47.5, width:20, height:20, angle: Math.PI/4,
                style:style.button,
            }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.basicSynthesizer,design);

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
        object.__synthesizer = new _canvas_.interface.circuit.synthesizer(_canvas_.library.audio.context);
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
        object.elements.button_rectangle.panicButton.onpress = function(){ object.__synthesizer.panic(); },

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
    category:'synthesizer',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/basicSynthesizer/'
};