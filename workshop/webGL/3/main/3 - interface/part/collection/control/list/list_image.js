this.list_image = function(
    name='list_image', 
    x, y, width=50, height=100, angle=0, interactable=true,
    list=[],

    itemTextVerticalOffsetMux=0.5, itemTextHorizontalOffsetMux=0.05,
    active=true, multiSelect=true, hoverable=true, selectable=!false, pressable=true,

    itemHeightMux=0.1, itemWidthMux=0.95, itemSpacingMux=0.01, 
    breakHeightMux=0.0025, breakWidthMux=0.9, 
    spacingHeightMux=0.005,
    backingURL, breakURL,

    itemURL__off,
    itemURL__up,
    itemURL__press,
    itemURL__select,
    itemURL__select_press,
    itemURL__glow,
    itemURL__glow_press,
    itemURL__glow_select,
    itemURL__glow_select_press,
    itemURL__hover,
    itemURL__hover_press,
    itemURL__hover_select,
    itemURL__hover_select_press,
    itemURL__hover_glow,
    itemURL__hover_glow_press,
    itemURL__hover_glow_select,
    itemURL__hover_glow_select_press,

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
            var backing = interfacePart.builder('image','backing',{width:width, height:height, url:backingURL});
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
                                colour:{r:0,g:0,b:0,a:0}
                            });

                            accumulativeHeight += height*(spacingHeightMux+itemSpacingMux);
                            itemCollection.append( temp );
                        }else if( list[a] == 'break'){
                            var temp = interfacePart.builder('image',''+a,{
                                x:width*(1-breakWidthMux)*0.5, y:accumulativeHeight,
                                width:width*breakWidthMux, height:height*breakHeightMux,
                                url:breakURL
                            });

                            accumulativeHeight += height*(breakHeightMux+itemSpacingMux);
                            itemCollection.append( temp );
                        }else{
                            var temp = interfacePart.builder( 'button_image', ''+a, {
                                x:width*(1-itemWidthMux)*0.5, y:accumulativeHeight,
                                width:width*itemWidthMux, height:height*itemHeightMux, interactable:interactable,

                                active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

                                backingURL__off:                     itemURL__off,
                                backingURL__up:                      itemURL__up,
                                backingURL__press:                   itemURL__press,
                                backingURL__select:                  itemURL__select,
                                backingURL__select_press:            itemURL__select_press,
                                backingURL__glow:                    itemURL__glow,
                                backingURL__glow_press:              itemURL__glow_press,
                                backingURL__glow_select:             itemURL__glow_select,
                                backingURL__glow_select_press:       itemURL__glow_select_press,
                                backingURL__hover:                   itemURL__hover,
                                backingURL__hover_press:             itemURL__hover_press,
                                backingURL__hover_select:            itemURL__hover_select,
                                backingURL__hover_select_press:      itemURL__hover_select_press,
                                backingURL__hover_glow:              itemURL__hover_glow,
                                backingURL__hover_glow_press:        itemURL__hover_glow_press,
                                backingURL__hover_glow_select:       itemURL__hover_glow_select,
                                backingURL__hover_glow_select_press: itemURL__hover_glow_select_press,
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
            var stencil = interfacePart.builder('rectangle','stencil',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
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