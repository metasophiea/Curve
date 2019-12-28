this.voltage_duplicator = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'voltage_duplicator/';

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
            model:'voltage_duplicator',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                                   },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:(unitStyle.drawingValue.height -unitStyle.offset)/2 },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset     },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset     },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_voltage', name:'input', data:{ 
                    x:unitStyle.drawingValue.width-10/3, y:(unitStyle.drawingValue.height-unitStyle.offset)*0.75 - 5, width:5, height:10, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'output_1', data:{ 
                    x:0, y:(unitStyle.drawingValue.height-unitStyle.offset)/2, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'output_2', data:{
                    x:0, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 + 15, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.voltage,
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
            object.io.voltage.input.onchange = function(value){ object.io.voltage.output_1.set(value); object.io.voltage.output_2.set(value); };

    return object;
};
this.voltage_duplicator.metadata = {
    name:'Voltage Duplicator',
    category:'misc',
    helpURL:'/help/units/beta/voltage_duplicator/'
};