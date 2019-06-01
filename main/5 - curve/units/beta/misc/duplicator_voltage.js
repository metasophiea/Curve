this.duplicator_voltage = function(x,y,a){
    var shape = [
        {x:0,y:0},
        {x:40,y:20},
        {x:40,y:40},
        {x:0,y:40}
    ];
    var design = {
        name:'duplicator_voltage',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            { type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background} },
            { type:'text', name:'label', data:{
                x:12.5, y:37.5, 
                width:3,height:3,
                text:'voltage duplicator',
                font:'AppleGaramond', 
                printingMode:{widthCalculation:'absolute'},
                colour:style.textColour}
            },

            { type:'path', name:'marking_1', data:{pointsAsXYArray:[
                {x:35,y:30}, {x:20,y:30}, {x:15,y:28.5}, {x:5,y:28.5}, {x:7.5,y:25.5},
            ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.voltage} },
            { type:'path', name:'marking_2', data:{pointsAsXYArray:[
                {x:25,y:30}, {x:15,y:14}, {x:5,y:14}, {x:7.5,y:11},
            ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.voltage} },
            { type:'path', name:'marking_3', data:{pointsAsXYArray:[
                {x:5,y:14}, {x:7.5,y:17},
            ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.voltage} },
            { type:'path', name:'marking_4', data:{pointsAsXYArray:[
                {x:5,y:28.5}, {x:7.5,y:31.5},
            ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.voltage} },

            {type:'connectionNode_voltage', name:'input', data:{ 
                x:40, y:23.75, width:5, height:12.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
                onchange:function(value){ object.io.voltage.output_1.set(value); object.io.voltage.output_2.set(value); } 
            }},
            {type:'connectionNode_voltage', name:'output_1', data:{ 
                x:0, y:20, width:5, height:12.5, angle:Math.PI, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow 
                }
            }},
            {type:'connectionNode_voltage', name:'output_2', data:{ 
                x:0, y:35, width:5, height:12.5, angle:Math.PI, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow 
                }
            }},
        ]
    };
    //add bumpers
    for(var a = shape.length-1, b=0, c=1; b < shape.length; a=b, b++, c++){
        if(c == shape.length){c = 0;}

        var arm1 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[a]));
        var arm2 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[c]));

        design.elements.push( {type:'path', name:'bumper_'+b, data:{ pointsAsXYArray:[
            { x:shape[b].x+arm1.x, y:shape[b].y+arm1.y }, shape[b], { x:shape[b].x+arm2.x, y:shape[b].y+arm2.y },
        ], thickness:2.5, jointType:'round', capType:'round', colour:style.bumper }} );
    }



    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);
    
    return object;
};

this.duplicator_voltage.metadata = {
    name:'Voltage Duplicator',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/beta/duplicator_voltage/'
};