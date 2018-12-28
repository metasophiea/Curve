this.audioSink = function(x,y){
    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        level:{
            backing:'rgba(10,10,10,1)',
            levels:['rgb(250,250,250)','rgb(200,200,200)'],
            markingStyle_fill:'rgba(220,220,220,1)',
            markingStyle_font:'1pt Courier New',
        },
    };
    var design = {
        name:'audioSink',
        category:'humanOutputDevices',
        collection: 'alpha',
        x:x, y:y,
        space:[{x:0,y:0},{x:30,y:0},{x:30,y:55},{x:0,y:55}],
        // spaceOutline: true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:30,y:0},{x:30,y:55},{x:0,y:55}], style:style.background }},

            {type:'connectionNode_audio', name:'audioInput_right', data:{ x:30, y:5, width:10, height:20 }},
            {type:'connectionNode_audio', name:'audioInput_left', data:{ x:30, y:30, width:10, height:20 }},
            {type:'audio_meter_level', name:'audioLevel_right', data:{ x:15, y:5, width:10, height:45, style:style.level }},
            {type:'audio_meter_level', name:'audioLevel_left', data:{ x:5, y:5, width:10, height:45, style:style.level }},
        ],
    };
 
    //main object
        var object = interfaceUnit.builder(this.audioSink,design);

    //circuitry
        var flow = {
            destination:null,
            stereoCombiner: null,
            pan_left:null, pan_right:null,
        };
        //destination
            flow._destination = workspace.library.audio.destination;

        //stereo channel combiner
            flow.stereoCombiner = new ChannelMergerNode(workspace.library.audio.context, {numberOfInputs:2});

        //audio connections
            //inputs to meters
                object.elements.connectionNode_audio.audioInput_left.out().connect( object.elements.audio_meter_level.audioLevel_left.audioIn() );
                object.elements.connectionNode_audio.audioInput_right.out().connect(object.elements.audio_meter_level.audioLevel_right.audioIn());
            //inputs to stereo combiner
                object.elements.connectionNode_audio.audioInput_left.out().connect(flow.stereoCombiner, 0, 0);
                object.elements.connectionNode_audio.audioInput_right.out().connect(flow.stereoCombiner, 0, 1);
            //stereo combiner to main output
                flow.stereoCombiner.connect(flow._destination);

            //start audio meters
                object.elements.audio_meter_level.audioLevel_left.start();
                object.elements.audio_meter_level.audioLevel_right.start();

    return object;
};

this.audioSink.metadata = {
    name:'Audio Sink',
    helpURL:'https://metasophiea.com/curve/help/units/alpha/audioSink/'
};