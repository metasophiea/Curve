this.duplicator_signal = function(x,y,a){
    var style = {
        background:{r:70/255,g:70/255,b:70/255,a:1},
        marking:{r:235/255,g:98/255,b:61/255,a:1},
        bumper:{r:0.125,g:0.125,b:0.125,a:1},
        textColour:{r:0.7,g:0.7,b:0.7,a:1},
        connectionNode_signal_colour:{
            dim:{r:235/255,g:98/255,b:61/255,a:1},
            glow:{r:237/255,g:154/255,b:132/255,a:1},
        },
    };
    var bumperCoverage = 5;
    var shape = [
        {x:0,y:0},
        {x:40,y:10},
        {x:40,y:30},
        {x:0,y:40}
    ];
    var design = {
        name:'duplicator_signal',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            { type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background} },
            { type:'text', name:'label', data:{
                x:16, y:34, 
                width:3,height:3,
                angle:-0.24497866312686423,
                text:'signal duplicator',
                font:'AppleGaramond', 
                printingMode:{widthCalculation:'absolute'},
                colour:style.textColour}
            },

            { type:'pathWithRoundJointsAndEnds', name:'marking_1', data:{pointsAsXYArray:[
                {x:35,y:20}, {x:27.5,y:20}, {x:17.5,y:12.5}, {x:5,y:12.5}, {x:7.5,y:9.5},
            ], thickness:1.25, colour:style.marking} },
            { type:'pathWithRoundJointsAndEnds', name:'marking_2', data:{pointsAsXYArray:[
                {x:5,y:12.5}, {x:7.5,y:15.5},
            ], thickness:1.25, colour:style.marking} },
            { type:'pathWithRoundJointsAndEnds', name:'marking_3', data:{pointsAsXYArray:[
                {x:27.5,y:20}, {x:17.5,y:27.5}, {x:5,y:27.5}, {x:7.5,y:30.5},
            ], thickness:1.25, colour:style.marking} },
            { type:'pathWithRoundJointsAndEnds', name:'marking_4', data:{pointsAsXYArray:[
                {x:5,y:27.5}, {x:7.5,y:24.5},
            ], thickness:1.25, colour:style.marking} },


            {type:'connectionNode_signal', name:'input', data:{ 
                type:0, x:40, y:15, width:3, height:10, 
                style:{ dim:style.connectionNode_signal_colour.dim, glow:style.connectionNode_signal_colour.glow, },
                onchange:function(value){ object.io.signal.output_1.set(value); object.io.signal.output_2.set(value); } 
            }},
            {type:'connectionNode_signal', name:'output_1', data:{ type:1, x:-3, y:7.5, width:3, height:10, isAudioOutput:true, style:{ dim:style.connectionNode_signal_colour.dim, glow:style.connectionNode_signal_colour.glow, }}},
            {type:'connectionNode_signal', name:'output_2', data:{ type:1, x:-3, y:22.5, width:3, height:10, isAudioOutput:true, style:{ dim:style.connectionNode_signal_colour.dim, glow:style.connectionNode_signal_colour.glow, }}},
        ]
    };

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

this.duplicator_signal.metadata = {
    name:'Signal Duplicator',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/beta/duplicator_signal/'
};