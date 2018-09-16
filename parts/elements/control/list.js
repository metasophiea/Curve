this.list = function(
    id='list', 
    x, y, width, height, angle=0,
    list=['item1','item2','item3','item4','item5','item6','item7','item8','item9','item10','item11','item12','item12','item14','item15','item16','item17','item18','item19','item20','item21','item22','item23','item24'],
    selectable=true, multiSelect=true,
    itemHeight=0.1, itemSpacing=0.01,
    itemTextVerticalOffset=0.5, itemTextHorizontalOffset=0.05,
    listItemTextStyle='fill:rgba(0,0,0,1); font-size:5; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',

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
        var lastShiftClicked = undefined;
        var position = 0;

    //main object
        var object = __globals.utility.misc.elementMaker('g',id,{x:x, y:y, r:angle});

    //background
        var rect = __globals.utility.misc.elementMaker('rect',null,{width:width, height:height, style:'fill:rgba(230,230,230,1)'});
        object.appendChild(rect);

    //viewport (for clipping the visible area)
        var viewport = __globals.utility.misc.elementMaker('g','viewport',{});
        viewport.setAttribute('clip-path','polygon(0px 0px, '+width+'px 0px, '+width+'px '+height+'px, 0px '+height+'px)');
        object.appendChild(viewport);

    //main list
        function makeItem(text,a){
            var temp = __globals.utility.misc.elementMaker( 'button_rect_3', a, {
                x:0, y:(height*(itemHeight+itemSpacing))*a,
                width:width, height:height*itemHeight, text:text,
                textVerticalOffset:itemTextVerticalOffset, textHorizontalOffset:itemTextHorizontalOffset,
                active:true, hoverable:true, selectable:true,
                style:{
                    text:listItemTextStyle,
                    up:listItemBackgroundStyle_up,                              press:listItemBackgroundStyle_press,
                    select:listItemBackgroundStyle_select,                       select_press:listItemBackgroundStyle_select_press,
                    glow:listItemBackgroundStyle_glow,                           glow_press:listItemBackgroundStyle_glow_press,
                    glow_select:listItemBackgroundStyle_glow_select,             glow_select_press:listItemBackgroundStyle_glow_select_press,
                    hover:listItemBackgroundStyle_hover,                         hover_press:listItemBackgroundStyle_hover_press,
                    hover_select:listItemBackgroundStyle_hover_select,           hover_select_press:listItemBackgroundStyle_hover_select_press,
                    hover_glow:listItemBackgroundStyle_hover_glow,               hover_glow_press:listItemBackgroundStyle_hover_glow_press,
                    hover_glow_select:listItemBackgroundStyle_hover_glow_select, hover_glow_select_press:listItemBackgroundStyle_hover_glow_select_press,
                }
            });
            temp.onpress = function(a){return function(event){object.select(a,undefined,event);}}(a);

            return temp;
        }
        var mainList = __globals.utility.misc.elementMaker('g','mainList');
        viewport.appendChild(mainList);
        for(var a = 0; a < list.length; a++){
            var temp = makeItem(list[a],a);
            itemArray.push( temp );
            mainList.appendChild( temp );
        }
        
    //interaction
        object.onwheel = function(event){
            var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
            object.position( object.position() + move/10 );
        };

    //controls
        object.position = function(a,update=true){
            if(a == undefined){return position;}
            a = a < 0 ? 0 : a;
            a = a > 1 ? 1 : a;
            position = a;

            var totalHeight =   height*(list.length*(itemHeight + itemSpacing) - itemSpacing)
            var movementSpace = totalHeight - height;
            
            __globals.utility.element.setTransform_XYonly( mainList, undefined, -a*movementSpace );

            var y_offSet = movementSpace * a;
            var bottom = y_offSet+height;

            viewport.setAttribute('clip-path','polygon(0px '+y_offSet+'px, '+width+'px '+y_offSet+'px, '+width+'px '+bottom+'px, 0px '+bottom+'px)');

            if(update&&this.onpositionchange){this.onpositionchange(a);}
        };
        object.select = function(a,state,event,update=true){
            //if selectability is turned off, just return the clicked item text
            if(!selectable){ if(this.onselect){this.onselect(list[a],a);} return;}

            //if the shift key is pressed, do a range select
            if( multiSelect && event != undefined && event.shiftKey ){
                if( lastShiftClicked == undefined ){ lastShiftClicked = a; return; }
                else{
                    var min = Math.min(lastShiftClicked, a); var max = Math.max(lastShiftClicked, a);
                    for(var b = min; b <= max; b++){ this.select(b,undefined,undefined,false); }
                    lastShiftClicked = undefined;
                }
            }else{
                if(state == undefined){
                    var index = selectedItems.indexOf(a);
                    var state = index == -1;
                    if(state){ selectedItems.push(a); }
                    else{ selectedItems.splice(index, 1); }
                }
                itemArray[a].select(state);
            }

            if(update && this.onselect){this.onselect(this.getSelected(),selectedItems);}
        };
        object.glow = function(a,state){
            if(state == undefined){ itemArray[a].glow(!itemArray[a].glow()); }
            else{ itemArray[a].glow(state); }
        };
        object.getSelected = function(){ return selectedItems.map(a => list[a]); };
        object.add = function(text){
            var temp = makeItem(text,list.length);
            list.push(text);
            itemArray.push( temp );
            mainList.appendChild( temp );
        };
        object.remove = function(a){
            list.splice(a, 1);
            itemArray = [];
            mainList.innerHTML = '';

            for(var a = 0; a < list.length; a++){
                var temp = makeItem(list[a],a);
                itemArray.push( temp );
                mainList.appendChild( temp );
            }

            selectedItems = [];
        };

    //callbacks
        object.onselect = function(a,i){};
        object.onpositionchange = function(a){};
    
    return object;
};