// this.list_image = function(
//     name='list_image', 
//     x, y, angle=0, interactable=true,
//     list=[],

//     active=true, multiSelect=false, hoverable=true, selectable=false, pressable=true,

//     heightLimit=-1, widthLimit=-1,
//     background_url='/images/testImages/expanded-metal-1.jpg',
//     break_url='/images/testImages/Dore-munchausen-illustration.jpg',
//     image_url='/images/testImages/mikeandbrian.jpg',

//     default_item_height=10, default_item_width=47.5,
//     default_item_spacingHeight=3/4,
//     default_item_horizontalPadding=2,

//     default_item__off__url=                     '/images/testImages/buttonStates/off.png',
//     default_item__up__url=                      '/images/testImages/buttonStates/up.png',
//     default_item__press__url=                   '/images/testImages/buttonStates/press.png',
//     default_item__select__url=                  '/images/testImages/buttonStates/select.png',
//     default_item__select_press__url=            '/images/testImages/buttonStates/select_press.png',
//     default_item__glow__url=                    '/images/testImages/buttonStates/glow.png',
//     default_item__glow_press__url=              '/images/testImages/buttonStates/glow_press.png',
//     default_item__glow_select__url=             '/images/testImages/buttonStates/glow_select.png',
//     default_item__glow_select_press__url=       '/images/testImages/buttonStates/glow_select_press.png',
//     default_item__hover__url=                   '/images/testImages/buttonStates/hover.png',
//     default_item__hover_press__url=             '/images/testImages/buttonStates/hover_press.png',
//     default_item__hover_select__url=            '/images/testImages/buttonStates/hover_select.png',
//     default_item__hover_select_press__url=      '/images/testImages/buttonStates/hover_select_press.png',
//     default_item__hover_glow__url=              '/images/testImages/buttonStates/hover_glow.png',
//     default_item__hover_glow_press__url=        '/images/testImages/buttonStates/hover_glow_press.png',
//     default_item__hover_glow_select__url=       '/images/testImages/buttonStates/hover_glow_select.png',
//     default_item__hover_glow_select_press__url= '/images/testImages/buttonStates/hover_glow_select_press.png',

//     space_height=10/16,
//     break_height=10/8,
//     break_lineMux=1/5,

//     onenter=function(a){/*console.log('onenter >',a);*/},
//     onleave=function(a){/*console.log('onleave >',a);*/},
//     onpress=function(a){/*console.log('onpress >',a);*/},
//     ondblpress=function(a){/*console.log('ondblpress >',a);*/},
//     onrelease=function(a){/*console.log('onrelease >',a);*/},
//     onselection=function(a){/*console.log('onselection >',a);*/},
//     onpositionchange=function(a){/*console.log('onpositionchange >',a);*/},
// ){
//     dev.log.partControl('.list_image(...)'); //#development

//     //state
//         let self = this;
//         let itemArray = [];
//         let calculatedListHeight = 0;
//         const state = {
//             position:0,
//             lastNonShiftClicked:0,
//             selectedItems:[],
//         };

//     //default style
//         const style = {
//             default:{
//                 heightLimit:heightLimit, widthLimit:widthLimit,
//                 background_url:background_url,
//                 break_url:break_url,
//                 image_url:image_url,

//                 height:default_item_height, width:default_item_width,

//                 itemSpacingHeight:default_item_spacingHeight,
//                 itemHorizontalPadding:default_item_horizontalPadding,

//                 item__off__url:                     default_item__off__url,
//                 item__up__url:                      default_item__up__url,
//                 item__press__url:                   default_item__press__url,
//                 item__select__url:                  default_item__select__url,
//                 item__select_press__url:            default_item__select_press__url,
//                 item__glow__url:                    default_item__glow__url,
//                 item__glow_press__url:              default_item__glow_press__url,
//                 item__glow_select__url:             default_item__glow_select__url,
//                 item__glow_select_press__url:       default_item__glow_select_press__url,
//                 item__hover__url:                   default_item__hover__url,
//                 item__hover_press__url:             default_item__hover_press__url,
//                 item__hover_select__url:            default_item__hover_select__url,
//                 item__hover_select_press__url:      default_item__hover_select_press__url,
//                 item__hover_glow__url:              default_item__hover_glow__url,
//                 item__hover_glow_press__url:        default_item__hover_glow_press__url,
//                 item__hover_glow_select__url:       default_item__hover_glow_select__url,
//                 item__hover_glow_select_press__url: default_item__hover_glow_select_press__url,
//             },
//             space:{
//                 height:space_height,
//             },
//             image:{},
//             break:{
//                 height:break_height,
//                 lineMux:break_lineMux,
//             },
//             checkbox:{},
//             button:{},
//             list:{
//                 heightLimit:-1,
//                 space_height:space_height,
//                 break_height:break_height,
//                 break_lineMux:break_lineMux,
//             },
//         };


//     //generate list content
//         function generateListContent(listItems=[]){
//             function def(i,t){ return i[t]==undefined ? (style[i.type][t]==undefined ? style.default[t] : style[i.type][t]) : i[t]; }

//             const output = {elements:[], calculatedListHeight:0};
//             const xOffset = style.default.widthLimit < 0 ? 0 : (style.default.widthLimit-style.default.width)/2;

//             listItems.forEach((item,index) => {
//                 if(index != 0){output.calculatedListHeight += style.default.itemSpacingHeight;}

//                 let newItem;
//                 if(item.type == 'image'){
//                     newItem = self.list_image.itemTypes.image(
//                         index, xOffset, output.calculatedListHeight, def(item,'width'), def(item,'height'), def(item,'image_url'),
//                     );
//                 }else if(item.type == 'space'){
//                     newItem = self.list_image.itemTypes.space(index, xOffset, output.calculatedListHeight, def(item,'height') );
//                 }else if(item.type == 'break'){
//                     newItem = self.list_image.itemTypes.break(
//                         index, xOffset, output.calculatedListHeight, def(item,'width'), 
//                         def(item,'height'), def(item,'break_url')
//                     );
//                 }else if(item.type == 'checkbox'){
//                     newItem = self.list_image.itemTypes.checkbox(
//                         index, xOffset, output.calculatedListHeight, def(item,'width'), def(item,'height'), def(item,'itemHorizontalPadding'),
//                         item.active != undefined ? item.active : active, 
//                         item.hoverable != undefined ? item.hoverable : hoverable, 
//                         item.selectable != undefined ? item.selectable : selectable, 
//                         item.pressable != undefined ? item.pressable : pressable, 

//                         def(item,'item__off__url'),
//                         def(item,'item__up__url'),
//                         def(item,'item__press__url'),
//                         def(item,'item__select__url'),
//                         def(item,'item__select_press__url'),
//                         def(item,'item__glow__url'),
//                         def(item,'item__glow_press__url'),
//                         def(item,'item__glow_select__url'),
//                         def(item,'item__glow_select_press__url'),
//                         def(item,'item__hover__url'),
//                         def(item,'item__hover_press__url'),
//                         def(item,'item__hover_select__url'),
//                         def(item,'item__hover_select_press__url'),
//                         def(item,'item__hover_glow__url'),
//                         def(item,'item__hover_glow_press__url'),
//                         def(item,'item__hover_glow_select__url'),
//                         def(item,'item__hover_glow_select_press__url'),

//                         item.updateFunction, item.onclickFunction,
//                     );
//                 }else if(item.type == 'button'){
//                     newItem = self.list_image.itemTypes.button(
//                         index, xOffset, output.calculatedListHeight, def(item,'width'), def(item,'height'), def(item,'itemHorizontalPadding'),
//                         item.active != undefined ? item.active : active, 
//                         item.hoverable != undefined ? item.hoverable : hoverable, 
//                         item.selectable != undefined ? item.selectable : selectable, 
//                         item.pressable != undefined ? item.pressable : pressable, 

//                         def(item,'item__off__url'),
//                         def(item,'item__up__url'),
//                         def(item,'item__press__url'),
//                         def(item,'item__select__url'),
//                         def(item,'item__select_press__url'),
//                         def(item,'item__glow__url'),
//                         def(item,'item__glow_press__url'),
//                         def(item,'item__glow_select__url'),
//                         def(item,'item__glow_select_press__url'),
//                         def(item,'item__hover__url'),
//                         def(item,'item__hover_press__url'),
//                         def(item,'item__hover_select__url'),
//                         def(item,'item__hover_select_press__url'),
//                         def(item,'item__hover_glow__url'),
//                         def(item,'item__hover_glow_press__url'),
//                         def(item,'item__hover_glow_select__url'),
//                         def(item,'item__hover_glow_select_press__url'),

//                         function(){ object.onenter([index]); },
//                         function(){ object.onleave([index]); },
//                         function(){ object.onpress([index]); },
//                         function(){ object.ondblpress([index]); },
//                         function(){ if(item.function){item.function();} object.onrelease([index]); },
//                         function(obj,event){ object.select(index,true,event,false);} ,
//                         function(obj,event){ object.select(index,false,event,false); },
//                     );
//                 }else if(item.type == 'list'){
//                     newItem = self.list_image.itemTypes.list(
//                         subListGroup,
//                         index, xOffset, output.calculatedListHeight,
                    
//                         //internal callbacks
//                             function(isOpen){
//                                 if(!isOpen){return;}
//                                 itemArray.forEach((item,a) => { if(list[a].type == 'list' && a != index && item.isOpen){ item.close(); } });
//                                 return -state.position * (style.default.heightLimit > 0 && style.default.heightLimit < calculatedListHeight ? (calculatedListHeight-style.default.heightLimit) : calculatedListHeight);
//                             },
                        
//                         //button
//                             def(item,'width'), def(item,'height'), 
                    
//                             def(item,'itemHorizontalPadding'),
//                             item.active != undefined ? item.active : active, 
//                             item.hoverable != undefined ? item.hoverable : hoverable, 
//                             item.pressable != undefined ? item.pressable : pressable, 
                    
//                             def(item,'item__off__url'),
//                             def(item,'item__up__url'),
//                             def(item,'item__press__url'),
//                             def(item,'item__select__url'),
//                             def(item,'item__select_press__url'),
//                             def(item,'item__glow__url'),
//                             def(item,'item__glow_press__url'),
//                             def(item,'item__glow_select__url'),
//                             def(item,'item__glow_select_press__url'),
//                             def(item,'item__hover__url'),
//                             def(item,'item__hover_press__url'),
//                             def(item,'item__hover_select__url'),
//                             def(item,'item__hover_select_press__url'),
//                             def(item,'item__hover_glow__url'),
//                             def(item,'item__hover_glow_press__url'),
//                             def(item,'item__hover_glow_select__url'),
//                             def(item,'item__hover_glow_select_press__url'),
                    
//                         //sub list
//                             item.list,
//                             item.interactable,
                    
//                             item.itemWidth,
//                             def(item,'heightLimit'),
//                             def(item,'widthLimit'),
//                             def(item,'backgroundColour'),
//                             def(item,'backgroundMarkingColour'),
                    
//                             def(item,'default_item_spacingHeight'),
                    
//                             def(item,'space_height'),
//                             def(item,'break_height'),
//                             def(item,'break_lineMux'),
                    
//                             item.onenter,
//                             item.onleave,
//                             item.onpress,
//                             item.ondblpress,
//                             item.onrelease,
//                             item.onselection,
//                             item.onpositionchange,
//                     );
//                 }else{ //unknown item
//                     output.calculatedListHeight -= style.default.itemSpacingHeight;
//                     console.warn('interface part "list_image" :: error : unknown list item type:',item);
//                     return;
//                 }

//                 output.elements.push(newItem.item);
//                 output.calculatedListHeight += newItem.height;
//             });

//             return output;
//         }

//     //refreshing function
//         function refresh(){
//             itemArray = [];
//             calculatedListHeight = 0;
//             state.selectedItems = [];
//             state.lastNonShiftClicked = 0;
//             state.position = 0;
            
//             results = generateListContent(list);
//             calculatedListHeight = results.calculatedListHeight;
//             itemArray = results.elements;

//             const widthToUse = style.default.widthLimit < 0 ? style.default.width : style.default.widthLimit;
//             backing.width(widthToUse);
//             cover.width(widthToUse);
//             stencil.width(widthToUse);

//             const heightToUse = style.default.heightLimit < 0 || style.default.heightLimit > calculatedListHeight ? calculatedListHeight : style.default.heightLimit;
//             backing.height(calculatedListHeight);
//             cover.height(heightToUse);
//             stencil.height(heightToUse);

//             itemCollection.clear();
//             results.elements.forEach(element => itemCollection.append(element));
//         }

//     //elements 
//         //main
//             const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
//             //stenciled group
//                 const stenciledGroup = interfacePart.builder('basic','group','stenciledGroup');
//                 object.append(stenciledGroup);
//             //sub list group
//                 const subListGroup = interfacePart.builder('basic','group','subListGroup');
//                 object.append(subListGroup);
//             //backing
//                 const backing = interfacePart.builder('basic','image','backing',{url:background_url});
//                 stenciledGroup.append(backing);
//             //item collection
//                 const itemCollection = interfacePart.builder('basic','group','itemCollection');
//                 stenciledGroup.append(itemCollection);
//             //cover
//                 const cover = interfacePart.builder('basic','rectangle','cover',{colour:{r:0,g:0,b:0,a:0}});
//                 stenciledGroup.append(cover);
//             //stencil
//                 const stencil = interfacePart.builder('basic','rectangle','stencil');
//                 stenciledGroup.stencil(stencil);
//                 stenciledGroup.clipActive(true);

//     refresh();

//     return object;
// };

// this.list_image.itemTypes = {};
// this.list_image.itemTypes.space = function(index, x, y, height){
//     dev.log.partControl('.list_image.itemTypes.space(...)'); //#development

//     const newItem = interfacePart.builder('basic','group',index+'_space',{x:x,y:y});
//     return {item:newItem,height:height};
// };
// this.list_image.itemTypes.break = function(index, x, y, width, height, url){
//     dev.log.partControl('.list_image.itemTypes.break(...)'); //#development

//     const newItem = interfacePart.builder('basic','group',index+'_break',{x:x,y:y});
//     const image = interfacePart.builder('basic', 'image', 'image', { width:width, height:height, url:url });
//     newItem.append(image);

//     return {item:newItem,height:height};
// };
// this.list_image.itemTypes.image = function(index, x, y, width, height, url){
//     dev.log.partControl('.list_image.itemTypes.image(...)'); //#development

//     const newItem = interfacePart.builder('basic','group',index+'_image',{x:x,y:y});
//     const image = interfacePart.builder('basic', 'image', 'image', { width:width, height:height, url:url });
//     newItem.append(image);

//     return {item:newItem,height:height};
// };

// interfacePart.partLibrary.control.list_image = function(name,data){ 
//     return interfacePart.collection.control.list_image(
//         name,
//         data.x, 
//         data.y, 
//         data.angle,
//         data.interactable,
//         data.list,
    
//         data.active,
//         data.multiSelect,
//         data.hoverable,
//         data.selectable,
//         data.pressable,
    
//         data.heightLimit,
//         data.widthLimit,
//         data.background_url,
//         data.break_url,
    
//         data.default_item_height,
//         data.default_item_width,
//         data.default_item_spacingHeight,
//         data.default_item_horizontalPadding,
    
//         data.default_item__off__url,
//         data.default_item__up__url,
//         data.default_item__press__url,
//         data.default_item__select__url,
//         data.default_item__select_press__url,
//         data.default_item__glow__url,
//         data.default_item__glow_press__url,
//         data.default_item__glow_select__url,
//         data.default_item__glow_select_press__url,
//         data.default_item__hover__url,
//         data.default_item__hover_press__url,
//         data.default_item__hover_select__url,
//         data.default_item__hover_select_press__url,
//         data.default_item__hover_glow__url,
//         data.default_item__hover_glow_press__url,
//         data.default_item__hover_glow_select__url,
//         data.default_item__hover_glow_select_press__url,
    
//         data.space_height,
//         data.break_height,
//         data.break_lineMux,
    
//         data.onenter,
//         data.onleave,
//         data.onpress,
//         data.ondblpress,
//         data.onrelease,
//         data.onselection,
//         data.onpositionchange,
//     );
// };