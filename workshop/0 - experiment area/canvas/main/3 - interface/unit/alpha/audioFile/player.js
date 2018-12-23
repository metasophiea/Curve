this.player = function(x,y,debug=false){
    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        h1: {fill:'rgba(0,0,0,1)', font:'4pt Courier New'},
        h2: {fill:'rgba(0,0,0,1)', font:'3pt Courier New'},
        markings: {fill:'rgba(150,150,150,1)'},
        readout_sixteenSegmentDisplay_static:{background:'rgb(0,0,0)', glow:'rgb(200,200,200)',dim:'rgb(20,20,20)'},
        load_button:{
            background__up__fill:'rgba(175,175,175,1)', 
            background__hover__fill:'rgba(220,220,220,1)', 
            background__hover_press__fill:'rgba(150,150,150,1)',
        },
        start_button:{
            background__up__fill:'rgba(175,195,175,1)', 
            background__hover__fill:'rgba(220,240,220,1)', 
            background__hover_press__fill:'rgba(150,170,150,1)',
        },
        stop_button:{
            background__up__fill:'rgba(195,175,175,1)', 
            background__hover__fill:'rgba(240,220,220,1)', 
            background__hover_press__fill:'rgba(170,150,150,1)',
        },
    };
    var design = {
        name: 'player',
        collection: 'alpha',
        x:x, y:y,
        space:[{x:0,y:0},{x:220,y:0},{x:220,y:80},{x:0,y:80}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:220,y:0},{x:220,y:80},{x:0,y:80}], style:style.background }},

            {type:'connectionNode_audio', name:'outRight', data:{ x:-10, y:5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'outLeft', data:{ x:-10, y:27.5, width:10, height:20, isAudioOutput:true }},

            //symbol
                {type:'rectangle', name:'symbol_line1',  data:{ x:3.5,  y:38.5, width:1, height:2,  style:style.markings }},
                {type:'rectangle', name:'symbol_line2',  data:{ x:5.5,  y:37,   width:1, height:5,  style:style.markings }},
                {type:'rectangle', name:'symbol_line3',  data:{ x:7.5,  y:35.5, width:1, height:8,  style:style.markings }},
                {type:'rectangle', name:'symbol_line4',  data:{ x:9.5,  y:34.5, width:1, height:10, style:style.markings }},
                {type:'rectangle', name:'symbol_line5',  data:{ x:11.5, y:35.5, width:1, height:8,  style:style.markings }},
                {type:'rectangle', name:'symbol_line6',  data:{ x:13.5, y:37,   width:1, height:5,  style:style.markings }},
                {type:'rectangle', name:'symbol_line7',  data:{ x:15.5, y:39,   width:1, height:1,  style:style.markings }},
                {type:'rectangle', name:'symbol_line8',  data:{ x:17.5, y:36,   width:1, height:7,  style:style.markings }},
                {type:'rectangle', name:'symbol_line9',  data:{ x:19.5, y:32,   width:1, height:15, style:style.markings }},
                {type:'rectangle', name:'symbol_line10', data:{ x:21.5, y:34.5, width:1, height:10, style:style.markings }},
                {type:'rectangle', name:'symbol_line11', data:{ x:23.5, y:37,   width:1, height:5,  style:style.markings }},
                {type:'rectangle', name:'symbol_line12', data:{ x:25.5, y:38.5, width:1, height:2,  style:style.markings }},
                
            {type:'readout_sixteenSegmentDisplay_static', name:'trackNameReadout', data:{ x: 30, y: 5, angle:0, width:100, height:20, count:10, style:style.readout_sixteenSegmentDisplay_static }},
            {type:'readout_sixteenSegmentDisplay_static', name:'time', data:{ x: 135, y: 5, angle:0, width:80, height:20, count:8, style:style.readout_sixteenSegmentDisplay_static }},

            {type:'button_rect', name:'load', data: { x:5, y: 5, width:20, height:10, style:style.load_button, onpress:function(){ object.i.loadByFile(); } }},
            {type:'button_rect',name:'start',data:{ x:5, y: 17.5, width:20, height:10, style:style.start_button, onpress:function(){ object.player.start(); } }},
            {type:'button_rect',name:'stop',data:{ x:15, y: 17.5, width:10, height:10, style:style.stop_button, onpress:function(){ object.player.stop(); } }},

            {type:'text', name:'rate_label_name', data:{ x:8.5, y:79, text:'rate', style:style.h1 }},
            {type:'text', name:'rate_label_0', data:{ x:5, y:75, text:'0', style:style.h2 }},
            {type:'text', name:'rate_label_1', data:{ x:13.7, y:54, text:'1', style:style.h2 }},
            {type:'text', name:'rate_label_2', data:{ x:23, y:75, text:'2', style:style.h2 }},
            {type:'dial_continuous',name:'rate_dial',data:{ x:15, y:65, r: 9, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, resetValue:0.5 }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{ x:30, y:30, width:185, height:45, selectionArea:false, selectionAreaToggle:function(bool){ object.player.loop({active:bool}); } }},
        ]
    };

    //main object
        var object = interfaceUnit.builder(this.player,design);

    //internal 
        function loadProcess(data){
            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.draw( object.player.waveformSegment() );                   
            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(0);
            object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area(-1,-1);
        
            object.elements.readout_sixteenSegmentDisplay_static.trackNameReadout.text(data.name);
            object.elements.readout_sixteenSegmentDisplay_static.trackNameReadout.print('smart');
        }
        
    //circuitry
        //audio file player
            object.player = new interface.circuit.alpha.player(workspace.library.audio.context);
            object.player.out_right().connect( object.elements.connectionNode_audio.outRight.in() );
            object.player.out_left().connect( object.elements.connectionNode_audio.outLeft.in() );

        //data refresh
            function refresh(){
                //check if there's a track at all
                    if( !object.player.isLoaded() ){return;}

                //time readout
                    var time = workspace.library.math.seconds2time( Math.round(object.player.currentTime()));

                    object.elements.readout_sixteenSegmentDisplay_static.time.text(
                        workspace.library.misc.padString(time.h,2,'0')+':'+
                        workspace.library.misc.padString(time.m,2,'0')+':'+
                        workspace.library.misc.padString(time.s,2,'0')
                    );
                    object.elements.readout_sixteenSegmentDisplay_static.time.print();

                //wave box
                    object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(object.player.progress(),false);
            }
            setInterval(refresh,1000/30);

    //wiring
        object.elements.dial_continuous.rate_dial.onchange = function(data){ object.player.rate( 2*data ); };
        object.elements.grapher_waveWorkspace.grapher_waveWorkspace.onchange = function(needle,value){
            if(needle == 'lead'){ object.player.jumpTo(value); }
            else if(needle == 'selection_A' || needle == 'selection_B'){
                var temp = object.elements.grapher_waveWorkspace.grapher_waveWorkspace.area();
                if(temp.A < temp.B){ object.player.loop({start:temp.A,end:temp.B}); }
                else{ object.player.loop({start:temp.B,end:temp.A}); }
            }
        };

    //interface
        object.i = {
            loadByFile:function(){
                object.player.load('file',loadProcess);
            },
            loadByURL:function(url){
                object.player.load('url',loadProcess,url);
            },
        };

    //setup
        object.elements.dial_continuous.rate_dial.set(0.5);

    return object;
};

this.player.metadata = {
    name:'Player',
    helpURL:'https://metasophiea.com/curve/help/units/alpha/player/'
};