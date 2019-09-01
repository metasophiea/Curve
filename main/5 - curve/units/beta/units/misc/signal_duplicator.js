this.signal_duplicator = function(x,y,a){
    var width = 260; var height = 260;
    var div = 6.5;
    var shape = [
        {x:0,y:0},
        {x:width/div,y:height/(div*4)},
        {x:width/div,y:height/div - height/(div*4)},
        {x:0,y:height/div},
    ];
    var imageStoreURL_localPrefix = imageStoreURL+'signal_duplicator/';
    var design = {
        name:'signal_duplicator',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {collection:'dynamic', type:'connectionNode_signal', name:'input', data:{ 
                x:width/div-0.5, y:(height/div)/2 - 5, width:5, height:10, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.signal.dim, 
                    glow:style.connectionNode.signal.glow,
                    cable_dim:style.connectionCable.signal.dim,
                    cable_glow:style.connectionCable.signal.glow,
                },
                onchange:function(value){ object.io.signal.output_1.set(value); object.io.signal.output_2.set(value); } 
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'output_1', data:{ 
                x:0, y:(height/div)/2 - 2.5, width:5, height:10, angle:Math.PI, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.signal.dim, 
                    glow:style.connectionNode.signal.glow, 
                    cable_dim:style.connectionCable.signal.dim, 
                    cable_glow:style.connectionCable.signal.glow 
                }
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'output_2', data:{
                x:0, y:(height/div)/2 - 2.5 + 15, width:5, height:10, angle:Math.PI, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.signal.dim, 
                    glow:style.connectionNode.signal.glow, 
                    cable_dim:style.connectionCable.signal.dim, 
                    cable_glow:style.connectionCable.signal.glow 
                }
            }},
            {collection:'basic', type:'image', name:'backing', 
                data:{ x: -10/6, y: -10/6, width: (width+20)/div, height: (height+20)/div, url:imageStoreURL_localPrefix+'backing.png' }
            },
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.signal_duplicator,design);

    return object;
};



this.signal_duplicator.metadata = {
    name:'Signal Duplicator',
    category:'misc',
    helpURL:'/help/units/beta/signal_duplicator/'
};