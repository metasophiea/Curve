this.menubar = function(x,y){
    var vars = {
        width: workspace.control.viewport.width(),
        height: 40,
        selected: undefined,
        activedropdown: undefined,
    };
    var style = {
        bar: {fill:'rgba(240,240,240,1)'}, 
        button:{
            text_fill:'rgba(0,0,0,1)',
            text_font:'22.5pt Helvetica',
            background__up__fill:'rgba(240,240,240,1)', 
            background__press__fill:'rgba(240,240,240,1)',
            background__select_press__fill:'rgba(229,167,255,1)',
            background__press__stroke:'rgba(0,0,0,0)',
            background__select__fill:'rgba(229,167,255,1)', background__select__stroke:'rgba(0,0,0,0)',
            background__select_press__stroke:'rgba(0,0,0,0)',
        },
        list:{
            text_font: '22.5pt Helvetica',
            item__up__fill: 'rgba(240,240,240,1)', 
            item__hover__fill: 'rgba(229,167,255,1)', 
        },
    };

    //elements
        //main
            var object = workspace.interface.part.alpha.builder( 'group', 'menubar', {});
            var bar = workspace.interface.part.alpha.builder( 'rectangle', 'rectangle', {x:0, y:0, width:vars.height, height:vars.height, style:style.bar} );
                object.append(bar);

        //items
            var accWidth = 0;
            for(var a = 0; a < this.menubar.dropdowns.length; a++){
                var item = workspace.interface.part.alpha.builder( 'button_rect', 'dropdownButton_'+a, {
                    x:accWidth, y:0, 
                    width:this.menubar.dropdowns[a].width, height:vars.height, 
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
                                case 'break': height += that.menubar.dropdowns[a].breakHeight; break;
                                case 'space': height += that.menubar.dropdowns[a].spaceHeight; break;
                                default: height += that.menubar.dropdowns[a].listItemHeight; break;
                            }
                        }
                        if(height > workspace.control.viewport.height()){
                            height = workspace.control.viewport.height();
                        }

                    //produce dropdown
                        vars.activedropdown = workspace.interface.part.alpha.builder( 'list', 'dropdown', {
                            x:x, y:vars.height, style:style.list,
                            width:that.menubar.dropdowns[a].listWidth, height:height,

                            multiSelect:false, selectable:false,

                            itemWidthMux: 1,
                            itemHeightMux:  that.menubar.dropdowns[a].listItemHeight/height, 
                            breakHeightMux: that.menubar.dropdowns[a].breakHeight/height,
                            spaceHeightMux: that.menubar.dropdowns[a].spaceHeight/height,
                            itemSpacingMux:0, 

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
            bar.parameter.width( workspace.control.viewport.width() );
        };
        object.refresh();

    return object;
};






//a design object for the menubar options and their respective dropdown menu items
this.menubar.dropdowns = [
    {
        text:'file',
        width:90,
        listWidth:300,
        listItemHeight:45,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:[
            {text_left:'New Scene', function:function(){ control.scene.new(true); } },
            {text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ control.scene.load(undefined,undefined,true); } },
            {text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ control.scene.save('project.crv'); } },
        ]
    },
    {
        text:'edit',
        width:90,
        listWidth:300,
        listItemHeight:45,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:[
            {text_left:'Cut',       text_right:'ctrl-x', function:function(){control.selection.cut();}       },
            {text_left:'Copy',      text_right:'ctrl-c', function:function(){control.selection.copy();}      },
            {text_left:'Paste',     text_right:'ctrl-v', function:function(){control.selection.paste();}     },
            {text_left:'Duplicate', text_right:'ctrl-b', function:function(){control.selection.duplicate();} },
            {text_left:'Delete',    text_right:'del',    function:function(){control.selection.delete();}    },
        ]
    },
    {
        text:'create',
        width:130,
        listWidth:500,
        listItemHeight:45,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:(function(){
            var outputArray = [];

            for(category in workspace.interface.unit.alpha){
                if(category == 'builder'){continue;}

                for(model in workspace.interface.unit.alpha[category]){
                    if( workspace.interface.unit.alpha[category][model].devUnit ){continue;}

                    outputArray.push({
                        text_left: workspace.interface.unit.alpha[category][model].metadata.name,
                        function:function(model,category){return function(){
                            var p = workspace.core.viewport.windowPoint2workspacePoint(30,30);
                            workspace.control.scene.addUnit(p.x,p.y,0,model,category,'alpha');
                        }}(model,category),
                    });
                }

                outputArray.push('break');
            }

            outputArray.pop();
        
            return outputArray;
        })()
    },
    {
        text:'help',
        width:100,
        listWidth:300,
        listItemHeight:45,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:[
        {text_left:'Help Docs', text_right:'(empty)', function:function(){ console.log('go to help site'); /*system.utility.misc.openURL(system.super.helpFolderLocation);*/ } },
        ]
    },
];