this.audioSink = function(x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        level:{
            backing:{r:10/255,g:10/255,b:10/255,a:1},
            levels:[{r:250/255,g:250/255,b:250/255,a:1},{r:150/255,g:150/255,b:150/255,a:1}],
            markingStyle_fill:{r:220/255,g:220/255,b:220/255,a:1},
            markingStyle_font:'defaultThin',
            markingStyle_size:1,
        },
    };
    var design = {
        name:'audioSink',
        category:'humanOutputDevices',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:30,y:0},{x:30,y:55},{x:0,y:55}],
        // spaceOutline: true,
        elements:[
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:30,y:0},{x:30,y:55},{x:0,y:55}], colour:style.background }},

            {collection:'dynamic', type:'connectionNode_audio', name:'audioInput_right', data:{ x:30, y:5, width:10, height:20 }},
            {collection:'dynamic', type:'connectionNode_audio', name:'audioInput_left', data:{ x:30, y:30, width:10, height:20 }},
            {collection:'display', type:'audio_meter_level', name:'audioLevel_right', data:{ x:15, y:5, width:10, height:45, style:style.level }},
            {collection:'display', type:'audio_meter_level', name:'audioLevel_left', data:{ x:5, y:5, width:10, height:45, style:style.level }},
        ],
    };
 
    //main object
        var object = _canvas_.interface.unit.builder(this.audioSink,design);

    //circuitry
        var flow = {
            destination:null,
            stereoCombiner: null,
            pan_left:null, pan_right:null,
        };
        //destination
            flow._destination = _canvas_.library.audio.destination;

        //stereo channel combiner
            flow.stereoCombiner = new ChannelMergerNode(_canvas_.library.audio.context, {numberOfInputs:2});

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
    category:'humanOutputDevices',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/audioSink/'
};