this.data_duplicator = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'data_duplicator/';

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
            model:'data_duplicator',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                                      y:0                                                       },
                { x:(unitStyle.drawingValue.width -unitStyle.offset)*(3/5), y:0                                                       },
                { x:unitStyle.drawingValue.width -unitStyle.offset,         y:(unitStyle.drawingValue.height -unitStyle.offset)*(1/5) },
                { x:unitStyle.drawingValue.width -unitStyle.offset,         y:(unitStyle.drawingValue.height -unitStyle.offset)*(4/5) },
                { x:(unitStyle.drawingValue.width -unitStyle.offset)*(3/5), y:unitStyle.drawingValue.height -unitStyle.offset         },
                { x:0,                                                      y:unitStyle.drawingValue.height -unitStyle.offset         },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_data', name:'input', data:{ 
                    x:unitStyle.drawingValue.width-10/3, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 - 15/2, width:5, height:15, cableVersion:2, style:style.connectionNode.data,
                }},
                {collection:'dynamic', type:'connectionNode_data', name:'output_1', data:{ 
                    x:0, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 - 2.5, width:5, height:15, angle:Math.PI, cableVersion:2, style:style.connectionNode.data,
                }},
                {collection:'dynamic', type:'connectionNode_data', name:'output_2', data:{ 
                    x:0, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 - 2.5 + 20, width:5, height:15, angle:Math.PI, cableVersion:2, style:style.connectionNode.data,
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
            object.io.data.input.onreceive = function(address,data){
                object.io.data.output_1.send(address,data);
                object.io.data.output_2.send(address,data);
            };

    return object;
};
this.data_duplicator.metadata = {
    name:'Data Duplicator',
    category:'routing',
    helpURL:'/help/units/alpha/data_duplicator/'
};