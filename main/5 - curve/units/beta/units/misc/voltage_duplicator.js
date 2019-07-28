this.voltage_duplicator = function(x,y,a){
    var width = 260; var height = 260;
    var div = 6.5;
    var shape = [
        {x:0,y:0},
        {x:width/div,y:height/(div*4)*2},
        {x:width/div,y:height/div},
        {x:0,y:height/div},
    ];
    var design = {
        name:'voltage_duplicator',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {collection:'dynamic', type:'connectionNode_voltage', name:'input', data:{ 
                x:width/div-0.5, y:(height/div)*0.75 - 5, width:5, height:10, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow,
                    cable_dim:style.connectionCable.voltage.dim,
                    cable_glow:style.connectionCable.voltage.glow,
                },
                onchange:function(value){ object.io.voltage.output_1.set(value); object.io.voltage.output_2.set(value); } 
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'output_1', data:{ 
                x:0, y:(height/div)/2, width:5, height:10, angle:Math.PI, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow 
                }
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'output_2', data:{
                x:0, y:(height/div)*0.75 + 5, width:5, height:10, angle:Math.PI, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow 
                }
            }},
            {collection:'basic', type:'image', name:'backing', 
                data:{ x: -10/6, y: -10/6, width: (width+20)/div, height: (height+20)/div, url:'prototypeUnits/beta/2/voltage_duplicator/voltage_duplicator_backing.png' }
            },
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    return object;
};



this.voltage_duplicator.metadata = {
    name:'Voltage Duplicator',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/beta/voltage_duplicator/'
};