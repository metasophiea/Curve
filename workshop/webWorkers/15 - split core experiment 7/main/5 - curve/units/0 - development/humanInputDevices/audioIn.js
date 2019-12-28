this.audioIn = function(name,x,y,a,setupConnect=true){
    var attributes = {
        deviceList:[],
        currentSelection: 0
    };
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        marking:{stroke:{r:160/255,g:160/255,b:160/255,a:1}, lineWidth:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3.5, ratio:1, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:2, ratio:1.5, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},

        readout:{ background:'rgb(0,0,0)', glow:'rgb(200,200,200)', dim:'rgb(20,20,20)' },
        button:{
            background__up__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover__colour:{r:230/255,g:230/255,b:230/255,a:1}, 
            background__hover_press__colour:{r:180/255,g:180/255,b:180/255,a:1},
        },
        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        },
    };
    var design = {
        name:name,
        model:'audioIn',
        category:'humanInputDevices',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[
            {x:0,y:10},{x:10,y:10},{x:22.5,y:0},{x:37.5,y:0},{x:50,y:10},{x:245,y:10},
            {x:245,y:40},{x:50,y:40},{x:37.5,y:50},{x:22.5,y:50},{x:10,y:40},{x:0,y:40}
        ],
        // spaceOutline: true,
        elements:[
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[
                {x:0,y:10},{x:10,y:10},{x:22.5,y:0},{x:37.5,y:0},{x:50,y:10},{x:245,y:10},
                {x:245,y:40},{x:50,y:40},{x:37.5,y:50},{x:22.5,y:50},{x:10,y:40},{x:0,y:40}
            ], colour:style.background }},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioOut', data:{x: -10, y: 15, width: 10, height: 20, isAudioOutput:true }},
            {collection:'display', type:'readout_sixteenSegmentDisplay', name:'index', data:{x: 70, y: 15, angle:0, width:50, height:20, static:true, count:5, style:style.readout}},
            {collection:'display', type:'readout_sixteenSegmentDisplay', name:'text',  data:{x: 122.5, y: 15, angle:0, width:100, height:20, static:true, count:10, style:style.readout}},
            {collection:'control', type:'button_rectangle', name:'up',   data:{x:225, y: 15, width:15, height:10, selectable:false, style:style.button, onpress:function(){incSelection();}}},
            {collection:'control', type:'button_rectangle', name:'down', data:{x:225, y: 25, width:15, height:10, selectable:false, style:style.button, onpress:function(){decSelection();}}},
            {collection:'basic', type:'text', name:'gainLabel_name', data:{x:30, y:42, text:'gain', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'gainLabel_0',    data:{x:18, y:38, text:'0', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'gainLabel_1',    data:{x:30, y:8, text:'1', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'gainLabel_2',    data:{x:41, y:38, text:'2', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous', name:'outputGain', data:{x: 30, y: 25, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, style:style.dial, resetValue:0.5 }},
            {collection:'basic', type:'path', name:'upArrow',   data:{pointsAsXYArray:[{x:227.5,y:22.5},{x:232.5,y:17.5},{x:237.5,y:22.5}], colour:style.marking.stroke, thickness:style.marking.lineWidth}},
            {collection:'basic', type:'path', name:'downArrow', data:{pointsAsXYArray:[{x:227.5,y:27.5},{x:232.5,y:32.5},{x:237.5,y:27.5}], colour:style.marking.stroke, thickness:style.marking.lineWidth}},
            {collection:'display', type:'audio_meter_level', name:'audioIn',data:{x:50, y:15, width:17.5, height:20}},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(design);

    //keycapture
        object.elements.polygon.backing.onkeydown = function(x,y,event){
            switch(event.key){
                case 'ArrowUp':    object.elements.button_rectangle.up.press(); break;
                case 'ArrowDown':  object.elements.button_rectangle.down.press(); break;
                case 'ArrowLeft':  object.elements.dial_continuous.outputGain.set(object.elements.dial_continuous.outputGain.get()-0.1); break;
                case 'ArrowRight': object.elements.dial_continuous.outputGain.set(object.elements.dial_continuous.outputGain.get()+0.1); break;
            }
        };

    //circuitry
        object.circuitry = {
            unit: new _canvas_.interface.circuit.audioIn(_canvas_.library.audio.context,setupConnect)
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
    category:'humanInputDevices',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/audioInput/'
};