this.data_combiner = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'data_combiner/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:320, height:320 },
        design:{ width:5, height:5 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };

    var design = {
        name:'data_combiner',
        x:x, y:y, angle:a,
        space:[
            { x:0, y:(measurements.drawing.height -offset)*(1/5) },
            { x:(measurements.drawing.width -offset)*(2/5), y:0 },
            { x:measurements.drawing.width -offset, y:0                                       },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset     },
            { x:(measurements.drawing.width -offset)*(2/5),                                   y:measurements.drawing.height -offset     },
            { x:0, y:(measurements.drawing.height -offset)*(4/5) },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_data', name:'output', data:{ x:0, y:(measurements.drawing.height-offset)/2 + 15/2, width:5, height:15, angle:Math.PI, cableVersion:2, style:style.connectionNode.data }},
            {collection:'dynamic', type:'connectionNode_data', name:'input_1', data:{ x:measurements.drawing.width -3 -1/3, y:7.5, width:5, height:15, cableVersion:2, style:style.connectionNode.data }},
            {collection:'dynamic', type:'connectionNode_data', name:'input_2', data:{ x:measurements.drawing.width -3 -1/3, y:27.5, width:5, height:15, cableVersion:2, style:style.connectionNode.data }},

            {collection:'basic', type:'image', name:'backing', data:{ 
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png'
            } },
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(design);

    //wiring
        object.io.data.input_1.onreceive = function(address,data){ object.io.data.output.send(address,data); };
        object.io.data.input_2.onreceive = function(address,data){ object.io.data.output.send(address,data); };

    return object;
};



this.data_combiner.metadata = {
    name:'Data Combiner',
    category:'misc',
    helpURL:'/help/units/beta/data_combiner/'
};