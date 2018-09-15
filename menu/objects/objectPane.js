this.objectPane = function(x,y){
    var vars = {
        width: 300, height:300,
    };
    var style = {
        background:'fill:rgba(240,240,240,1);pointer-events:none;',
        markings: 'fill:rgba(150,150,150,1); pointer-events:none;',
        text: 'fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
    };
    var design = {
        type:'objectPane',
        x:x, y:y,
        base:{
            points:[{x:0,y:0},{x:vars.width,y:0},{x:vars.width,y:25},{x:0,y:25}],
            style:'fill:rgba(240,240,240,0.75);'
        },
        elements:[
            {type:'text', name:'title', data:{
                x:30, y:12.5, text:'Create Object', style:style.text
            }},
            {type:'path', name:'backing', data:{
                path:[{x:0,y:25},{x:vars.width,y:25},{x:vars.width,y:vars.height},{x:0,y:vars.height}],
                style:style.background
            }},
            {type:'button_rect', name:'close', data:{
                x:2.5, y:2.5, width:20, height:20, 
                style:{ up:'fill:rgba(255,132,132,1)', hover:'fill:rgba(255,200,200,1)', down:'fill:rgba(255,100,100,1)' },
                onclick:function(){ menu.control.objectPane.close(); }
            }},
            {type:'slide', name:'scroll', data:{
                x:vars.width-15, y:25, width:15, height:vars.height-25,
                onchange:function(a){design.list.objectList.position(a,false);},
            }},
            {type:'list', name:'objectList', data:{
                x:5, y:30, width:vars.width-25, height:vars.height-35,
                list:[], selectable:false,
                style:{listItemText:style.text},
                onselect:function(a,i){
                    var p = __globals.utility.workspace.pointConverter.browser2workspace(30,30);
                    __globals.utility.workspace.placeAndReturnObject( objects[Object.keys(objects)[i]](p.x,p.y) );
                },
                onpositionchange:function(a){design.slide.scroll.set(a)},
            }},
        ]
    };


    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.data_duplicator,design);

    //populate list
        for(i in objects){
            design.list.objectList.add( objects[i].metadata ? objects[i].metadata.name : i );
        }
    
    return obj;
};