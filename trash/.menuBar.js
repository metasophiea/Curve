this.menubar = function(){
    var vars = {
        width: __globals.utility.workspace.getViewportDimensions().width,
        height: 20,
        selected: undefined,
        opendropdown: undefined,
    };
    var style = {
        bar: 'fill:rgba(240,240,240,1);', 
        text: 'fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
        button:{
            up:'fill:rgba(240,240,240,1)',
            select:'fill:rgba(229,167,255,1)',
        }
    };

    var design = {
        type:'menuBar',
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
        for(var a = 0; a < this.menubar.items.length; a++){

            design.elements.push(
                {type:'button_rect', name:a, data:{
                    x: accWidth, y: 0,
                    width: this.menubar.items[a].width, height: vars.height, 
                    text: this.menubar.items[a].text,
                    textHorizontalOffset: this.menubar.items[a].textHorizontalOffset,
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
                            //produce the dropdown list for the selected item
                            vars.opendropdown = __globals.utility.misc.elementMaker('list','createMenu',{
                                x:x, y:20,
                                width: that.menubar.items[a].listWidth, 
                                height: (that.menubar.items[a].itemList.length*that.menubar.items[a].listItemHeight),
                                itemHeightMux: 1/that.menubar.items[a].itemList.length, 
                                itemSpacingMux:0,
                                list:that.menubar.items[a].itemList,
                                selectable:false, multiSelect:false, 
                                style:{ 
                                    listItemText:'fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
                                    background_hover:style.button.select,
                                    backing:style.button.up,
                                    background_up:style.button.up,
                                }
                            });

                            vars.opendropdown.onrelease = function(){ design.button_rect[a].select(false); };

                            obj.append( vars.opendropdown );
                        }
                    }(a,accWidth,this),
                    ondeselect:function(){ obj.removeChild(vars.opendropdown); },
                }}
            );
            
            this.menubar.items[a].x = accWidth;
            accWidth += this.menubar.items[a].width;
        }


    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.data_duplicator,design);

    //interface
        obj.i = {
            report:function(text){ if(text == undefined){return;} design.text.report.innerHTML = text; }
        };

    return obj;
};








//a design object for the menubar options and their respective dropdown menu items
this.menubar.items = [
    {
        x:undefined,
        width:45, 
        listWidth:150,
        listItemHeight:22.5,
        text:'file',
        textHorizontalOffset:0.25,
        itemList:[
            // {text:'New Scene', function:function(){}},
            {text:'New Scene', function:function(){ control.i.scene.new(); }},
            {text:'Open Scene', function:function(){ control.i.scene.load(); }},
            {text:'Save Scene', function:function(){ control.i.scene.save(); }},
        ]
    },
    {
        x:undefined,
        width:65, 
        listWidth:250,
        listItemHeight:22.5,
        text:'create',
        textHorizontalOffset:0.175,
        itemList:[]
    },
];
//dynamic population
    for(i in objects){
        this.menubar.items[1].itemList.push(
            {
                text: objects[i].metadata ? objects[i].metadata.name : i,
                function:function(i){
                    return function(){
                        var p = __globals.utility.workspace.pointConverter.browser2workspace(30,30);
                        __globals.utility.workspace.placeAndReturnObject( objects[i](p.x,p.y) );
                    }
                }(i),
            }
        );
    }