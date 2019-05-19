// this.duplicator_data = function(x,y,a){
//     var style = {
//         background:{r:70/255,g:70/255,b:70/255,a:1},
//         markings:{r:150/255,g:150/255,b:150/255,a:1},
//     };
//     var shape = [
//         {x:3,y:2},
//         {x:26,y:2},
//         {x:42,y:9.5},
//         {x:42,y:30.5},
//         {x:26,y:38},
//         {x:3,y:38}
//     ];
//     var design = {
//         name:'duplicator_data',
//         x:x, y:y, angle:a,
//         space:shape,
//         elements:[
//             {type:'image', name:'main', data:{width:45, height:40, url:'http://0.0.0.0:8000/images/units/beta/duplicator_data.png'}},

//             {type:'connectionNode_data', name:'input', data:{ 
//                 type:0, x:40, y:13, width:5, height:16, 
//                 style:{ dim:{r:1,g:0,b:0,a:0}, glow:{r:1,g:1,b:1,a:0.5}, },
//                 onreceive:function(address,data){
//                     object.io.data.output_1.send(address,data);
//                     object.io.data.output_2.send(address,data);
//                 } 
//             }},
//             {type:'connectionNode_data', name:'output_1', data:{ type:1, x:0, y:5, width:5, height:15, isAudioOutput:true, style:{ dim:{r:1,g:0,b:0,a:0}, glow:{r:1,g:1,b:1,a:0.5}, },}},
//             {type:'connectionNode_data', name:'output_2', data:{ type:1, x:0, y:21, width:5, height:15, isAudioOutput:true, style:{ dim:{r:1,g:0,b:0,a:0}, glow:{r:1,g:1,b:1,a:0.5}, },}},
//         ]
//     };

//     //main object
//         var object = _canvas_.interface.unit.builder(this.ruler,design);
    
//     return object;
// };

// this.duplicator_data.metadata = {
//     name:'Data Duplicator',
//     category:'misc',
//     helpURL:'https://curve.metasophiea.com/help/units/beta/duplicator_data/'
// };