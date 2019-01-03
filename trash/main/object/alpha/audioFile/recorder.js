this.recorder = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
        text:'fill:rgba(0,0,0,1); font-size:5px; font-family:Courier New; pointer-events: none;',
        buttonText:'fill:rgba(100,100,100,1); font-size:5px; font-family:Courier New; pointer-events: none;',
        logoText:'fill:rgba(100,100,100,1); font-size:8px; font-family:Bookman; pointer-events: none;',
    };
    var design = {
        name: 'recorder',
        collection: 'alpha',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:175,y:0},{x:175,y:40},{x:0,y:40}], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'inRight',  data: {type: 0, x: 175, y: 2.5, width: 10, height: 15}},
            {type:'connectionNode_audio', name:'inLeft',   data: {type: 0, x: 175, y: 22.5, width: 10, height: 15}},


            //logo label
                {type:'rect', name:'logo_rect', data:{x:135, y:27.5, angle:-0.25, width:35, height:10, style:'fill:rgb(230,230,230)'}},
                {type:'label', name:'logo_label', data:{x:139, y:34.5, angle:-0.25, text:'REcorder', style:style.logoText}},

            //rec
                {type:'button_rect', name:'rec', data: {
                    x:5, y: 25, width:20, height:10,
                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                    onpress: function(){
                        if(state == 'paused'){obj.recorder.resume();}
                        else{obj.recorder.start();}
                        updateLights('rec');
                    }
                }},
                {type:'text', name:'button_rect_text', data:{x:10.5, y:31.5, text:'rec', angle:0, style:style.buttonText}},
            //pause/resume
                {type:'button_rect', name:'pause/resume', data: {
                    x:27.5, y: 25, width:20, height:10,
                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                    onpress: function(){
                        if(state == 'paused'){obj.recorder.resume();}
                        else{obj.recorder.pause();}
                        updateLights('pause/resume');
                    }
                }},
                {type:'text', name:'button_pause/resume_text', data:{x:30, y:31.5, text:'pause', angle:0, style:style.buttonText}},
            //stop
                {type:'button_rect', name:'stop', data: {
                    x:50, y: 25, width:20, height:10,
                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                    onpress: function(){updateLights('stop');obj.recorder.stop();}
                }},
                {type:'text', name:'button_stop_text', data:{x:54, y:31.5, text:'stop', angle:0, style:style.buttonText}},
            //save
                {type:'button_rect', name:'save', data: {
                    x:72.5, y: 25, width:20, height:10, 
                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                    onpress: function(){
                        updateLights('save');
                        if(state != 'empty'){ obj.recorder.save(); }
                    }
                }},
                {type:'text', name:'button_save_text', data:{x:76.5, y:31.5, text:'save', angle:0, style:style.buttonText}},
            //clear
                {type:'button_rect', name:'clear', data: {
                    x:95, y: 25, width:20, height:10, 
                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                    onpress: function(){updateLights('clear');obj.recorder.clear();}
                }},
                {type:'text', name:'button_clear_text', data:{x:97.5, y:31.5, text:'clear', angle:0, style:style.buttonText}},

            //time readout
                {type:'readout_sixteenSegmentDisplay', name:'time', data:{
                    x: 70, y: 5, angle:0, width:100, height:15, count:11, 
                    style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                }},

            //activity lights
                //recording
                    {type:'glowbox_rect', name:'activityLight_recording', data:{x:5, y:5, width:15, height:15, style:{glow:'fill:rgb(255, 63, 63)', dim:'fill:rgb(25, 6, 6)'}}},
                    {type:'text', name:'activityLight_recording_text', data:{x:8, y:14, text:'rec', angle:0, style:style.text}},
                //paused
                    {type:'glowbox_rect', name:'activityLight_paused', data:{x:20, y:5, width:15, height:15, style:{glow:'fill:rgb(126, 186, 247)', dim:'fill:rgb(12, 18, 24)'}}},
                    {type:'text', name:'activityLight_paused_text', data:{x:23, y:14, text:'pau', angle:0, style:style.text}},
                //empty
                    {type:'glowbox_rect', name:'activityLight_empty', data:{x:35, y:5, width:15, height:15, style:{glow:'fill:rgb(199, 249, 244)', dim:'fill:rgb(19, 24, 24)'}}},
                    {type:'text', name:'activityLight_empty_text', data:{x:38, y:14, text:'emp', angle:0, style:style.text}},
                //ready to save
                    {type:'glowbox_rect', name:'activityLight_full', data:{x:50, y:5, width:15, height:15, style:{glow:'fill:rgb(61, 224, 35)', dim:'fill:rgb(6, 22, 3)'}}},
                    {type:'text', name:'activityLight_full_text', data:{x:53, y:14, text:'ful', angle:0, style:style.text}},
        ]
    };

    //main object
        var obj = object.builder(object.alpha.recorder,design);

    //circuitry
        //update functions
            //time readout
                setInterval(function(){
                    var time = obj.recorder.recordingTime();
                    var decimalValues = time % 1;
                    time = system.utility.math.seconds2time( Math.round(time) );

                    design.readout_sixteenSegmentDisplay.time.text(
                        system.utility.misc.padString(time.h,2,'0')+':'+
                        system.utility.misc.padString(time.m,2,'0')+':'+
                        system.utility.misc.padString(time.s,2,'0')+'.'+
                        system.utility.misc.padString((''+decimalValues).slice(2),2,'0')
                    );
                    design.readout_sixteenSegmentDisplay.time.print();
                },100);
            //lights
                var state = 'empty'; //empty - recording - paused - full
                function updateLights(action){
                    if( state == 'empty' && (action == 'save' || action == 'stop') ){return;}
                    if( action == 'stop' || action == 'save' ){ state = 'full'; }
                    if( state == 'empty' && action == 'rec' ){ state = 'recording'; }
                    if( action == 'clear' ){ state = 'empty'; }
                    if( state == 'recording' && action == 'pause/resume' ){ state = 'paused'; }
                    else if( state == 'paused' && (action == 'pause/resume' || action == 'rec') ){ state = 'recording'; }

                    if(state == 'empty'){design.glowbox_rect.activityLight_empty.on();}else{design.glowbox_rect.activityLight_empty.off();}
                    if(state == 'recording'){design.glowbox_rect.activityLight_recording.on();}else{design.glowbox_rect.activityLight_recording.off();}
                    if(state == 'paused'){design.glowbox_rect.activityLight_paused.on();}else{design.glowbox_rect.activityLight_paused.off();}
                    if(state == 'full'){design.glowbox_rect.activityLight_full.on();}else{design.glowbox_rect.activityLight_full.off();}
                }
                updateLights('clear');
                design.glowbox_rect.activityLight_empty.on();

        //audio recorder
            obj.recorder = new part.circuit.audio.recorder(system.audio.context);
            design.connectionNode_audio.inRight.out().connect( obj.recorder.in_right() );
            design.connectionNode_audio.inLeft.out().connect( obj.recorder.in_left() );

    return obj;
};

this.recorder.metadata = {
    name:'Recorder',
    helpurl:'https://metasophiea.com/curve/help/objects/recorder/'
};
