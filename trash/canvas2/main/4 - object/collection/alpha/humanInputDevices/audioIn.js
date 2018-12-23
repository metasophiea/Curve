this.audioIn = function(x,y,setupConnect=true){
    var attributes = {
        deviceList:[],
        currentSelection: 0
    };
    var style = {
        background: {fill:'rgba(200,200,200,1)'},
        marking:{stroke:'rgb(160,160,160)', lineWidth:1},
        h1:{fill:'rgba(0,0,0,1)', font:'5pt Courier New'},
        h2:{fill:'rgba(0,0,0,1)', font:'3pt Courier New'},

        readout:{ background:'rgb(0,0,0)', glow:'rgb(200,200,200)', dim:'rgb(20,20,20)' },
        button:{
            background__up__fill:'rgba(220,220,220,1)', 
            background__hover__fill:'rgba(230,230,230,1)', 
            background__hover_press__fill:'rgba(180,180,180,1)',
        },
        dial:{
            handle:'rgba(220,220,220,1)',
            slot:'rgba(50,50,50,1)',
            needle:'rgba(250,150,150,1)',
        },
    };
    var design = {
        name:'audioIn',
        collection: 'alpha',
        x:x, y:y,
        space:[
            {x:0,y:10},{x:10,y:10},{x:22.5,y:0},{x:37.5,y:0},{x:50,y:10},{x:245,y:10},
            {x:245,y:40},{x:50,y:40},{x:37.5,y:50},{x:22.5,y:50},{x:10,y:40},{x:0,y:40}
        ],
        // spaceOutline: true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[
                {x:0,y:10},{x:10,y:10},{x:22.5,y:0},{x:37.5,y:0},{x:50,y:10},{x:245,y:10},
                {x:245,y:40},{x:50,y:40},{x:37.5,y:50},{x:22.5,y:50},{x:10,y:40},{x:0,y:40}
            ], style:style.background }},
            {type:'connectionNode_audio', name:'audioOut', data:{x: -10, y: 15, width: 10, height: 20, isAudioOutput:true }},
            {type:'readout_sixteenSegmentDisplay', name:'index', data:{x: 70, y: 15, angle:0, width:50, height:20, count:5, style:style.readout}},
            {type:'readout_sixteenSegmentDisplay', name:'text',  data:{x: 122.5, y: 15, angle:0, width:100, height:20, count:10, style:style.readout}},
            {type:'button_rect', name:'up',   data:{x:225, y: 15, width:15, height:10, selectable:false, style:style.button, onpress:function(){incSelection();}}},
            {type:'button_rect', name:'down', data:{x:225, y: 25, width:15, height:10, selectable:false, style:style.button, onpress:function(){decSelection();}}},
            {type:'text', name:'gainLabel_name', data:{x:21.25, y:44, text:'gain', style:style.h1, angle:0}},
            {type:'text', name:'gainLabel_0',    data:{x:17,    y:39, text:'0', style:style.h2, angle:0}},
            {type:'text', name:'gainLabel_1',    data:{x:28.75, y:10, text:'1', style:style.h2, angle:0}},
            {type:'text', name:'gainLabel_2',    data:{x:40.5,  y:39, text:'2', style:style.h2, angle:0}},
            {type:'dial_continuous', name:'outputGain', data:{x: 30, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, style:style.dial, resetValue:0.5 }},
            {type:'path', name:'upArrow',   data:{points:[{x:227.5,y:22.5},{x:232.5,y:17.5},{x:237.5,y:22.5}], style:style.marking}},
            {type:'path', name:'downArrow', data:{points:[{x:227.5,y:27.5},{x:232.5,y:32.5},{x:237.5,y:27.5}], style:style.marking}},
            {type:'audio_meter_level', name:'audioIn',data:{x:50, y:15, width:17.5, height:20}},
        ]
    };

    //main object
        var object = canvas.object.builder(this.audioIn,design);

    //keycapture
        object.onkeydown = function(x,y,event){
            switch(event.key){
                case 'ArrowUp':    object.elements.button_rect.up.press(); break;
                case 'ArrowDown':  object.elements.button_rect.down.press(); break;
                case 'ArrowLeft':  object.elements.dial_continuous.outputGain.set(object.elements.dial_continuous.outputGain.get()-0.1); break;
                case 'ArrowRight': object.elements.dial_continuous.outputGain.set(object.elements.dial_continuous.outputGain.get()+0.1); break;
            }
        };

    //circuitry
        object.circuitry = {
            unit: new canvas.part.circuit.audio.audioIn(canvas.library.audio.context,setupConnect)
        };
        object.circuitry.unit.out().connect( object.elements.connectionNode_audio.audioOut.in() );
        object.circuitry.unit.out().connect( object.elements.audio_meter_level.audioIn.audioIn() );

    //wiring
        object.elements.dial_continuous.outputGain.onchange = function(value){object.circuitry.unit.gain(value*2);}

    //internal functions
        function selectDevice(a){
            if(attributes.deviceList.length == 0){
                object.elements.readout_sixteenSegmentDisplay.index.text(' n/a');
                object.elements.readout_sixteenSegmentDisplay.index.print();
                object.elements.readout_sixteenSegmentDisplay.text.text('no devices');
                object.elements.readout_sixteenSegmentDisplay.text.print('smart');
                return;
            }
            if( a < 0 || a >= attributes.deviceList.length ){return;}
            attributes.currentSelection = a;

            selectionNum=''+(a+1);while(selectionNum.length < 2){ selectionNum = '0'+selectionNum;}
            totalNum=''+attributes.deviceList.length;while(totalNum.length < 2){ totalNum = '0'+totalNum;}
            object.elements.readout_sixteenSegmentDisplay.index.text(selectionNum+'/'+totalNum);
            object.elements.readout_sixteenSegmentDisplay.index.print();

            var text = attributes.deviceList[a].deviceId;
            if(attributes.deviceList[a].label.length > 0){text = attributes.deviceList[a].label +' - '+ text;}
            object.elements.readout_sixteenSegmentDisplay.text.text(text);
            object.elements.readout_sixteenSegmentDisplay.text.print('smart');

            object.circuitry.unit.selectDevice( attributes.deviceList[a].deviceId );
        }
        function incSelection(){ selectDevice(attributes.currentSelection+1); }
        function decSelection(){ selectDevice(attributes.currentSelection-1); }

    //setup
        object.circuitry.unit.listDevices(function(a){attributes.deviceList=a;});
        if(setupConnect){setTimeout(function(){selectDevice(0);},500);}
        object.elements.dial_continuous.outputGain.set(0.5);
        object.elements.audio_meter_level.audioIn.start();

    return object;
};

this.audioIn.metadata = {
    name:'Audio Input',
    helpURL:'https://metasophiea.com/curve/help/objects/alpha/audioInput/'
};