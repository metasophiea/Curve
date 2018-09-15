this.menuBar = function(){
    var vars = {
        width: 300, height:20,
    };
    vars.width = __globals.utility.workspace.getViewportDimensions().width;
    var style = {
        text: 'fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
        button:{
            off:'fill:rgba(240,240,240,1)',
            hover:'fill:rgba(220,220,220,1)',
            hover_press:'fill:rgba(250,250,250,1)',
        }
    };

    var design = {
        type:'menuBar',
        x:0, y:0,
        base:{
            points:[{x:0,y:0},{x:vars.width,y:0},{x:vars.width,y:vars.height},{x:0,y:vars.height}],
            style:'fill:rgba(240,240,240,1);'
        },
        elements:[
            {type:'button_rect_2',name:'file',data:{
                x:0, y:0, width:70, height:vars.height, text:'objects',
                textHorizontalOffset:0.15,
                style:{
                    background_off:style.button.off,
                    background_hover:style.button.hover,
                    background_hover_press:style.button.hover_press,
                },
                onpress:function(){menu.control.objectPane.open();}
            }},
            {type:'button_rect_2',name:'open',data:{
                x:70, y:0, width:50, height:vars.height, text:'open',
                textHorizontalOffset:0.15,
                style:{
                    background_off:style.button.off,
                    background_hover:style.button.hover,
                    background_hover_press:style.button.hover_press,
                },
                onpress:function(){menu.control.loadsave.load();}
            }},
            {type:'button_rect_2',name:'save',data:{
                x:120, y:0, width:50, height:vars.height, text:'save',
                textHorizontalOffset:0.15,
                style:{
                    background_off:style.button.off,
                    background_hover:style.button.hover,
                    background_hover_press:style.button.hover_press,
                },
                onpress:function(){menu.control.loadsave.save();}
            }},
            {type:'text', name:'report', data:{
                x:vars.width-75, y:10, text:'', style:style.text
            }},
        ]
    };

    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.data_duplicator,design);

    //interface
        obj.i = {
            report:function(text){ if(text == undefined){return;} design.text.report.innerHTML = text; }
        };

    return obj;
};