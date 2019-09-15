this.list_image = function(
    name='list_image', 
    x, y, angle=0, interactable=true, list=[],
    active=true, multiSelect=true, hoverable=true, selectable=!false, pressable=true,
    limitHeightTo=-1,limitWidthTo=-1,

    itemHeight=10, itemWidth=47.5,
    itemSpacingHeight=0.75,
    spacingHeight=0.5,
    breakHeight=0.25,

    backingURL, 
    breakURL,
    textbreakURL,
    sublist__up,
    sublist__hover,
    sublist__glow,
    sublist__hover_glow,
    sublist__hover_glow_press,

    checkbox_uncheckURL,
    checkbox_checkURL,
    checkbox_uncheckGlowURL,
    checkbox_checkGlowURL,
    
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

    onenter=function(a){/*console.log('onenter >',a);*/},
    onleave=function(a){/*console.log('onleave >',a);*/},
    onpress=function(a){/*console.log('onpress >',a);*/},
    ondblpress=function(a){/*console.log('ondblpress >',a);*/},
    onrelease=function(a){/*console.log('onrelease >',a);*/},
    onselection=function(a){/*console.log('onselection >',a);*/},
    onpositionchange=function(a){/*console.log('onpositionchange >',a);*/},
){
    //state
        var itemArray = [];
        var selectedItems = [];
        var lastNonShiftClicked = 0;
        var position = 0;
        var calculatedListHeight = 0;

    //genrate list content
        function generateListContent(listItems=[]){
            var output = {elements:[], calculatedListHeight:0};
            var xOffset = limitWidthTo < 0 ? 0 : (limitWidthTo-itemWidth)/2;

            listItems.forEach((item,index) => {
                if(index != 0){output.calculatedListHeight += itemSpacingHeight;}

                switch(item.type){
                    case 'space':
                        var space_group = interfacePart.builder('basic','group',index+'_space');
                        output.elements.push(space_group);
                        output.calculatedListHeight += spacingHeight;
                    break;
                    case 'break': 
                        var lineWidth = limitWidthTo < 0 ? itemWidth*0.9 : itemWidth;
                        var xPosition = limitWidthTo < 0 ? itemWidth*0.05 : xOffset;

                        var imageBacking = interfacePart.builder('basic','image',index+'_break',{
                            x:xPosition, y:output.calculatedListHeight+itemSpacingHeight/2,
                            width:lineWidth, height:breakHeight,
                            url:breakURL
                        });

                        output.elements.push(imageBacking);
                        output.calculatedListHeight += itemSpacingHeight+breakHeight;
                    break;
                    case 'textbreak': 
                        var lineWidth = limitWidthTo < 0 ? itemWidth*0.9 : itemWidth;
                        var xPosition = limitWidthTo < 0 ? itemWidth*0.05 : xOffset;
                        var imageBacking = interfacePart.builder('basic','image',index+'_break',{
                            x:xPosition, y:output.calculatedListHeight,
                            width:lineWidth, height:itemSpacingHeight+breakHeight,
                            url:breakURL
                        });

                        output.elements.push(imageBacking);
                        output.calculatedListHeight += itemSpacingHeight+breakHeight;
                    break;
                    case 'checkbox':
                        var checkbox = interfacePart.builder( 'control', 'checkbox_image', 'checkbox', {
                            x:xOffset, y:output.calculatedListHeight,
                            width:itemWidth, height:itemHeight,
                            uncheckURL:checkbox_uncheckURL,
                            checkURL:checkbox_checkURL,
                            uncheckGlowURL:checkbox_uncheckGlowURL,
                            checkGlowURL:checkbox_checkGlowURL,
                        });
                        if(item.onclickFunction != undefined){
                            checkbox.onchange = (function(listItem){
                                return function(value){ listItem.onclickFunction(value);  }
                            })(item);
                        }
                        if(item.updateFunction != undefined){checkbox.set(item.updateFunction());}

                        output.elements.push(checkbox);
                        output.calculatedListHeight += itemHeight;
                    break;
                    case 'list':
                        var sublistName = 'sublist__'+index+'_list';
                        var list_group = interfacePart.builder('basic','group',index+'_list');
                            var button = interfacePart.builder( 'control', 'button_image', 'button', {
                                x:xOffset, y:output.calculatedListHeight,
                                width:itemWidth, height:itemHeight, interactable:interactable, 

                                backingURL__off:                        '',
                                backingURL__up:                         sublist__up,
                                backingURL__press:                      '',
                                backingURL__select:                     '',
                                backingURL__select_press:               '',
                                backingURL__glow:                       sublist__glow,
                                backingURL__glow_press:                 '',
                                backingURL__glow_select:                '',
                                backingURL__glow_select_press:          '',
                                backingURL__hover:                      sublist__hover,
                                backingURL__hover_press:                '',
                                backingURL__hover_select:               '',
                                backingURL__hover_select_press:         '',
                                backingURL__hover_glow:                 sublist__hover_glow,
                                backingURL__hover_glow_press:           sublist__hover_glow_press,
                                backingURL__hover_glow_select:          '',
                                backingURL__hover_glow_select_press:    '',
                            });
                            list_group.append(button);

                            button.onpress = (function(sublistName){
                                return function(){ 
                                    if( subListGroup.getChildByName(sublistName) != undefined ){
                                        object.closeAllLists();
                                    }else if(subListGroup.children().length != 0){
                                        object.closeAllLists();
                                        list_group.open();
                                    }else{
                                        list_group.open();
                                    }
                                }
                            })(sublistName);

                            list_group.open = (function(sublistName,listItem,y){
                                return function(){
                                    list_group.getChildByName('button').glow(true);
                                    var sublist = _canvas_.interface.part.builder('control', 'list_image', sublistName, {
                                        x: limitWidthTo<0?itemWidth:limitWidthTo, y:y,
                                        list: listItem.list,

                                        active:         listItem.active ? listItem.active : active, 
                                        multiSelect:    listItem.multiSelect ? listItem.multiSelect : multiSelect, 
                                        hoverable:      listItem.hoverable ? listItem.hoverable : hoverable, 
                                        selectable:     listItem.selectable ? listItem.selectable : selectable, 
                                        pressable:      listItem.pressable ? listItem.pressable : pressable,

                                        limitHeightTo:  listItem.limitHeightTo ? listItem.limitHeightTo : -1, 
                                        limitWidthTo:   listItem.limitWidthTo ? listItem.limitWidthTo : limitWidthTo,

                                        itemHeight:                listItem.itemHeight ? listItem.itemHeight : itemHeight, 
                                        itemWidth:                 listItem.itemWidth ? listItem.itemWidth : itemWidth, 
                                        itemSpacingHeight:         listItem.itemSpacingHeight ? listItem.itemSpacingHeight : itemSpacingHeight, 
                                        spacingHeight:             listItem.spacingHeight ? listItem.spacingHeight : spacingHeight, 
                                        breakHeight:               listItem.breakHeight ? listItem.breakHeight : breakHeight,
                                        backingURL:                listItem.backingURL? listItem.backingURL : backingURL, 
                                        breakURL:                  listItem.breakURL? listItem.breakURL : breakURL,
                                        textbreakURL:              listItem.textbreakURL? listItem.textbreakURL : textbreakURL,
                                        sublist__up:               listItem.sublist__up? listItem.sublist__up : sublist__up,
                                        sublist__hover:            listItem.sublist__hover? listItem.sublist__hover : sublist__hover,
                                        sublist__glow:             listItem.sublist__glow? listItem.sublist__glow : sublist__glow,
                                        sublist__hover_glow:       listItem.sublist__hover_glow? listItem.sublist__hover_glow : sublist__hover_glow,
                                        sublist__hover_glow_press: listItem.sublist__hover_glow_press? listItem.sublist__hover_glow_press : sublist__hover_glow_press,

                                        checkbox_uncheckURL:       listItem.checkbox_uncheckURL ? listItem.checkbox_uncheckURL : checkbox_uncheckURL,
                                        checkbox_checkURL:         listItem.checkbox_checkURL ? listItem.checkbox_checkURL : checkbox_checkURL,
                                        checkbox_uncheckGlowURL:   listItem.checkbox_uncheckGlowURL ? listItem.checkbox_uncheckGlowURL : checkbox_uncheckGlowURL,
                                        checkbox_checkGlowURL:     listItem.checkbox_checkGlowURL ? listItem.checkbox_checkGlowURL : checkbox_checkGlowURL,

                                        itemURL__off:                       listItem.itemURL__off ? listItem.itemURL__off : itemURL__off,
                                        itemURL__up:                        listItem.itemURL__up ? listItem.itemURL__up : itemURL__up,
                                        itemURL__press:                     listItem.itemURL__press ? listItem.itemURL__press : itemURL__press,
                                        itemURL__select:                    listItem.itemURL__select ? listItem.itemURL__select : itemURL__select,
                                        itemURL__select_press:              listItem.itemURL__select_press ? listItem.itemURL__select_press : itemURL__select_press,
                                        itemURL__glow:                      listItem.itemURL__glow ? listItem.itemURL__glow : itemURL__glow,
                                        itemURL__glow_press:                listItem.itemURL__glow_press ? listItem.itemURL__glow_press : itemURL__glow_press,
                                        itemURL__glow_select:               listItem.itemURL__glow_select ? listItem.itemURL__glow_select : itemURL__glow_select,
                                        itemURL__glow_select_press:         listItem.itemURL__glow_select_press ? listItem.itemURL__glow_select_press : itemURL__glow_select_press,
                                        itemURL__hover:                     listItem.itemURL__hover ? listItem.itemURL__hover : itemURL__hover,
                                        itemURL__hover_press:               listItem.itemURL__hover_press ? listItem.itemURL__hover_press : itemURL__hover_press,
                                        itemURL__hover_select:              listItem.itemURL__hover_select ? listItem.itemURL__hover_select : itemURL__hover_select,
                                        itemURL__hover_select_press:        listItem.itemURL__hover_select_press ? listItem.itemURL__hover_select_press : itemURL__hover_select_press,
                                        itemURL__hover_glow:                listItem.itemURL__hover_glow ? listItem.itemURL__hover_glow : itemURL__hover_glow,
                                        itemURL__hover_glow_press:          listItem.itemURL__hover_glow_press ? listItem.itemURL__hover_glow_press : itemURL__hover_glow_press,
                                        itemURL__hover_glow_select:         listItem.itemURL__hover_glow_select ? listItem.itemURL__hover_glow_select : itemURL__hover_glow_select,
                                        itemURL__hover_glow_select_press:   listItem.itemURL__hover_glow_select_press ? listItem.itemURL__hover_glow_select_press : itemURL__hover_glow_select_press,
                                    });
                                    sublist.onenter = function(a){object.onenter([index].concat(a));};
                                    sublist.onleave = function(a){object.onleave([index].concat(a));};
                                    sublist.onpress = function(a){object.onpress([index].concat(a));};
                                    sublist.ondblpress = function(a){object.ondblpress([index].concat(a));};
                                    sublist.onrelease = function(a){object.onrelease([index].concat(a));};
                                    subListGroup.append(sublist);
                                }
                            })(sublistName,item,output.calculatedListHeight);
                            list_group.close = function(){
                                list_group.getChildByName('button').glow(false);
                                var sublistElement = subListGroup.getChildByName('sublist__'+index+'_list');
                                if( sublistElement == undefined ){return;}
                                subListGroup.remove(sublistElement);
                            };

                        output.elements.push(list_group);
                        output.calculatedListHeight += itemHeight;
                    break;
                    case 'item': 
                        var name = index+'_item';
                        var temp = interfacePart.builder('control', 'button_image', name, {
                            x:xOffset, y:output.calculatedListHeight,
                            width:itemWidth, height:itemHeight, interactable:interactable, 

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
                        temp.onenter = function(a){ return function(){ object.onenter([a]); } }(index);
                        temp.onleave = function(a){ return function(){ object.onleave([a]); } }(index);
                        temp.onpress = function(a){ return function(){ object.onpress([a]); } }(index);
                        temp.ondblpress = function(a){ return function(){ object.ondblpress([a]); } }(index);
                        temp.onrelease = function(a){
                            return function(){
                                if( list[a].function ){ list[a].function(); }
                                object.onrelease([a]);
                            }
                        }(index);
                        temp.onselect = function(a){ return function(obj,event){ object.select(a,true,event,false);} }(name);
                        temp.ondeselect = function(a){ return function(obj,event){ object.select(a,false,event,false); } }(name);

                        output.elements.push(temp);
                        output.calculatedListHeight += itemHeight;
                    break;
                    default: console.warn('interface part "list" :: error : unknown list item type:',item); break;
                }

            });


            return output;
        }

    //refreshing function
        function refresh(){
            itemArray = [];
            selectedItems = [];
            lastNonShiftClicked = 0;
            position = 0;
            
            results = generateListContent(list);
            calculatedListHeight = results.calculatedListHeight;
            itemArray = results.elements;

            backing.width(limitWidthTo<0?itemWidth:limitWidthTo);
            backing.height(limitHeightTo<0?calculatedListHeight:limitHeightTo);
            cover.width(limitWidthTo<0?itemWidth:limitWidthTo);
            cover.height(limitHeightTo<0?calculatedListHeight:limitHeightTo);
            stencil.width(limitWidthTo<0?itemWidth:limitWidthTo);
            stencil.height(limitHeightTo<0?calculatedListHeight:limitHeightTo);

            itemCollection.clear();
            results.elements.forEach(element => itemCollection.append(element));
        }

    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //backing
            var backing = interfacePart.builder('basic','image','backing',{url:backingURL});
            object.append(backing);
        //stenciled group
            var stenciledGroup = interfacePart.builder('basic','group','stenciledGroup');
            object.append(stenciledGroup);
        //sub list group
            var subListGroup = interfacePart.builder('basic','group','subListGroup');
            object.append(subListGroup);
        //item collection
            var itemCollection = interfacePart.builder('basic','group','itemCollection');
            stenciledGroup.append(itemCollection);
        //cover
            var cover = interfacePart.builder('basic','rectangle','cover',{colour:{r:0,g:0,b:0,a:0}});
            stenciledGroup.append(cover);
        //stencil
            var stencil = interfacePart.builder('basic','rectangle','stencil');
            stenciledGroup.stencil(stencil);
            stenciledGroup.clipActive(true);

    //interaction
        cover.onwheel = function(x,y,event){
            if(!interactable){return;}
            var move = event.deltaY/100;
            object.position( object.position() + move/10 );
            itemArray.forEach(item => {
                if(item.forceMouseLeave != undefined){
                    item.forceMouseLeave();
                }
            });
        };

    //controls
        object.position = function(a,update=true){
            if(a == undefined){return position;}
            a = a < 0 ? 0 : a;
            a = a > 1 ? 1 : a;
            position = a;

            if(limitHeightTo < 0){return;}
            var movementSpace = calculatedListHeight - limitHeightTo;
            itemCollection.y( -a*movementSpace );
            
            if(update&&this.onpositionchange){this.onpositionchange(a);}
        };
        object.select = function(a,state,event,update=true){
            if(!selectable){return;}

                if(!multiSelect){
                //where multi selection is not allowed
                    //where we want to select an item, which is not already selected
                        if(state && !selectedItems.includes(a) ){
                            //deselect all other items
                                while( selectedItems.length > 0 ){
                                    itemCollection.getChildByName(selectedItems[0]).select(false,undefined,undefined);
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
                    if(update){ itemCollection.getChildByName(a).select(true,undefined,false); }
                }else{
                //where multi selection is allowed
                    //where range-selection is to be done
                        if( event != undefined && event.shiftKey ){
                            //gather top and bottom item
                            //(first gather the range positions overall, then compute those positions to indexes on the itemArray)
                                a = itemCollection.getChildIndexByName(a);

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
                                        if( itemArray[b].select != undefined && itemArray[b].select() ){
                                            itemArray[b].select(false,undefined,false);
                                        }
                                    }
                                }

                            //select those within the range (that aren't already selected)
                                for(var b = min; b <= max; b++){
                                    if( itemArray[b].select != undefined && !itemArray[b].select() ){
                                        itemArray[b].select(true,undefined,false);
                                        selectedItems.push(b);
                                    }
                                }
                    //where range-selection is not to be done
                        }else{
                            if(update){ itemArray[a].select(state); }
                            if(state && !selectedItems.includes(a) ){ selectedItems.push(a); }
                            else if(!state && selectedItems.includes(a)){ selectedItems.splice( selectedItems.indexOf(a), 1 ); }
                            lastNonShiftClicked = itemCollection.getChildIndexByName(a);
                        }
                }

            object.onselection(selectedItems);
        };
        object.add = function(item){
            list.push(item);
            refresh();
        };
        object.remove = function(a){
            list.splice(a,1);
            refresh();
        };
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
            refresh();
        };
        object.limitHeightTo = function(value){
            if(value==undefined){return limitHeightTo;}
            limitHeightTo = value;
            refresh();
        };
        object.closeAllLists = function(){
            list.forEach((item,index) => {
                if(item.type != 'list'){return;}
                itemArray[index].close();
            });
        };

    //info
        object.getCalculatedListHeight = function(){return calculatedListHeight;};

    //callbacks
        object.onenter = onenter;
        object.onleave = onleave;
        object.onpress = onpress;
        object.ondblpress = ondblpress;
        object.onrelease = onrelease;
        object.onselection = onselection;
        object.onpositionchange = onpositionchange;

    refresh();

    return object;
};

interfacePart.partLibrary.control.list_image = function(name,data){ return interfacePart.collection.control.list_image(
    name, data.x, data.y, data.angle, data.interactable, data.list,
    data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,
    data.limitHeightTo, data.limitWidthTo,

    data.itemHeight, data.itemWidth, data.itemSpacingHeight, data.spacingHeight, data.breakHeight,

    data.backingURL, 
    data.breakURL,
    data.textbreakURL,
    data.sublist__up,
    data.sublist__hover,
    data.sublist__glow,
    data.sublist__hover_glow,
    data.sublist__hover_glow_press,

    data.checkbox_uncheckURL, 
    data.checkbox_checkURL, 
    data.checkbox_uncheckGlowURL, 
    data.checkbox_checkGlowURL,
    
    data.itemURL__off,
    data.itemURL__up,
    data.itemURL__press,
    data.itemURL__select,
    data.itemURL__select_press,
    data.itemURL__glow,
    data.itemURL__glow_press,
    data.itemURL__glow_select,
    data.itemURL__glow_select_press,
    data.itemURL__hover,
    data.itemURL__hover_press,
    data.itemURL__hover_select,
    data.itemURL__hover_select_press,
    data.itemURL__hover_glow,
    data.itemURL__hover_glow_press,
    data.itemURL__hover_glow_select,
    data.itemURL__hover_glow_select_press,

    data.onenter,
    data.onleave,
    data.onpress,
    data.ondblpress,
    data.onrelease,
    data.onselection,
    data.onpositionchange,
); };