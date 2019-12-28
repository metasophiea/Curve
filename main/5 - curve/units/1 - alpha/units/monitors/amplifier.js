this.amplifier = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'amplifier/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:935, height:860 },
                    design: { width:15.5, height:14.25 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'amplifier',
            x:x, y:y, angle:angle,
            space:[
                {x:0,                                              y:0},
                {x:unitStyle.drawingValue.width -unitStyle.offset, y:0},
                {x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset},
                {x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset},
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input_L', data:{
                    x:unitStyle.drawingValue.width-unitStyle.offset,
                    y:unitStyle.drawingValue.height-unitStyle.offset-20,
                    width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'input_R', data:{ 
                    x:unitStyle.drawingValue.width-unitStyle.offset,
                    y:unitStyle.drawingValue.height-unitStyle.offset-40,
                    width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio,
                }},

                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },
            ]
        });

    //circuitry
        const flow = {
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