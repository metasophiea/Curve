this.player = function(x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        markings:{ colour:{r:150/255,g:150/255,b:150/255,a:1}, thickness:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3, ratio:1, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:2, ratio:1.5, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        readout_sixteenSegmentDisplay_static:{background:{r:0/255,g:0/255,b:0/255,a:1}, glow:{r:200/255,g:200/255,b:200/255,a:1},dim:{r:20/255,g:20/255,b:20/255,a:1}},
        button:{
            background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:150/255,b:150/255,a:1},
        },
        load_button:{
            background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:150/255,b:150/255,a:1},
        },
        start_button:{
            background__up__colour:{r:175/255,g:195/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:240/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:170/255,b:150/255,a:1},
        },
        stop_button:{
            background__up__colour:{r:195/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:240/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:170/255,g:150/255,b:150/255,a:1},
        },
        slide:{
            handle:{r:220/255,g:220/255,b:220/255,a:1}
        },
    };
    var design = {
        name: 'player',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:220,y:0},{x:220,y:80},{x:0,y:80}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:220,y:0},{x:220,y:80},{x:0,y:80}], colour:style.background }},

            {type:'connectionNode_audio', name:'outRight', data:{ x:-10, y:5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'outLeft', data:{ x:-10, y:27.5, width:10, height:20, isAudioOutput:true }},

            //symbol
                {type:'rectangle', name:'symbol_line1',  data:{ x:3.5,  y:38.5, width:1, height:2,  colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line2',  data:{ x:5.5,  y:37,   width:1, height:5,  colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line3',  data:{ x:7.5,  y:35.5, width:1, height:8,  colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line4',  data:{ x:9.5,  y:34.5, width:1, height:10, colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line5',  data:{ x:11.5, y:35.5, width:1, height:8,  colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line6',  data:{ x:13.5, y:37,   width:1, height:5,  colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line7',  data:{ x:15.5, y:39,   width:1, height:1,  colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line8',  data:{ x:17.5, y:36,   width:1, height:7,  colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line9',  data:{ x:19.5, y:32,   width:1, height:15, colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line10', data:{ x:21.5, y:34.5, width:1, height:10, colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line11', data:{ x:23.5, y:37,   width:1, height:5,  colour:style.markings.colour }},
                {type:'rectangle', name:'symbol_line12', data:{ x:25.5, y:38.5, width:1, height:2,  colour:style.markings.colour }},
                
            {type:'readout_sixteenSegmentDisplay_static', name:'trackNameReadout', data:{ x: 30, y: 5, angle:0, width:100, height:20, count:10, style:style.readout_sixteenSegmentDisplay_static }},
            {type:'readout_sixteenSegmentDisplay_static', name:'time', data:{ x: 135, y: 5, angle:0, width:80, height:20, count:8, style:style.readout_sixteenSegmentDisplay_static }},

            {type:'button_rectangle', name:'load', data: { x:5, y: 5, width:20, height:10, style:style.load_button, onpress:function(){ object.i.loadByFile(); } }},
            {type:'button_rectangle',name:'start',data:{ x:5, y: 17.5, width:10, height:10, style:style.start_button, onpress:function(){ object.player.start(); } }},
            {type:'button_rectangle',name:'stop',data:{ x:15, y: 17.5, width:10, height:10, style:style.stop_button, onpress:function(){ object.player.stop(); } }},

            {type:'text', name:'rate_label_name', data:{ x:15, y:77.5, text:'rate', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {type:'text', name:'rate_label_0', data:{ x:5, y:75, text:'0', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {type:'text', name:'rate_label_1', data:{ x:15, y:51.5, text:'1', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {type:'text', name:'rate_label_2', data:{ x:25, y:75, text:'2', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {type:'dial_continuous',name:'rate_dial',data:{ x:15, y:65, r: 9, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, resetValue:0.5 }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{ x:30, y:30, width:185, height:45, selectionArea:false, selectionAreaToggle:function(bool){ 
                console.log(bool); 
                object.player.loop({active:bool}); 
            } }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.player,design);

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
            object.player = new _canvas_.interface.circuit.player(_canvas_.library.audio.context);
            object.player.out_right().connect( object.elements.connectionNode_audio.outRight.in() );
            object.player.out_left().connect( object.elements.connectionNode_audio.outLeft.in() );

        //data refresh
            function refresh(){
                //check if there's a track at all
                    if( !object.player.isLoaded() ){return;}

                //time readout
                    var time = _canvas_.library.math.seconds2time( Math.round(object.player.currentTime()));

                    object.elements.readout_sixteenSegmentDisplay_static.time.text(
                        _canvas_.library.misc.padString(time.h,2,'0')+':'+
                        _canvas_.library.misc.padString(time.m,2,'0')+':'+
                        _canvas_.library.misc.padString(time.s,2,'0')
                    );
                    object.elements.readout_sixteenSegmentDisplay_static.time.print();

                //wave box
                    object.elements.grapher_waveWorkspace.grapher_waveWorkspace.select(object.player.progress(),false);
            }
            setInterval(refresh,1000/30);
    
    //import/export
        object.exportData = function(){
            var data = {
                track: object.player.unloadRaw(),
            };

            return data;
        };
        object.importData = function(data){
            object.i.loadRaw(data.track);
        };

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
            loadRaw:function(data){
                object.player.loadRaw(data,loadProcess);
            },
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
    category:'audioFile',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/player/'
};