this.voltage_readout = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'voltage_readout/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:440, height:290 },
        design:{ width:7, height:4.5 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    
    var design = {
        name:'voltage_readout',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                     },
            { x:measurements.drawing.width -offset, y:0                                     },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset   },
            { x:0,                                  y:measurements.drawing.height -offset   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_voltage', name:'in', data:{ 
                x:measurements.drawing.width-3.5, y:measurements.drawing.height-20, width:5, height:15, angle:0, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'basic', type:'image', name:'backing', data:{ 
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png'
            } },
            {collection:'display', type:'gauge_image', name:'gauge', data:{ 
                x:5, y:5, width:55, height:35,
                backingURL:imageStoreURL_localPrefix+'gauge_backing.png',
                style:{needles:[{r:0,g:0,b:0,a:1}]},
            }, },
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //wiring
        object.elements.connectionNode_voltage.in.onchange = function(value){
            object.elements.gauge_image.gauge.needle(value);
        };

    return object;
};



this.voltage_readout.metadata = {
    name:'Voltage Readout',
    category:'monitors',
    helpURL:'/help/units/beta/voltage_readout/'
};