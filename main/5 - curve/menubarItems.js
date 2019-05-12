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
        width:65,
        listWidth:260,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:(function(){
            var requestedCollection = (new URL(window.location.href)).searchParams.get("collection");
            if( requestedCollection == undefined ){ requestedCollection = 'alpha'; }

            if(_canvas_.control.interaction.devMode()){
                ////populate create dropdown with all units from all categories

                var collections = _canvas_.interface.unit.collection;
                var outputItemList = [];

                Object.keys(collections).sort().forEach(collectionKey => {
                    //for this collection, sort models into their categories
                    var categorySortingList = {};
                    Object.keys(collections[collectionKey]).sort().filter(a => a[0]!='_').forEach(modelKey => {
                        var model = collections[collectionKey][modelKey];
                        if(model.metadata.category == undefined){ model.metadata.category = 'unknown'; }
                        if(!categorySortingList.hasOwnProperty(model.metadata.category)){
                            categorySortingList[model.metadata.category] = [];
                        }
                        categorySortingList[model.metadata.category].push(modelKey);
                    });

                    //run though categories and generate item list for this collection
                    var collectionItemList = {type:'list', text:collectionKey, list:[]};
                    Object.keys(categorySortingList).sort().forEach(categoryKey => {
                        var categoryPrintingName = categoryKey;
                        if(collections[collectionKey]._categoryData != undefined && collections[collectionKey]._categoryData[categoryKey] != undefined){
                            categoryPrintingName = collections[collectionKey]._categoryData[categoryKey].printingName;
                        }

                        var categoryList = { type:'list', text:categoryPrintingName, list:[] };
                        categorySortingList[categoryKey].forEach(model => {
                            categoryList.list.push(
                                {
                                    type:'item', text_left:collections[collectionKey][model].metadata.name,
                                    function:function(design){return function(){
                                        var p = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(30,30);
                                        _canvas_.control.scene.addUnit(p.x,p.y,0,design,collectionKey);
                                    }}(model),
                                }
                            );
                        });

                        collectionItemList.list.push(categoryList);
                    });

                    //add this item list to the output array
                    outputItemList.push(collectionItemList);
                });

                return outputItemList;
            }else{
                ////populate create dropdown with units from only the alpha category
                var categoryName = requestedCollection;

                var collection = {};
                var outputItemList = [];

                for(design in _canvas_.interface.unit.collection[categoryName]){
                    if(design[0] == '_'){continue;}

                    var metadata = _canvas_.interface.unit.collection[categoryName][design].metadata;
                    if(metadata.dev){continue;}
                    
                    if(!collection.hasOwnProperty(metadata.category)){
                        collection[metadata.category] = [];
                    }
                    collection[metadata.category].push(design);
                }

                Object.keys(collection).sort().forEach(category => {
                    var printingName = _canvas_.interface.unit.collection[categoryName]._categoryData[category] ? _canvas_.interface.unit.collection[categoryName]._categoryData[category].printingName : category;
                    var sublist = { type:'list', text:printingName, list:[] };

                    collection[category].forEach(design => {
                        var metadata = _canvas_.interface.unit.collection[categoryName][design].metadata;
                        sublist.list.push(
                            {
                                type:'item', text_left: metadata.name,
                                function:function(design,categoryName){return function(){
                                    var p = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(30,30);
                                    _canvas_.control.scene.addUnit(p.x,p.y,0,design,categoryName);
                                }}(design,categoryName),
                            }
                        );
                    });

                    outputItemList.push(sublist);
                });

                return outputItemList;
            }

        })(),
    },
    {
        text:'tools',
        width:50,
        listWidth:150,
        listItemHeight:22.5,
        breakHeight: 0.5,
        spaceHeight: 1,
        itemList:[
            { type:'checkbox', text:'snapping', updateFunction:function(){return _canvas_.control.scene.activeSnapping();}, onclickFunction:function(val){_canvas_.control.scene.activeSnapping(val);} },
        ]
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