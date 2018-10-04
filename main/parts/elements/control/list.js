this.list = function(
    id='list', 
    x, y, width, height, angle=0,
    list=[
        {text:'item1',  function:function(){console.log('item1 function');}},  {text:'item2',  function:function(){console.log('item2 function');}},
        {text:'item3',  function:function(){console.log('item3 function');}},  {text:'item4',  function:function(){console.log('item4 function');}},
        'space','break','space',
        {text:'item5',  function:function(){console.log('item5 function');}},  {text:'item6',  function:function(){console.log('item6 function');}},
        {text:'item7',  function:function(){console.log('item7 function');}},  {text:'item8',  function:function(){console.log('item8 function');}},
        {text:'item9',  function:function(){console.log('item9 function');}},  {text:'item10', function:function(){console.log('item10 function');}},
        {text:'item11', function:function(){console.log('item11 function');}}, {text:'item12', function:function(){console.log('item12 function');}},
        {text:'item13', function:function(){console.log('item13 function');}}, {text:'item14', function:function(){console.log('item14 function');}},
        {text:'item15', function:function(){console.log('item15 function');}}, {text:'item16', function:function(){console.log('item16 function');}},
        {text:'item17', function:function(){console.log('item17 function');}}, {text:'item18', function:function(){console.log('item18 function');}},
        {text:'item19', function:function(){console.log('item19 function');}}, {text:'item20', function:function(){console.log('item20 function');}},
        {text:'item21', function:function(){console.log('item21 function');}}, {text:'item22', function:function(){console.log('item22 function');}},
        {text:'item23', function:function(){console.log('item23 function');}}, {text:'item24', function:function(){console.log('item24 function');}},
        {text:'item25', function:function(){console.log('item25 function');}}, {text:'item26', function:function(){console.log('item26 function');}},
        {text:'item27', function:function(){console.log('item27 function');}}, {text:'item28', function:function(){console.log('item28 function');}},
        {text:'item29', function:function(){console.log('item29 function');}}, {text:'item30', function:function(){console.log('item30 function');}},
        {text:'item31', function:function(){console.log('item31 function');}}, {text:'item32', function:function(){console.log('item32 function');}},
    ],
    selectable=true, multiSelect=true, hoverable=true, pressable=true, active=true,
    itemHeightMux=0.1, itemSpacingMux=0.01, breakHeightMux=0.0025, breakWidthMux=0.9, spacingHeightMux=0.005,
    itemTextVerticalOffsetMux=0.5, itemtextHorizontalOffsetMux=0.05,
    listItemTextStyle='fill:rgba(0,0,0,1); font-size:5; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
    backingStyle='fill:rgba(230,230,230,1)',
    breakStyle='fill:rgba(195,195,195,1)',
    listItemBackgroundStyle_off=                     'fill:rgba(180,180,180,1)',
    listItemBackgroundStyle_up=                      'fill:rgba(220,220,220,1)',
    listItemBackgroundStyle_press=                   'fill:rgba(230,230,230,1)',
    listItemBackgroundStyle_select=                  'fill:rgba(200,200,200,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
    listItemBackgroundStyle_select_press=            'fill:rgba(230,230,230,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
    listItemBackgroundStyle_glow=                    'fill:rgba(230,230,210,1)',
    listItemBackgroundStyle_glow_press=              'fill:rgba(250,250,250,1)',
    listItemBackgroundStyle_glow_select=             'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
    listItemBackgroundStyle_glow_select_press=       'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
    listItemBackgroundStyle_hover=                   'fill:rgba(230,230,230,1)',
    listItemBackgroundStyle_hover_press=             'fill:rgba(240,240,240,1)',
    listItemBackgroundStyle_hover_select=            'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
    listItemBackgroundStyle_hover_select_press=      'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
    listItemBackgroundStyle_hover_glow=              'fill:rgba(240,240,240,1)',
    listItemBackgroundStyle_hover_glow_press=        'fill:rgba(250,250,250,1)',
    listItemBackgroundStyle_hover_glow_select=       'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
    listItemBackgroundStyle_hover_glow_select_press= 'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
){
    //state
        var itemArray = [];
        var selectedItems = [];
        var lastNonShiftClicked = 0;
        var position = 0;
        var calculatedListHeight;


    //main object
        var object = system.utility.misc.elementMaker('g',id,{x:x, y:y, r:angle});

    //background
        var rect = system.utility.misc.elementMaker('rect',null,{width:width, height:height, style:backingStyle});
        object.appendChild(rect);

    //viewport (for clipping the visible area)
        var viewport = system.utility.misc.elementMaker('g','viewport',{});
        viewport.setAttribute('clip-path','polygon(0px 0px, '+width+'px 0px, '+width+'px '+height+'px, 0px '+height+'px)');
        object.appendChild(viewport);

    //main list
        var mainList = system.utility.misc.elementMaker('g','mainList');
        viewport.appendChild(mainList);

        function refreshList(){
            //clean out all values
                itemArray = [];
                mainList.innerHTML = '';
                selectedItems = [];
                position = 0;
                lastNonShiftClicked = 0;

            //populate list
                var accumulativeHeight = 0;
                for(var a = 0; a < list.length; a++){
                    if( list[a] == 'break' ){
                        //break
                        var temp = system.utility.misc.elementMaker( 'rect', a, {
                            x:width*(1-breakWidthMux)*0.5, y:accumulativeHeight,
                            width:width*breakWidthMux, height:height*breakHeightMux,
                            style:breakStyle
                        });

                        accumulativeHeight += height*(breakHeightMux+itemSpacingMux);
                    }else if( list[a] == 'space' ){
                        //spacing
                        var temp = system.utility.misc.elementMaker( 'rect', a, {
                            x:0, y:accumulativeHeight,
                            width:width, height:height*spacingHeightMux,
                            style:backingStyle
                        });

                        accumulativeHeight += height*(spacingHeightMux+itemSpacingMux);
                    }else{
                        //regular item
                        var temp = system.utility.misc.elementMaker( 'button_rect', a, {
                            x:0, y:accumulativeHeight,
                            width:width, height:height*itemHeightMux, 
                            text_centre: (list[a].text?list[a].text:list[a].text_centre),
                            text_left: list[a].text_left, text_right:list[a].text_right,
                            textVerticalOffset:itemTextVerticalOffsetMux, textHorizontalOffsetMux:itemtextHorizontalOffsetMux,
                            active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,
                            style:{
                                text:listItemTextStyle,
                                off:listItemBackgroundStyle_off,
                                up:listItemBackgroundStyle_up,                               press:listItemBackgroundStyle_press,
                                select:listItemBackgroundStyle_select,                       select_press:listItemBackgroundStyle_select_press,
                                glow:listItemBackgroundStyle_glow,                           glow_press:listItemBackgroundStyle_glow_press,
                                glow_select:listItemBackgroundStyle_glow_select,             glow_select_press:listItemBackgroundStyle_glow_select_press,
                                hover:listItemBackgroundStyle_hover,                         hover_press:listItemBackgroundStyle_hover_press,
                                hover_select:listItemBackgroundStyle_hover_select,           hover_select_press:listItemBackgroundStyle_hover_select_press,
                                hover_glow:listItemBackgroundStyle_hover_glow,               hover_glow_press:listItemBackgroundStyle_hover_glow_press,
                                hover_glow_select:listItemBackgroundStyle_hover_glow_select, hover_glow_select_press:listItemBackgroundStyle_hover_glow_select_press,
                            }
                        });

                        accumulativeHeight += height*(itemHeightMux+itemSpacingMux);

                        temp.onenter = function(a){ return function(){ object.onenter(a); } }(a);
                        temp.onleave = function(a){ return function(){ object.onleave(a); } }(a);
                        temp.onpress = function(a){ return function(){ object.onpress(a); } }(a);
                        temp.ondblpress = function(a){ return function(){ object.ondblpress(a); } }(a);
                        temp.onrelease = function(a){
                            return function(){
                                if( list[a].function ){ list[a].function(); }
                                object.onrelease(a);
                            }
                        }(a);
                        temp.onselect = function(a){ return function(obj,event){ object.select(a,true,event,false); } }(a);
                        temp.ondeselect = function(a){ return function(obj,event){ object.select(a,false,event,false); } }(a);
                    }

                    itemArray.push( temp );
                    mainList.appendChild( temp );
                }

            return accumulativeHeight - height*itemSpacingMux;
        }

        calculatedListHeight = refreshList();



    //interaction
        object.onwheel = function(event){
            var move = system.mouse.wheelInterpreter( event.deltaY );
            object.position( object.position() + move/10 );
        };

    //controls
        object.position = function(a,update=true){
            if(a == undefined){return position;}
            a = a < 0 ? 0 : a;
            a = a > 1 ? 1 : a;
            position = a;

            if( calculatedListHeight < height ){return;}

            var movementSpace = calculatedListHeight - height;
            
            system.utility.element.setTransform_XYonly( mainList, undefined, -a*movementSpace );

            var y_offSet = movementSpace * a;
            var bottom = y_offSet+height;

            viewport.setAttribute('clip-path','polygon(0px '+y_offSet+'px, '+width+'px '+y_offSet+'px, '+width+'px '+bottom+'px, 0px '+bottom+'px)');

            if(update&&this.onpositionchange){this.onpositionchange(a);}
        };
        object.select = function(a,state,event,update=true){
            if(!selectable){return;}

            //where multi selection is not allowed
            if(!multiSelect){
                //where we want to select an item, which is not already selected
                if(state && !selectedItems.includes(a) ){
                    //deselect all other items
                    while( selectedItems.length > 0 ){
                        itemArray[ selectedItems[0] ].select(false,undefined,false);
                        selectedItems.shift();
                    }

                    //select current item
                    selectedItems.push(a);

                    //do not update the item itself, in the case that it was the item that sent this command
                    //(which would cause a little loop)
                    if(update){ itemArray[a].select(true,undefined,false); }
                //where we want to deselect an item that is selected
                }else if(!state && selectedItems.includes(a)){
                    //deselect current item
                    selectedItems.splice( selectedItems.indexOf(a), 1 );

                    //do not update the item itself, in the case that it was the item that sent this command
                    //(which would cause a little loop)
                    if(update){ itemArray[a].select(false,undefined,false); }
                }

            //where multi selection is allowed
            }else{
                //determind if range-selection is to be done
                if( event != undefined && event.shiftKey ){
                    var min = Math.min(lastNonShiftClicked, a); var max = Math.max(lastNonShiftClicked, a);

                    //deselect all outside the range
                    selectedItems = [];
                    for(var b = 0; b < itemArray.length; b++){
                        if( b > max || b < min ){
                            if( itemArray[b].select() ){
                                itemArray[b].select(false,undefined,false);
                            }
                        }
                    }

                    //select those within the range (that aren't already selected)
                    for(var b = min; b <= max; b++){
                        if( !itemArray[b].select() ){
                            itemArray[b].select(true,undefined,false);
                            selectedItems.push(b);
                        }
                    }

                }else{
                    if(update){ itemArray[a].select(state); }
                    if(state && !selectedItems.includes(a) ){ selectedItems.push(a); }
                    else if(!state && selectedItems.includes(a)){ selectedItems.splice( selectedItems.indexOf(a), 1 ); }
                    lastNonShiftClicked = a;
                }
            }

            object.onselection(selectedItems);
        };
        object.add = function(item){
            list.push(item);
            calculatedListHeight = refreshList();
        };
        object.remove = function(a){
            list.splice(a,1);
            calculatedListHeight = refreshList();
        };

        //callbacks
            object.onenter = function(listItemNumber){ /*console.log('onenter:',listItemNumber);*/ };
            object.onleave = function(listItemNumber){ /*console.log('onleave:',listItemNumber);*/ };
            object.onpress = function(listItemNumber){ /*console.log('onpress:',listItemNumber);*/ };
            object.ondblpress = function(listItemNumber){ /*console.log('ondblpress:',listItemNumber);*/ };
            object.onrelease = function(listItemNumber){ /*console.log('onrelease:',listItemNumber);*/ };
            object.onselection = function(listItemNumbers){ /*console.log('onselection:',listItemNumbers);*/ };
            object.onpositionchange = function(a){};
        
    return object;
};