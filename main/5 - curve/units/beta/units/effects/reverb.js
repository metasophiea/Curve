this.reverb = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'reverb/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:885, height:320 },
        design:{ width:14.5, height:5 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    var colour = {
        LCD:{
            background:{r:0.1,g:0.1,b:0.1,a:1},
            glow:{r:0.3,g:0.64,b:0.22,a:1},
            dim:{r:0.1,g:0.24,b:0.12,a:1}
        }
    };
    
    var design = {
        name:'reverb',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                     },
            { x:measurements.drawing.width -offset, y:0                                     },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset   },
            { x:0,                                  y:measurements.drawing.height -offset   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                x:measurements.drawing.width-3.5, y:30, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                x:0, y:45, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'wet_connection', data:{ 
                x:87.5+5, y:measurements.drawing.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'dry_connection', data:{ 
                x:87.5+32.5+5, y:measurements.drawing.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'rocker_down_connection', data:{ 
                x:69, y:measurements.drawing.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'rocker_up_connection', data:{ 
                x:59, y:0, width:5, height:10, angle:-Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
            }},

            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'guide.png' }
            },

            {collection:'control', type:'dial_colourWithIndent_continuous',name:'wet',data:{
                x:87.5, y:22.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5,
                style:{ handle:style.primaryEight[5], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dry',data:{
                x:87.5+32.5, y:22.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5,
                style:{ handle:style.primaryEight[2], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'button_image', name:'rocker_up', data:{
                x:58.7, y:10, width:10, height:15, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'rocker_up_up.png',
                backingURL__press:imageStoreURL_localPrefix+'rocker_up_down.png',
            }},
            {collection:'control', type:'button_image', name:'rocker_down', data:{
                x:58.7, y:10+15, width:10, height:15, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'rocker_down_up.png',
                backingURL__press:imageStoreURL_localPrefix+'rocker_down_down.png',
            }},
            {collection:'display', type:'sevenSegmentDisplay_static', name:'LCD_10', data:{ x:5, y:5, width:25, height:40, style:colour.LCD }},
            {collection:'display', type:'sevenSegmentDisplay_static', name:'LCD_1', data:{ x:30, y:5, width:25, height:40, style:colour.LCD }},
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(this.reverb,design);

    //circuitry
        var state = {
            reverbTypeSelected:0,
            availableTypes:[],
            wet:0.5,
            dry:0.5,
        };

        //reverb
            object.reverbCircuit = new _canvas_.interface.circuit.reverbUnit(_canvas_.library.audio.context);
            object.elements.connectionNode_audio.input.out().connect( object.reverbCircuit.in() );
            object.reverbCircuit.out().connect( object.elements.connectionNode_audio.output.in() );
            object.reverbCircuit.getTypes( a => {
                state.availableTypes = a;
                setReverbType(state.reverbTypeSelected);
            } );
            
        //internal functions
            var loadingScreenIntervalID;
            var journeyHistory = [];
            var journey = [
            //big loop
                // ['LCD_1',0],
                // ['LCD_1',2],
                // ['LCD_1',5],
                // ['LCD_1',6],
                // ['LCD_10',6],
                // ['LCD_10',4],
                // ['LCD_10',1],
                // ['LCD_10',0],

            //four loops
                ['LCD_10',3],
                ['LCD_10',1],
                ['LCD_10',0],
                ['LCD_10',2],
                ['LCD_10',5],
                ['LCD_10',6],
                ['LCD_10',4],
                ['LCD_10',3],
                ['LCD_1',3],
                ['LCD_1',5],
                ['LCD_1',6],
                ['LCD_1',4],
                ['LCD_1',1],
                ['LCD_1',0],
                ['LCD_1',2],
                ['LCD_1',3],
            ];
            var step = 0;
            function startReadoutLoadingScreen(){
                object.elements.sevenSegmentDisplay_static.LCD_10.enterCharacter();
                object.elements.sevenSegmentDisplay_static.LCD_1.enterCharacter();
                
                if(loadingScreenIntervalID != undefined){return;}
                loadingScreenIntervalID = setInterval(function(){
                    var data = journey[step++]
                    if(step >= journey.length){step = 0;}

                    if(journeyHistory.length == 3){
                        var last = journeyHistory.shift();
                        if(last != undefined){ object.elements.sevenSegmentDisplay_static[last[0]].set(last[1],false); }
                    }

                    object.elements.sevenSegmentDisplay_static[data[0]].set(data[1],true);

                    journeyHistory.push(data);
                },1000/20);
            }
            function stopReadoutLoadingScreen(){
                clearInterval(loadingScreenIntervalID);
                loadingScreenIntervalID = undefined;
                object.elements.sevenSegmentDisplay_static.LCD_10.enterCharacter();
                object.elements.sevenSegmentDisplay_static.LCD_1.enterCharacter();
            };
            function setReadout(num){
                num = ("0" + num).slice(-2);

                object.elements.sevenSegmentDisplay_static.LCD_10.enterCharacter(num[0]);
                object.elements.sevenSegmentDisplay_static.LCD_1.enterCharacter(num[1]);
            }
            function setReverbType(a){
                if( state.availableTypes.length == 0 ){ console.log('broken or not yet ready'); return; }

                if( a >= state.availableTypes.length ){a = state.availableTypes.length-1;}
                else if( a < 0 ){a = 0;}
    
                state.reverbTypeSelected = a;
                startReadoutLoadingScreen();
                object.reverbCircuit.type( state.availableTypes[a], function(){stopReadoutLoadingScreen(); setReadout(state.reverbTypeSelected);} );    
            }
            function incReverbType(){ setReverbType(state.reverbTypeSelected+1); }
            function decReverbType(){ setReverbType(state.reverbTypeSelected-1); }
            function updateWetDry(){ object.reverbCircuit.wetdry('manualControl',state.wet,state.dry); }

        //wiring
            object.elements.dial_colourWithIndent_continuous.wet.onchange = function(value){ state.wet = value; updateWetDry(); };
            object.elements.dial_colourWithIndent_continuous.dry.onchange = function(value){ state.dry = value; updateWetDry(); };
            object.elements.button_image.rocker_up.onpress = function(){ incReverbType(); };
            object.elements.button_image.rocker_down.onpress = function(){ decReverbType(); };
            object.elements.connectionNode_voltage.wet_connection.onchange = function(value){ object.elements.dial_colourWithIndent_continuous.wet.set(value); };
            object.elements.connectionNode_voltage.dry_connection.onchange = function(value){ object.elements.dial_colourWithIndent_continuous.dry.set(value); };
            object.elements.connectionNode_signal.rocker_down_connection.onchange = function(value){
                if(value){
                    object.elements.button_image.rocker_down.press();
                }else{
                    object.elements.button_image.rocker_down.release();
                }
            };
            object.elements.connectionNode_signal.rocker_up_connection.onchange = function(value){
                if(value){
                    object.elements.button_image.rocker_up.press();
                }else{
                    object.elements.button_image.rocker_up.release();
                }
            };
            
        //import/export
            object.exportData = function(){
                return {
                    wet: object.elements.dial_colourWithIndent_continuous.wet.get(),
                    dry: object.elements.dial_colourWithIndent_continuous.dry.get(),
                    reverbNumber: state.reverbTypeSelected,
                };
            };
            object.importData = function(data){
                object.elements.dial_colourWithIndent_continuous.wet.set(data.wet);
                object.elements.dial_colourWithIndent_continuous.dry.set(data.dry);
                state.reverbTypeSelected = data.reverbNumber;
            };

        //interface 
            object.i = {
                wet: function(value){
                    if(value == undefined){
                        return object.elements.dial_colourWithIndent_continuous.wet.get();
                    }else{
                        object.elements.dial_colourWithIndent_continuous.wet.set(value);
                    }
                },
                dry: function(value){
                    if(value == undefined){
                        return object.elements.dial_colourWithIndent_continuous.dry.get();
                    }else{
                        object.elements.dial_colourWithIndent_continuous.dry.set(value);
                    }
                },
                reverbNumber: function(number){ if(value == undefined){ return state.reverbTypeSelected; }else{ setReverbType(number); } }
            };

        //setup
            startReadoutLoadingScreen();
        
    return object;
};



this.reverb.metadata = {
    name:'Reverb',
    category:'effects',
    helpURL:'/help/units/beta/reverb/'
};