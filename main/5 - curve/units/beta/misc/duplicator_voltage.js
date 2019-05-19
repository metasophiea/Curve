// this.duplicator_voltage = function(x,y,a){
//     var style = {
//         background:{r:70/255,g:70/255,b:70/255,a:1},
//         markings:{r:150/255,g:150/255,b:150/255,a:1},
//     };
//     var shape = [
//         {x:5,y:2},
//         {x:41.5,y:20},
//         {x:41.5,y:38},
//         {x:5,y:38}
//     ];
//     var design = {
//         name:'duplicator_voltage',
//         x:x, y:y, angle:a,
//         space:shape,
//         elements:[
//             {type:'image', name:'main', data:{width:45, height:40, url:'http://0.0.0.0:8000/images/units/beta/duplicator_voltage.png'}},

//             {type:'connectionNode_voltage', name:'input', data:{ 
//                 type:0, x:40, y:24, width:5, height:12, 
//                 style:{ dim:{r:1,g:0,b:0,a:0}, glow:{r:1,g:1,b:1,a:0.5}, },
//                 onchange:function(value){ object.io.voltage.output_1.set(value); object.io.voltage.output_2.set(value); } 
//             }},
//             {type:'connectionNode_voltage', name:'output_1', data:{ type:1, x:0, y:8.5, width:5, height:12, isAudioOutput:true, style:{ dim:{r:1,g:0,b:0,a:0}, glow:{r:1,g:1,b:1,a:0.5}, },}},
//             {type:'connectionNode_voltage', name:'output_2', data:{ type:1, x:0, y:23, width:5, height:12, isAudioOutput:true, style:{ dim:{r:1,g:0,b:0,a:0}, glow:{r:1,g:1,b:1,a:0.5}, },}},
//         ]
//     };

//     //main object
//         var object = _canvas_.interface.unit.builder(this.ruler,design);
    
//     return object;
// };

// this.duplicator_voltage.metadata = {
//     name:'Voltage Duplicator',
//     category:'misc',
//     helpURL:'https://curve.metasophiea.com/help/units/beta/duplicator_voltage/'
// };