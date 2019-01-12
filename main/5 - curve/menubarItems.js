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
            {text_left:'New Scene', function:function(){ control.scene.new(true); } },
            {text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ control.scene.load(undefined,undefined,true); } },
            {text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ control.scene.save('project.crv'); } },
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
            {text_left:'Cut',       text_right:'ctrl-x', function:function(){control.selection.cut();}       },
            {text_left:'Copy',      text_right:'ctrl-c', function:function(){control.selection.copy();}      },
            {text_left:'Paste',     text_right:'ctrl-v', function:function(){control.selection.paste();}     },
            {text_left:'Duplicate', text_right:'ctrl-b', function:function(){control.selection.duplicate();} },
            {text_left:'Delete',    text_right:'del',    function:function(){control.selection.delete();}    },
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