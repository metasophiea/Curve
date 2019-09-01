this.signal_combiner = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'signal_combiner/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:260, height:260 },
        design:{ width:4, height:4 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };

    var design = {
        name:'signal_combiner',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                        y:(measurements.drawing.height -offset)/4      },
            { x:measurements.drawing.width -offset,       y:0                                            },
            { x:measurements.drawing.width -offset,       y:measurements.drawing.height -offset          },
            { x:0,                                        y:(measurements.drawing.height -offset)*0.75   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_signal', name:'output', data:{ x:0, y:(measurements.drawing.height-offset)/2 + 5, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'input_1', data:{ x:measurements.drawing.width-3-1/3, y:7.5, width:5, height:10, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'input_2', data:{ x:measurements.drawing.width-3-1/3, y:measurements.drawing.height-20.5, width:5, height:10, cableVersion:2, style:style.connectionNode.signal }},

            {collection:'basic', type:'image', name:'backing', data:{ 
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png'
            } },
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(this.signal_combiner,design);

    //wiring
        object.io.signal.input_1.onchange = function(value){ object.io.signal.output.set(value || object.io.signal.input_2.read()); };
        object.io.signal.input_2.onchange = function(value){ object.io.signal.output.set(value || object.io.signal.input_1.read()); };

    return object;
};



this.signal_combiner.metadata = {
    name:'Signal Combiner',
    category:'misc',
    helpURL:'/help/units/beta/signal_combiner/'
};