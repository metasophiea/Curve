// this.duplicator_audio = function(x,y,a){
//     var style = {
//         background:{r:70/255,g:70/255,b:70/255,a:1},
//         markings:{r:150/255,g:150/255,b:150/255,a:1},
//     };
//     var shape = [
//         {x:3.5,y:10},
//         {x:6.5,y:2},
//         {x:13,y:2},
//         {x:42,y:9.5},
//         {x:42,y:30.5},
//         {x:13,y:38},
//         {x:6.5,y:38},
//         {x:3.5,y:30},
//         {x:2,y:20},
//     ];
//     var design = {
//         name:'duplicator_audio',
//         x:x, y:y, angle:a,
//         space:shape,
//         elements:[
//             {type:'image', name:'main', data:{width:45, height:40, url:'http://0.0.0.0:8000/images/units/beta/duplicator_audio.png'}},

//             {type:'connectionNode_audio', name:'input', data:{ 
//                 type:0, x:40, y:12.5, width:5, height:16, 
//                 style:{ dim:{r:1,g:0,b:0,a:0}, glow:{r:1,g:1,b:1,a:0.5}, },
//             }},
//             {type:'connectionNode_audio', name:'output_1', data:{ type:1, x:2.5, y:5, width:5, height:12, angle:0.2, isAudioOutput:true, style:{ dim:{r:1,g:0,b:0,a:0}, glow:{r:1,g:1,b:1,a:0.5}, },}},
//             {type:'connectionNode_audio', name:'output_2', data:{ type:1, x:0, y:23, width:5, height:12, angle:-0.2, isAudioOutput:true, style:{ dim:{r:1,g:0,b:0,a:0}, glow:{r:1,g:1,b:1,a:0.5}, },}},
//         ]
//     };

//     //main object
//         var object = _canvas_.interface.unit.builder(this.ruler,design);

//     //circuitry
//         object.elements.connectionNode_audio.input.out().connect( object.elements.connectionNode_audio.output_1.in() );
//         object.elements.connectionNode_audio.input.out().connect( object.elements.connectionNode_audio.output_2.in() );
    
//     return object;
// };

// this.duplicator_audio.metadata = {
//     name:'Audio Duplicator',
//     category:'misc',
//     helpURL:'https://curve.metasophiea.com/help/units/beta/duplicator_audio/'
// };