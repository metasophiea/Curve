this.distortionUnit = function(name,x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3.5, ratio:1, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:2, ratio:1.5, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},

        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        }
    };
    var design = {
        name:name,
        model:'distortionUnit',
        category:'audioEffectUnits',
        collection:'alpha',
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
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[
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
            ], colour:style.background }},

            {collection:'dynamic', type:'connectionNode_audio', name:'audioIn', data:{ x:102.5, y:61.5, width:10, height:20}},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioOut', data:{ x:0, y:81.5, width:10, height:20, isAudioOutput:true, angle:Math.PI }},
        
            {collection:'basic', type:'text', name:'outGain_title', data:{x:22.5, y:89,   text:'out', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'outGain_0',     data:{x:11,   y:85.5, text:'0',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'outGain_1/2',   data:{x:22.5, y:56,   text:'1/2', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'outGain_1',     data:{x:33,   y:85.5, text:'1',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous',name:'outGain_dial',data:{
                x:22.5, y:72.5, radius:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'distortionAmount_title', data:{x:22.5, y:39.5, text:'dist', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'distortionAmount_0',     data:{x:11,   y:36,   text:'0',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'distortionAmount_50',    data:{x:22.5, y:6.5,  text:'50',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'distortionAmount_100',   data:{x:35,   y:36,   text:'100',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous',name:'distortionAmount_dial',data:{
                x:22.5, y:23, radius:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'resolution_title', data:{x:52.5, y:64, text:'res',  width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'resolution_2',     data:{x:41,   y:60, text:'2',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'resolution_50',    data:{x:52.5, y:31, text:'500',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'resolution_100',   data:{x:65,   y:60, text:'1000', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous',name:'resolution_dial',data:{
                x:52.5, y:47.5, radius:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'overSample_title', data:{x:80, y:39.5, text:'overSamp', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'overSample_0',     data:{x:65, y:12,   text:'none',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'overSample_50',    data:{x:80, y:7.5,  text:'2x',       width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'overSample_100',   data:{x:92, y:12,   text:'4x',       width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_discrete',name:'overSample_dial',data:{
                x:80, y:23, radius:12, startAngle:(1.25*Math.PI), maxAngle:0.5*Math.PI, arcDistance:1.35, optionCount:3,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'inGain_title', data:{x:80,   y:89,   text:'in', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'inGain_0',     data:{x:69,   y:85.5, text:'0',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'inGain_1/2',   data:{x:80,   y:56,   text:'1/2', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'inGain_1',     data:{x:90.5, y:85.5, text:'1',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous',name:'inGain_dial',data:{
                x:80, y:72.5, radius:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(design);

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
                outGain:         object.elements.dial_continuous.outGain_dial.get(), 
                distortionAmount:object.elements.dial_continuous.distortionAmount_dial.get(), 
                resolution:      object.elements.dial_continuous.resolution_dial.get(), 
                overSample:      object.elements.dial_discrete.overSample_dial.get(), 
                inGain:          object.elements.dial_continuous.inGain_dial.get()
            };
        };

    //circuitry
        object.distortionCircuit = new _canvas_.interface.circuit.distortionUnit(_canvas_.library.audio.context);
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
    name:'Distortion Unit - Mono',
    category:'audioEffectUnits',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/distortionUnit/'
};

this.distortionUnit_stereo = function(name,x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3.5, ratio:1, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:2, ratio:1.5, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},

        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        }
    };
    var design = {
        name:name,
        model:'distortionUnit_stereo',
        category:'audioEffectUnits',
        collection:'alpha',
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
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[
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
            ], colour:style.background }},

            {collection:'dynamic', type:'connectionNode_audio', name:'audioIn_R', data:{ x:102.5, y:35.5, width:10, height:20 }},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioIn_L', data:{ x:102.5, y:61.5, width:10, height:20 }},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioOut_R', data:{ x:-10, y:35.5, width:10, height:20, isAudioOutput:true }},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioOut_L', data:{ x:-10, y:61.5, width:10, height:20, isAudioOutput:true }},
        
            {collection:'basic', type:'text', name:'outGain_title', data:{x:22.5, y:89,   text:'out', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'outGain_0',     data:{x:11,   y:85.5, text:'0',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'outGain_1/2',   data:{x:22.5, y:56,   text:'1/2', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'outGain_1',     data:{x:33,   y:85.5, text:'1',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous',name:'outGain_dial',data:{
                x:22.5, y:72.5, radius:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'distortionAmount_title', data:{x:22.5, y:39.5, text:'dist', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'distortionAmount_0',     data:{x:11,   y:36,   text:'0',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'distortionAmount_50',    data:{x:22.5, y:6.5,  text:'50',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'distortionAmount_100',   data:{x:35,   y:36,   text:'100',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous',name:'distortionAmount_dial',data:{
                x:22.5, y:23, radius:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'resolution_title', data:{x:52.5, y:64, text:'res',  width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'resolution_2',     data:{x:41,   y:60, text:'2',    width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'resolution_50',    data:{x:52.5, y:31, text:'500',  width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'resolution_100',   data:{x:65,   y:60, text:'1000', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous',name:'resolution_dial',data:{
                x:52.5, y:47.5, radius:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'overSample_title', data:{x:80, y:39.5, text:'overSamp', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'overSample_0',     data:{x:65, y:12,   text:'none',     width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'overSample_50',    data:{x:80, y:7.5,  text:'2x',       width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'overSample_100',   data:{x:92, y:12,   text:'4x',       width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_discrete',name:'overSample_dial',data:{
                x:80, y:23, radius:12, startAngle:(1.25*Math.PI), maxAngle:0.5*Math.PI, arcDistance:1.35, optionCount:3,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {collection:'basic', type:'text', name:'inGain_title', data:{x:80,   y:89,   text:'in', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'inGain_0',     data:{x:69,   y:85.5, text:'0',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'inGain_1/2',   data:{x:80,   y:56,   text:'1/2', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'inGain_1',     data:{x:90.5, y:85.5, text:'1',   width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous',name:'inGain_dial',data:{
                x:80, y:72.5, radius:12, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(design);

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
                outGain:         object.elements.dial_continuous.outGain_dial.get(), 
                distortionAmount:object.elements.dial_continuous.distortionAmount_dial.get(), 
                resolution:      object.elements.dial_continuous.resolution_dial.get(), 
                overSample:      object.elements.dial_discrete.overSample_dial.get(), 
                inGain:          object.elements.dial_continuous.inGain_dial.get()
            };
        };

    //circuitry
        object.distortionCircuit_R = new _canvas_.interface.circuit.distortionUnit(_canvas_.library.audio.context);
        object.elements.connectionNode_audio.audioIn_R.out().connect( object.distortionCircuit_R.in() );
        object.distortionCircuit_R.out().connect( object.elements.connectionNode_audio.audioIn_R.in() );
        
        object.distortionCircuit_L = new _canvas_.interface.circuit.distortionUnit(_canvas_.library.audio.context);
        object.elements.connectionNode_audio.audioIn_L.out().connect( object.distortionCircuit_L.in() );
        object.distortionCircuit_L.out().connect( object.elements.connectionNode_audio.audioOut_L.in() );

    //wiring
        object.elements.dial_continuous.outGain_dial.onchange = function(value){
            object.distortionCircuit_R.outGain(value);
            object.distortionCircuit_L.outGain(value);
        };
        object.elements.dial_continuous.distortionAmount_dial.onchange = function(value){
            object.distortionCircuit_R.distortionAmount(value*100);
            object.distortionCircuit_L.distortionAmount(value*100);
        };
        object.elements.dial_continuous.resolution_dial.onchange = function(value){
            object.distortionCircuit_R.resolution(Math.round(value*1000));
            object.distortionCircuit_L.resolution(Math.round(value*1000));
        };
        object.elements.dial_discrete.overSample_dial.onchange = function(value){
            object.distortionCircuit_R.oversample(['none','2x','4x'][value]);
            object.distortionCircuit_L.oversample(['none','2x','4x'][value]);
        };
        object.elements.dial_continuous.inGain_dial.onchange = function(value){
            object.distortionCircuit_R.inGain(2*value);
            object.distortionCircuit_L.inGain(2*value);
        };

    //setup
        object.elements.dial_continuous.resolution_dial.set(0.5);
        object.elements.dial_continuous.inGain_dial.set(0.5);
        object.elements.dial_continuous.outGain_dial.set(1);

    return object;
};
this.distortionUnit_stereo.metadata = {
    name:'Distortion Unit - Stereo',
    category:'audioEffectUnits',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/distortionUnit/'
};