this.list = function(
    name='list', 
    x, y, width=50, height=100, angle=0, interactable=true,
    list=[],

    itemTextVerticalOffsetMux=0.5, itemTextHorizontalOffsetMux=0.05,
    active=true, multiSelect=true, hoverable=true, selectable=!false, pressable=true,

    itemHeightMux=0.1, itemWidthMux=0.95, itemSpacingMux=0.01, 
    breakHeightMux=0.0025, breakWidthMux=0.9, 
    spacingHeightMux=0.005,
    backing_style={r:230/255,g:230/255,b:230/255,a:1}, break_style={r:195/255,g:195/255,b:195/255,a:1},

    text_font = '5pt Arial',
    text_textBaseline = 'alphabetic',
    text_colour = {r:0/255,g:0/255,b:0/255,a:1},

    item__off__colour=                            {r:180/255,g:180/255,b:180/255,a:1},
    item__off__lineColour=                        {r:0/255,g:0/255,b:0/255,a:0},
    item__off__lineThickness=                     0,
    item__up__colour=                             {r:200/255,g:200/255,b:200/255,a:1},
    item__up__lineColour=                         {r:0/255,g:0/255,b:0/255,a:0},
    item__up__lineThickness=                      0,
    item__press__colour=                          {r:230/255,g:230/255,b:230/255,a:1},
    item__press__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
    item__press__lineThickness=                   0,
    item__select__colour=                         {r:200/255,g:200/255,b:200/255,a:1},
    item__select__lineColour=                     {r:120/255,g:120/255,b:120/255,a:1},
    item__select__lineThickness=                  0.75,
    item__select_press__colour=                   {r:230/255,g:230/255,b:230/255,a:1},
    item__select_press__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
    item__select_press__lineThickness=            0.75,
    item__glow__colour=                           {r:220/255,g:220/255,b:220/255,a:1},
    item__glow__lineColour=                       {r:0/255,g:0/255,b:0/255,a:0},
    item__glow__lineThickness=                    0,
    item__glow_press__colour=                     {r:250/255,g:250/255,b:250/255,a:1},
    item__glow_press__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
    item__glow_press__lineThickness=              0,
    item__glow_select__colour=                    {r:220/255,g:220/255,b:220/255,a:1},
    item__glow_select__lineColour=                {r:120/255,g:120/255,b:120/255,a:1},
    item__glow_select__lineThickness=             0.75,
    item__glow_select_press__colour=              {r:250/255,g:250/255,b:250/255,a:1},
    item__glow_select_press__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
    item__glow_select_press__lineThickness=       0.75,
    item__hover__colour=                          {r:220/255,g:220/255,b:220/255,a:1},
    item__hover__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
    item__hover__lineThickness=                   0,
    item__hover_press__colour=                    {r:240/255,g:240/255,b:240/255,a:1},
    item__hover_press__lineColour=                {r:0/255,g:0/255,b:0/255,a:0},
    item__hover_press__lineThickness=             0,
    item__hover_select__colour=                   {r:220/255,g:220/255,b:220/255,a:1},
    item__hover_select__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
    item__hover_select__lineThickness=            0.75,
    item__hover_select_press__colour=             {r:240/255,g:240/255,b:240/255,a:1},
    item__hover_select_press__lineColour=         {r:120/255,g:120/255,b:120/255,a:1},
    item__hover_select_press__lineThickness=      0.75,
    item__hover_glow__colour=                     {r:240/255,g:240/255,b:240/255,a:1},
    item__hover_glow__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
    item__hover_glow__lineThickness=              0,
    item__hover_glow_press__colour=               {r:250/255,g:250/255,b:250/255,a:1},
    item__hover_glow_press__lineColour=           {r:0/255,g:0/255,b:0/255,a:0},
    item__hover_glow_press__lineThickness=        0,
    item__hover_glow_select__colour=              {r:240/255,g:240/255,b:240/255,a:1},
    item__hover_glow_select__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
    item__hover_glow_select__lineThickness=       0.75,
    item__hover_glow_select_press__colour=        {r:250/255,g:250/255,b:250/255,a:1},
    item__hover_glow_select_press__lineColour=    {r:120/255,g:120/255,b:120/255,a:1},
    item__hover_glow_select_press__lineThickness= 0.75,

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
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //backing
            var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, colour:backing_style});
            object.append(backing);
        //item collection
            var itemCollection = interfacePart.builder('group','itemCollection');
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
                        if( list[a] == 'space' ){
                            var temp = interfacePart.builder( 'rectangle', ''+a, {
                                x:0, y:accumulativeHeight,
                                width:width, height:height*spacingHeightMux,
                                colour:{r:1,g:0,b:0,a:0},
                            });

                            accumulativeHeight += height*(spacingHeightMux+itemSpacingMux);
                            itemCollection.append( temp );
                        }else if( list[a] == 'break'){
                            var temp = interfacePart.builder( 'rectangle', ''+a, {
                                x:width*(1-breakWidthMux)*0.5, y:accumulativeHeight,
                                width:width*breakWidthMux, height:height*breakHeightMux,
                                colour:break_style
                            });

                            accumulativeHeight += height*(breakHeightMux+itemSpacingMux);
                            itemCollection.append( temp );
                        }else{
                            var temp = interfacePart.builder( 'button_rectangle', ''+a, {
                                x:width*(1-itemWidthMux)*0.5, y:accumulativeHeight,
                                width:width*itemWidthMux, height:height*itemHeightMux, interactable:interactable,
                                text_left: list[a].text_left,
                                text_centre: (list[a].text?list[a].text:list[a].text_centre),
                                text_right: list[a].text_right,

                                textVerticalOffset: itemTextVerticalOffsetMux, textHorizontalOffsetMux: itemTextHorizontalOffsetMux,
                                active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

                                style:{
                                    text_font:text_font,
                                    text_textBaseline:text_textBaseline,
                                    text_colour:text_colour,

                                    background__off__colour:                            item__off__colour,
                                    background__off__lineColour:                        item__off__lineColour,
                                    background__off__lineThickness:                     item__off__lineThickness,
                                    background__up__colour:                             item__up__colour,
                                    background__up__lineColour:                         item__up__lineColour,
                                    background__up__lineThickness:                      item__up__lineThickness,
                                    background__press__colour:                          item__press__colour,
                                    background__press__lineColour:                      item__press__lineColour,
                                    background__press__lineThickness:                   item__press__lineThickness,
                                    background__select__colour:                         item__select__colour,
                                    background__select__lineColour:                     item__select__lineColour,
                                    background__select__lineThickness:                  item__select__lineThickness,
                                    background__select_press__colour:                   item__select_press__colour,
                                    background__select_press__lineColour:               item__select_press__lineColour,
                                    background__select_press__lineThickness:            item__select_press__lineThickness,
                                    background__glow__colour:                           item__glow__colour,
                                    background__glow__lineColour:                       item__glow__lineColour,
                                    background__glow__lineThickness:                    item__glow__lineThickness,
                                    background__glow_press__colour:                     item__glow_press__colour,
                                    background__glow_press__lineColour:                 item__glow_press__lineColour,
                                    background__glow_press__lineThickness:              item__glow_press__lineThickness,
                                    background__glow_select__colour:                    item__glow_select__colour,
                                    background__glow_select__lineColour:                item__glow_select__lineColour,
                                    background__glow_select__lineThickness:             item__glow_select__lineThickness,
                                    background__glow_select_press__colour:              item__glow_select_press__colour,
                                    background__glow_select_press__lineColour:          item__glow_select_press__lineColour,
                                    background__glow_select_press__lineThickness:       item__glow_select_press__lineThickness,
                                    background__hover__colour:                          item__hover__colour,
                                    background__hover__lineColour:                      item__hover__lineColour,
                                    background__hover__lineThickness:                   item__hover__lineThickness,
                                    background__hover_press__colour:                    item__hover_press__colour,
                                    background__hover_press__lineColour:                item__hover_press__lineColour,
                                    background__hover_press__lineThickness:             item__hover_press__lineThickness,
                                    background__hover_select__colour:                   item__hover_select__colour,
                                    background__hover_select__lineColour:               item__hover_select__lineColour,
                                    background__hover_select__lineThickness:            item__hover_select__lineThickness,
                                    background__hover_select_press__colour:             item__hover_select_press__colour,
                                    background__hover_select_press__lineColour:         item__hover_select_press__lineColour,
                                    background__hover_select_press__lineThickness:      item__hover_select_press__lineThickness,
                                    background__hover_glow__colour:                     item__hover_glow__colour,
                                    background__hover_glow__lineColour:                 item__hover_glow__lineColour,
                                    background__hover_glow__lineThickness:              item__hover_glow__lineThickness,
                                    background__hover_glow_press__colour:               item__hover_glow_press__colour,
                                    background__hover_glow_press__lineColour:           item__hover_glow_press__lineColour,
                                    background__hover_glow_press__lineThickness:        item__hover_glow_press__lineThickness,
                                    background__hover_glow_select__colour:              item__hover_glow_select__colour,
                                    background__hover_glow_select__lineColour:          item__hover_glow_select__lineColour,
                                    background__hover_glow_select__lineThickness:       item__hover_glow_select__lineThickness,
                                    background__hover_glow_select_press__colour:        item__hover_glow_select_press__colour,
                                    background__hover_glow_select_press__lineColour:    item__hover_glow_select_press__lineColour,
                                    background__hover_glow_select_press__lineThickness: item__hover_glow_select_press__lineThickness,
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
                        }
                    }

                return accumulativeHeight - height*itemSpacingMux;
            }
            calculatedListHeight = refreshList();
        //cover
            var cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
            object.append(cover);
        //stencil
            var stencil = interfacePart.builder('rectangle','stencil',{width:width, height:height});
            object.stencil(stencil);
            object.clipActive(true);


    //interaction
        cover.onwheel = function(x,y,event){
            if(!interactable){return;}
            var move = event.deltaY/100;
            object.position( object.position() + move/10 );
            for(var a = 0; a < itemArray.length; a++){
                itemArray[a].forceMouseLeave();
            }
        };
    
    //controls
        object.position = function(a,update=true){
            if(a == undefined){return position;}
            a = a < 0 ? 0 : a;
            a = a > 1 ? 1 : a;
            position = a;

            if( calculatedListHeight < height ){return;}
            var movementSpace = calculatedListHeight - height;
            itemCollection.y( -a*movementSpace );
            
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
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
            refreshList();
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