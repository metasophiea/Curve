_canvas_.control.gui.elements.menubar.dropdowns = [
    {
        text:'file',
        width:45,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
            {type:'item', text_left:'New Scene', function:function(){ console.log('New'); } },
            {type:'item', text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ console.log('Open'); } },
            {type:'item', text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ console.log('Save'); } },
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
            {type:'item', text_left:'Cut',       text_right:'ctrl-x', function:function(){ console.log('cut');       }},
            {type:'item', text_left:'Copy',      text_right:'ctrl-c', function:function(){ console.log('copy');      }},
            {type:'item', text_left:'Paste',     text_right:'ctrl-v', function:function(){ console.log('paste');     }},
            {type:'item', text_left:'Duplicate', text_right:'ctrl-b', function:function(){ console.log('duplicate'); }},
            {type:'item', text_left:'Delete',    text_right:'del',    function:function(){ console.log('delete');    }},
        ]
    },
    {
        text:'create',
        width:65,
        listWidth:250,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:Array.apply(null, {length:22}).map(Number.call, Number).map(function(a){
            return {type:'item', text_left:'Item '+a, text_right:''+a, function:function(){ console.log(''+a); }};
        }),
    },
    {
        text:'help',
        width:50,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
            {type:'item', text_left:'Help Docs', text_right:'(empty)', function:function(){ console.log('go to help site'); } },
        ]
    },
];



_canvas_.control.gui.showMenubar();
_canvas_.control.viewport.activeRender(true);
_canvas_.control.viewport.stopMouseScroll(true);
