this.list = function(
    name='list', 
    x, y, width=50, height=100, angle=0,
    list=[],

    itemTextVerticalOffsetMux=0.5, itemTextHorizontalOffsetMux=0.05,
    active=true, multiSelect=true, hoverable=true, selectable=!false, pressable=true,

    itemHeightMux=0.1, itemWidthMux=0.95, itemSpacingMux=0.01, 
    breakHeightMux=0.0025, breakWidthMux=0.9, 
    spacingHeightMux=0.005,
    backing_style='rgba(230,230,230,1)', break_style='rgba(195,195,195,1)',

    text_font = '5pt Arial',
    text_textBaseline = 'alphabetic',
    text_fill = 'rgba(0,0,0,1)',
    text_stroke = 'rgba(0,0,0,0)',
    text_lineWidth = 1,

    item__off__fill=                          'rgba(180,180,180,1)',
    item__off__stroke=                        'rgba(0,0,0,0)',
    item__off__lineWidth=                     0,
    item__up__fill=                           'rgba(200,200,200,1)',
    item__up__stroke=                         'rgba(0,0,0,0)',
    item__up__lineWidth=                      0,
    item__press__fill=                        'rgba(230,230,230,1)',
    item__press__stroke=                      'rgba(0,0,0,0)',
    item__press__lineWidth=                   0,
    item__select__fill=                       'rgba(200,200,200,1)',
    item__select__stroke=                     'rgba(120,120,120,1)',
    item__select__lineWidth=                  2,
    item__select_press__fill=                 'rgba(230,230,230,1)',
    item__select_press__stroke=               'rgba(120,120,120,1)',
    item__select_press__lineWidth=            2,
    item__glow__fill=                         'rgba(220,220,220,1)',
    item__glow__stroke=                       'rgba(0,0,0,0)',
    item__glow__lineWidth=                    0,
    item__glow_press__fill=                   'rgba(250,250,250,1)',
    item__glow_press__stroke=                 'rgba(0,0,0,0)',
    item__glow_press__lineWidth=              0,
    item__glow_select__fill=                  'rgba(220,220,220,1)',
    item__glow_select__stroke=                'rgba(120,120,120,1)',
    item__glow_select__lineWidth=             2,
    item__glow_select_press__fill=            'rgba(250,250,250,1)',
    item__glow_select_press__stroke=          'rgba(120,120,120,1)',
    item__glow_select_press__lineWidth=       2,
    item__hover__fill=                        'rgba(220,220,220,1)',
    item__hover__stroke=                      'rgba(0,0,0,0)',
    item__hover__lineWidth=                   0,
    item__hover_press__fill=                  'rgba(240,240,240,1)',
    item__hover_press__stroke=                'rgba(0,0,0,0)',
    item__hover_press__lineWidth=             0,
    item__hover_select__fill=                 'rgba(220,220,220,1)',
    item__hover_select__stroke=               'rgba(120,120,120,1)',
    item__hover_select__lineWidth=            2,
    item__hover_select_press__fill=           'rgba(240,240,240,1)',
    item__hover_select_press__stroke=         'rgba(120,120,120,1)',
    item__hover_select_press__lineWidth=      2,
    item__hover_glow__fill=                   'rgba(240,240,240,1)',
    item__hover_glow__stroke=                 'rgba(0,0,0,0)',
    item__hover_glow__lineWidth=              0,
    item__hover_glow_press__fill=             'rgba(250,250,250,1)',
    item__hover_glow_press__stroke=           'rgba(0,0,0,0)',
    item__hover_glow_press__lineWidth=        0,
    item__hover_glow_select__fill=            'rgba(240,240,240,1)',
    item__hover_glow_select__stroke=          'rgba(120,120,120,1)',
    item__hover_glow_select__lineWidth=       2,
    item__hover_glow_select_press__fill=      'rgba(250,250,250,1)',
    item__hover_glow_select_press__stroke=    'rgba(120,120,120,1)',
    item__hover_glow_select_press__lineWidth= 2,

    onenter=function(){},
    onleave=function(){},
    onpress=function(){},
    ondblpress=function(){},
    onrelease=function(){},
    onselection=function(){},
    onpositionchange=function(){},
){
    //state
        var itemArray = [];
        var selectedItems = [];
        var lastNonShiftClicked = 0;
        var position = 0;
        var calculatedListHeight;

    //elements 
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        //backing
            var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{
                fill:backing_style,
            }});
            object.append(backing);
        //item collection
            var itemCollection = canvas.part.builder('group','itemCollection');
            object.append(itemCollection);
            function refreshList(){
                //clean out all values
                    itemArray = [];
                    itemCollection.clear();
                    selectedItems = [];
                    position = 0;
                    lastNonShiftClicked = 0;

                //populate list
                    var accumulativeHeight = 0;
                    for(var a = 0; a < list.length; a++){
                        switch(list[a]){
                            case 'space':
                                var temp = canvas.part.builder( 'rectangle', ''+a, {
                                    x:0, y:accumulativeHeight,
                                    width:width, height:height*spacingHeightMux,
                                    style:{fill:'rgba(255,0,0,0)'}
                                });

                                accumulativeHeight += height*(spacingHeightMux+itemSpacingMux);
                                itemCollection.append( temp );
                            break;
                            case 'break':
                                var temp = canvas.part.builder( 'rectangle', ''+a, {
                                    x:width*(1-breakWidthMux)*0.5, y:accumulativeHeight,
                                    width:width*breakWidthMux, height:height*breakHeightMux,
                                    style:{fill:break_style}
                                });

                                accumulativeHeight += height*(breakHeightMux+itemSpacingMux);
                                itemCollection.append( temp );
                            break;
                            default:
                                var temp = canvas.part.builder( 'button_rect', ''+a, {
                                    x:width*(1-itemWidthMux)*0.5, y:accumulativeHeight,
                                    width:width*itemWidthMux, height:height*itemHeightMux, 
                                    text_left: list[a].text_left,
                                    text_centre: (list[a].text?list[a].text:list[a].text_centre),
                                    text_right: list[a].text_right,

                                    textVerticalOffset: itemTextVerticalOffsetMux, textHorizontalOffsetMux: itemTextHorizontalOffsetMux,
                                    active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

                                    style:{
                                        text_font:text_font,
                                        text_textBaseline:text_textBaseline,
                                        text_fill:text_fill,
                                        text_stroke:text_stroke,
                                        text_lineWidth:text_lineWidth,

                                        item__off__fill:                            item__off__fill,
                                        item__off__stroke:                          item__off__stroke,
                                        item__off__lineWidth:                       item__off__lineWidth,
                                        item__up__fill:                             item__up__fill,
                                        item__up__stroke:                           item__up__stroke,
                                        item__up__lineWidth:                        item__up__lineWidth,
                                        item__press__fill:                          item__press__fill,
                                        item__press__stroke:                        item__press__stroke,
                                        item__press__lineWidth:                     item__press__lineWidth,
                                        item__select__fill:                         item__select__fill,
                                        item__select__stroke:                       item__select__stroke,
                                        item__select__lineWidth:                    item__select__lineWidth,
                                        item__select_press__fill:                   item__select_press__fill,
                                        item__select_press__stroke:                 item__select_press__stroke,
                                        item__select_press__lineWidth:              item__select_press__lineWidth,
                                        item__glow__fill:                           item__glow__fill,
                                        item__glow__stroke:                         item__glow__stroke,
                                        item__glow__lineWidth:                      item__glow__lineWidth,
                                        item__glow_press__fill:                     item__glow_press__fill,
                                        item__glow_press__stroke:                   item__glow_press__stroke,
                                        item__glow_press__lineWidth:                item__glow_press__lineWidth,
                                        item__glow_select__fill:                    item__glow_select__fill,
                                        item__glow_select__stroke:                  item__glow_select__stroke,
                                        item__glow_select__lineWidth:               item__glow_select__lineWidth,
                                        item__glow_select_press__fill:              item__glow_select_press__fill,
                                        item__glow_select_press__stroke:            item__glow_select_press__stroke,
                                        item__glow_select_press__lineWidth:         item__glow_select_press__lineWidth,
                                        item__hover__fill:                          item__hover__fill,
                                        item__hover__stroke:                        item__hover__stroke,
                                        item__hover__lineWidth:                     item__hover__lineWidth,
                                        item__hover_press__fill:                    item__hover_press__fill,
                                        item__hover_press__stroke:                  item__hover_press__stroke,
                                        item__hover_press__lineWidth:               item__hover_press__lineWidth,
                                        item__hover_select__fill:                   item__hover_select__fill,
                                        item__hover_select__stroke:                 item__hover_select__stroke,
                                        item__hover_select__lineWidth:              item__hover_select__lineWidth,
                                        item__hover_select_press__fill:             item__hover_select_press__fill,
                                        item__hover_select_press__stroke:           item__hover_select_press__stroke,
                                        item__hover_select_press__lineWidth:        item__hover_select_press__lineWidth,
                                        item__hover_glow__fill:                     item__hover_glow__fill,
                                        item__hover_glow__stroke:                   item__hover_glow__stroke,
                                        item__hover_glow__lineWidth:                item__hover_glow__lineWidth,
                                        item__hover_glow_press__fill:               item__hover_glow_press__fill,
                                        item__hover_glow_press__stroke:             item__hover_glow_press__stroke,
                                        item__hover_glow_press__lineWidth:          item__hover_glow_press__lineWidth,
                                        item__hover_glow_select__fill:              item__hover_glow_select__fill,
                                        item__hover_glow_select__stroke:            item__hover_glow_select__stroke,
                                        item__hover_glow_select__lineWidth:         item__hover_glow_select__lineWidth,
                                        item__hover_glow_select_press__fill:        item__hover_glow_select_press__fill,
                                        item__hover_glow_select_press__stroke:      item__hover_glow_select_press__stroke,
                                        item__hover_glow_select_press__lineWidth:   item__hover_glow_select_press__lineWidth,
                                    }
                                });

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

                                accumulativeHeight += height*(itemHeightMux+itemSpacingMux);
                                itemCollection.append( temp );
                                itemArray.push( temp );
                            break;
                        }
                    }

                return accumulativeHeight - height*itemSpacingMux;
            }
            calculatedListHeight = refreshList();
        //cover
            var cover = canvas.part.builder('rectangle','cover',{width:width, height:height, style:{ fill:'rgba(0,0,0,0)' }});
            object.append(cover);
        //stencil
            var stencil = canvas.part.builder('rectangle','stencil',{width:width, height:height, style:{ fill:'rgba(0,0,0,0)' }});
            object.stencil(stencil);
            object.clip(true);


    //interaction
        cover.onwheel = function(x,y,event){
            var move = event.deltaY/100;
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
            itemCollection.parameter.y( -a*movementSpace );
            
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
                                    itemCollection.children[ selectedItems[0] ].select(false,undefined,false);
                                    selectedItems.shift();
                                }

                            //select current item
                                selectedItems.push(a);

                    //where we want to deselect an item that is selected
                        }else if(!state && selectedItems.includes(a)){
                            selectedItems = [];
                        }

                //do not update the item itself, in the case that it was the item that sent this command
                //(which would cause a little loop)
                    if(update){ itemCollection.children[a].select(true,undefined,false); }

            //where multi selection is allowed
                }else{
                    //wherer range-selection is to be done
                        if( event != undefined && event.shiftKey ){
                            //gather top and bottom item
                            //(first gather the range positions overall, then compute those positions to indexes on the itemArray)
                                var min = Math.min(lastNonShiftClicked, a);
                                var max = Math.max(lastNonShiftClicked, a);
                                for(var b = 0; b < itemArray.length; b++){
                                    if( itemArray[b].name == ''+min ){min = b;}
                                    if( itemArray[b].name == ''+max ){max = b;}
                                }

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
                    //where range-selection is not to be done
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
        object.onenter = onenter;
        object.onleave = onleave;
        object.onpress = onpress;
        object.ondblpress = ondblpress;
        object.onrelease = onrelease;
        object.onselection = onselection;
        object.onpositionchange = onpositionchange;
        
    return object;
};