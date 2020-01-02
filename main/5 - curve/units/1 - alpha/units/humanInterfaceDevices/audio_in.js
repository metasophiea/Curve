this.audio_in = function(name,x,y,angle,setupConnect=true){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'audio_in/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:905, height:320 },
                    design: { width:14.75, height:5 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.outputGain = { handle:{r:0.99,g:0.46,b:0.33,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'audio_in',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'io_output', data:{ 
                    x:0, y:25 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'io_previous', data:{ 
                    x:117.9 - 10/2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'io_next', data:{ 
                    x:132.05 - 10/2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', data:{ 
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                }},
                {collection:'control', type:'dial_2_continuous', name:'outputGain',data:{
                    x:20, y:25, radius:75/6, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5, style:unitStyle.outputGain,
                }},
                {collection:'control', type:'button_image', name:'button_previous', data:{
                    x:112.5, y:12.5, width:10.85, height:10.85, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png',
                }},
                {collection:'control', type:'button_image', name:'button_next', data:{
                    x:137.5, y:23.35, width:10.85, height:10.85, hoverable:false, angle:Math.PI,
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png',
                }},
                {collection:'display', type:'audio_meter_level', name:'audioIn',data:{ 
                    x:37.5+10/16, y:5+10/16, width:11.65-10/8, height:40-10/8
                }},
                {collection:'display', type:'readout_sixteenSegmentDisplay', name:'index', data:{
                    x:52.5+10/16, y:12.5+10/16, width:56.65-10/8, height:10.85-10/8, static:true, count:11, resolution:5,
                }},
                {collection:'display', type:'readout_sixteenSegmentDisplay', name:'text', data:{
                    x:52.5+10/16, y:26.7+10/16, width:85-10/8, height:10.85-10/8, static:true, count:18, resolution:5,
                }},
            ]
        });

    //circuitry
        const state = {
            deviceList:[],
            currentSelection: 0
        };
        const audioInCircuit = new _canvas_.interface.circuit.audioIn(_canvas_.library.audio.context,setupConnect);

        audioInCircuit.out().connect( object.elements.audio_meter_level.audioIn.audioIn() );

        function selectDevice(a){
            if(state.deviceList.length == 0){
                object.elements.readout_sixteenSegmentDisplay.index.text('');
                object.elements.readout_sixteenSegmentDisplay.index.print();
                object.elements.readout_sixteenSegmentDisplay.text.text(' -- no devices --');
                object.elements.readout_sixteenSegmentDisplay.text.print('smart');
                return;
            }
            if( a < 0 || a >= state.deviceList.length ){return;}
            state.currentSelection = a;

            selectionNum=''+(a+1);while(selectionNum.length < 2){ selectionNum = '0'+selectionNum;}
            totalNum=''+state.deviceList.length; while(totalNum.length < 2){ totalNum = '0'+totalNum; }
            let index_text = selectionNum+'/'+totalNum; while(index_text.length < 8){ index_text = ' '+index_text; }
            object.elements.readout_sixteenSegmentDisplay.index.text(index_text);
            object.elements.readout_sixteenSegmentDisplay.index.print();

            let text_text = state.deviceList[a].deviceId;
            if(state.deviceList[a].label.length > 0){text_text = state.deviceList[a].label +' - '+ text_text;}
            object.elements.readout_sixteenSegmentDisplay.text.text(text_text);
            object.elements.readout_sixteenSegmentDisplay.text.print('smart');

            audioInCircuit.selectDevice( state.deviceList[a].deviceId );
        }
        function incSelection(){ selectDevice(state.currentSelection+1); }
        function decSelection(){ selectDevice(state.currentSelection-1); }

    //wiring
        //hid
            object.elements.dial_2_continuous.outputGain.onchange = function(value){audioInCircuit.gain(value*2);}
            object.elements.button_image.button_previous.onpress = function(){ decSelection(); };
            object.elements.button_image.button_next.onpress = function(){ incSelection(); };
        //io
            audioInCircuit.out().connect( object.io.audio.io_output.in() );
            object.io.signal.io_previous.onchange = function(value){ if(value){ object.elements.button_image.button_previous.press(); }else{ object.elements.button_image.button_previous.release(); } };
            object.io.signal.io_next.onchange = function(value){ if(value){ object.elements.button_image.button_next.press(); }else{ object.elements.button_image.button_next.release(); } };

    //interface
        object.i = {
            gain:function(value){
                if(value == undefined){return object.elements.dial_2_continuous.outputGain.get();}
                object.elements.dial_2_continuous.outputGain.set(value);
            },
        };

    //import/export
        object.exportData = function(){
            return { gain: object.elements.dial_2_continuous.outputGain.get() };
        };
        object.importData = function(data){
            object.elements.dial_2_continuous.outputGain.get( data.gain );
        };
    
    //setup/tearDown
        object.oncreate = function(){
            audioInCircuit.listDevices(function(a){state.deviceList=a;});
            if(setupConnect){setTimeout(function(){selectDevice(0);},500);}
            object.elements.dial_2_continuous.outputGain.set(0.5);
            object.elements.audio_meter_level.audioIn.start();
        };

    return object;
};
this.audio_in.metadata = {
    name:'Audio In',
    category:'humanInterfaceDevices',
    helpURL:'/help/units/alpha/audio_in/'
};