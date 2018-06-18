objects.testObject_recorder2 = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
        text:'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'
    };
    var design = {
        type: 'testObject_recorder',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:220,y:0},{x:220,y:220},{x:0,y:220}], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'inRight',  data: {type: 0, x: 220, y: 5, width: 10, height: 20}},
            {type:'connectionNode_audio', name:'inLeft',   data: {type: 0, x: 220, y: 27.5, width: 10, height: 20}},
            {type:'connectionNode_audio', name:'outRight', data: {type: 1, x: -10, y: 5, width: 10, height: 20}},
            {type:'connectionNode_audio', name:'outLeft',  data: {type: 1, x: -10, y: 27.5, width: 10, height: 20}},

            {type:'button_rect', name:'rec', data: {
                x:5, y: 5, width:20, height:20,
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                },
                onclick: function(){ obj.recorder.start(); }
            }},
            {type:'text', name:'text_rec', data:{x: 30, y: 17.5, text: 'rec', style: style.text}},

            {type:'button_rect', name:'stop', data: {
                x:5, y: 30, width:20, height:20,
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                },
                onclick: function(){ obj.recorder.stop(); }
            }},
            {type:'text', name:'text_stop', data:{x: 30, y: 42.5, text: 'stop', style: style.text}},

            {type:'button_rect', name:'save', data: {
                x:5, y: 55, width:20, height:20,
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                },
                onclick: function(){ obj.recorder.save(); }
            }},
            {type:'text', name:'text_save', data:{x: 30, y: 67.5, text: 'save', style: style.text}},

            {type:'button_rect', name:'clear', data: {
                x:5, y: 80, width:20, height:20,
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                },
                onclick: function(){ obj.recorder.clear(); }
            }},
            {type:'text', name:'text_clear', data:{x: 30, y: 92.5, text: 'clear', style: style.text}},

            {type:'button_rect', name:'pause', data: {
                x:5, y: 105, width:20, height:20,
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                },
                onclick: function(){ obj.recorder.pause(); }
            }},
            {type:'text', name:'text_pause', data:{x: 30, y: 117.5, text: 'pause', style: style.text}},

            {type:'button_rect', name:'resume', data: {
                x:5, y: 130, width:20, height:20,
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                },
                onclick: function(){ obj.recorder.resume(); }
            }},
            {type:'text', name:'text_resume', data:{x: 30, y: 142.5, text: 'resume', style: style.text}},
        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.testObject_recorder2,design);

    //circuitry
        //audio recorder
        obj.recorder = new parts.audio.recorder2(__globals.audio.context);
        design.connectionNode_audio.inRight.out().connect( obj.recorder.in_right() );
        design.connectionNode_audio.inLeft.out().connect( obj.recorder.in_left() );
        obj.recorder.out_right().connect( design.connectionNode_audio.outRight.in() );
        obj.recorder.out_left().connect( design.connectionNode_audio.outLeft.in() );

        // //costant readout
        // setInterval(function(){
        //     console.log( obj.recorder.state() );
        //     console.log( obj.recorder.recordingTime() );
        //     console.log( obj.recorder.getTrack() );
        //     console.log('');
        // },500);

    return obj;
};