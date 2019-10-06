this.light_panel_4 = function(x,y,angle){
    //unitStyle
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'light_panel/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:330, height:85 },
                    design: { width:5.5, height:1+5/12 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'light_panel_4',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'in_0', data:{ 
                    x:3 + (69/6)/2 +5, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_1', data:{ 
                    x:3 + (69/6)/2 +5 + (69/6+1), y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_2', data:{ 
                    x:3 + (69/6)/2 +5 + (69/6+1)*2, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_3', data:{ 
                    x:3 + (69/6)/2 +5 + (69/6+1)*3, y:unitStyle.drawingValue.height, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'4_backing.png' }
                },
                {collection:'display', type:'glowbox_image', name:'lamp_0', 
                    data:{ 
                        x:3, y:5.5, width:69/6, height:34/6,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'display', type:'glowbox_image', name:'lamp_1', 
                    data:{ 
                        x:3 + 69/6+1, y:5.5, width:69/6, height:34/6,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'display', type:'glowbox_image', name:'lamp_2', 
                    data:{ 
                        x:3 + (69/6+1)*2, y:5.5, width:69/6, height:34/6,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                },
                {collection:'display', type:'glowbox_image', name:'lamp_3', 
                    data:{ 
                        x:3 + (69/6+1)*3, y:5.5, width:69/6, height:34/6,
                        dimURL:unitStyle.imageStoreURL_localPrefix+'light_off.png',
                        glowURL:unitStyle.imageStoreURL_localPrefix+'light_on.png',
                    },
                }
            ]
        });
    
    //wiring
        //io
            for(var a = 0; a <= 3; a++){
                object.io.signal['in_'+a].onchange = (function(a){ return function(value){
                    var lamp = object.elements.glowbox_image['lamp_'+a];
                    value ? lamp.on() : lamp.off();
                }; })(a);
            }

    return object;
};
this.light_panel_4.metadata = {
    name:'Light Panel - Type B',
    category:'interface',
    helpURL:'/help/units/beta/light_panel_4/'
};