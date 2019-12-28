this.audio_duplicator = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'audio_duplicator/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:320, height:320 },
                    design: { width:5, height:5 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        const reverseOffset = (unitStyle.drawingValue.width)*(0.875/10);
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'audio_duplicator',
            x:x, y:y, angle:angle,
            space:[
                { x:reverseOffset,                                                              y:0                                                       },
                { x:reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1.7/10),  y:0                                                       },
                { x:reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(9/10),    y:(unitStyle.drawingValue.height -unitStyle.offset)*(1/5) },
                { x:reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(9/10),    y:(unitStyle.drawingValue.height -unitStyle.offset)*(4/5) },
                { x:reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1.7/10),  y:unitStyle.drawingValue.height -unitStyle.offset         },
                { x:reverseOffset,                                                              y:unitStyle.drawingValue.height -unitStyle.offset         },
                { x:reverseOffset - (unitStyle.drawingValue.width -unitStyle.offset)*(0.9/10),  y:(unitStyle.drawingValue.height -unitStyle.offset)*(4/5) },
                { x:reverseOffset - (unitStyle.drawingValue.width -unitStyle.offset)*(1.25/10), y:(unitStyle.drawingValue.height -unitStyle.offset)*(1/2) },
                { x:reverseOffset - (unitStyle.drawingValue.width -unitStyle.offset)*(0.9/10),  y:(unitStyle.drawingValue.height -unitStyle.offset)*(1/5) },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                    x:unitStyle.drawingValue.width-10/3, y:(unitStyle.drawingValue.height-unitStyle.offset)*0.5 - 15/2, 
                    width:5, height:15, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output_1', data:{ 
                    x:0, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 - 2.5, width:5, height:15, angle:0.15+Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'output_2', data:{ 
                    x:2.25, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 - 2.5 + 20, width:5, height:15, angle:-0.15+Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                }},
                
                {collection:'basic', type:'image', name:'backing', 
                    data:{ 
                        x:-unitStyle.offset/2, y:-unitStyle.offset/2,
                        width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, 
                        url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                    }
                },
            ]
        });

    //wiring
        //io
            object.io.audio.input.out().connect( object.io.audio.output_1.in() );
            object.io.audio.input.out().connect( object.io.audio.output_2.in() );

    return object;
};
this.audio_duplicator.metadata = {
    name:'Audio Duplicator',
    category:'misc',
    helpURL:'/help/units/beta/audio_duplicator/'
};