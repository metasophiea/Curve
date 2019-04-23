//a design object for the menubar options and their respective dropdown menu items
workspace.control.gui.elements.menubar.dropdowns = [
    {
        text:'file',
        width:45,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
            {text_left:'New Scene', function:function(){ workspace.control.scene.new(true); } },
            {text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ workspace.control.scene.load(undefined,undefined,true); } },
            {text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ workspace.control.scene.save('project.crv'); } },
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
            {text_left:'Cut',       text_right:'ctrl-x', function:function(){workspace.control.selection.cut();}       },
            {text_left:'Copy',      text_right:'ctrl-c', function:function(){workspace.control.selection.copy();}      },
            {text_left:'Paste',     text_right:'ctrl-v', function:function(){workspace.control.selection.paste();}     },
            {text_left:'Duplicate', text_right:'ctrl-b', function:function(){workspace.control.selection.duplicate();} },
            {text_left:'Delete',    text_right:'del',    function:function(){workspace.control.selection.delete();}    },
        ]
    },
    {
        text:'create',
        width:65,
        listWidth:250,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:(function(){
            //collect units and separate by category
                var collection = {};
                for(design in workspace.interface.unit.collection.alpha){
                    var data = workspace.interface.unit.collection.alpha[design].metadata;
                    if(data.dev){continue;}

                    if(collection[ data.category == undefined ? '' : data.category ] == undefined){
                        collection[ data.category == undefined ? '' : data.category ] = [];
                    }
                    collection[ data.category == undefined ? '' : data.category ].push(
                        {
                            text_left: data.name,
                            function:function(design){return function(){
                                var p = workspace.core.viewport.windowPoint2workspacePoint(30,30);
                                workspace.control.scene.addUnit(p.x,p.y,0,design,'alpha');
                            }}(design),
                        }
                    );
                }

            //covert to an array, separating categories by breaks
                var outputArray = [];
                for(category in collection){
                    outputArray = outputArray.concat( collection[category] );
                    outputArray.push('break');
                }
                outputArray.pop();
        
            return outputArray;
        })()
    },
    {
        text:'help',
        width:50,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
        {text_left:'Help Docs', text_right:'(empty)', function:function(){ console.log('go to help site'); /*system.utility.misc.openURL(system.super.helpFolderLocation);*/ } },
        ]
    },
];