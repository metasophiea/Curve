this.menubar = function(x,y){
    var self = this;
    var vars = {
        width: _canvas_.control.viewport.width(),
        height: 20,
        selected: undefined,
        activedropdown: undefined,
    };
    var style = {
        bar:{r:240/255,g:240/255,b:240/255,a:1}, 
        button:{
            text_colour:{r:0,g:0,b:0,a:1},
            text_font:'Helvetica',
            text_size:14,
            text_spacing:0.3,
            text_interCharacterSpacing:0.04,
            background__up__colour:{r:240/255,g:240/255,b:240/255,a:1}, 
            background__press__colour:{r:240/255,g:240/255,b:240/255,a:1},
            background__select_press__colour:{r:229/255,g:167/255,b:255/255,a:1},
            background__press__lineColour:{r:0/255,g:0/255,b:0/255,a:0},
            background__select__colour:{r:229/255,g:167/255,b:255/255,a:1}, background__select__lineColour:{r:0/255,g:0/255,b:0/255,a:0},
            background__select_press__lineColour:{r:0,g:0,b:0,a:0},
        },
        list:{
            text_size:14,
            text_font:'Helvetica',
            text_spacing:0.3,
            text_interCharacterSpacing:0.04,
            sublist_arrowColour:{r:0.5,g:0.5,b:0.5,a:1},
            item__up__colour:{r:240/255,g:240/255,b:240/255,a:1}, 
            item__hover__colour:{r:229/255,g:167/255,b:255/255,a:1}, 
            item__hover_glow__colour:{r:239/255,g:209/255,b:255/255,a:1}, 
        },
    };

    //elements
        //main
            var object = _canvas_.interface.part.builder( 'basic', 'group', 'menubar', {});
            var bar = _canvas_.interface.part.builder( 'basic', 'rectangle', 'rectangle', {x:0, y:0, width:vars.height, height:vars.height, colour:style.bar} );
                object.append(bar);

        //items
            function createDropdown(a,x){
                var dropdown = undefined;

                //produce dropdown
                    dropdown = _canvas_.interface.part.builder( 'control', 'list', 'dropdown', {
                        x:x, y:vars.height, style:style.list,
                        itemWidth:self.menubar.dropdowns[a].listWidth,
                        itemHeight:self.menubar.dropdowns[a].listItemHeight,

                        multiSelect:false, selectable:false,

                        item_textSize:style.list.text_size,
                        item_textFont:style.list.text_font, 
                        item_textSpacing:style.list.text_spacing,
                        item_textInterCharacterSpacing:style.list.text_interCharacterSpacing,
                        sublist_arrowSize:style.list.text_size/2,
                        sublist_arrowColour:style.list.sublist_arrowColour,

                        itemSpacingHeight:0,
                        spacingHeight:self.menubar.dropdowns[a].spaceHeight,
                        breakHeight:self.menubar.dropdowns[a].breakHeight,

                        list:self.menubar.dropdowns[a].itemList,
                    });

                //add height limittation if the dropdown height exceeds the window height
                    if( control.viewport.height() < dropdown.getCalculatedListHeight()){
                        dropdown.limitHeightTo(control.viewport.height()-vars.height);
                    }

                //upon selection of an item in a dropdown; close the dropdown and have nothing selected
                    dropdown.onrelease = function(){
                        object.getChildByName('dropdownButton_'+a).select(false); 
                        vars.selected = undefined;
                    };

                return dropdown;
            }

            var accWidth = 0;
            for(var a = 0; a < this.menubar.dropdowns.length; a++){
                var item = _canvas_.interface.part.builder( 'control', 'button_rectangle', 'dropdownButton_'+a, {
                    x:accWidth, y:0, 
                    width:this.menubar.dropdowns[a].width,
                    height:vars.height, 
                    hoverable:false, selectable:true,
                    text_centre:this.menubar.dropdowns[a].text,
                    style:style.button,
                } );
                object.append(item);

                item.onpress = function(a){ return function(){
                    // if this item has already been selected (and will be deselected after this callback)
                    // sent the menubar's 'vars.selected' value to undefined. Otherwise, set it to
                    // this item's number

                    vars.selected = object.getChildByName('dropdownButton_'+a).select() ? undefined : a;
                }; }(a);
                item.onenter = function(a){ return function(event){
                    //assuming an item has been selected, and it isn't the item that's currently being 
                    //entered; deselect that one and tell the menubar that this item is selected now.
                    //if no mouse button is pressed (no button rolling is happening) select it manually
                    if( vars.selected != undefined && vars.selected != a){
                        object.getChildByName('dropdownButton_'+vars.selected).select(false);
                        vars.selected = a;
                        if(event.buttons == 0){ object.getChildByName('dropdownButton_'+vars.selected).select(true); }
                    }
                }; }(a);
                item.onselect = function(a,x){ return function(){
                    vars.activedropdown = createDropdown(a,x)
                    object.append(vars.activedropdown);
                } }(a,accWidth);
                item.ondeselect = function(){ 
                    object.remove(vars.activedropdown); 
                    vars.activedropdown = undefined;
                };

                this.menubar.dropdowns[a].x = accWidth;
                accWidth += this.menubar.dropdowns[a].width;
            }

    //control
        object.closeAllDropdowns = function(){
            if(vars.activedropdown != undefined){
                vars.activedropdown.onrelease();
            }
        };

    //refresh callback
        object.refresh = function(){
            bar.width( _canvas_.control.viewport.width() );
            if(vars.activedropdown != undefined){ object.closeAllDropdowns(); }
        };
        object.refresh();

    return object;
};