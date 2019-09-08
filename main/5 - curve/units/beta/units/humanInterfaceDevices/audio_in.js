this.audio_in = function(x,y,a,setupConnect=true){
    var imageStoreURL_localPrefix = imageStoreURL+'audio_in/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:905, height:320 },
        design:{ width:14.75, height:5 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    measurements.drawingUnit = {
        width: measurements.drawing.width/measurements.design.width,
        height: measurements.drawing.height/measurements.design.height,
    };

    var design = {
        name:'audio_in',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                   },
            { x:measurements.drawing.width -offset, y:0                                   },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset },
            { x:0,                                  y:measurements.drawing.height -offset },
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
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png'
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous', name:'outputGain',data:{
                x:20, y:25, radius:75/6, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                style:{ handle:{r:0.99,g:0.46,b:0.33,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'button_image', name:'button_previous', data:{
                x:112.5, y:12.5, width:10.85, height:10.85, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_up.png',
                backingURL__press:imageStoreURL_localPrefix+'button_down.png',
            }},
            {collection:'control', type:'button_image', name:'button_next', data:{
                x:137.5, y:23.35, width:10.85, height:10.85, hoverable:false, angle:Math.PI,
                backingURL__up:imageStoreURL_localPrefix+'button_up.png',
                backingURL__press:imageStoreURL_localPrefix+'button_down.png',
            }},
            {collection:'display', type:'audio_meter_level', name:'audioIn',data:{ x:37.5+10/16, y:5+10/16, width:11.65-10/8, height:40-10/8 }},
            {collection:'display', type:'readout_sixteenSegmentDisplay_static', name:'index', data:{
                x:52.5+10/16, y:12.5+10/16, width:56.65-10/8, height:10.85-10/8, count:11
            }},
            {collection:'display', type:'readout_sixteenSegmentDisplay_static', name:'text', data:{
                x:52.5+10/16, y:26.7+10/16, width:85-10/8, height:10.85-10/8, count:18
            }},
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(design);

    //circuitry
        var attributes = {
            deviceList:[],
            currentSelection: 0
        };

        object.circuitry = {
            unit: new _canvas_.interface.circuit.audioIn(_canvas_.library.audio.context,setupConnect)
        };
        object.circuitry.unit.out().connect( object.elements.connectionNode_audio.io_output.in() );
        object.circuitry.unit.out().connect( object.elements.audio_meter_level.audioIn.audioIn() );

        function selectDevice(a){
            if(attributes.deviceList.length == 0){
                object.elements.readout_sixteenSegmentDisplay_static.index.text('');
                object.elements.readout_sixteenSegmentDisplay_static.index.print();
                object.elements.readout_sixteenSegmentDisplay_static.text.text(' -- no devices --');
                object.elements.readout_sixteenSegmentDisplay_static.text.print('smart');
                return;
            }
            if( a < 0 || a >= attributes.deviceList.length ){return;}
            attributes.currentSelection = a;

            selectionNum=''+(a+1);while(selectionNum.length < 2){ selectionNum = '0'+selectionNum;}
            totalNum=''+attributes.deviceList.length; while(totalNum.length < 2){ totalNum = '0'+totalNum; }
            var text = selectionNum+'/'+totalNum; while(text.length < 8){ text = ' '+text; }
            object.elements.readout_sixteenSegmentDisplay_static.index.text(text);
            object.elements.readout_sixteenSegmentDisplay_static.index.print();

            var text = attributes.deviceList[a].deviceId;
            if(attributes.deviceList[a].label.length > 0){text = attributes.deviceList[a].label +' - '+ text;}
            object.elements.readout_sixteenSegmentDisplay_static.text.text(text);
            object.elements.readout_sixteenSegmentDisplay_static.text.print('smart');

            object.circuitry.unit.selectDevice( attributes.deviceList[a].deviceId );
        }
        function incSelection(){ selectDevice(attributes.currentSelection+1); }
        function decSelection(){ selectDevice(attributes.currentSelection-1); }

    //wiring
        object.elements.dial_colourWithIndent_continuous.outputGain.onchange = function(value){object.circuitry.unit.gain(value*2);}
        object.elements.button_image.button_previous.onpress = function(){ decSelection(); };
        object.elements.button_image.button_next.onpress = function(){ incSelection(); };
        object.io.signal.io_previous.onchange = function(value){ if(value){ object.elements.button_image.button_previous.press(); }else{ object.elements.button_image.button_previous.release(); } };
        object.io.signal.io_next.onchange = function(value){ if(value){ object.elements.button_image.button_next.press(); }else{ object.elements.button_image.button_next.release(); } };

    //setup
        object.circuitry.unit.listDevices(function(a){attributes.deviceList=a;});
        if(setupConnect){setTimeout(function(){selectDevice(0);},500);}
        object.elements.dial_colourWithIndent_continuous.outputGain.set(0.5);
        object.elements.audio_meter_level.audioIn.start();

    return object;
};



this.audio_in.metadata = {
    name:'Audio In',
    category:'humanInterfaceDevices',
    helpURL:'/help/units/beta/audio_in/'
};