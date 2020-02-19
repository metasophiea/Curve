this.light_panel_8 = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'light_panel/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:1070, height:130 },
                    design: { width:10.7, height:1.3 },
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
            model:'light_panel_8',
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
                {collection:'dynamic', type:'connectionNode_signal', name:'in_2', data:{ 
                    x:1.8 + 13*2 + (12.4/2) + 10/2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_3', data:{ 
                    x:1.8 + 13*3 + (12.4/2) + 10/2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_4', data:{ 
                    x:1.8 + 13*4 + (12.4/2) + 10/2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_5', data:{ 
                    x:1.8 + 13*5 + (12.4/2) + 10/2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_6', data:{ 
                    x:1.8 + 13*6 + (12.4/2) + 10/2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_7', data:{ 
                    x:1.8 + 13*7 + (12.4/2) + 10/2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'8_backing.png' }
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
                },
                {collection:'display', type:'glowbox_image', name:'lamp_2', 
                    data:{ 
                        x:1.8 + 13*2, y:4.8, width:12.4, height:6.4,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'display', type:'glowbox_image', name:'lamp_3', 
                    data:{ 
                        x:1.8 + 13*3, y:4.8, width:12.4, height:6.4,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'display', type:'glowbox_image', name:'lamp_4', 
                    data:{ 
                        x:1.8 + 13*4, y:4.8, width:12.4, height:6.4,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'display', type:'glowbox_image', name:'lamp_5', 
                    data:{ 
                        x:1.8 + 13*5, y:4.8, width:12.4, height:6.4,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'display', type:'glowbox_image', name:'lamp_6', 
                    data:{ 
                        x:1.8 + 13*6, y:4.8, width:12.4, height:6.4,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'display', type:'glowbox_image', name:'lamp_7', 
                    data:{ 
                        x:1.8 + 13*7, y:4.8, width:12.4, height:6.4,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                }
            ]
        });
    
    //wiring
        //io
            for(let a = 0; a <= 7; a++){
                object.io.signal['in_'+a].onchange = (function(a){ return function(value){
                    const lamp = object.elements.glowbox_image['lamp_'+a];
                    value ? lamp.on() : lamp.off();
                }; })(a);
            }

    return object;
};
this.light_panel_8.metadata = {
    name:'Light Panel - Type C',
    category:'interface',
    helpURL:'/help/units/curvetech/light_panel_8/'
};