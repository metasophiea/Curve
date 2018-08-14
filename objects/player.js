this.player = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
        text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',
        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
    };
    var design = {
        type: 'player',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:220,y:0},{x:220,y:80},{x:0,y:80}], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'outRight', data:{  type: 1, x: -10, y: 5, width: 10, height: 20 }},
            {type:'connectionNode_audio', name:'outLeft', data:{ type: 1, x: -10, y: 27.5, width: 10, height: 20 }},

            //symbol
            {type:'rect', name:'symbol_line1',  data:{ x:3.5,  y:38.5, width:1, height:2,  style:style.markings }},
            {type:'rect', name:'symbol_line2',  data:{ x:5.5,  y:37,   width:1, height:5,  style:style.markings }},
            {type:'rect', name:'symbol_line3',  data:{ x:7.5,  y:35.5, width:1, height:8,  style:style.markings }},
            {type:'rect', name:'symbol_line4',  data:{ x:9.5,  y:34.5, width:1, height:10, style:style.markings }},
            {type:'rect', name:'symbol_line5',  data:{ x:11.5, y:35.5, width:1, height:8,  style:style.markings }},
            {type:'rect', name:'symbol_line6',  data:{ x:13.5, y:37,   width:1, height:5,  style:style.markings }},
            {type:'rect', name:'symbol_line7',  data:{ x:15.5, y:39,   width:1, height:1,  style:style.markings }},
            {type:'rect', name:'symbol_line8',  data:{ x:17.5, y:36,   width:1, height:7,  style:style.markings }},
            {type:'rect', name:'symbol_line9',  data:{ x:19.5, y:32,   width:1, height:15, style:style.markings }},
            {type:'rect', name:'symbol_line10', data:{ x:21.5, y:34.5, width:1, height:10, style:style.markings }},
            {type:'rect', name:'symbol_line11', data:{ x:23.5, y:37,   width:1, height:5,  style:style.markings }},
            {type:'rect', name:'symbol_line12', data:{ x:25.5, y:38.5, width:1, height:2,  style:style.markings }},
            

            {type:'readout_sixteenSegmentDisplay', name:'trackNameReadout', data:{
                x: 30, y: 5, angle:0, width:100, height:20, count:10, 
                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
            }},
            {type:'readout_sixteenSegmentDisplay', name:'time', data:{
                x: 135, y: 5, angle:0, width:80, height:20, count:8, 
                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
            }},

            {type:'button_rect', name:'load', data: {
                x:5, y: 5, width:20, height:10,
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                },
                onclick: function(){
                    obj.player.load('file',function(data){
                        design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.player.waveformSegment() );                   
                        design.grapher_waveWorkspace.grapher_waveWorkspace.select(0);
                        design.grapher_waveWorkspace.grapher_waveWorkspace.area(-1,-1);
                    
                        design.readout_sixteenSegmentDisplay.trackNameReadout.text(data.name);
                        design.readout_sixteenSegmentDisplay.trackNameReadout.print('smart');
                    });
                }
            }},
            {type:'button_rect',name:'start',data:{
                x:5, y: 17.5, width:20, height:10, 
                style:{
                    up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', 
                    down:'fill:rgba(150,170,150,1)', glow:'fill:rgba(220,220,220,1)'
                }, 
                onclick:function(){ obj.player.start(); }
            }},
            {type:'button_rect',name:'stop',data:{
                x:15, y: 17.5, width:10, height:10, 
                style:{
                    up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', 
                    down:'fill:rgba(170,150,150,1)', glow:'fill:rgba(240,200,220,1)'
                }, 
                onclick:function(){ obj.player.stop(); }
            }},
            {type:'label', name:'rate_label_name', data:{ x:10, y:78, text:'rate', style:style.text }},
            {type:'label', name:'rate_label_0', data:{ x:5, y:75, text:'0', style:style.text }},
            {type:'label', name:'rate_label_1', data:{ x:13.7, y:54, text:'1', style:style.text }},
            {type:'label', name:'rate_label_2', data:{ x:23, y:75, text:'2', style:style.text }},
            {type:'dial_continuous',name:'rate',data:{
                x:15, y:65, r: 9, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, 
                style:{outerArc:'stroke:rgba(50,50,50,0.25); fill:none;'},
                onchange:function(data){ obj.player.rate( 2*data ); },
            }},

            {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                x:30, y:30, width:185, height:45,
                selectionAreaToggle:function(bool){ obj.player.loop({active:bool}); },
                onchange:function(needle,value){
                    if(needle == 'lead'){ obj.player.jumpTo(value); }
                    else if(needle == 'selection_A' || needle == 'selection_B'){
                        var temp = design.grapher_waveWorkspace.grapher_waveWorkspace.area();
                        if(temp.A < temp.B){ obj.player.loop({start:temp.A,end:temp.B}); }
                        else{ obj.player.loop({start:temp.B,end:temp.A}); }
                    }
                },
            }},
        ]
    };

    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.player,design);

    //circuitry
        //audio file player
            obj.player = new parts.circuits.audio.player(__globals.audio.context);
            obj.player.out_right().connect( design.connectionNode_audio.outRight.in() );
            obj.player.out_left().connect( design.connectionNode_audio.outLeft.in() );

        //data refresh
            function refresh(){
                //check if there's a track at all
                    if( !obj.player.isLoaded() ){return;}

                //time readout
                    var time = __globals.utility.math.seconds2time( Math.round(obj.player.currentTime()));

                    design.readout_sixteenSegmentDisplay.time.text(
                        __globals.utility.misc.padString(time.h,2,'0')+':'+
                        __globals.utility.misc.padString(time.m,2,'0')+':'+
                        __globals.utility.misc.padString(time.s,2,'0')
                    );
                    design.readout_sixteenSegmentDisplay.time.print();

                //wave box
                    design.grapher_waveWorkspace.grapher_waveWorkspace.select(obj.player.progress());
            }
            setInterval(refresh,1000/30);

    //interface
        obj.i = {
            loadByURL:function(url){
                obj.player.load('url',function(data){
                    design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.player.waveformSegment() );                   
                    design.grapher_waveWorkspace.grapher_waveWorkspace.select(0);
                    design.grapher_waveWorkspace.grapher_waveWorkspace.area(-1,-1);
                
                    design.readout_sixteenSegmentDisplay.trackNameReadout.text(data.name);
                    design.readout_sixteenSegmentDisplay.trackNameReadout.print('smart');
                },url);
            },
        };

    //setup
        design.dial_continuous.rate.set(0.5);

    return obj;
};
