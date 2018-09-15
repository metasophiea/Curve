// var list_part = function(
//     id='list', 
//     x, y, width, height, angle=0,
//     list=['item1','item2','item3','item4','item5','item6','item7','item8','item9','item10','item11','item12','item12','item14','item15','item16','item17','item18','item19','item20','item21','item22','item23','item24'],
//     selectable=true, multiSelect=true,
//     itemHeight=0.1, itemSpacing=0.01,
//     itemTextVerticalOffset=0.5, itemTextHorizontalOffset=0.05,
//     listItemTextStyle='fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central;',

//     backgroundStyle_off=                     'fill:rgba(200,200,200,1)',
//     backgroundStyle_press=                   'fill:rgba(240,240,240,1)',
//     backgroundStyle_select=                  'fill:rgba(200,200,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_glow=                    'fill:rgba(220,220,220,1)',
//     backgroundStyle_glow_select=             'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_hover=                   'fill:rgba(220,220,200,1)',
//     backgroundStyle_hover_press=             'fill:rgba(240,240,240,1)',
//     backgroundStyle_hover_select=            'fill:rgba(220,220,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_hover_select_press=      'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_hover_glow=              'fill:rgba(240,240,200,1)',
//     backgroundStyle_hover_glow_press=        'fill:rgba(250,250,250,1)',
//     backgroundStyle_hover_glow_select=       'fill:rgba(240,240,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_hover_glow_select_press= 'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:2;',
// ){
//     //state
//         var itemArray = [];
//         var selectedItems = [];
//         var lastShiftClicked = undefined;

//     //main object
//         var object = __globals.utility.misc.elementMaker('g',id,{x:x, y:y, r:angle});

//     //background
//         var rect = __globals.utility.misc.elementMaker('rect',null,{width:width, height:height, style:'fill:rgba(230,230,230,1)'});
//         object.appendChild(rect);

//     //viewport (for clipping the visible area)
//         var viewport = __globals.utility.misc.elementMaker('g','viewport',{});
//         viewport.setAttribute('clip-path','polygon(0px 0px, '+width+'px 0px, '+width+'px '+height+'px, 0px '+height+'px)');
//         object.appendChild(viewport);

//     //main list
//         var mainList = __globals.utility.misc.elementMaker('g','mainList');
//         viewport.appendChild(mainList);
//         for(var a = 0; a < list.length; a++){
//             var temp = list_part.item(
//                 a, 0, (height*(itemHeight+itemSpacing))*a, 
//                 width, height*itemHeight, 
//                 list[a], itemTextVerticalOffset, 
//                 itemTextHorizontalOffset, 
//                 listItemTextStyle,
//                 backgroundStyle_off,               backgroundStyle_press,
//                 backgroundStyle_select,            undefined/*backgroundStyle_select_press*/,
//                 backgroundStyle_glow,              undefined/*backgroundStyle_glow_press*/,
//                 backgroundStyle_glow_select,       undefined/*backgroundStyle_glow_select_press*/,
//                 backgroundStyle_hover,             backgroundStyle_hover_press,
//                 backgroundStyle_hover_select,      backgroundStyle_hover_select_press,
//                 backgroundStyle_hover_glow,        backgroundStyle_hover_glow_press,
//                 backgroundStyle_hover_glow_select, backgroundStyle_hover_glow_select_press,
//             );
//             temp.pressed = function(a){return function(event){object.select(a,undefined,event);}}(a);

//             itemArray.push( temp );
//             mainList.appendChild( temp );
//         }
        

//     //controls
//         object.position = function(a){
//             var totalHeight =   height*(list.length*(itemHeight + itemSpacing) - itemSpacing)
//             var movementSpace = totalHeight - height;
            
//             __globals.utility.element.setTransform_XYonly( mainList, undefined, -a*movementSpace );

//             var y_offSet = movementSpace * a;
//             var bottom = y_offSet+height;

//             viewport.setAttribute('clip-path','polygon(0px '+y_offSet+'px, '+width+'px '+y_offSet+'px, '+width+'px '+bottom+'px, 0px '+bottom+'px)');
//         };
//         object.select = function(a,state,event,update=true){
//             //if selectability is turned off, just return the clicked item text
//             if(!selectable){ if(this.selected){this.selected(list[a]);} return;}

//             //if the shift key is pressed, do a range select
//             if( multiSelect && event != undefined && event.shiftKey ){
//                 if( lastShiftClicked == undefined ){ lastShiftClicked = a; return; }
//                 else{
//                     var min = Math.min(lastShiftClicked, a); var max = Math.max(lastShiftClicked, a);
//                     for(var b = min; b <= max; b++){ this.select(b,undefined,undefined,false); }
//                     lastShiftClicked = undefined;
//                 }
//             }else{
//                 if(state == undefined){
//                     var index = selectedItems.indexOf(a);
//                     var state = index == -1;
//                     if(state){ selectedItems.push(a); }
//                     else{ selectedItems.splice(index, 1); }
//                 }
//                 itemArray[a].select(state);
//             }

//             if(update && this.selected){this.selected(this.getSelected());}
//         };
//         object.glow = function(a,state){
//             if(state == undefined){ itemArray[a].glow(!itemArray[a].glow()); }
//             else{ itemArray[a].glow(state); }
//         };
//         object.getSelected = function(){ return selectedItems.map(a => list[a]); };

//     //callbacks
//         object.selected = function(a){console.log(a);};
    
//     return object;
// };



// list_part.item = function(
//     id='listItem',
//     x, y, width, height,
//     text,
//     textVerticalOffset=0.5, textHorizontalOffset=0.05,
//     textStyle='fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central;',
//     backgroundStyle_off=                     'fill:rgba(200,200,200,1)',
//     backgroundStyle_press=                   'fill:rgba(240,240,240,1)',
//     backgroundStyle_select=                  'fill:rgba(200,200,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_select_press=            '', //impossible
//     backgroundStyle_glow=                    'fill:rgba(220,220,220,1)',
//     backgroundStyle_glow_press=              '', //impossible
//     backgroundStyle_glow_select=             'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_glow_select_press=       '', //impossible
//     backgroundStyle_hover=                   'fill:rgba(220,220,200,1)',
//     backgroundStyle_hover_press=             'fill:rgba(240,240,240,1)',
//     backgroundStyle_hover_select=            'fill:rgba(220,220,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_hover_select_press=      'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_hover_glow=              'fill:rgba(240,240,200,1)',
//     backgroundStyle_hover_glow_press=        'fill:rgba(250,250,250,1)',
//     backgroundStyle_hover_glow_select=       'fill:rgba(240,240,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
//     backgroundStyle_hover_glow_select_press= 'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:2;',
// ){
//     //elements
//         var object = __globals.utility.misc.elementMaker('g',id,{x:x,y:y});

//         var background = __globals.utility.misc.elementMaker('rect',null,{width:width, height:height, style:backgroundStyle_off});
//         object.appendChild( background );

//         var text = __globals.utility.misc.elementMaker('text',null,{x:width*textHorizontalOffset, y:height*textVerticalOffset, text:text, style:textStyle});
//         object.appendChild(text);

//     //state
//     object.state = {
//         hovering:false,
//         glowing:false,
//         selected:false,
//         pressed:false,
//     };
//     object.activateState = function(){
//         if( object.state.pressed && !object.state.hovering ){object.state.pressed = false;}

//         var styles = [
//             backgroundStyle_off,
//             backgroundStyle_press,
//             backgroundStyle_select,
//             backgroundStyle_select_press,
//             backgroundStyle_glow,
//             backgroundStyle_glow_press,
//             backgroundStyle_glow_select,
//             backgroundStyle_glow_select_press,
//             backgroundStyle_hover,
//             backgroundStyle_hover_press,
//             backgroundStyle_hover_select,
//             backgroundStyle_hover_select_press,
//             backgroundStyle_hover_glow,
//             backgroundStyle_hover_glow_press,
//             backgroundStyle_hover_glow_select,
//             backgroundStyle_hover_glow_select_press,
//         ];

//         __globals.utility.element.setStyle(
//             background, styles[object.state.hovering*8 + object.state.glowing*4 + object.state.selected*2 + object.state.pressed*1]
//         );
//     };
//     object.activateState();

//     //interactivity
//         object.onmouseenter = function(){ object.state.hovering = true; object.activateState(); };
//         object.onmouseleave = function(){ object.state.hovering = false; object.activateState(); };
//         object.onmouseup = function(){ object.state.pressed = false; object.activateState(); };
//         object.onmousedown = function(event){ object.state.pressed = true; object.activateState(); if(object.pressed){object.pressed(event);} };
//     //controls
//         object.glow = function(bool){ if(bool == undefined){return object.state.glowing;} object.state.glowing = bool; object.activateState(); };
//         object.select = function(bool){ if(bool == undefined){return object.state.selected;} object.state.selected = bool; object.activateState(); };
//     //callbacks
//         object.pressed = function(event){};

//     return object;
// };