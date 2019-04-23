_canvas_.control.gui.elements.menubar.dropdowns = [
    {
        text:'file',
        width:45,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
            {text_left:'New Scene', function:function(){ console.log('New'); } },
            {text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ console.log('Open'); } },
            {text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ console.log('Save'); } },
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
            {text_left:'Cut',       text_right:'ctrl-x', function:function(){ console.log('cut');       }},
            {text_left:'Copy',      text_right:'ctrl-c', function:function(){ console.log('copy');      }},
            {text_left:'Paste',     text_right:'ctrl-v', function:function(){ console.log('paste');     }},
            {text_left:'Duplicate', text_right:'ctrl-b', function:function(){ console.log('duplicate'); }},
            {text_left:'Delete',    text_right:'del',    function:function(){ console.log('delete');    }},
        ]
    },
    {
        text:'create',
        width:65,
        listWidth:250,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
            {text_left:'Item 1', text_right:'1', function:function(){ console.log('1'); }},
            {text_left:'Item 2', text_right:'2', function:function(){ console.log('2'); }},
            {text_left:'Item 3', text_right:'3', function:function(){ console.log('3'); }},
            {text_left:'Item 4', text_right:'4', function:function(){ console.log('4'); }},
            {text_left:'Item 5', text_right:'5', function:function(){ console.log('5'); }},
        ],
    },
    {
        text:'help',
        width:50,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
        {text_left:'Help Docs', text_right:'(empty)', function:function(){ console.log('go to help site'); } },
        ]
    },
];



_canvas_.control.gui.showMenubar();
_canvas_.control.viewport.activeRender(true);
_canvas_.control.viewport.stopMouseScroll(true);
