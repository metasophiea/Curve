this.data_combiner = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'data_combiner/';

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
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'data_combiner',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                                      y:(unitStyle.drawingValue.height -unitStyle.offset)*(1/5) },
                { x:(unitStyle.drawingValue.width -unitStyle.offset)*(2/5), y:0                                                       },
                { x:unitStyle.drawingValue.width -unitStyle.offset,         y:0                                                       },
                { x:unitStyle.drawingValue.width -unitStyle.offset,         y:unitStyle.drawingValue.height -unitStyle.offset         },
                { x:(unitStyle.drawingValue.width -unitStyle.offset)*(2/5), y:unitStyle.drawingValue.height -unitStyle.offset         },
                { x:0,                                                      y:(unitStyle.drawingValue.height -unitStyle.offset)*(4/5) },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_data', name:'output', data:{ 
                    x:0, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 + 15/2, width:5, height:15, angle:Math.PI, cableVersion:2, style:style.connectionNode.data
                }},
                {collection:'dynamic', type:'connectionNode_data', name:'input_1', data:{ 
                    x:unitStyle.drawingValue.width -3 -1/3, y:7.5, width:5, height:15, cableVersion:2, style:style.connectionNode.data
                }},
                {collection:'dynamic', type:'connectionNode_data', name:'input_2', data:{ 
                    x:unitStyle.drawingValue.width -3 -1/3, y:27.5, width:5, height:15, cableVersion:2, style:style.connectionNode.data
                }},
                {collection:'basic', type:'image', name:'backing', data:{ 
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                }},
            ]
        });

    //wiring
        //io
            object.io.data.input_1.onreceive = function(address,data){ object.io.data.output.send(address,data); };
            object.io.data.input_2.onreceive = function(address,data){ object.io.data.output.send(address,data); };
    
    return object;
};
this.data_combiner.metadata = {
    name:'Data Combiner',
    category:'misc',
    helpURL:'/help/units/alpha/data_combiner/'
};