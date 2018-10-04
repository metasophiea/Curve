this.basicMixer = function(x,y){
    var style = {
        background:'fill:rgba(200,200,200,1);pointer-events:none;',
        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
        h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
        h2: 'fill:rgb(150,150,150); font-size:4px; font-family:Courier New;',

        dial:{
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)',
            outerArc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
        }
    };
    var design = {
        type:'basicMixer',
        x:x, y:y,
        base:{
            points:[{x:0,y:0},{x:100,y:0},{x:100,y:207.5},{x:0,y:207.5}],
            style:'fill:rgba(200,200,200,0);'
        },
        elements:[
            {type:'connectionNode_audio', name:'input_0', data:{ type:0, x:90, y:10+0,   width:20, height:20 }},
            {type:'connectionNode_audio', name:'input_1', data:{ type:0, x:90, y:10+25,  width:20, height:20 }},
            {type:'connectionNode_audio', name:'input_2', data:{ type:0, x:90, y:10+50,  width:20, height:20 }},
            {type:'connectionNode_audio', name:'input_3', data:{ type:0, x:90, y:10+75,  width:20, height:20 }},
            {type:'connectionNode_audio', name:'input_4', data:{ type:0, x:90, y:10+100, width:20, height:20 }},
            {type:'connectionNode_audio', name:'input_5', data:{ type:0, x:90, y:10+125, width:20, height:20 }},
            {type:'connectionNode_audio', name:'input_6', data:{ type:0, x:90, y:10+150, width:20, height:20 }},
            {type:'connectionNode_audio', name:'input_7', data:{ type:0, x:90, y:10+175, width:20, height:20 }},

            {type:'connectionNode_audio', name:'output_0', data:{ type:1, x:-10, y:5, width:20, height:20 }},
            {type:'connectionNode_audio', name:'output_1', data:{ type:1, x:-10, y:30, width:20, height:20 }},

            {type:'path', name:'backing', data:{
                path:[{x:0,y:0},{x:100,y:0},{x:100,y:207.5},{x:0,y:207.5}],
                style:style.background
            }},

            {type:'text', name:'gain', data:{x:80, y:6.5, text: 'gain', style: style.h2}},
            {type:'text', name:'pan', data:{x:56.5, y:6.5, text: 'pan', style: style.h2}},

            {type:'rect', name:'vertical', data:{ x:22.5, y:6, width:2, height:190, style:style.markings }},
            {type:'rect', name:'overTheTop', data:{ x:10, y:6, width:14, height:2, style:style.markings }},
            {type:'rect', name:'down', data:{ x:10, y:6, width:2, height:35, style:style.markings }},
            {type:'rect', name:'inTo0', data:{ x:2, y:14, width:10, height:2, style:style.markings }},
            {type:'rect', name:'inTo1', data:{ x:2, y:39, width:10, height:2, style:style.markings }},
        ]
    };
    //dynamic design
    for(var a = 0; a < 8; a++){
        design.elements.push(
            {type:'rect', name:'line_'+a, data:{
                x:23, y:19.1+a*25, width:75, height:2, 
                style:style.markings,
            }}
        );

        design.elements.push(
            {type:'dial_continuous',name:'gain_'+a,data:{
                x:85, y:20+a*25, r: 8, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                onchange:function(a){
                    return function(value){
                        obj['splitter_'+a].inGain(value);
                    }
                }(a)
            }}
        );
        design.elements.push(
            {type:'dial_continuous',name:'pan_'+a,data:{
                x:60, y:20+a*25, r: 8, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                onchange:function(a){
                    return function(value){
                        obj['splitter_'+a].outGain(0,value);
                        obj['splitter_'+a].outGain(1,1-value);
                    }
                }(a)
            }}
        );
    }

    //main object
        var obj = system.utility.misc.objectBuilder(objects.basicMixer,design);

    //internal circuitry
        for(var a = 0; a < 8; a++){
            obj['splitter_'+a] = new parts.circuits.audio.channelMultiplier(system.audio.context,2);
            design.connectionNode_audio['input_'+a].out().connect(obj['splitter_'+a].in());
            obj['splitter_'+a].out(0).connect( design.connectionNode_audio['output_0'].in() );
            obj['splitter_'+a].out(1).connect( design.connectionNode_audio['output_1'].in() );
        }

    //interface
        obj.i = {
            gain:function(track,value){design.dial_continuous['gain_'+track].set(value);},
            pan:function(track,value){design.dial_continuous['pan_'+track].set(value);},
        };

    //setup
        for(var a = 0; a < 8; a++){
            obj.i.gain(a,0.5);
            obj.i.pan(a,0.5);
        }
    
    return obj;
};

this.basicMixer.metadata = {
    name:'Basic Audio Mixer',
    helpurl:'https://metasophiea.com/curve/help/objects/basicAudioMixer/'
};