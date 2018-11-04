canvas.system.core.element.add( {type:'rect', data:{x:150, y:50, width:50, height:50, fillStyle:'rgba(0,255,0,1)'}} );

var g = canvas.system.core.element.add( {type:'group', data:{x:0, y:0, angle:-0.2}, children:[]} );
    canvas.system.core.element.add( {type:'dot', data:{x:0,y:0}},undefined , g );
    canvas.system.core.element.add( {type:'rect', data:{x:0, y:0, width:10, height:10}},undefined , g );
    canvas.system.core.element.add( {type:'rect', data:{x:20, y:0, width:10, height:10}},undefined , g );
    canvas.system.core.element.add( {type:'poly', data:{points: [{x:0,y:20},{x:20,y:20},{x:20,y:0}] }},undefined , g );
    canvas.system.core.element.add( {type:'image', data:{x:0, y:30, width:20, height:20, angle:0.3, url:'https://images-na.ssl-images-amazon.com/images/I/61Nx%2BIpgqQL._SY355_.jpg'}},undefined , g );
    canvas.system.core.element.add( {type:'dot', data:{x:40,y:40}},undefined , g );

canvas.system.core.element.add( {type:'rect', data:{x:58, y:60, width:50, height:50, fillStyle:'rgba(255,0,0,1)'}} );

canvas.system.core.element.add( {type:'dot', data:{x:58,y:60}} );
var g = canvas.system.core.element.add( {type:'group', data:{x:58, y:60, angle:-0.5}, children:[]} );
    canvas.system.core.element.add( {type:'dot', data:{x:0,y:0}},undefined , g );
    canvas.system.core.element.add( {type:'rect', data:{x:0, y:0, width:100, height:100,fillStyle:'rgba(0,200,0,0.3)'}},undefined , g );
    var g = canvas.system.core.element.add( {type:'group', data:{x:10, y:10, angle:-0.5}, children:[]},undefined , g );
        canvas.system.core.element.add( {type:'dot', data:{x:15,y:0}},undefined , g );
        canvas.system.core.element.add( {type:'rect', data:{x:0, y:0, width:10, height:10}},undefined , g );
        canvas.system.core.element.add( {type:'rect', data:{x:15, y:0, width:10, height:10}},undefined , g );
        canvas.system.core.element.add( {type:'rect', data:{x:15, y:0, width:10, height:10}},undefined , g );
        canvas.system.core.element.add( {type:'rect', data:{x:10, y:10, width:10, height:10}},undefined , g );
        canvas.system.core.element.add( {type:'poly', data:{points: [{x:0,y:20},{x:20,y:20},{x:20,y:0}] }},undefined , g );

canvas.system.core.element.add( {type:'image', data:{x:100, y:30, width:200, height:200, angle:0.3, url:'https://images-na.ssl-images-amazon.com/images/I/61Nx%2BIpgqQL._SY355_.jpg'}} );










// // lots of rects test
// for(var a = 0; a < 20000; a++){
//     canvas.system.core.element.add( {type:'rect', data:{x:10, y:10, width:10, height:10, angle:-0.0, fillStyle:'rgba(0,255,0,1)'}} );
//     console.log(a);
// }


// //lots of ploys test
// for(var a = 0; a < 10000; a++){
//     canvas.system.core.element.add( {type:'poly', data:{points: [{x:10,y:10},{x:20,y:10},{x:20,y:20},{x:10,y:20}] }} );
//     console.log(a);
// }