// this.duplicator_signal = function(x,y,a){
//     var shape = [
//         {x:0,y:0},
//         {x:40,y:10},
//         {x:40,y:30},
//         {x:0,y:40}
//     ];
//     var design = {
//         name:'duplicator_signal',
//         x:x, y:y, angle:a,
//         space:shape,
//         elements:[
//             {collection:'basic', type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background} },
//             {collection:'basic', type:'text', name:'label', data:{
//                 x:15.75, y:33.5, 
//                 width:3,height:3,
//                 angle:-0.24497866312686423,
//                 text:'signal duplicator',
//                 font:'AppleGaramond', 
//                 printingMode:{widthCalculation:'absolute'},
//                 colour:style.textColour}
//             },

//             {collection:'basic', type:'path', name:'marking_1', data:{pointsAsXYArray:[
//                 {x:35,y:20}, {x:27.5,y:20}, {x:17.5,y:12.5}, {x:5,y:12.5}, {x:7.5,y:9.5},
//             ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.signal} },
//             {collection:'basic', type:'path', name:'marking_2', data:{pointsAsXYArray:[
//                 {x:5,y:12.5}, {x:7.5,y:15.5},
//             ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.signal} },
//             {collection:'basic', type:'path', name:'marking_3', data:{pointsAsXYArray:[
//                 {x:27.5,y:20}, {x:17.5,y:27.5}, {x:5,y:27.5}, {x:7.5,y:30.5},
//             ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.signal} },
//             {collection:'basic', type:'path', name:'marking_4', data:{pointsAsXYArray:[
//                 {x:5,y:27.5}, {x:7.5,y:24.5},
//             ], thickness:1.25, jointType:'round', capType:'round', colour:style.marking.signal} },


//             {collection:'dynamic', type:'connectionNode_signal', name:'input', data:{ 
//                 x:40, y:15, width:5, height:10, cableVersion:2,
//                 style:{ 
//                     dim:style.connectionNode.signal.dim, 
//                     glow:style.connectionNode.signal.glow,
//                     cable_dim:style.connectionCable.signal.dim,
//                     cable_glow:style.connectionCable.signal.glow,
//                 },
//                 onchange:function(value){ object.io.signal.output_1.set(value); object.io.signal.output_2.set(value); } 
//             }},
//             {collection:'dynamic', type:'connectionNode_signal', name:'output_1', data:{ 
//                 x:0, y:17.5, width:5, height:10, angle:Math.PI, cableVersion:2,
//                 style:{ 
//                     dim:style.connectionNode.signal.dim, 
//                     glow:style.connectionNode.signal.glow, 
//                     cable_dim:style.connectionCable.signal.dim, 
//                     cable_glow:style.connectionCable.signal.glow 
//                 }
//             }},
//             {collection:'dynamic', type:'connectionNode_signal', name:'output_2', data:{
//                 x:0, y:32.5, width:5, height:10, angle:Math.PI, cableVersion:2,
//                 style:{ 
//                     dim:style.connectionNode.signal.dim, 
//                     glow:style.connectionNode.signal.glow, 
//                     cable_dim:style.connectionCable.signal.dim, 
//                     cable_glow:style.connectionCable.signal.glow 
//                 }
//             }},
//         ]
//     };
//     //add bumpers
//     for(var a = shape.length-1, b=0, c=1; b < shape.length; a=b, b++, c++){
//         if(c == shape.length){c = 0;}

//         var arm1 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.small.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[a]));
//         var arm2 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.small.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[c]));

//         design.elements.push( {collection:'basic', type:'path', name:'bumper_'+b, data:{ pointsAsXYArray:[
//             { x:shape[b].x+arm1.x, y:shape[b].y+arm1.y }, shape[b], { x:shape[b].x+arm2.x, y:shape[b].y+arm2.y },
//         ], thickness:bumperCoverage.small.thickness, jointType:'round', capType:'round', colour:style.bumper }} );
//     }


//     //main object
//         var object = _canvas_.interface.unit.builder(this.ruler,design);
    
//     return object;
// };

// this.duplicator_signal.metadata = {
//     name:'Signal Duplicator',
//     category:'misc',
//     helpURL:'https://curve.metasophiea.com/help/units/beta/duplicator_signal/'
// };