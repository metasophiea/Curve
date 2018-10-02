//a design object for the menubar options and their respective dropdown menu items
this.menubar.dropdowns = [
    {
        text:'file',
        width:50, 
        textHorizontalOffset:0.3,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:[
            {text:'New Scene', function:function(){ control.i.scene.new(); }},
            {text:'Open Scene',text_right:'ctrl-f2', function:function(){ control.i.scene.load(); }},
            'break',
            {text:'Save Scene',text_right:'ctrl-f3', function:function(){ control.i.scene.save(); }},
        ]
    },
    // {
    //     text:'edit',
    //     width:45,
    //     textHorizontalOffset:0.25,
    //     listWidth:150,
    //     listItemHeight:22.5,
    //     breakHeight: 1,
    //     spaceHeight: 2,
    //     itemList:[
    //         {text_left:'Cut',text_right:'ctrl-x'},
    //         {text_left:'Copy',text_right:'ctrl-c'},
    //         {text_left:'Paste',text_right:'ctrl-v'},
    //         {text_left:'Duplicate',text_right:'ctrl-b'},
    //         {text_left:'Delete',text_right:'del'},
    //     ]
    // },
    {
        text:'create',
        width:65, 
        textHorizontalOffset:0.175,
        listWidth:250,
        listItemHeight:22.5,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:[]
    },
    {
        text:'help',
        width:50, 
        textHorizontalOffset:0.175,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 1,
        spaceHeight: 2,
        itemList:[
            {text:'Help Docs', function:function(){ __globals.utility.misc.openURL(__globals.super.helpFolderLocation); }},
        ]
    },
];

//dynamic population of 'create' dropdown
for(i in objects){
    this.menubar.dropdowns[1].itemList.push(
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