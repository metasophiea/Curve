this.distortionUnit = function(x,y,a){
    var style = {
        background: {fill:'rgba(200,200,200,1)'},
        h1:{fill:'rgba(0,0,0,1)', font:'4pt Courier New'},
        h2:{fill:'rgba(0,0,0,1)', font:'3pt Courier New'},

        dial:{
            handle:{fill:'rgba(220,220,220,1)'},
            slot:{fill:'rgba(50,50,50,1)'},
            needle:{fill:'rgba(250,150,150,1)'},
        }
    };
    var design = {
        name: 'distortionUnit',
        category: 'audioEffectUnits',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[
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
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[
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
            ], style:style.background }},

            {type:'connectionNode_audio', name:'audioIn', data: { x: 102.5, y: 61.5, width: 10, height: 20 }},
            {type:'connectionNode_audio', name:'audioOut', data:{ x: -10, y: 61.5, width: 10, height: 20, isAudioOutput:true }},
        
            {type:'text', name:'outGain_title', data:{x:17.5, y:91,   text:'out', style:style.h1}},
            {type:'text', name:'outGain_0',     data:{x:9.5,  y:85.5, text:'0',   style:style.h2}},
            {type:'text', name:'outGain_1/2',   data:{x:19,   y:57,   text:'1/2', style:style.h2}},
            {type:'text', name:'outGain_1',     data:{x:33,   y:85.5, text:'1',   style:style.h2}},
            {type:'dial_continuous',name:'outGain_dial',data:{
                x: 22.5, y: 72.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},

            {type:'text', name:'distortionAmount_title', data:{x:16.5,   y:41.5, text:'dist', style:style.h1}},
            {type:'text', name:'distortionAmount_0',     data:{x:9.5,  y:36,   text:'0',    style:style.h2}},
            {type:'text', name:'distortionAmount_50',    data:{x:20,   y:7.5,  text:'50',   style:style.h2}},
            {type:'text', name:'distortionAmount_100',   data:{x:33,   y:36,   text:'100',  style:style.h2}},
            {type:'dial_continuous',name:'distortionAmount_dial',data:{
                x: 22.5, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},

            {type:'text', name:'resolution_title', data:{x:47, y:66, text:'res',  style:style.h1}},
            {type:'text', name:'resolution_2',     data:{x:39, y:60, text:'2',    style:style.h2}},
            {type:'text', name:'resolution_50',    data:{x:49, y:32, text:'500',  style:style.h2}},
            {type:'text', name:'resolution_100',   data:{x:63, y:60, text:'1000', style:style.h2}},
            {type:'dial_continuous',name:'resolution_dial',data:{
                x: 52.5, y: 47.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},

            {type:'text', name:'overSample_title', data:{x:67,   y:41.5, text:'overSamp', style:style.h1}},
            {type:'text', name:'overSample_0',     data:{x:61,   y:12,   text:'none',     style:style.h2}},
            {type:'text', name:'overSample_50',    data:{x:77.5, y:7.5,  text:'2x',       style:style.h2}},
            {type:'text', name:'overSample_100',   data:{x:90.5, y:12,   text:'4x',       style:style.h2}},
            {type:'dial_discrete',name:'overSample_dial',data:{
                x: 80, y: 23, r: 12, startAngle: (1.25*Math.PI), maxAngle: 0.5*Math.PI, arcDistance: 1.35, optionCount: 3,
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},

            {type:'text', name:'inGain_title', data:{x:76,   y:91,   text:'in', style:style.h1}},
            {type:'text', name:'inGain_0',     data:{x:67,   y:85.5, text:'0',   style:style.h2}},
            {type:'text', name:'inGain_1/2',   data:{x:76.5, y:57,   text:'1/2', style:style.h2}},
            {type:'text', name:'inGain_1',     data:{x:90.5, y:85.5, text:'1',   style:style.h2}},
            {type:'dial_continuous',name:'inGain_dial',data:{
                x: 80, y: 72.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},
        ]
    };

    //main object
        var object = alphaUnit.builder(this.distortionUnit,design);

    //import/export
        object.importData = function(data){
            object.elements.dial_continuous.outGain_dial.set(data.outGain);
            object.elements.dial_continuous.distortionAmount_dial.set(data.distortionAmount);
            object.elements.dial_continuous.resolution_dial.set(data.resolution);
            object.elements.dial_discrete.overSample_dial.set(data.overSample);
            object.elements.dial_continuous.inGain_dial.set(data.inGain);
        };
        object.exportData = function(){
            return {
                outGain:          object.elements.dial_continuous.outGain_dial.get(), 
                distortionAmount: object.elements.dial_continuous.distortionAmount_dial.get(), 
                resolution:       object.elements.dial_continuous.resolution_dial.get(), 
                overSample:       object.elements.dial_discrete.overSample_dial.get(), 
                inGain:           object.elements.dial_continuous.inGain_dial.get()
            };
        };

    //circuitry
        object.distortionCircuit = new workspace.interface.circuit.alpha.distortionUnit(workspace.library.audio.context);
        object.elements.connectionNode_audio.audioIn.out().connect( object.distortionCircuit.in() );
        object.distortionCircuit.out().connect( object.elements.connectionNode_audio.audioOut.in() );

    //wiring
        object.elements.dial_continuous.outGain_dial.onchange = function(value){object.distortionCircuit.outGain(value);};
        object.elements.dial_continuous.distortionAmount_dial.onchange = function(value){object.distortionCircuit.distortionAmount(value*100);};
        object.elements.dial_continuous.resolution_dial.onchange = function(value){object.distortionCircuit.resolution(Math.round(value*1000));};
        object.elements.dial_discrete.overSample_dial.onchange = function(value){object.distortionCircuit.oversample(['none','2x','4x'][value]);};
        object.elements.dial_continuous.inGain_dial.onchange = function(value){object.distortionCircuit.inGain(2*value);};

    //setup
        object.elements.dial_continuous.resolution_dial.set(0.5);
        object.elements.dial_continuous.inGain_dial.set(0.5);
        object.elements.dial_continuous.outGain_dial.set(1);

    return object;
};

this.distortionUnit.metadata = {
    name:'Distortion Unit',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/distortionUnit/'
};