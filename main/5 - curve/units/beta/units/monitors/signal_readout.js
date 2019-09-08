this.signal_readout = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'signal_readout/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:320, height:290 },
        design:{ width:5, height:4.5 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    
    var design = {
        name:'signal_readout',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                     },
            { x:measurements.drawing.width -offset, y:0                                     },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset   },
            { x:0,                                  y:measurements.drawing.height -offset   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_signal', name:'in', data:{ 
                x:measurements.drawing.width-3.5, y:measurements.drawing.height-20, width:5, height:15, angle:0, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png' }
            },
            {collection:'display', type:'glowbox_image', name:'lamp', 
                data:{ 
                    x:5, y:5, width:35, height:35,
                    dimURL:imageStoreURL_localPrefix+'light_off.png',
                    glowURL:imageStoreURL_localPrefix+'light_on.png',
                },
            }
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(design);

    //wiring
        object.elements.connectionNode_signal.in.onchange = function(value){
            if(value){ object.elements.glowbox_image.lamp.on(); }
            else{ object.elements.glowbox_image.lamp.off(); }
        };

    return object;
};



this.signal_readout.metadata = {
    name:'Signal Readout',
    category:'monitors',
    helpURL:'/help/units/beta/signal_readout/'
};