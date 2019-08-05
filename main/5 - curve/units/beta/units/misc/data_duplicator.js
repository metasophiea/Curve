this.data_duplicator = function(x,y,a){
    var width = 320; var height = 320;
    var div = 6.4;
    var shape = [
        {x:0,y:0},
        {x:width/div*(3/5),y:0},
        {x:width/div,y:height/div*(1/5)},
        {x:width/div,y:height/div*(4/5)},
        {x:width/div*(3/5),y:height/div},
        {x:0,y:height/div},
    ];
    var imageStoreURL_localPrefix = imageStoreURL+'data_duplicator/';
    var design = {
        name:'data_duplicator',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {collection:'dynamic', type:'connectionNode_data', name:'input', data:{ 
                x:width/div-0.5, y:(height/div)/2 - 7.5, width:5, height:15, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.data.dim, 
                    glow:style.connectionNode.data.glow,
                    cable_dim:style.connectionCable.data.dim, 
                    cable_glow:style.connectionCable.data.glow,
                },
                onreceive:function(address,data){
                    object.io.data.output_1.send(address,data);
                    object.io.data.output_2.send(address,data);
                } 
            }},
            {collection:'dynamic', type:'connectionNode_data', name:'output_1', data:{ 
                x:0, y:(height/div)/2 - 2.5, width:5, height:15, angle:Math.PI, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.data.dim, 
                    glow:style.connectionNode.data.glow, 
                    cable_dim:style.connectionCable.data.dim, 
                    cable_glow:style.connectionCable.data.glow 
                }
            }},
            {collection:'dynamic', type:'connectionNode_data', name:'output_2', data:{ 
                x:0, y:(height/div) - 7.5, width:5, height:15, angle:Math.PI, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.data.dim, 
                    glow:style.connectionNode.data.glow, 
                    cable_dim:style.connectionCable.data.dim, 
                    cable_glow:style.connectionCable.data.glow 
                }
            }},

            {collection:'basic', type:'image', name:'backing', 
                data:{ x: -10/6, y: -10/6, width: (width+20)/div, height: (height+20)/div, url:imageStoreURL_localPrefix+'backing.png' }
            },
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    return object;
};



this.data_duplicator.metadata = {
    name:'Data Duplicator',
    category:'misc',
    helpURL:'/help/units/beta/data_duplicator/'
};