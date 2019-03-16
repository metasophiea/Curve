this.menubar = function(x,y,scale){
    var vars = {
        width: _canvas_.control.viewport.width(),
        height: 20*scale,
        selected: undefined,
        activedropdown: undefined,
    };
    var style = {
        bar:{r:240/255,g:240/255,b:240/255,a:1}, 
        button:{
            text_colour:{r:0,g:0,b:0,a:1},
            text_size:10*scale,
            background__up__colour:{r:240/255,g:240/255,b:240/255,a:1}, 
            background__press__colour:{r:240/255,g:240/255,b:240/255,a:1}, 
            background__select_press__colour:{r:229/255,g:167/255,b:1,a:1}, 
            background__press__lineColour:{r:0,g:0,b:0,a:0},
            background__select__colour:{r:229/255,g:167/255,b:1,a:1}, 
            background__select__lineColour:{r:0,g:0,b:0,a:0},
            background__select_press__lineColour:{r:0,g:0,b:0,a:0},
        },
        list:{
            text_size:7.5*scale,
            item__up__colour:{r:240/255,g:240/255,b:240/255,a:1}, 
            item__hover__colour:{r:229/255,g:167/255,b:1,a:1}, 
        },
    };

    //elements
        //main
            var object = _canvas_.interface.part.builder( 'group', 'menubar', {});
            var bar = _canvas_.interface.part.builder( 'rectangle', 'rectangle', {x:0, y:0, width:vars.height, height:vars.height, colour:style.bar} );
                object.append(bar);

        //items
            var accWidth = 0;
            for(var a = 0; a < this.menubar.dropdowns.length; a++){
                var item = _canvas_.interface.part.builder( 'button_rectangle', 'dropdownButton_'+a, {
                    x:accWidth*scale, y:0, 
                    width:this.menubar.dropdowns[a].width*scale, height:vars.height, 
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
                item.onselect = function(a,x,that){ return function(){
                    //precalc
                        var height = 0;
                        for(var b = 0; b < that.menubar.dropdowns[a].itemList.length; b++){
                            switch(that.menubar.dropdowns[a].itemList[b]){
                                case 'break': height += that.menubar.dropdowns[a].breakHeight*scale; break;
                                case 'space': height += that.menubar.dropdowns[a].spaceHeight*scale; break;
                                default: height += that.menubar.dropdowns[a].listItemHeight*scale; break;
                            }
                        }
                        if(height > _canvas_.control.viewport.height()*scale){
                            height = _canvas_.control.viewport.height()*scale;
                        }

                    //produce dropdown
                        vars.activedropdown = _canvas_.interface.part.builder( 'list', 'dropdown', {
                            x:x*scale, y:vars.height, style:style.list,
                            width:that.menubar.dropdowns[a].listWidth*scale, height:height,

                            multiSelect:false, selectable:false,

                            itemWidthMux: 1,
                            itemHeightMux:  (that.menubar.dropdowns[a].listItemHeight/height)*scale, 
                            breakHeightMux: (that.menubar.dropdowns[a].breakHeight/height)*scale,
                            spaceHeightMux: (that.menubar.dropdowns[a].spaceHeight/height)*scale,
                            itemSpacingMux: 0, 

                            list:that.menubar.dropdowns[a].itemList,
                        });

                    //upon selection of an item in a dropdown; close the dropdown and have nothing selected
                        vars.activedropdown.onrelease = function(){
                            object.getChildByName('dropdownButton_'+a).select(false); 
                            vars.selected = undefined;
                        };

                    object.append(vars.activedropdown);
                } }(a,accWidth,this);
                item.ondeselect = function(){ 
                    object.remove(vars.activedropdown); 
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
        };
        object.refresh();

    return object;
};