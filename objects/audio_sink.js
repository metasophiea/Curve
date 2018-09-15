this.audio_sink = function(x,y){
    var style = {
        background:'fill:rgba(200,200,200,1)',
        level:{
            backing:'fill:rgb(10,10,10)', 
            levels:['fill:rgb(250,250,250);','fill:rgb(200,200,200);'],
            marking:'fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'
        },
    };
    var design = {
        type:'audio_sink',
        x:x, y:y,
        base:{
            points:[{x:0,y:0},{x:100,y:0},{x:100,y:55},{x:0,y:55}], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'right', data:{
                type:0, x:90, y:5, width:20, height:20
            }},
            {type:'connectionNode_audio', name:'left', data:{
                type:0, x:90, y:30, width:20, height:20
            }},
            {type:'audio_meter_level', name:'right', data:{
                x:10, y:5, width:5, height:45, 
                style:{backing:style.backing, levels:style.levels, markings:style.markings},
            }},
            {type:'audio_meter_level', name:'left', data:{
                x:5, y:5, width:5, height:45,
                style:{backing:style.backing, levels:style.levels, markings:style.markings},
            }},
        ],
    };
 
    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.audio_sink,design);

    //circuitry
        var flow = {
            destination:null,
            stereoCombiner: null,
            pan_left:null, pan_right:null,
        };
        //destination
            flow._destination = __globals.audio.destination;

        //stereo channel combiner
            flow.stereoCombiner = new ChannelMergerNode(__globals.audio.context, {numberOfInputs:2});

        //audio connections
            //inputs to meters
                design.connectionNode_audio.left.out().connect( design.audio_meter_level.left.audioIn() );
                design.connectionNode_audio.right.out().connect(design.audio_meter_level.right.audioIn());
            //inputs to stereo combiner
                design.connectionNode_audio.left.out().connect(flow.stereoCombiner, 0, 0);
                design.connectionNode_audio.right.out().connect(flow.stereoCombiner, 0, 1);
            //stereo combiner to main output
                flow.stereoCombiner.connect(flow._destination);

            //start audio meters
                design.audio_meter_level.left.start();
                design.audio_meter_level.right.start();
    return obj;
};

this.audio_sink.metadata = {
    name:'Audio Sink',
    helpurl:'https://metasophiea.com/curve/help/object/audioSink/'
};