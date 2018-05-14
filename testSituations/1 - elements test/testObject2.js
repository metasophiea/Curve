function makeTestObject2(x,y,debug=false){
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
        dim:'fill:rgba(80,80,80,1)'
    };
    var design = {
        type: 'testObject2',
        x: x, y: y,
        base: {points:[{x:0,y:0},{x:335,y:0},{x:335,y:285},{x:0,y:285}], style:style.background},

        slider: {
            Vslide:{
                type: 'vertical', x:5, y:40, width: 10, height: 120,
                style:{handle:style.handle, backing:style.backing, slot:style.slot},
                onChange:function(data){design.connector.data.externalData_1.send('Vslide',data);}, 
                onRelease:function(){console.log('Vslide onRelease');}
            },
            Hslide:{
                type: 'horizontal', x:5, y:165, width: 115, height: 10,
                style:{handle:style.handle, backing:style.backing, slot:style.slot},
                onChange:function(data){design.connector.data.externalData_1.send('Hslide',data);}, 
                onRelease:function(){console.log('Hslide onRelease');}
            }
        },
        sliderPanel: {
            VslidePanel:{
                type: 'vertical', x:20, y:40, width: 100, height: 120, count: 10,
                style:{handle:style.handle, backing:style.backing, slot:style.slot},
                onChange:function(){console.log('VslidePanel onChange');}, 
                onRelease:function(){console.log('VslidePanel onRelease');}
            },
            HslidePanel:{
                type: 'horizontal', x:5, y:180, width: 115, height: 100, count: 10,
                style:{handle:style.handle, backing:style.backing, slot:style.slot},
                onChange:function(){console.log('HslidePanel onChange');}, 
                onRelease:function(){console.log('HslidePanel onRelease');}
            }
        },
        continuousDial: { 
            Cdial:{
                x: 70, y: 22.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35,
                style:{handle:style.handle, slot:style.slot, needle:style.needle, outerArc:style.markings},
                onChange:function(){console.log('Cdial onChange');}, 
                onRelease:function(){console.log('Cdial onRelease');}
            }
        },
        discreteDial: { 
            Ddial:{
                x: 105, y: 22.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35,
                style:{handle:style.handle, slot:style.slot, needle:style.needle, outerArc:style.markings},
                onChange:function(){console.log('Ddial onChange');}, 
                onRelease:function(){console.log('Ddial onRelease');}
            }
        },
        button: { 
            button_rect:{
                type:'rectangle', x:220, y: 5, width:20, height:20, 
                style:{up:'fill:rgba(200,200,200,1)', hover:'fill:rgba(220,220,220,1)', down:'fill:rgba(180,180,180,1)', glow:'fill:rgba(220,200,220,1)'},
                onClick:function(){design.connector.data.externalData_1.send('button_rect');}
            }
        },
        checkbox: { 
            checkbox_rect:{
                type:'rectangle', x:245, y: 5, width:20, height:20, angle:0, 
                style:{check:'fill:rgba(150,150,150,1)', backing:'fill:rgba(200,200,200,1)', checkGlow:'fill:rgba(220,220,220,1)', backingGlow:'fill:rgba(220,220,220,1)'},
                onChange:function(){design.connector.data.externalData_1.send('checkbox_rect', design.checkbox.checkbox_rect.get());}
            }
        },
        key: { 
            key_rect:{
                type:'rectangle', x:270, y:5, width:20, height:20, angle:0, 
                style:{off:'fill:rgba(200,200,200,1)', press:'fill:rgba(180,180,180,1)', glow:'fill:rgba(220,200,220,1)', pressAndGlow:'fill:rgba(200,190,200,1)'}, 
                onkeydown:function(){design.connector.data.externalData_1.send('key_rect',true);}, 
                onkeyup:function(){design.connector.data.externalData_1.send('key_rect',false);}
            }
        },
        rastorgrid: { 
            rastorgrid:{
                x:230, y:135, width:100, height:100, xCount:4, yCount:4, 
                style:{backing:'fill:rgba(200,200,200,1)',check:'fill:rgba(150,150,150,1)',backingGlow:'fill:rgba(220,220,220,1)',checkGlow:'fill:rgba(220,220,220,1)'}, 
                onChange:function(){design.connector.data.externalData_1.send('rastorgrid', design.rastorgrid.rastorgrid.get());}
            }
        },
        
        glowbox: { 
            glowbox:{
                x:120, y:5, width: 10, height:10, angle:0, 
                style:{glow:'fill:rgba(240,240,240,1)', dim:'fill:rgba(80,80,80,1)'},
                glowStyle:style.glow, dimStyle:style.dim
            }
        },
        label: { 
            label:{
                x:125, y:20, text:'_mainObject', style:style.h1, angle:0
            }
        },
        level:{
            level:{
                x: 125, y:240, angle:0, width: 10, height:40, 
                style:{backing: 'fill:rgb(10,10,10)', levels:['fill:rgb(250,250,250)','fill:rgb(200,200,200)']}
            }
        },
        meter_level:{
            meter_level:{
                x: 137.5, y:240, angle:0, width: 10, height:40, markings:[0.125,0.25,0.375,0.5,0.625,0.75,0.875],
                style:{backing: 'fill:rgb(10,10,10)', levels:['fill:rgb(250,250,250)','fill:rgb(200,200,200)'],marking:'fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'}
            }
        },
        audio_meter_level:{
            audio_meter_level:{
                x: 150, y:240, angle:0, width: 10, height:40, markings:[0.125,0.25,0.375,0.5,0.625,0.75,0.875],
                style:{backing: 'fill:rgb(10,10,10)', levels:['fill:rgb(250,250,250)','fill:rgb(200,200,200)'],marking:'fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'}
            }
        },
        sevenSegmentDisplay: {
            sevenSegmentDisplay:{
                x: 162.5, y: 240, angle:0, width:20, height:20,
                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
            }
        },
        sixteenSegmentDisplay: {
            sevenSegmentDisplay:{
                x: 185, y: 240, angle:0, width:20, height:20,
                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
            }
        },
        rastorDisplay: {
            rastorDisplay:{
                x: 162.5, y: 262.5, angle:0, width:20, height:20,
                xCount:8, yCount:8, xGappage:0.1, yGappage:0.1,
            }
        },
        graph:{ 
            graph:{
                x:125, y:30, width:100, height:100, 
                style:{middleground:'stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;', background:'stroke:rgba(0,100,0,1); stroke-width:0.25;',backgroundText:'fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',backing:'fill:rgba(50,50,50,1)'}
            }
        },
        grapher_periodicWave:{ 
            grapher_periodicWave:{
                x:125, y:135, width:100, height:100, 
                style:{middleground:'stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;', background:'stroke:rgba(0,100,0,1); stroke-width:0.25;',backgroundText:'fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',backing:'fill:rgba(50,50,50,1)'}
            }
        },

        connector: {
            audio:{
                internalAudio_1: {
                    type: 1, x: 230, y: 65, width: 30, height: 30, 
                    onConnect:undefined, onDisconnect:undefined
                },
                internalAudio_2: {
                    type: 0, x: 300, y: 65, width: 30, height: 30, 
                    onConnect:undefined, onDisconnect:undefined
                },
            },
            data:{
                internalData_1: {
                    x: 230, y: 30, width: 30, height: 30, 
                    receive:undefined, 
                    give:undefined, 
                    onConnect:undefined, 
                    onDisconnect:undefined
                },
                internalData_2: {
                    x: 300, y: 30, width: 30, height: 30, 
                    receive:undefined, 
                    give:undefined, 
                    onConnect:undefined, 
                    onDisconnect:undefined
                },
                externalData_1: {
                    x: 230, y: 100, width: 30, height: 30, 
                    receive:function(address, data){
                        switch(address){
                            case 'Vslide': design.slider.Vslide.set(data,true,false); break;
                            case 'Hslide': design.slider.Hslide.set(data,false); break;
                            case 'VslidePanel': design.sliderPanel.VslidePanel.set(data,false,false); break;
                            case 'HslidePanel': design.sliderPanel.HslidePanel.set(data,false); break;
                            case 'Cdial': design.continuousDial.Cdial.set(data,false,false); break;
                            case 'Ddial': design.discreteDial.Ddial.select(data,false,false); break;
                            case 'button_rect': design.grapher_periodicWave.grapher_periodicWave.reset(); design.continuousDial.Cdial.smoothSet(1,1,'s',false); design.slider.Vslide.smoothSet(1,1,'linear',false); design.slider.Hslide.smoothSet(1,1,'sin',false); design.sliderPanel.VslidePanel.smoothSetAll(1,1,'cos',false); design.sliderPanel.HslidePanel.smoothSetAll(1,1,'exponential',false); break;
                            case 'checkbox_rect': design.checkbox.checkbox_rect.set(data,false); break;
                            case 'key_rect': if(data){design.key.key_rect.glow();design.glowbox.glowbox.on();}else{design.key.key_rect.dim();design.glowbox.glowbox.off();} break;
                            case 'rastorgrid': design.rastorgrid.rastorgrid.set(data,false); break;
                        }
                    }, 
                    give:undefined, 
                    onConnect:undefined, 
                    onDisconnect:undefined
                },
            }
        }
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(design,style);

    //setup
        setTimeout(function(){
            for(var a = 0; a < 10; a++){ design.sliderPanel.VslidePanel.slide(a).set( 1-1/(a+1)  ); }
            for(var a = 0; a < 10; a++){ design.sliderPanel.HslidePanel.slide(a).set( 1-1/(a+1)  ); }

            setInterval(function(){ design.sevenSegmentDisplay.sevenSegmentDisplay.enterCharacter( ''+Math.round(Math.random()*10) ); },1000);
            design.rastorDisplay.rastorDisplay.test();

            design.graph.graph._test();

            design.grapher_periodicWave.grapher_periodicWave.waveElement('sin',1,1);
            design.grapher_periodicWave.grapher_periodicWave.draw();

            design.level.level.set(0.5,0);
            design.level.level.set(0.75,1);

            setInterval(function(){ design.meter_level.meter_level.set( Math.random() ); },1000);

            design.connector.audio.internalAudio_1.connectTo(design.connector.audio.internalAudio_2);
            design.connector.data.internalData_1.connectTo(design.connector.data.internalData_2);
        },1);

    return obj;
}