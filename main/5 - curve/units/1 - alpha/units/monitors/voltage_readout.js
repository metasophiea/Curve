this.voltage_readout = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'voltage_readout/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:440, height:290 },
                    design: { width:7, height:4.5 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.gauge = {needles:[{r:0,g:0,b:0,a:1}]};
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'voltage_readout',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_voltage', name:'in', data:{ 
                    x:unitStyle.drawingValue.width-3.5, y:unitStyle.drawingValue.height-15, width:5, height:10, angle:0, cableVersion:2, style:style.connectionNode.voltage,
                }},
                {collection:'basic', type:'image', name:'backing', data:{ 
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                } },
                {collection:'display', type:'gauge_image', name:'gauge', data:{ 
                    x:5, y:5, width:55, height:35,
                    backingURL:unitStyle.imageStoreURL_localPrefix+'gauge_backing.png',
                    style:unitStyle.gauge,
                }, },
            ]
        });

    //wiring
        //io
            object.io.voltage.in.onchange = function(value){
                object.elements.gauge_image.gauge.needle( Math.abs(value) );
            };

    return object;
};
this.voltage_readout.metadata = {
    name:'Voltage Readout',
    category:'monitors',
    helpURL:'/help/units/alpha/voltage_readout/'
};