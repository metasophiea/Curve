// this.amplifier = function(x,y,a){
//     var shape = [
//         {x:0,y:0},
//         {x:150,y:0},
//         {x:150,y:140},
//         {x:0,y:140},
//     ];
//     var design = {
//         name:'amplifier',
//         x:x, y:y, angle:a,
//         space:shape,
//         elements:[
//             {collection:'basic', type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background} },

//             {collection:'basic', type:'image', name:'grill', data:{x:10,y:10,width:130,height:120,url:'images/units/beta/amplifierGrill.png'} },
//             {collection:'basic', type:'path', name:'grillFrame', data:{
//                 looping:true, 
//                 pointsAsXYArray:[{x:10,y:10}, {x:140,y:10}, {x:140,y:130}, {x:10,y:130}],
//                 thickness:5,
//                 jointType:'round',
//                 colour:{r:24/255,g:24/255,b:24/255,a:1}
//             } },

//             {collection:'basic', type:'text', name:'label', data:{
//                 x:147.25, y:135, 
//                 width:4,height:4,
//                 angle:-Math.PI/2,
//                 text:'amplifier (true tone)',
//                 font:'AppleGaramond', 
//                 printingMode:{widthCalculation:'absolute'},
//                 colour:style.textColour
//             } },
//             {collection:'basic', type:'path', name:'line', data:{
//                 pointsAsXYArray:[{x:146,y:5}, {x:146,y:92.5} ],
//                 capType:'round',
//                 thickness:0.5,
//                 colour:style.textColour
//             } },

//             {collection:'dynamic', type:'connectionNode_audio', name:'input_left', data:{ 
//                 x:150, y:100, width:5, height:15, cableVersion:2,
//                 style:{ 
//                     dim:style.connectionNode.audio.dim, 
//                     glow:style.connectionNode.audio.glow,
//                     cable_dim:style.connectionCable.audio.dim, 
//                     cable_glow:style.connectionCable.audio.glow,
//                 },
//             }},
//             {collection:'dynamic', type:'connectionNode_audio', name:'input_right', data:{ 
//                 x:150, y:120, width:5, height:15, cableVersion:2,
//                 style:{ 
//                     dim:style.connectionNode.audio.dim, 
//                     glow:style.connectionNode.audio.glow,
//                     cable_dim:style.connectionCable.audio.dim, 
//                     cable_glow:style.connectionCable.audio.glow,
//                 },
//             }},

//         ]
//     };
//     //add bumpers
//     for(var a = shape.length-1, b=0, c=1; b < shape.length; a=b, b++, c++){
//         if(c == shape.length){c = 0;}

//         var arm1 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.large.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[a]));
//         var arm2 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.large.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[c]));

//         design.elements.push( {collection:'basic', type:'path', name:'bumper_'+b, data:{ pointsAsXYArray:[
//             { x:shape[b].x+arm1.x, y:shape[b].y+arm1.y }, shape[b], { x:shape[b].x+arm2.x, y:shape[b].y+arm2.y },
//         ], thickness:bumperCoverage.large.thickness, jointType:'round', capType:'round', colour:style.bumper }} );
//     }


    
//     //main object
//         var object = _canvas_.interface.unit.builder(this.ruler,design);

//     //circuitry
//         var flow = {
//             destination:null,
//             stereoCombiner: null,
//             pan_left:null, pan_right:null,
//         };

//         //destination
//             flow._destination = _canvas_.library.audio.destination;

//         //stereo channel combiner
//             flow.stereoCombiner = new ChannelMergerNode(_canvas_.library.audio.context, {numberOfInputs:2});

//         //audio connections
//             //inputs to stereo combiner
//                 object.elements.connectionNode_audio.input_left.out().connect(flow.stereoCombiner, 0, 0);
//                 object.elements.connectionNode_audio.input_right.out().connect(flow.stereoCombiner, 0, 1);
//             //stereo combiner to main output
//                 flow.stereoCombiner.connect(flow._destination);

//     return object;
// };


this.amplifier = function(x,y,a){
    var width = 935; var height = 860;
    var shape = [
        {x:0,y:0},
        {x:width/6,y:0},
        {x:width/6,y:height/6},
        {x:0,y:height/6},
    ];
    var design = {
        name:'amplifier',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'input_L', data:{ 
                x:width/6 - 1, y:height/6 - 20, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2,
                style:{
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                }
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'input_R', data:{ 
                x:width/6 - 1, y:height/6 - 20 - 20, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2,
                style:{
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                }
            }},

            {collection:'basic', type:'image', name:'backing', 
                data:{ x: -10/6, y: -10/6, width: (width+20)/6, height: (height+20)/6, url:'prototypeUnits/beta/2/Amplifier/amplifier_backing.png' }
            },
        ]
    };

    
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //circuitry
        var flow = {
            destination:null,
            stereoCombiner: null,
            pan_left:null, pan_right:null,
        };

        //destination
            flow._destination = _canvas_.library.audio.destination;

        //stereo channel combiner
            flow.stereoCombiner = new ChannelMergerNode(_canvas_.library.audio.context, {numberOfInputs:2});

        //audio connections
            //inputs to stereo combiner
                object.elements.connectionNode_audio.input_L.out().connect(flow.stereoCombiner, 0, 0);
                object.elements.connectionNode_audio.input_R.out().connect(flow.stereoCombiner, 0, 1);
            //stereo combiner to main output
                flow.stereoCombiner.connect(flow._destination);

    return object;
};



this.amplifier.metadata = {
    name:'Amplifier',
    category:'monitors',
    helpURL:'https://curve.metasophiea.com/help/units/beta/amplifier/'
};