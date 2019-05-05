//a design object for the menubar options and their respective dropdown menu items
_canvas_.control.gui.elements.menubar.dropdowns = [
    {
        text:'file',
        width:45,
        listWidth:170,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
            {type:'item', text_left:'New Scene', function:function(){ _canvas_.control.scene.new(true); } },
            {type:'item', text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ _canvas_.control.scene.load(undefined,undefined,true); } },
            {type:'item', text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ _canvas_.control.scene.save('project.crv'); } },
        ]
    },
    {
        text:'edit',
        width:45,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
            {type:'item', text_left:'Cut',       text_right:'ctrl-x', function:function(){_canvas_.control.selection.cut();}       },
            {type:'item', text_left:'Copy',      text_right:'ctrl-c', function:function(){_canvas_.control.selection.copy();}      },
            {type:'item', text_left:'Paste',     text_right:'ctrl-v', function:function(){_canvas_.control.selection.paste();}     },
            {type:'item', text_left:'Duplicate', text_right:'ctrl-b', function:function(){_canvas_.control.selection.duplicate();} },
            {type:'item', text_left:'Delete',    text_right:'del',    function:function(){_canvas_.control.selection.delete();}    },
        ]
    },
    {
        text:'create',
        width:70,
        listWidth:260,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:(function(){
            var collection = {};
            var outputArray = [];

            for(design in _canvas_.interface.unit.collection.alpha){
                if(design == '_categoryData'){continue;}

                var metadata = _canvas_.interface.unit.collection.alpha[design].metadata;
                if(metadata.dev){continue;}
                
                if(!collection.hasOwnProperty(metadata.category)){
                    collection[metadata.category] = [];
                }
                collection[metadata.category].push(design);
            }

            for(category in collection){
                var printingName = _canvas_.interface.unit.collection.alpha._categoryData[category] ? _canvas_.interface.unit.collection.alpha._categoryData[category].printingName : category;
                var sublist = { type:'list', text:printingName, list:[] };

                collection[category].forEach(design => {
                    var metadata = _canvas_.interface.unit.collection.alpha[design].metadata;
                    sublist.list.push(
                        {
                            type:'item', text_left: metadata.name,
                            function:function(design){return function(){
                                var p = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(30,30);
                                _canvas_.control.scene.addUnit(p.x,p.y,0,design,'alpha');
                            }}(design),
                        }
                    );
                });

                outputArray.push(sublist);
            }

            return outputArray;
        })(),
    },
    {
        text:'help',
        width:50,
        listWidth:160,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
        {type:'item', text_left:'Help Docs', text_right:'(empty)', function:function(){ console.log('go to help site'); } },
        ]
    },
];