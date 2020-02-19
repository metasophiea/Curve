this.light_panel_2 = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'light_panel/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:290, height:130 },
                    design: { width:2.9, height:1.3 },
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
            model:'light_panel_2',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'in_0', data:{ 
                    x:1.8 + (12.4/2) + 10/2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_1', data:{ 
                    x:1.8 + 13 + (12.4/2) + 10/2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'2_backing.png' }
                },
                {collection:'display', type:'glowbox_image', name:'lamp_0', 
                    data:{ 
                        x:1.8, y:4.8, width:12.4, height:6.4,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'display', type:'glowbox_image', name:'lamp_1', 
                    data:{ 
                        x:1.8 + 13, y:4.8, width:12.4, height:6.4,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                }
            ]
        });
    
    //wiring
        //io
            for(let a = 0; a <= 1; a++){
                object.io.signal['in_'+a].onchange = (function(a){ return function(value){
                    const lamp = object.elements.glowbox_image['lamp_'+a];
                    value ? lamp.on() : lamp.off();
                }; })(a);
            }

    return object;
};
this.light_panel_2.metadata = {
    name:'Light Panel - Type A',
    category:'interface',
    helpURL:'/help/units/curvetech/light_panel_2/'
};