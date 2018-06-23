objects.audioIn = function(x,y){
    var attributes = {
        deviceList:[],
        currentSelection: 0
    };
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        marking:'fill:none; stroke:rgb(160,160,160); stroke-width:1;pointer-events: none;',
        h1:'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
        h2:'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',

        readout: {background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'},
        button: {up:'fill:rgba(180,180,180,1)', hover:'fill:rgba(220,220,220,1)', down:'fill:rgba(170,170,170,1)', glow:'fill:rgba(220,200,220,1)'},
        dial: {handle:'fill:rgba(220,220,220,1)', slot:'fill:rgba(50,50,50,1)',needle: 'fill:rgba(250,150,150,1)',outerArc:'fill:none; stroke:rgb(150,150,150); stroke-width:1;'},
    };
    var design = {
        type:'audioIn',
        x:x, y:y,
        base:{
            points:[
                {x:0,y:10},{x:10,y:10},{x:22.5,y:0},{x:37.5,y:0},{x:50,y:10},{x:245,y:10},
                {x:245,y:40},{x:50,y:40},{x:37.5,y:50},{x:22.5,y:50},{x:10,y:40},{x:0,y:40}
            ], 
            style:style.background
        },
        elements:[
                {type:'connectionNode_audio', name:'audioOut', data:{type: 1, x: -10, y: 15, width: 20, height: 20}},
                {type:'readout_sixteenSegmentDisplay', name:'index', data:{x: 70, y: 15, angle:0, width:50, height:20, count:5, style:style.readout}},
                {type:'readout_sixteenSegmentDisplay', name:'text',  data:{x: 122.5, y: 15, angle:0, width:100, height:20, count:10, style:style.readout}},
                {type:'button_rect', name:'up',   data:{x:225, y: 15, width:15, height:10, style:style.button, onclick:function(){incSelection();}}},
                {type:'button_rect', name:'down', data:{x:225, y: 25, width:15, height:10, style:style.button, onclick:function(){decSelection();}}},
                {type:'dial_continuous', name:'outputGain', data:{x: 30, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, style:style.dial, onchange:function(value){obj.circuitry.unit.gain(value*2);}}},
                {type:'label', name:'gainLabel_name', data:{x:21.25, y:44, text:'gain', style:style.h1, angle:0}},
                {type:'label', name:'gainLabel_0',    data:{x:15, y:40, text:'0', style:style.h2, angle:0}},
                {type:'label', name:'gainLabel_1',    data:{x:28.75, y:7, text:'1', style:style.h2, angle:0}},
                {type:'label', name:'gainLabel_2',    data:{x:42.5, y:40, text:'2', style:style.h2, angle:0}},
                {type:'path', name:'upArrow',   data:{path:[{x:227.5,y:22.5},{x:232.5,y:17.5},{x:237.5,y:22.5}], style:style.marking}},
                {type:'path', name:'downArrow', data:{path:[{x:227.5,y:27.5},{x:232.5,y:32.5},{x:237.5,y:27.5}], style:style.marking}},
                {type:'audio_meter_level', name:'audioIn',data:{x:50, y:15, width:17.5, height:20}},
        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(arguments.callee,design);

        var keycaptureObj = __globals.keyboardInteraction.declareKeycaptureObject(obj,{none:['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']});
            keycaptureObj.keyPress = function(key){
                switch(key){
                    case 'ArrowUp': design.button_rect.up.click();  break;
                    case 'ArrowDown': design.button_rect.down.click();  break;
                    case 'ArrowLeft': design.dial_continuous.outputGain.set(design.dial_continuous.outputGain.get()-0.1);  break;
                    case 'ArrowRight': design.dial_continuous.outputGain.set(design.dial_continuous.outputGain.get()+0.1);  break;
                }
            };


    //circuitry
        obj.circuitry = {
            unit: new parts.audio.audioIn(__globals.audio.context)
        };
        obj.circuitry.unit.out().connect( design.connectionNode_audio.audioOut.in() );
        obj.circuitry.unit.out().connect( design.audio_meter_level.audioIn.audioIn() );

    //internal functions
        function selectDevice(a){
            if(attributes.deviceList.length == 0){
                design.readout_sixteenSegmentDisplay.index.text(' n/a');
                design.readout_sixteenSegmentDisplay.index.print();
                design.readout_sixteenSegmentDisplay.text.text('no devices');
                design.readout_sixteenSegmentDisplay.text.print('smart');
                return;
            }
            if( a < 0 || a >= attributes.deviceList.length ){return;}
            attributes.currentSelection = a;

            selectionNum=''+(a+1);while(selectionNum.length < 2){ selectionNum = '0'+selectionNum;}
            totalNum=''+attributes.deviceList.length;while(totalNum.length < 2){ totalNum = '0'+totalNum;}
            design.readout_sixteenSegmentDisplay.index.text(selectionNum+'/'+totalNum);
            design.readout_sixteenSegmentDisplay.index.print();

            var text = attributes.deviceList[a].deviceId;
            if(attributes.deviceList[a].label.length > 0){text = attributes.deviceList[a].label +' - '+ text;}
            design.readout_sixteenSegmentDisplay.text.text(text);
            design.readout_sixteenSegmentDisplay.text.print('smart');
        }
        function incSelection(){ selectDevice(attributes.currentSelection+1); }
        function decSelection(){ selectDevice(attributes.currentSelection-1); }

    //setup
        obj.circuitry.unit.listDevices(function(a){attributes.deviceList=a;});
        setTimeout(function(){selectDevice(0);},500);
        design.dial_continuous.outputGain.set(0.5);
        design.audio_meter_level.audioIn.start();

    return obj;
};