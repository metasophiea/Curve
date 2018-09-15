this.distortionUnit = function(x,y){
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        h1: 'fill:rgba(0,0,0,1); font-size:6px; font-family:Courier New;',
        h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',

        dial:{
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)',
            arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
        }
    };
    var design = {
        type: 'distortionUnit',
        x: x, y: y,
        base: {
            points:[
                { x:0,           y:10     },
                { x:10,          y:0      },
                { x:102.5/3,     y:0      },
                { x:102.5*0.45,  y:10     },
                { x:102.5*0.55,  y:10     },
                { x:2*(102.5/3), y:0      },
                { x:102.5-10,    y:0      },
                { x:102.5,       y:10     },
                { x:102.5,       y:95-10  },
                { x:102.5-10,    y:95     },
                { x:2*(102.5/3), y:95     },
                { x:102.5*0.55,  y:95-10  },
                { x:102.5*0.45,  y:95-10  },
                { x:102.5/3,     y:95     },
                { x:10,          y:95     },
                { x:0,           y:95-10  }
            ], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'audioIn', data: { type: 0, x: 102.5, y: 61.5, width: 10, height: 20 }},
            {type:'connectionNode_audio', name:'audioOut', data:{ type: 1, x: -10, y: 61.5, width: 10, height: 20 }},
        
            {type:'label', name:'outGain_title', data:{x:17.5, y:91,   text:'out', style:style.h1}},
            {type:'label', name:'outGain_0',     data:{x:9.5,  y:85.5, text:'0',   style:style.h2}},
            {type:'label', name:'outGain_1/2',   data:{x:19,   y:57,   text:'1/2', style:style.h2}},
            {type:'label', name:'outGain_1',     data:{x:33,   y:85.5, text:'1',   style:style.h2}},
            {type:'dial_continuous',name:'outGain',data:{
                x: 22.5, y: 72.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(value){obj.distortionCircuit.outGain(value);},
            }},

            {type:'label', name:'distortionAmount_title', data:{x:15.5, y:41.5, text:'dist', style:style.h1}},
            {type:'label', name:'distortionAmount_0',     data:{x:9.5,  y:36,   text:'0',    style:style.h2}},
            {type:'label', name:'distortionAmount_50',    data:{x:20,   y:7.5,  text:'50',   style:style.h2}},
            {type:'label', name:'distortionAmount_100',   data:{x:33,   y:36,   text:'100',  style:style.h2}},
            {type:'dial_continuous',name:'distortionAmount',data:{
                x: 22.5, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(value){obj.distortionCircuit.distortionAmount(value*100);},
            }},

            {type:'label', name:'resolution_title', data:{x:47, y:66, text:'res',  style:style.h1}},
            {type:'label', name:'resolution_2',     data:{x:39, y:60, text:'2',    style:style.h2}},
            {type:'label', name:'resolution_50',    data:{x:49, y:32, text:'500',  style:style.h2}},
            {type:'label', name:'resolution_100',   data:{x:63, y:60, text:'1000', style:style.h2}},
            {type:'dial_continuous',name:'resolution',data:{
                x: 52.5, y: 47.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(value){obj.distortionCircuit.resolution(Math.round(value*1000));},
            }},
            {type:'label', name:'overSample_title', data:{x:67,   y:41.5, text:'overSamp', style:style.h1}},
            {type:'label', name:'overSample_0',     data:{x:61,   y:12,   text:'none',     style:style.h2}},
            {type:'label', name:'overSample_50',    data:{x:77.5, y:7.5,  text:'2x',       style:style.h2}},
            {type:'label', name:'overSample_100',   data:{x:90.5, y:12,   text:'4x',       style:style.h2}},
            {type:'dial_discrete',name:'overSample',data:{
                x: 80, y: 23, r: 12, startAngle: (1.25*Math.PI), maxAngle: 0.5*Math.PI, arcDistance: 1.35, optionCount: 3,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                onchange:function(value){obj.distortionCircuit.oversample(['none','2x','4x'][value]);},
            }},
            {type:'label', name:'inGain_title', data:{x:76,   y:91,   text:'in', style:style.h1}},
            {type:'label', name:'inGain_0',     data:{x:67,   y:85.5, text:'0',   style:style.h2}},
            {type:'label', name:'inGain_1/2',   data:{x:76.5, y:57,   text:'1/2', style:style.h2}},
            {type:'label', name:'inGain_1',     data:{x:90.5, y:85.5, text:'1',   style:style.h2}},
            {type:'dial_continuous',name:'inGain',data:{
                x: 80, y: 72.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(value){obj.distortionCircuit.inGain(2*value);},
            }},
        ]
    };

    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.distortionUnit,design);

    //import/export
        obj.importData = function(data){
            design.dial_continuous.outGain.set(data.outGain);
            design.dial_continuous.distortionAmount.set(data.distortionAmount);
            design.dial_continuous.resolution.set(data.resolution);
            design.dial_discrete.overSample.select(data.overSample);
            design.dial_continuous.inGain.set(data.inGain);
        };
        obj.exportData = function(){
            return {
                outGain:design.dial_continuous.outGain.get(), 
                distortionAmount:design.dial_continuous.distortionAmount.get(), 
                resolution:design.dial_continuous.resolution.get(), 
                overSample:design.dial_discrete.overSample.select(), 
                inGain:design.dial_continuous.inGain.get()
            };
        };

    //circuitry
        //distortion
            obj.distortionCircuit = new parts.circuits.audio.distortionUnit(__globals.audio.context);
            design.connectionNode_audio.audioIn.out().connect( obj.distortionCircuit.in() );
            obj.distortionCircuit.out().connect( design.connectionNode_audio.audioOut.in() );

    //setup
        design.dial_continuous.resolution.set(0.5);
        design.dial_continuous.inGain.set(0.5);
        design.dial_continuous.outGain.set(1);

    return obj;
};

this.distortionUnit.metadata = {
    name:'Distortion Unit',
    helpurl:'https://metasophiea.com/curve/help/object/distortionUnit/'
};