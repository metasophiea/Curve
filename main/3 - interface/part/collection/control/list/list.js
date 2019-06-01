this.list = function(
    name='list', 
    x, y, angle=0, interactable=true,
    list=[],

    limitHeightTo=-1,limitWidthTo=-1,

    itemHeight=10, itemWidth=47.5,
    itemSpacingHeight=0.75,
    spacingHeight=0.5,
    breakHeight=0.25,

    textbreak_fontSize=1.5,
    textbreak_colour={r:0.7,g:0.7,b:0.7,a:1},

    item_textSize=2.5,
    item_textColour={r:0.2,g:0.2,b:0.2,a:1},
    item_textFont='defaultThin',
    item_textSpacing=0.1,
    item_textInterCharacterSpacing=0,

    sublist_arrowSize=2.5,
    sublist_arrowColour={r:0.2,g:0.2,b:0.2,a:1},

    item_textVerticalOffsetMux=0.5, item_textHorizontalOffsetMux=0.05,
    active=true, multiSelect=true, hoverable=true, selectable=!false, pressable=true,

    backing_style={r:230/255,g:230/255,b:230/255,a:1}, break_style={r:195/255,g:195/255,b:195/255,a:1},
    
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
    item__hover_glow__colour=                     {r:250/255,g:250/255,b:250/255,a:1},
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

    //generate list content
        function generateListContent(listItems=[]){
            var output = {elements:[], calculatedListHeight:0};
            var xOffset = limitWidthTo < 0 ? 0 : (limitWidthTo-itemWidth)/2;

            if(listItems.length == 0){ listItems = [{type:'item', text:'-empty-'}]; }

            listItems.forEach((item,index) => {
                if(index != 0){output.calculatedListHeight += itemSpacingHeight;}

                switch(item.type){
                    case 'space':
                        var space_group = interfacePart.builder('group',index+'_space');
                        output.elements.push(space_group);
                        output.calculatedListHeight += spacingHeight;
                    break;
                    case 'break': 
                        var lineWidth = limitWidthTo < 0 ? itemWidth*0.9 : itemWidth;
                        var xPosition = limitWidthTo < 0 ? itemWidth*0.05 : xOffset;

                        var rectangleBacking = interfacePart.builder( 'rectangle', index+'_break', {
                            x:xPosition, y:output.calculatedListHeight+itemSpacingHeight/2,
                            width:lineWidth, height:breakHeight,
                            colour:break_style,
                        });
                        output.elements.push(rectangleBacking);
                        output.calculatedListHeight += itemSpacingHeight+breakHeight;
                    break;
                    case 'textbreak': 
                        var textbreak_group = interfacePart.builder('group',index+'_textbreak');
                            var textXPosition = limitWidthTo < 0 ? itemWidth*0.05 : xOffset;
                            var text = interfacePart.builder('text', 'text', {
                                x:textXPosition, y:output.calculatedListHeight + itemSpacingHeight/2 + breakHeight/2,
                                width:textbreak_fontSize, height:textbreak_fontSize,
                                printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
                                text:item.text, colour:textbreak_colour,
                            });
                            textbreak_group.append(text);
                            text.onFontUpdateCallback = function(){
                                var maxWidth = limitWidthTo < 0 ? itemWidth*0.9 : itemWidth;
                                var offset = maxWidth*0.025 + text.resultingWidth();
                                breakLine.x( textXPosition + offset );
                                breakLine.width( maxWidth - offset );
                            };

                            var breakLine = interfacePart.builder( 'rectangle', 'line', {
                                y:output.calculatedListHeight+itemSpacingHeight/2,
                                height:breakHeight,
                                colour:textbreak_colour,
                            });
                            text.onFontUpdateCallback();
                            textbreak_group.append(breakLine);

                        output.elements.push(textbreak_group);
                        output.calculatedListHeight += itemSpacingHeight+breakHeight;
                    break;
                    case 'checkbox':
                        var checkbox_group = interfacePart.builder('group',index+'_checkbox');
                            var rectangleBacking = interfacePart.builder( 'rectangle', 'backing', {
                                x:xOffset, y:output.calculatedListHeight,
                                width:itemWidth, height:itemHeight,
                                colour:item__up__colour,
                            });
                            checkbox_group.append(rectangleBacking);
                            rectangleBacking.onmouseenter = function(){this.colour = item__hover__colour;};
                            rectangleBacking.onmouseleave = function(){this.colour = item__up__colour;};
                            rectangleBacking.onmouseup = function(){this.colour = item__hover__colour;};
                            rectangleBacking.onmousedown = function(){this.colour = item__hover_press__colour;};
                            rectangleBacking.onclick = (function(listItem){
                                return function(){
                                    var value = !checkbox.get();
                                    checkbox.set(value);
                                    listItem.onclickFunction(value);
                                }
                            })(item);
                                
                            var checkbox = interfacePart.builder( 'checkbox_circle', 'checkbox', {
                                x:xOffset+itemWidth-itemHeight/2, y:output.calculatedListHeight + itemHeight/2,
                                radius:itemHeight/3, interactable:false, style:{backing:{r:0,g:0,b:0,a:0}, check:break_style}
                            });
                            checkbox_group.append(checkbox);
                            if(item.updateFunction != undefined){checkbox.set(item.updateFunction());}

                            var text = interfacePart.builder('text', 'text', {
                                x:xOffset + item_textHorizontalOffsetMux*itemWidth,
                                y:output.calculatedListHeight + itemHeight*item_textVerticalOffsetMux,
                                width:item_textSize, height:item_textSize,
                                printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
                                spacing:item_textSpacing, interCharacterSpacing:item_textInterCharacterSpacing,
                                text:item.text, colour:item_textColour, font:item_textFont,
                            });
                            checkbox_group.append(text);

                            checkbox_group.forceMouseLeave = function(){ rectangleBacking.onmouseleave(); };

                        output.elements.push(checkbox_group);
                        output.calculatedListHeight += itemHeight;
                    break;
                    case 'list':
                        var sublistName = 'sublist__'+index+'_list';
                        var list_group = interfacePart.builder('group',index+'_list');
                            var button = interfacePart.builder('button_rectangle', 'button', {
                                x:xOffset, y:output.calculatedListHeight,
                                width:itemWidth, height:itemHeight,
                                text_left:item.text,
                                style:{
                                    text_font:item_textFont,
                                    text_size:item_textSize,
                                    text_colour:item_textColour,
                                    text_spacing:item_textSpacing,
                                    text_interCharacterSpacing:item_textInterCharacterSpacing,

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
                                },
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

                            var xOff = xOffset + itemWidth - sublist_arrowSize - item_textHorizontalOffsetMux*itemWidth;
                            var yOff = output.calculatedListHeight + itemHeight/2;
                            var arrow = interfacePart.builder('polygon', 'arrow', {
                                pointsAsXYArray:[ 
                                    {x:xOff,y:yOff-sublist_arrowSize/2}, 
                                    {x:xOff,y:yOff+sublist_arrowSize/2}, 
                                    {x:xOff+sublist_arrowSize,y:yOff}
                                ],
                                colour:sublist_arrowColour,
                            });
                            list_group.append(arrow);

                            list_group.open = (function(sublistName,listItem,y){
                                return function(){
                                    list_group.getChildByName('button').glow(true);
                                    var sublist = _canvas_.interface.part.builder( 'list', sublistName, {
                                        x:limitWidthTo<0?itemWidth:limitWidthTo, y:y,
                                        list:listItem.list,

                                        limitHeightTo:-1, limitWidthTo:limitWidthTo,

                                        itemHeight:itemHeight, itemWidth:itemWidth, itemSpacingHeight:itemSpacingHeight, spacingHeight:spacingHeight, breakHeight:breakHeight,
                                        textbreak_fontSize:textbreak_fontSize, textbreak_colour:textbreak_colour,
                                        item_textSize:item_textSize, item_textColour:item_textColour, item_textFont:item_textFont, item_textSpacing:item_textSpacing, item_textInterCharacterSpacing:item_textInterCharacterSpacing,
                                        sublist_arrowSize:sublist_arrowSize, sublist_arrowColour:sublist_arrowColour,
                                        item_textVerticalOffsetMux:item_textVerticalOffsetMux, item_textHorizontalOffsetMux:item_textHorizontalOffsetMux,
                    
                                        active:active, multiSelect:multiSelect, hoverable:hoverable, selectable:selectable, pressable:pressable,
                                    
                                        backing_style:backing_style,
                                        break_style:break_style,
                                        
                                        style:{
                                            item__off__colour:item__off__colour,                     
                                            item__off__lineColour:item__off__lineColour,                     
                                            item__off__lineThickness:item__off__lineThickness,
                                            item__up__colour:item__up__colour,                      
                                            item__up__lineColour:item__up__lineColour,                      
                                            item__up__lineThickness:item__up__lineThickness,
                                            item__press__colour:item__press__colour,                   
                                            item__press__lineColour:item__press__lineColour,                   
                                            item__press__lineThickness:item__press__lineThickness,
                                            item__select__colour:item__select__colour,                  
                                            item__select__lineColour:item__select__lineColour,                  
                                            item__select__lineThickness:item__select__lineThickness,
                                            item__select_press__colour:item__select_press__colour,            
                                            item__select_press__lineColour:item__select_press__lineColour,            
                                            item__select_press__lineThickness:item__select_press__lineThickness,
                                            item__glow__colour:item__glow__colour,                    
                                            item__glow__lineColour:item__glow__lineColour,                    
                                            item__glow__lineThickness:item__glow__lineThickness,
                                            item__glow_press__colour:item__glow_press__colour,              
                                            item__glow_press__lineColour:item__glow_press__lineColour,              
                                            item__glow_press__lineThickness:item__glow_press__lineThickness,
                                            item__glow_select__colour:item__glow_select__colour,             
                                            item__glow_select__lineColour:item__glow_select__lineColour,             
                                            item__glow_select__lineThickness:item__glow_select__lineThickness,
                                            item__glow_select_press__colour:item__glow_select_press__colour,       
                                            item__glow_select_press__lineColour:item__glow_select_press__lineColour,       
                                            item__glow_select_press__lineThickness:item__glow_select_press__lineThickness,
                                            item__hover__colour:item__hover__colour,                   
                                            item__hover__lineColour:item__hover__lineColour,                   
                                            item__hover__lineThickness:item__hover__lineThickness,
                                            item__hover_press__colour:item__hover_press__colour,             
                                            item__hover_press__lineColour:item__hover_press__lineColour,             
                                            item__hover_press__lineThickness:item__hover_press__lineThickness,
                                            item__hover_select__colour:item__hover_select__colour,            
                                            item__hover_select__lineColour:item__hover_select__lineColour,            
                                            item__hover_select__lineThickness:item__hover_select__lineThickness,
                                            item__hover_select_press__colour:item__hover_select_press__colour,      
                                            item__hover_select_press__lineColour:item__hover_select_press__lineColour,      
                                            item__hover_select_press__lineThickness:item__hover_select_press__lineThickness,
                                            item__hover_glow__colour:item__hover_glow__colour,              
                                            item__hover_glow__lineColour:item__hover_glow__lineColour,              
                                            item__hover_glow__lineThickness:item__hover_glow__lineThickness,
                                            item__hover_glow_press__colour:item__hover_glow_press__colour,        
                                            item__hover_glow_press__lineColour:item__hover_glow_press__lineColour,        
                                            item__hover_glow_press__lineThickness:item__hover_glow_press__lineThickness,
                                            item__hover_glow_select__colour:item__hover_glow_select__colour,       
                                            item__hover_glow_select__lineColour:item__hover_glow_select__lineColour,       
                                            item__hover_glow_select__lineThickness:item__hover_glow_select__lineThickness,
                                            item__hover_glow_select_press__colour:item__hover_glow_select_press__colour, 
                                            item__hover_glow_select_press__lineColour:item__hover_glow_select_press__lineColour, 
                                            item__hover_glow_select_press__lineThickness:item__hover_glow_select_press__lineThickness,
                                        }
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
                        var temp = interfacePart.builder('button_rectangle', name, {
                            x:xOffset, y:output.calculatedListHeight,
                            width:itemWidth, height:itemHeight, interactable:interactable, 
                            text_left: item.text_left,
                            text_centre: (item.text?item.text:item.text_centre),
                            text_right: item.text_right,

                            textVerticalOffsetMux: item_textVerticalOffsetMux, textHorizontalOffsetMux: item_textHorizontalOffsetMux,
                            active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

                            style:{
                                text_font:item_textFont,
                                text_size:item_textSize,
                                text_colour:item_textColour,
                                text_spacing:item_textSpacing,
                                text_interCharacterSpacing:item_textInterCharacterSpacing,

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
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //backing
            var backing = interfacePart.builder('rectangle','backing',{colour:backing_style});
            object.append(backing);
        //stenciled group
            var stenciledGroup = interfacePart.builder('group','stenciledGroup');
            object.append(stenciledGroup);
        //sub list group
            var subListGroup = interfacePart.builder('group','subListGroup');
            object.append(subListGroup);
        //item collection
            var itemCollection = interfacePart.builder('group','itemCollection');
            stenciledGroup.append(itemCollection);
        //cover
            var cover = interfacePart.builder('rectangle','cover',{colour:{r:0,g:0,b:0,a:0}});
            stenciledGroup.append(cover);
        //stencil
            var stencil = interfacePart.builder('rectangle','stencil');
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