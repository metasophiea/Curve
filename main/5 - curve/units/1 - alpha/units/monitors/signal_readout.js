this.signal_readout = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'signal_readout/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:320, height:290 },
                    design: { width:5, height:4.5 },
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
            model:'signal_readout',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'in', data:{ 
                    x:unitStyle.drawingValue.width-3.5, y:unitStyle.drawingValue.height-15, width:5, height:10, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },
                {collection:'display', type:'glowbox_image', name:'lamp', 
                    data:{ 
                        x:5, y:5, width:35, height:35,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                }
            ]
        });

    //wiring
        //io
            object.io.signal.in.onchange = function(value){
                if(value){ object.elements.glowbox_image.lamp.on(); }
                else{ object.elements.glowbox_image.lamp.off(); }
            };

    return object;
};
this.signal_readout.metadata = {
    name:'Signal Readout',
    category:'monitors',
    helpURL:'/help/units/alpha/signal_readout/'
};