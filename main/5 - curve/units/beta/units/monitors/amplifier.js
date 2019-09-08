this.amplifier = function(x,y,a){
    var width = 935; var height = 860;
    var shape = [
        {x:0,y:0},
        {x:width/6,y:0},
        {x:width/6,y:height/6},
        {x:0,y:height/6},
    ];
    var imageStoreURL_localPrefix = imageStoreURL+'amplifier/';
    var design = {
        name:'amplifier',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'input_L', data:{ 
                x:width/6 - 1, y:height/6 - 20, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2,
                style:{
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                }
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'input_R', data:{ 
                x:width/6 - 1, y:height/6 - 20 - 20, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2,
                style:{
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                }
            }},

            {collection:'basic', type:'image', name:'backing', 
                data:{ x: -10/6, y: -10/6, width: (width+20)/6, height: (height+20)/6, url:imageStoreURL_localPrefix+'backing.png' }
            },
        ]
    };

    
    //main object
        var object = _canvas_.interface.unit.builder(design);

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
            //inputs to stereo combiner
                object.elements.connectionNode_audio.input_L.out().connect(flow.stereoCombiner, 0, 0);
                object.elements.connectionNode_audio.input_R.out().connect(flow.stereoCombiner, 0, 1);
            //stereo combiner to main output
                flow.stereoCombiner.connect(flow._destination);

    return object;
};



this.amplifier.metadata = {
    name:'Amplifier',
    category:'monitors',
    helpURL:'/help/units/beta/amplifier/'
};