objects.testObject_recorder1 = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
    };
    var design = {
        type: 'testObject_recorder',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], 
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
            {type:'button_rect', name:'stop', data: {
                x:30, y: 5, width:20, height:20,
                style:{
                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                },
                onclick: function(){ obj.recorder.stop(); }
            }},

        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.testObject_recorder1,design);

    //circuitry
        //audio recorder
        obj.recorder = new parts.audio.recorder1(__globals.audio.context);
        design.connectionNode_audio.inRight.out().connect( obj.recorder.in_right() );
        design.connectionNode_audio.inLeft.out().connect( obj.recorder.in_left() );
        obj.recorder.out_right().connect( design.connectionNode_audio.outRight.in() );
        obj.recorder.out_left().connect( design.connectionNode_audio.outLeft.in() );

    return obj;
};