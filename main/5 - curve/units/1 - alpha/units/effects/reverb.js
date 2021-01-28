this.reverb = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'reverb/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:885, height:320 },
                    design: { width:14.5, height:5 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.LCD = {
                    background:{r:0.1,g:0.1,b:0.1,a:1},
                    glow:{r:0.3,g:0.64,b:0.22,a:1},
                    dim:{r:0.1,g:0.24,b:0.12,a:1}
                };
                this.dial_wet = { handle:style.primaryEight[5], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.dial_dry = { handle:style.primaryEight[2], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'reverb',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                    x:unitStyle.drawingValue.width-3.5, y:30, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:0, y:45, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'wet_connection', data:{ 
                    x:92.5, y:unitStyle.drawingValue.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'dry_connection', data:{ 
                    x:125, y:unitStyle.drawingValue.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'rocker_down_connection', data:{ 
                    x:69, y:unitStyle.drawingValue.height-3.5, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'rocker_up_connection', data:{ 
                    x:59, y:0, width:5, height:10, angle:-Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'guide.png' }
                },
                {collection:'control', type:'dial_2_continuous',name:'wet',data:{
                    x:87.5, y:22.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5, style:unitStyle.dial_wet,
                }},
                {collection:'control', type:'dial_2_continuous',name:'dry',data:{
                    x:120, y:22.5, radius:27.5/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5, style:unitStyle.dial_dry,
                }},
                {collection:'control', type:'button_image', name:'rocker_up', data:{
                    x:58.7, y:10, width:10, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'rocker_up_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'rocker_up_down.png',
                }},
                {collection:'control', type:'button_image', name:'rocker_down', data:{
                    x:58.7, y:25, width:10, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'rocker_down_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'rocker_down_down.png',
                }},
                {collection:'display', type:'sevenSegmentDisplay', name:'LCD_10', data:{ x:5, y:5, width:25, height:40, canvasBased:true, style:unitStyle.LCD }},
                {collection:'display', type:'sevenSegmentDisplay', name:'LCD_1', data:{ x:30, y:5, width:25, height:40, canvasBased:true, style:unitStyle.LCD }},
            ]
        });

    //circuitry        
        const state = {
            reverbTypeSelected:0,
            availableTypes:[],
            wet:0.5,
            dry:0.5,
        };
        const reverbCircuit = new _canvas_.interface.circuit.reverbUnit(_canvas_.library.audio.context);
            
        //internal functions
            let loadingScreenIntervalID;
            const journeyHistory = [];
            const journey = [
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
            let step = 0;
            function startReadoutLoadingScreen(){
                object.elements.sevenSegmentDisplay.LCD_10.enterCharacter();
                object.elements.sevenSegmentDisplay.LCD_1.enterCharacter();
                
                if(loadingScreenIntervalID != undefined){return;}
                loadingScreenIntervalID = setInterval(function(){
                    const data = journey[step++]
                    if(step >= journey.length){step = 0;}

                    if(journeyHistory.length == 3){
                        const last = journeyHistory.shift();
                        if(last != undefined){ object.elements.sevenSegmentDisplay[last[0]].set(last[1],false); }
                    }

                    object.elements.sevenSegmentDisplay[data[0]].set(data[1],true);

                    journeyHistory.push(data);
                },1000/20);
            }
            function stopReadoutLoadingScreen(){
                clearInterval(loadingScreenIntervalID);
                loadingScreenIntervalID = undefined;
                object.elements.sevenSegmentDisplay.LCD_10.enterCharacter();
                object.elements.sevenSegmentDisplay.LCD_1.enterCharacter();
            };
            function setReadout(num){
                num++;

                num = ("0" + num).slice(-2);

                object.elements.sevenSegmentDisplay.LCD_10.enterCharacter(num[0]);
                object.elements.sevenSegmentDisplay.LCD_1.enterCharacter(num[1]);
            }
            function setReverbType(a){
                if( state.availableTypes.length == 0 ){ console.log('broken or not yet ready'); return; }

                if( a >= state.availableTypes.length ){a = state.availableTypes.length-1;}
                else if( a < 0 ){a = 0;}
    
                state.reverbTypeSelected = a;
                startReadoutLoadingScreen();
                reverbCircuit.type( state.availableTypes[a], function(){stopReadoutLoadingScreen(); setReadout(state.reverbTypeSelected);} );    
            }
            function incReverbType(){ setReverbType(state.reverbTypeSelected+1); }
            function decReverbType(){ setReverbType(state.reverbTypeSelected-1); }
            function updateWetDry(){ reverbCircuit.wetdry('manualControl',state.wet,state.dry); }

    //wiring
        //hid
            object.elements.dial_2_continuous.wet.onchange = function(value){ state.wet = value; updateWetDry(); };
            object.elements.dial_2_continuous.dry.onchange = function(value){ state.dry = value; updateWetDry(); };
            object.elements.button_image.rocker_up.onpress = function(){ incReverbType(); };
            object.elements.button_image.rocker_down.onpress = function(){ decReverbType(); };
        //io
            object.io.audio.input.audioNode = reverbCircuit.in();
            object.io.audio.output.audioNode = reverbCircuit.out();
            object.io.voltage.wet_connection.onchange = function(value){ object.elements.dial_2_continuous.wet.set(value); };
            object.io.voltage.dry_connection.onchange = function(value){ object.elements.dial_2_continuous.dry.set(value); };
            object.io.signal.rocker_down_connection.onchange = function(value){
                value ? object.elements.button_image.rocker_down.press() : object.elements.button_image.rocker_down.release();
            };
            object.io.signal.rocker_up_connection.onchange = function(value){
                value ? object.elements.button_image.rocker_up.press() : object.elements.button_image.rocker_up.release();
            };

    //interface
        object.i = {
            wet: function(value){
                if(value == undefined){
                    return object.elements.dial_2_continuous.wet.get();
                }else{
                    object.elements.dial_2_continuous.wet.set(value);
                }
            },
            dry: function(value){
                if(value == undefined){
                    return object.elements.dial_2_continuous.dry.get();
                }else{
                    object.elements.dial_2_continuous.dry.set(value);
                }
            },
            reverbNumber: function(number){ if(value == undefined){ return state.reverbTypeSelected; }else{ setReverbType(number); } }
        };

    //import/export
        object.exportData = function(){
            return {
                wet: object.elements.dial_2_continuous.wet.get(),
                dry: object.elements.dial_2_continuous.dry.get(),
                reverbNumber: state.reverbTypeSelected,
            };
        };
        object.importData = function(data){
            object.elements.dial_2_continuous.wet.set(data.wet);
            object.elements.dial_2_continuous.dry.set(data.dry);
            state.reverbTypeSelected = data.reverbNumber;
        };

    //setup/tearDown
        object.oncreate = function(){
            reverbCircuit.getTypes( a => { state.availableTypes = a; setReverbType(state.reverbTypeSelected); } );
        };

    return object;
};
this.reverb.metadata = {
    name:'Reverb',
    category:'effects',
    helpURL:'/help/units/alpha/reverb/'
};