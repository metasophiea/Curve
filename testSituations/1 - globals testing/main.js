function tester(item1,item2){
    if( JSON.stringify(item1) === JSON.stringify(item2) ){
        console.log('%cpass', 'color: green;'); return true;
    }else{
        console.log(item1 ,'!=', item2);
        console.log('%cfail', 'color: red;'); return false;
    }
}
//     function handyDotPrinter(dotArrays){
//         var colours = [
//             'rgba(100,100,100,1)',
//             'rgba(255,100,255,1)',
//             'rgba(255,255,100,1)',
//             'rgba(255,100,100,1)',
//             'rgba(100,100,255,1)',
//         ];
//         for(var a = 0; a < dotArrays.length; a++){
//             if(dotArrays[a].length > 2){
//                 __globals.panes.foreground.append(
//                     __globals.utility.experimental.elementMaker('path',null,{path:dotArrays[a], lineType:'L', style:'fill:'+colours[a%colours.length]+';'})
//                 );
//             }else{
//                 __globals.panes.foreground.append(
//                     __globals.utility.experimental.elementMaker('path',null,{path:
//                         [
//                             {x:dotArrays[a][0].x,y:dotArrays[a][0].y},
//                             {x:dotArrays[a][1].x,y:dotArrays[a][0].y},
//                             {x:dotArrays[a][1].x,y:dotArrays[a][1].y},
//                             {x:dotArrays[a][0].x,y:dotArrays[a][1].y},
//                             {x:dotArrays[a][0].x,y:dotArrays[a][0].y},
//                         ], lineType:'L', style:'stroke:'+colours[a%colours.length]+';fill:none;'})
//                 );
//             }
//             var style = 'fill:'+colours[a%colours.length]+'; font-size:3; font-family:Helvetica;';
//             for(var b = 0; b < dotArrays[a].length; b++){
//                 __globals.utility.workspace.dotMaker(
//                     dotArrays[a][b].x,dotArrays[a][b].y,'('+dotArrays[a][b].x+','+dotArrays[a][b].y+')',2,style,true
//                 ); 
//             }
//         }
//     }

{{include:utility.js}}
{{include:part_sequencer_testcode.js}}