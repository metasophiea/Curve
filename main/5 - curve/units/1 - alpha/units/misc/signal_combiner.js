this.signal_combiner= function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'signal_combiner/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:260, height:260 },
                    design: { width:4, height:4 },
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
            model:'signal_combiner',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:(unitStyle.drawingValue.height -unitStyle.offset)*0.25 },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0 },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset        },
                { x:0,                                              y:(unitStyle.drawingValue.height -unitStyle.offset)*0.75 },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'output', data:{ 
                    x:0, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 + 5, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.signal 
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'input_1', data:{ 
                    x:unitStyle.drawingValue.width-3-1/3, y:7.5, width:5, height:10, cableVersion:2, style:style.connectionNode.signal 
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'input_2', data:{ 
                    x:unitStyle.drawingValue.width-3-1/3, y:unitStyle.drawingValue.height-20.5-1/3, width:5, height:10, cableVersion:2, style:style.connectionNode.signal 
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
            object.io.signal.input_1.onchange = function(value){ object.io.signal.output.set(value || object.io.signal.input_2.read()); };
            object.io.signal.input_2.onchange = function(value){ object.io.signal.output.set(value || object.io.signal.input_1.read()); };

    return object;
};
this.signal_combiner.metadata = {
    name:'Signal Combiner',
    category:'misc',
    helpURL:'/help/units/beta/signal_combiner/'
};