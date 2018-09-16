// this.menuBar = function(){
//     var vars = {
//         width: 300, height:20,
//     };
//     vars.width = __globals.utility.workspace.getViewportDimensions().width;
//     var style = {
//         text: 'fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
//         button:{
//             off:'fill:rgba(240,240,240,1)',
//             hover:'fill:rgba(220,220,220,1)',
//             hover_press:'fill:rgba(250,250,250,1)',
//         }
//     };

//     var design = {
//         type:'menuBar',
//         x:0, y:0,
//         base:{
//             points:[{x:0,y:0},{x:vars.width,y:0},{x:vars.width,y:vars.height},{x:0,y:vars.height}],
//             style:'fill:rgba(240,240,240,1);'
//         },
//         elements:[
//             {type:'text', name:'report', data:{
//                 x:vars.width-75, y:10, text:'', style:style.text
//             }},
//         ]
//     };
//     //dynamic design
//         var keys = Object.keys(this.menuBar.dropdown);
//         var accWidth = 0;
//         for(var a = 0; a < keys.length; a++){
//             design.elements.push(
//                 {type:'button_rect_3',name:keys[a],data:{
//                     x:accWidth, y:0, width:this.menuBar.dropdown[keys[a]].width, height:vars.height, text:keys[a],
//                     textHorizontalOffset:this.menuBar.dropdown[keys[a]].textHorizontalOffset,
//                     style:{ up:style.button.off, hover:style.button.hover, hover_press:style.button.hover_press },
//                     onpress:function(key,menuBar){ return function(){menuBar.dropdown[key].toggle(); } }(keys[a],this.menuBar),
//                 }}
//             );
//             this.menuBar.dropdown[keys[a]].x = accWidth ;
//             accWidth += this.menuBar.dropdown[keys[a]].width;
//         }

//     //main object
//         var obj = __globals.utility.misc.objectBuilder(objects.data_duplicator,design);

//     //interface
//         obj.i = {
//             report:function(text){ if(text == undefined){return;} design.text.report.innerHTML = text; }
//         };

//     return obj;
// };



// this.menuBar.dropdown = {
//     create:{
//         obj:undefined,
//         x:undefined,
//         width:65,
//         textHorizontalOffset:0.175,
//         toggle:function(){
//             if(this.obj == undefined){this.open();}
//             else{this.close();}
//         },
//         open:function(){
//             this.obj = __globals.utility.workspace.placeAndReturnObject(
//                 __globals.utility.misc.elementMaker('list','createMenu',{
//                     x:this.x, y:20,
//                     width:200, height:300,
//                     itemSpacing:0, itemHeight:0.075,
//                     itemTextHorizontalOffset:0.1,
//                     style:{
//                         listItemText:'fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
//                     }
//                 }),
//             'menu');
//         },
//         close:function(){ __globals.utility.workspace.getPane(this.obj).removeChild(this.obj); this.obj = undefined; },
//         options:[
//             {}
//         ],
//     },
//     file:{
//         x:undefined,
//         width:40,
//         textHorizontalOffset:0.25,
//         open:function(){
//             console.log( menu.objects.menuBar.dropdown.file.x );},
//         close:function(){},
//     },
// }