this.duplicator_data = function(x,y,a){
    var shape = [
        {x:0,y:0},
        {x:30,y:0},
        {x:50,y:10},
        {x:50,y:40},
        {x:30,y:50},
        {x:0,y:50}
    ];
    var design = {
        name:'duplicator_data',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            { type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background} },
            { type:'text', name:'label', data:{
                x:29, y:47.5, 
                width:3,height:3,
                angle:-0.475,
                text:'data duplicator',
                font:'AppleGaramond', 
                printingMode:{widthCalculation:'absolute'},
                colour:style.textColour}
            },

            { type:'pathWithRoundJointsAndEnds', name:'marking_1', data:{pointsAsXYArray:[
                {x:45,y:25}, {x:20,y:25}, {x:10,y:35}, {x:5,y:35}, {x:7.5,y:32},
            ], thickness:1.25, colour:style.marking.data} },
            { type:'pathWithRoundJointsAndEnds', name:'marking_2', data:{pointsAsXYArray:[
                {x:5,y:35}, {x:7.5,y:38},
            ], thickness:1.25, colour:style.marking.data} },
            { type:'pathWithRoundJointsAndEnds', name:'marking_3', data:{pointsAsXYArray:[
                {x:35,y:25}, {x:25,y:15}, {x:5,y:15}, {x:7.5,y:12},
            ], thickness:1.25, colour:style.marking.data} },
            { type:'pathWithRoundJointsAndEnds', name:'marking_4', data:{pointsAsXYArray:[
                {x:5,y:15}, {x:7.5,y:18},
            ], thickness:1.25, colour:style.marking.data} },

            {type:'connectionNode_data', name:'input', data:{ 
                x:50, y:17.5, width:5, height:15, 
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
            {type:'connectionNode_data', name:'output_1', data:{ 
                x:-5, y:7.5, width:5, height:15, 
                style:{ 
                    dim:style.connectionNode.data.dim, 
                    glow:style.connectionNode.data.glow, 
                    cable_dim:style.connectionCable.data.dim, 
                    cable_glow:style.connectionCable.data.glow 
                }
            }},
            {type:'connectionNode_data', name:'output_2', data:{ 
                x:-5, y:27.5, width:5, height:15, 
                style:{ 
                    dim:style.connectionNode.data.dim, 
                    glow:style.connectionNode.data.glow, 
                    cable_dim:style.connectionCable.data.dim, 
                    cable_glow:style.connectionCable.data.glow 
                }
            }},
        ]
    };
    //add bumpers
    for(var a = shape.length-1, b=0, c=1; b < shape.length; a=b, b++, c++){
        if(c == shape.length){c = 0;}

        var arm1 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[a]));
        var arm2 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[c]));

        design.elements.push( {type:'pathWithRoundJointsAndEnds', name:'bumper_'+b, data:{ pointsAsXYArray:[
            { x:shape[b].x+arm1.x, y:shape[b].y+arm1.y }, shape[b], { x:shape[b].x+arm2.x, y:shape[b].y+arm2.y },
        ], thickness:2.5, colour:style.bumper }} );
    }



    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);
    
    return object;
};

this.duplicator_data.metadata = {
    name:'Data Duplicator',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/beta/duplicator_data/'
};