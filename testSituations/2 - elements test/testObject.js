objects.testObject = function(x,y,debug=false){
    var style = {
        background: 'fill:rgba(255,100,255,0.75); stroke:none;',
        h1: 'fill:rgba(0,0,0,1); font-size:14px; font-family:Courier New;',
        text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',

        markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',

        handle: 'fill:rgba(200,200,200,1)',
        backing: 'fill:rgba(150,150,150,1)',
        slot: 'fill:rgba(50,50,50,1)',
        needle: 'fill:rgba(250,150,150,1)',

        glow:'fill:rgba(240,240,240,1)',
        dim:'fill:rgba(80,80,80,1)',

        rangeslide:{
            handle:'fill:rgba(240,240,240,1)',
            backing:'fill:rgba(150,150,150,1)',
            slot:'fill:rgba(50,50,50,1)',
            invisibleHandle:'fill:rgba(0,0,0,0);',
            span:'fill:rgba(220,220,220,0.75)',
        },

        level:{
            backing: 'fill:rgb(10,10,10)', 
            levels:['fill:rgb(250,250,250)','fill:rgb(200,200,200)'],
            marking:'fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'
        },

        grapher:{
            middleground:'stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;', 
            background:'stroke:rgba(0,100,0,1); stroke-width:0.25;',
            backgroundText:'fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
            backing:'fill:rgba(50,50,50,1)'
        },
    };
    var design = {
        type: 'testObject2',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:510,y:0},{x:510,y:340},{x:0,y:340}], 
            style:style.background
        },
        elements:[
            //slides
                {type:'slide',name:'slide_vertical',data:{
                    x:5, y:40, width: 10, height: 120, angle:0,
                    style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                    onchange:function(data){
                        design.connectionNode_data.externalData_1.send('slide_vertical',data);
                        design.list.list.position(data);
                    }, 
                    onrelease:function(){console.log('slide_vertical onrelease');}
                }},
                {type:'slide',name:'slide_horizontal',data:{
                    x:5, y:175, height: 115, width: 10, angle:-Math.PI/2,
                    style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                    onchange:function(data){design.connectionNode_data.externalData_1.send('slide_horizontal',data);}, 
                    onrelease:function(){console.log('slide_horizontal onrelease');}
                }},
                {type:'slidePanel',name:'slidePanel_vertical',data:{
                    x:20, y:40, width: 100, height: 120, count: 10, 
                    style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                    onchange:function(slide,value){ design.connectionNode_data.externalData_1.send('slidePanel_vertical',{slide:slide,value:value}); },
                }},
                {type:'slidePanel',name:'slidePanel_horizontal',data:{
                    x:5, y:280, width: 100, height: 115, count: 10, angle:-Math.PI/2,
                    style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                    onchange:function(slide,value){ design.connectionNode_data.externalData_1.send('slidePanel_horizontal',{slide:slide,value:value}); },
                }},
                {type:'rangeslide',name:'rangeslide', data:{
                    x:185, y:272.5, height: 100, width: 10, angle:-Math.PI/2, handleHeight:1/5, spanWidth:1,
                    style:{
                        handle: style.rangeslide.handle,
                        backing: style.rangeslide.backing,
                        slot: style.rangeslide.slot,
                        invisibleHandle: style.rangeslide.invisibleHandle,
                        span: style.rangeslide.span,
                    },
                    onchange:function(values){ design.connectionNode_data.externalData_1.send('rangeslide',{values:values}); },
                }},  

            //dials
                {type:'dial_continuous',name:'dial_continuous',data:{
                    x: 70, y: 22.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, 
                    style:{handle:style.handle, slot:style.slot, needle:style.needle, outerArc:style.markings},
                    onchange:function(){console.log('dial_continuous onchange');},
                    onrelease:function(){console.log('dial_continuous onrelease');}
                }},
                {type:'dial_discrete',name:'dial_discrete',data:{
                    x: 105, y: 22.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, optionCount: 8,
                    style:{handle:style.handle, slot:style.slot, needle:style.needle, outerArc:style.markings}, 
                    onchange:function(){console.log('dial_discrete onchange');},
                    onrelease:function(){console.log('dial_discrete onrelease');}
                }},
            
            //button-like
                {type:'button_rect',name:'button_rect',data:{
                    x:220, y: 5, width:20, height:20, 
                    style:{
                        up:'fill:rgba(200,200,200,1)', hover:'fill:rgba(220,220,220,1)', 
                        down:'fill:rgba(180,180,180,1)', glow:'fill:rgba(220,200,220,1)'
                    }, 
                    onclick:function(){design.connectionNode_data.externalData_1.send('button_rect');}
                }},
                {type:'button_rect_2',name:'button_rect_2',data:{
                    x:5, y: 5, width:20, height:20, 
                    style:{
                        up:'fill:rgba(200,200,200,1)', hover:'fill:rgba(220,220,220,1)', 
                        down:'fill:rgba(180,180,180,1)', glow:'fill:rgba(220,200,220,1)'
                    }, 
                    onclick:function(){}
                }},
                {type:'checkbox_rect', name:'checkbox_rect', data:{
                    x:245, y: 5, width:20, height:20, angle:0, 
                    style:{
                        check:'fill:rgba(150,150,150,1)', backing:'fill:rgba(200,200,200,1)', 
                        checkGlow:'fill:rgba(220,220,220,1)', backingGlow:'fill:rgba(220,220,220,1)'
                    }, 
                    onchange:function(){design.connectionNode_data.externalData_1.send('checkbox_rect', design.checkbox_rect.checkbox_rect.get());}
                }},
                {type:'key_rect', name:'key_rect', data:{
                    x:270, y:5, width:20, height:20, angle:0, 
                    style:{
                        off:'fill:rgba(200,200,200,1)', press:'fill:rgba(180,180,180,1)', 
                        glow:'fill:rgba(220,200,220,1)', pressAndGlow:'fill:rgba(200,190,200,1)'
                    }, 
                    keydown:function(){design.connectionNode_data.externalData_1.send('key_rect',true);}, 
                    keyup:function(){design.connectionNode_data.externalData_1.send('key_rect',false);}
                }},
                {type:'rastorgrid', name:'rastorgrid', data:{
                    x:125, y:135, width:100, height:100, xCount:4, yCount:4, 
                    style:{
                        backing:'fill:rgba(200,200,200,1)', check:'fill:rgba(150,150,150,1)',
                        backingGlow:'fill:rgba(220,220,220,1)', checkGlow:'fill:rgba(220,220,220,1)'
                    }, 
                    onchange:function(){design.connectionNode_data.externalData_1.send('rastorgrid', design.rastorgrid.rastorgrid.get());}
                }},
            
            //sequencers
                {type:'sequencer', name:'sequencer', data:{
                    x:5, y:285, width:300, height:50, 
                    xCount:30, yCount:20, zoomLevel_x:0.5, zoomLevel_y:0.5,
                }},

            //display
                {type:'glowbox_rect', name:'glowbox_rect', data:{
                    x:120, y:5, width: 10, height:10, angle:0, 
                    style:{glow:'fill:rgba(240,240,240,1)', dim:'fill:rgba(80,80,80,1)'}
                }},
                {type:'label', name:'label', data:{
                    x:125, y:20, text:'_mainObject', style:style.h1, angle:0
                }},

            //levels
                {type:'level', name:'level', data:{
                    x: 125, y:240, angle:0, width: 10, height:40, 
                    style:{backing: 'fill:rgb(10,10,10)', levels:['fill:rgb(250,250,250)','fill:rgb(200,200,200)']}
                }},
                {type:'meter_level', name:'meter_level', data:{
                    x: 137.5, y:240, angle:0, width: 10, height:40, markings:[0.125,0.25,0.375,0.5,0.625,0.75,0.875],
                    style:{backing:style.backing, levels:style.levels, markings:style.markings},
                    }},
                {type:'audio_meter_level', name:'audio_meter_level', data:{
                    x: 150, y:240, angle:0, width: 10, height:40, markings:[0.125,0.25,0.375,0.5,0.625,0.75,0.875], 
                    style:{backing:style.backing, levels:style.levels, markings:style.markings},
                }},
            
            //segment displays
                {type:'sevenSegmentDisplay', name:'sevenSegmentDisplay', data:{
                    x: 162.5, y: 240, angle:0, width:10, height:20, 
                    style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                }},
                {type:'sixteenSegmentDisplay', name:'sixteenSegmentDisplay', data:{
                    x: 175, y: 240, angle:0, width:10, height:20, 
                    style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                }},
                {type:'readout_sixteenSegmentDisplay', name:'readout_sixteenSegmentDisplay', data:{
                    x: 187.5, y: 240, angle:0, width:100, height:20, count:10, 
                    style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                }},
                {type:'rastorDisplay', name:'rastorDisplay', data:{
                    x: 162.5, y: 262.5, angle:0, width:20, height:20, xCount:8, yCount:8, xGappage:0.1, yGappage:0.1
                }},

            //connection nodes
                //audio
                    {type:'connectionNode_audio', name:'internalAudio_1', data: {
                        type: 1, x: 125, y: 65, width: 30, height: 30
                    }},
                    {type:'connectionNode_audio', name:'internalAudio_2', data:{
                        type: 0, x: 195, y: 65, width: 30, height: 30
                    }},
                //data
                    {type:'connectionNode_data', name:'internalData_1', data:{
                        x: 125, y: 30, width: 30, height: 30
                    }},
                    {type:'connectionNode_data', name:'internalData_2', data:{
                        x: 195, y: 30, width: 30, height: 30
                    }},
                    {type:'connectionNode_data', name:'externalData_1', data:{
                        x: 125, y: 100, width: 30, height: 30, 
                        receive:function(address, data){
                            switch(address){
                                case 'slide_vertical':        design.slide.slide_vertical.set(data,false);             break;
                                case 'slide_horizontal':      design.slide.slide_horizontal.set(data,false);           break;
                                case 'slidePanel_vertical':   design.slidePanel.slidePanel_vertical.slide(data.slide).set(data.value,false); break;
                                case 'slidePanel_horizontal': design.slidePanel.slidePanel_horizontal.slide(data.slide).set(data.value,false); break;
                                case 'rangeslide':            design.rangeslide.rangeslide.set(data.values,false); break;
                                case 'dial_continuous':       design.dial_continuous.dial_continuous.set(data,false);  break;
                                case 'dial_discrete':         design.dial_discrete.dial_discrete.select(data,false);   break;
                                case 'button_rect': 
                                    design.grapher_periodicWave.grapher_periodicWave_canvas.reset(); 
                                    design.grapher_periodicWave.grapher_periodicWave_SVG.reset(); 
                                    design.dial_continuous.dial_continuous.smoothSet(1,1,'s',false); 
                                    design.slide.slide_vertical.smoothSet(1,1,'linear',false); 
                                    design.slidePanel.slidePanel_horizontal.smoothSet(1,1,'sin',false); 
                                    design.slidePanel.slidePanel_vertical.smoothSetAll(1,1,'cos',false); 
                                    design.slidePanel.slidePanel_horizontal.smoothSetAll(1,1,'exponential',false);
                                break;
                                case 'checkbox_rect': design.checkbox_rect.checkbox_rect.set(data,false); break;
                                case 'key_rect': 
                                    if(data){
                                        design.key_rect.key_rect.glow();design.glowbox_rect.glowbox_rect.on();
                                    }else{
                                        design.key_rect.key_rect.dim();design.glowbox_rect.glowbox_rect.off();
                                    }
                                break;
                                case 'rastorgrid': design.rastorgrid.rastorgrid.set(data,false); break;
                            }
                        }, 
                    }},

            //graphers
                //SVGs
                    {type:'grapherSVG', name:'grapherSVG', data:{
                        x:300, y:5, width:100, height:50,
                    }},
                    {type:'grapher_periodicWave', name:'grapher_periodicWave_SVG', data:{
                        x:300, y:60, width:100, height:50, graphType:'SVG'
                    }},
                    {type:'grapher_audioScope', name:'grapher_audioScope_SVG', data:{
                        x:300, y:115, width:100, height:50, graphType:'SVG'
                    }},
                    {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace_SVG', data:{
                        x:300, y:170, width:100, height:50, graphType:'SVG'
                    }},
                //Canvas
                    {type:'grapherCanvas', name:'grapherCanvas', data:{
                        x:405, y:5, width:100, height:50,
                    }},
                    {type:'grapher_periodicWave', name:'grapher_periodicWave_canvas', data:{
                        x:405, y:60, width:100, height:50, graphType:'Canvas'
                    }},
                    {type:'grapher_audioScope', name:'grapher_audioScope_canvas', data:{
                        x:405, y:115, width:100, height:50, graphType:'Canvas'
                    }},
                    {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace_canvas', data:{
                        x:405, y:170, width:100, height:50, graphType:'Canvas'
                    }},
            //list
                {type:'list', name:'list', data:{
                    x:230, y:30, width:60, height:90,
                }},
        ]
    };
 
    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.testObject,design);

    //setup
        design.grapher_audioScope.grapher_audioScope_SVG.refreshRate(1);
        design.grapher_audioScope.grapher_audioScope_canvas.refreshRate(1);

        for(var a = 0; a < 10; a++){ design.slidePanel.slidePanel_vertical.slide(a).set( 1-1/(a+1)  ); }
        for(var a = 0; a < 10; a++){ design.slidePanel.slidePanel_horizontal.slide(a).set( 1-1/(a+1)  ); }

        setInterval(function(){
            design.sevenSegmentDisplay.sevenSegmentDisplay.enterCharacter( ''+Math.round(Math.random()*9) ); 
            design.sixteenSegmentDisplay.sixteenSegmentDisplay.enterCharacter(
                '0123456789abcdefghijklmnopqrstuvwxyz'.split('')[Math.round(Math.random()*35)]
            ); 
        },500);
        design.readout_sixteenSegmentDisplay.readout_sixteenSegmentDisplay.test();
        design.rastorDisplay.rastorDisplay.test();

        design.grapherSVG.grapherSVG._test();
        design.grapher_waveWorkspace.grapher_waveWorkspace_SVG._test();
        design.grapher_audioScope.grapher_audioScope_SVG.start();
        design.grapherCanvas.grapherCanvas._test();
        design.grapher_waveWorkspace.grapher_waveWorkspace_canvas._test();
        design.grapher_audioScope.grapher_audioScope_canvas.start();

        design.level.level.set(0.5,0);
        design.level.level.set(0.75,1);

        setInterval(function(){ design.meter_level.meter_level.set( Math.random() ); },1000);

        design.sequencer.sequencer.addNote(0,0,10, 10/10);
        design.sequencer.sequencer.addNote(1,1,10, 9/10);
        design.sequencer.sequencer.addNote(2,2,10, 8/10);
        design.sequencer.sequencer.addNote(3,3,10, 7/10);
        design.sequencer.sequencer.addNote(4,4,10, 6/10);
        design.sequencer.sequencer.addNote(5,5,10, 5/10);
        design.sequencer.sequencer.addNote(6,6,10, 4/10);
        design.sequencer.sequencer.addNote(7,7,10, 3/10);
        design.sequencer.sequencer.addNote(8,8,10, 2/10);
        design.sequencer.sequencer.addNote(9,9,10, 1/10);
        design.sequencer.sequencer.addNote(10,10,10,  0);

        setTimeout(function(){ //must wait until object has been added to scene
            design.connectionNode_audio.internalAudio_1.connectTo(design.connectionNode_audio.internalAudio_2);
            design.connectionNode_data.internalData_1.connectTo(design.connectionNode_data.internalData_2);
        },0);

    return obj;
}