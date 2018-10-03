this.menubar = function(){
    var vars = {
        width: __globals.utility.workspace.getViewportDimensions().width,
        height: 20,
        selected: undefined,
        opendropdown: undefined,
    };
    var style = {
        bar: 'fill:rgba(240,240,240,1);', 
        text: 'fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none; white-space: pre;',
        button:{
            up:'fill:rgba(240,240,240,1)',
            select:'fill:rgba(229,167,255,1)',
        }
    };

    var design = {
        type:'menubar',
        skipGrapple:true,
        x:0, y:0,
        base:{
            points:[{x:0,y:0},{x:vars.width,y:0},{x:vars.width,y:vars.height},{x:0,y:vars.height}],
            style:style.bar,
        },
        elements:[]
    };

    //dynamic design
        var accWidth = 0;
        for(var a = 0; a < this.menubar.dropdowns.length; a++){

            design.elements.push(
                {type:'button_rect', name:a, data:{
                    x: accWidth, y: 0,
                    width: this.menubar.dropdowns[a].width, height: vars.height, 
                    text: this.menubar.dropdowns[a].text,
                    hoverable: false, pressable: false, selectable: true,
                    style:{ up:style.button.up, select:style.button.select },
                    onpress:function(a){ return function(){ 
                        // if this item has already been selected (and will be deselected after this callback)
                        // sent the menubar's 'vars.selected' value to undefined. Otherwise, set it to
                        // this item's number

                        vars.selected = design.button_rect[a].select() ? undefined : a;
                    } }(a),
                    onenter:function(a){ return function(obj,event){
                        //assuming an item has been selected, and it isn't the item that's currently being 
                        //entered; deselect that one and tell the menubar that this item is selected now.
                        //if no mouse button is pressed (no button rolling is happening) select it manually
                        if( vars.selected != undefined && vars.selected != a){
                            design.button_rect[vars.selected].select(false);
                            vars.selected = a;
                            if(event.buttons == 0){ design.button_rect[vars.selected].select(true); }
                        }
                    }; }(a),
                    onselect:function(a,x,that){
                        return function(){
                            //precalc
                                var height = 0;
                                for(var b = 0; b < that.menubar.dropdowns[a].itemList.length; b++){
                                    switch(that.menubar.dropdowns[a].itemList[b]){
                                        case 'break': height += that.menubar.dropdowns[a].breakHeight; break;
                                        case 'space': height += that.menubar.dropdowns[a].spaceHeight; break;
                                        default: height += that.menubar.dropdowns[a].listItemHeight; break;
                                    }
                                }

                            //produce the dropdown list for the selected item
                                vars.opendropdown = __globals.utility.misc.elementMaker('list','createMenu',{
                                    x:x, y:20,
                                    width: that.menubar.dropdowns[a].listWidth, height: height,
                                    itemHeightMux:  that.menubar.dropdowns[a].listItemHeight/height, 
                                    breakHeightMux: that.menubar.dropdowns[a].breakHeight/height,
                                    spaceHeightMux: that.menubar.dropdowns[a].spaceHeight/height,
                                    itemSpacingMux:0, 
                                    list:that.menubar.dropdowns[a].itemList,
                                    selectable:false, multiSelect:false, 
                                    style:{ 
                                        listItemText:style.text,
                                        background_hover:style.button.select,
                                        backing:style.button.up,
                                        background_up:style.button.up,
                                    }
                                });

                            //upon selection of an item in a dropdown; close the dropdown and have nothing selected
                                vars.opendropdown.onrelease = function(){ design.button_rect[a].select(false); vars.selected = undefined; };

                            obj.append( vars.opendropdown );
                        }
                    }(a,accWidth,this),
                    ondeselect:function(){ obj.removeChild(vars.opendropdown); },
                }}
            );
            
            this.menubar.dropdowns[a].x = accWidth;
            accWidth += this.menubar.dropdowns[a].width;
        }


    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.data_duplicator,design);

    //interface
        obj.i = {
            report:function(text){ if(text == undefined){return;} design.text.report.innerHTML = text; },
            closeEverything:function(){ 
                if(vars.selected == undefined){return;}
                design.button_rect[vars.selected].select(false);
                vars.selected = undefined;
            },
        };

    return obj;
};








//dynamic population of menubar items
{{include:dropdowns.js}}