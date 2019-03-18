this.recorder = function(x,y,a){
    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        h1: {fill:'rgba(100,100,100,1)', font:'6pt Bookman'},
        h2: {fill:'rgba(0,0,0,1)', font:'4pt Courier New'},
        button:{
            background__up__fill:'rgba(175,175,175,1)', 
            background__hover__fill:'rgba(220,220,220,1)', 
            background__hover_press__fill:'rgba(150,150,150,1)',
        },
        readout_sixteenSegmentDisplay_static:{background:'rgb(0,0,0)', glow:'rgb(200,200,200)',dim:'rgb(20,20,20)'},
    };
    var design = {
        name: 'recorder',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:175,y:0},{x:175,y:40},{x:0,y:40}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:175,y:0},{x:175,y:40},{x:0,y:40}], style:style.background }},

            {type:'connectionNode_audio', name:'inRight', data: {x:175, y:2.5, width:10, height:15}},
            {type:'connectionNode_audio', name:'inLeft', data: {x:175, y:22.5, width:10, height:15}},


            //logo label
                {type:'rectangle', name:'logo_rect', data:{x:135, y:27.5, angle:-0.25, width:35, height:10, style:{fill:'rgb(230,230,230)'}}},
                {type:'text', name:'logo_label', data:{x:139, y:34.5, angle:-0.25, text:'REcorder', style:style.h1}},

            //rec
                {type:'button_rectangle', name:'rec', data: {
                    x:5, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){
                        if(state == 'paused'){object.recorder.resume();}
                        else{object.recorder.start();}
                        updateLights('rec');
                    }
                }},
                {type:'text', name:'button_rectangle_text', data:{x:10.5, y:31.5, text:'rec', angle:0, style:style.h2}},
            //pause/resume
                {type:'button_rectangle', name:'pause/resume', data: {
                    x:27.5, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){
                        if(state == 'paused'){object.recorder.resume();}
                        else{object.recorder.pause();}
                        updateLights('pause/resume');
                    }
                }},
                {type:'text', name:'button_pause/resume_text', data:{x:30, y:31.5, text:'pause', angle:0, style:style.h2}},
            //stop
                {type:'button_rectangle', name:'stop', data: {
                    x:50, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){updateLights('stop');object.recorder.stop();}
                }},
                {type:'text', name:'button_stop_text', data:{x:54, y:31.5, text:'stop', angle:0, style:style.h2}},
            //save
                {type:'button_rectangle', name:'save', data: {
                    x:72.5, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){
                        updateLights('save');
                        if(state != 'empty'){ object.recorder.save(); }
                    }
                }},
                {type:'text', name:'button_save_text', data:{x:76.5, y:31.5, text:'save', angle:0, style:style.h2}},
            //clear
                {type:'button_rectangle', name:'clear', data: {
                    x:95, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){updateLights('clear');object.recorder.clear();}
                }},
                {type:'text', name:'button_clear_text', data:{x:97.5, y:31.5, text:'clear', angle:0, style:style.h2}},

            //time readout
                {type:'readout_sixteenSegmentDisplay_static', name:'time', data:{
                    x: 70, y: 5, angle:0, width:100, height:15, count:11, style:style.readout_sixteenSegmentDisplay_static
                }},

            //activity lights
                //recording
                    {type:'glowbox_rect', name:'activityLight_recording', data:{x:5, y:5, width:15, height:15, style:{glow:'rgb(255, 63, 63)', dim:'rgb(25, 6, 6)'}}},
                    {type:'text', name:'activityLight_recording_text', data:{x:8, y:14, text:'rec', angle:0, style:style.h2}},
                //paused
                    {type:'glowbox_rect', name:'activityLight_paused', data:{x:20, y:5, width:15, height:15, style:{glow:'rgb(126, 186, 247)', dim:'rgb(12, 18, 24)'}}},
                    {type:'text', name:'activityLight_paused_text', data:{x:23, y:14, text:'pau', angle:0, style:style.h2}},
                //empty
                    {type:'glowbox_rect', name:'activityLight_empty', data:{x:35, y:5, width:15, height:15, style:{glow:'rgb(199, 249, 244)', dim:'rgb(19, 24, 24)'}}},
                    {type:'text', name:'activityLight_empty_text', data:{x:38, y:14, text:'emp', angle:0, style:style.h2}},
                //ready to save
                    {type:'glowbox_rect', name:'activityLight_full', data:{x:50, y:5, width:15, height:15, style:{glow:'rgb(61, 224, 35)', dim:'rgb(6, 22, 3)'}}},
                    {type:'text', name:'activityLight_full_text', data:{x:53, y:14, text:'ful', angle:0, style:style.h2}},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.recorder,design);

    //circuitry
        //update functions
            //time readout
                setInterval(function(){
                    var time = object.recorder.recordingTime();
                    var decimalValues = time % 1;
                    time = _canvas_.library.math.seconds2time( Math.round(time) );

                    object.elements.readout_sixteenSegmentDisplay_static.time.text(
                        _canvas_.library.misc.padString(time.h,2,'0')+':'+
                        _canvas_.library.misc.padString(time.m,2,'0')+':'+
                        _canvas_.library.misc.padString(time.s,2,'0')+'.'+
                        _canvas_.library.misc.padString((''+decimalValues).slice(2),2,'0')
                    );
                    object.elements.readout_sixteenSegmentDisplay_static.time.print();
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

                    if(state == 'empty'){object.elements.glowbox_rect.activityLight_empty.on();}else{object.elements.glowbox_rect.activityLight_empty.off();}
                    if(state == 'recording'){object.elements.glowbox_rect.activityLight_recording.on();}else{object.elements.glowbox_rect.activityLight_recording.off();}
                    if(state == 'paused'){object.elements.glowbox_rect.activityLight_paused.on();}else{object.elements.glowbox_rect.activityLight_paused.off();}
                    if(state == 'full'){object.elements.glowbox_rect.activityLight_full.on();}else{object.elements.glowbox_rect.activityLight_full.off();}
                }
                updateLights('clear');
                object.elements.glowbox_rect.activityLight_empty.on();

        //audio recorder
            object.recorder = new _canvas_.interface.circuit.recorder(_canvas_.library.audio.context);
            object.elements.connectionNode_audio.inRight.out().connect( object.recorder.in_right() );
            object.elements.connectionNode_audio.inLeft.out().connect( object.recorder.in_left() );

    return object;
};

this.recorder.metadata = {
    name:'Recorder',
    category:'audioFile',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/recorder/'
};
