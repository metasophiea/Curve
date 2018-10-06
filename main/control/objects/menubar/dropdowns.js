//a design object for the menubar options and their respective dropdown menu items
this.menubar.dropdowns = [
    {
        text:'file',
        width:45,
        listWidth:175,
        listItemHeight:22.5,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:[
            {text_left:'New Scene', function:function(){ if(confirm("This will clear the current scene! Are you sure?")){control.i.scene.new();} }},
            {text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ control.i.scene.load(); }},
            {text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ control.i.scene.save(control.project.name); }},
        ]
    },
    {
        text:'edit',
        width:45,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:[
            {text_left:'Cut',       text_right:'ctrl-x',    function:function(){system.selection.cut();}       },
            {text_left:'Copy',      text_right:'ctrl-c',    function:function(){system.selection.copy();}      },
            {text_left:'Paste',     text_right:'ctrl-v',    function:function(){system.selection.paste();}     },
            {text_left:'Duplicate', text_right:'ctrl-b',    function:function(){system.selection.duplicate();} },
            {text_left:'Delete',    text_right:'del',       function:function(){system.selection.delete();}    },
        ]
    },
    {
        text:'create',
        width:65,
        listWidth:250,
        listItemHeight:22.5,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:(function(){
            var outputArray = [];

            //populate array with all creatable objects
                for(i in object.alpha){
                    outputArray.push(
                        {
                            text_left: object.alpha[i].metadata ? object.alpha[i].metadata.name : i,
                            function:function(i){
                                return function(){
                                    var p = system.utility.workspace.pointConverter.browser2workspace(30,30);
                                    system.utility.workspace.placeAndReturnObject( object.alpha[i](p.x,p.y) );
                                }
                            }(i),
                        }
                    );
                }

            //sort array
                outputArray.sort(
                    function(a,b){
                        if(a.text_left.toLowerCase() < b.text_left.toLowerCase()) return -1;
                        if(a.text_left.toLowerCase() > b.text_left.toLowerCase()) return 1;
                        return 0;
                    }
                );
        
            return outputArray;
        })()
    },
    {
        text:'help',
        width:50,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:[
            {text_left:'Help Docs', text_right:'(empty)', function:function(){ system.utility.misc.openURL(system.super.helpFolderLocation); }},
        ]
    },
];