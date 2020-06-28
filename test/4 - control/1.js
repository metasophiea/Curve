_canvas_.layers.registerFunctionForLayer("control", function(){
    _canvas_.control.gui.elements.menubar.dropdowns = [
        {
            text:'file',
            width:45,
            listWidth:150,
            listItemHeight:22.5,
            breakHeight: 0.5,
            spaceHeight: 1,
            itemList:[
                {type:'button', text_left:'New Scene', function:function(){ console.log('New'); } },
                {type:'button', text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ console.log('Open'); } },
                {type:'button', text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ console.log('Save'); } },
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
                {type:'button', text_left:'Cut',       text_right:'ctrl-x', function:function(){ console.log('cut');       }},
                {type:'button', text_left:'Copy',      text_right:'ctrl-c', function:function(){ console.log('copy');      }},
                {type:'button', text_left:'Paste',     text_right:'ctrl-v', function:function(){ console.log('paste');     }},
                {type:'button', text_left:'Duplicate', text_right:'ctrl-b', function:function(){ console.log('duplicate'); }},
                {type:'button', text_left:'Delete',    text_right:'del',    function:function(){ console.log('delete');    }},
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
                return {type:'button', text_left:'Item '+a, text_right:''+a, function:function(){ console.log(''+a); }};
                
            }),
        },
        {
            text:'tools',
            width:50,
            listWidth:150,
            listItemHeight:22.5,
            breakHeight: 0.5,
            spaceHeight: 1,
            itemList:[
                {type:'button', text_left:'A' },
                { type:'list', text:'sublist', itemWidth:300, list:[
                    { type:'space' },
                    { type:'button', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('sublist item1 function');} },
                    { type:'break' },
                    { type:'text', text:'text entry' },
                    { type:'button', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('sublist item2 function');} },
                    { type:'textbreak', text:'break 1'},
                    { type:'list', text:'sublist', itemWidth:100, list:[
                        { type:'space' },
                        { type:'break' },
                        { type:'button', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item1 function');} },
                        { type:'break' },
                        { type:'button', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item2 function');} },
                        { type:'textbreak', text:'break 1'},
                        { type:'button', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item3 function');} },
                        { type:'space' },
                    ] },
                    { type:'checkbox', text:'checkable', onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'button', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('sublist item3 function');} },
                    { type:'space' },
                ] },
            ]
        },
        {
            text:'help',
            width:50,
            listWidth:150,
            listItemHeight:22.5,
            breakHeight: 0.5,
            spaceHeight: 1,
            itemList:[
                {type:'button', text_left:'Help Docs', text_right:'(empty)', function:function(){ console.log('go to help site'); } },
            ]
        },
    ];



    _canvas_.control.gui.showMenubar();
    _canvas_.control.viewport.activeRender(true);
    _canvas_.control.viewport.stopMouseScroll(true);

    _canvas_.control.gui.style.darkMode();
});