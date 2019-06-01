this.duplicator_audio = function(x,y,a){
    var shape = [
        {x:5,y:50},
        {x:15,y:50},
        {x:55,y:40},
        {x:55,y:10},
        {x:15,y:0},
        {x:5,y:0},

        {x:3,y:5},
        {x:0.75,y:15},
        {x:0,y:25},
        {x:0.75,y:35},
        {x:3,y:45},
    ];
    var design = {
        name:'duplicator_audio',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {type:'connectionNode_audio', name:'input', data:{ 
                x:55, y:17.5, width:5, height:15, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow,
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                },
            }},
            {type:'connectionNode_audio', name:'output_1', data:{ 
                x:0.25, y:15+7.5, width:5, height:15, angle:0.15+Math.PI, isAudioOutput:true, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow 
                }
            }},
            {type:'connectionNode_audio', name:'output_2', data:{ 
                x:2.5, y:15+27.5, width:5, height:15, angle:-0.15+Math.PI, isAudioOutput:true, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow 
                }
            }},

            { type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background} },

            { type:'path', name:'marking_1', data:{pointsAsXYArray:[
                {x:50,y:25}, {x:5,y:34}, {x:7,y:30}, 
            ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.audio} },
            { type:'path', name:'marking_2', data:{pointsAsXYArray:[
                {x:5,y:34}, {x:8.5,y:37}, 
            ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.audio} },
            { type:'path', name:'marking_3', data:{pointsAsXYArray:[
                {x:50,y:25}, {x:5,y:16}, {x:7,y:20},
            ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.audio} },
            { type:'path', name:'marking_4', data:{pointsAsXYArray:[
                {x:5,y:16}, {x:8.5,y:13}, 
            ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.audio} },

            { type:'text', name:'label', data:{
                x:30.5, y:43.5, 
                width:3,height:3,
                angle:-0.25,
                text:'audio duplicator',
                font:'AppleGaramond', 
                printingMode:{widthCalculation:'absolute'},
                colour:style.textColour}
            },
        ]
    };
    //add bumpers
    for(var a = shape.length-1, b=0, c=1; b < 6; a=b, b++, c++){
        if(c == shape.length){c = 0;}

        var arm1 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.small.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[a]));
        var arm2 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.small.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[c]));

        design.elements.push( {type:'path', name:'bumper_'+b, data:{ pointsAsXYArray:[
            { x:shape[b].x+arm1.x, y:shape[b].y+arm1.y }, shape[b], { x:shape[b].x+arm2.x, y:shape[b].y+arm2.y },
        ], thickness:bumperCoverage.small.thickness, jointType:'round', capType:'round', colour:style.bumper }} );
    }


    
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //circuitry
        object.elements.connectionNode_audio.input.out().connect( object.elements.connectionNode_audio.output_1.in() );
        object.elements.connectionNode_audio.input.out().connect( object.elements.connectionNode_audio.output_2.in() );
    
    return object;
};

this.duplicator_audio.metadata = {
    name:'Audio Duplicator',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/beta/duplicator_audio/'
};