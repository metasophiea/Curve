//a design object for the menubar options and their respective dropdown menu items
_canvas_.control.gui.elements.menubar.dropdowns = [];

//file
    _canvas_.control.gui.elements.menubar.dropdowns.push(
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
                {type:'item', text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ _canvas_.control.scene.save('project.crv',true); } },
            ]
        }
    );

//edit
    _canvas_.control.gui.elements.menubar.dropdowns.push(
        {
            text:'edit',
            width:45,
            listWidth:250,//150,
            listItemHeight:22.5,
            breakHeight: 0.5,
            spaceHeight: 1,
            itemList:[
                {type:'item', text_left:'Undo',      text_right:'ctrl-z',       function:function(){_canvas_.control.actionRegistry.undo();} },
                {type:'item', text_left:'Redo',      text_right:'ctrl-shift-z', function:function(){_canvas_.control.actionRegistry.redo();} },
                {type:'break'},
                {type:'item', text_left:'Cut',       text_right:'ctrl-x', function:function(){_canvas_.control.selection.cut();}       },
                {type:'item', text_left:'Copy',      text_right:'ctrl-c', function:function(){_canvas_.control.selection.copy();}      },
                {type:'item', text_left:'Paste',     text_right:'ctrl-v', function:function(){_canvas_.control.selection.paste();}     },
                {type:'item', text_left:'Duplicate', text_right:'ctrl-b', function:function(){_canvas_.control.selection.duplicate();} },
                {type:'item', text_left:'Delete',    text_right:'del',    function:function(){_canvas_.control.selection.delete();}    },
                {type:'break'},
                {type:'item', text_left:'Select Everything', text_right:'ctrl-a', function:function(){_canvas_.control.selection.selectEverything();} },
                {type:'item', text_left:'Deselect Everything', text_right:'ctrl-shift-a', function:function(){_canvas_.control.selection.deselectEverything();} },
            ]
        }
    );

//create
    _canvas_.control.gui.elements.menubar.dropdowns.push(
        {
            text:'create',
            width:65,
            listWidth:200,
            listItemHeight:22.5,
            breakHeight: 0.5,
            spaceHeight: 1,
            itemList:(function(){
                var collections = _canvas_.interface.unit.collection;
                var outputItemList = [];
                var unitPlacementPosition = {x:30,y:30};

                function populator(collectionKey){
                    var collection = collections[collectionKey];
                    var collectionItemList = {
                        type:'list', 
                        text:collection._collectionData ? collection._collectionData.name : collectionKey, 
                        list:[],
                        itemWidth:collection._collectionData ? collection._collectionData.itemWidth : 260, 
                    };

                    //for this collection, sort models into their categories
                        var categorySortingList = {};
                        Object.keys(collection).sort().filter(a => a[0]!='_').forEach(modelKey => {
                            var model = collection[modelKey];
                            if(model.metadata.category == undefined){ model.metadata.category = 'unknown'; }
                            if(!categorySortingList.hasOwnProperty(model.metadata.category)){ categorySortingList[model.metadata.category] = []; }
                            categorySortingList[model.metadata.category].push(modelKey);
                        });

                    //run though categories and generate item list for this collection
                        Object.keys(categorySortingList).sort().forEach(categoryKey => {
                            //get category printing name
                                var categoryPrintingName = categoryKey;
                                var itemWidth = undefined;
                                if(collection._categoryData != undefined){
                                    if(collection._categoryData[categoryKey] != undefined){
                                        categoryPrintingName = collection._categoryData[categoryKey].printingName;
                                        itemWidth = collection._categoryData[categoryKey].itemWidth;
                                    }
                                }

                            //generate sub list for this category
                                var categoryList = { type:'list', text:categoryPrintingName, categoryKey:categoryKey, list:[], itemWidth:itemWidth, };
                                categorySortingList[categoryKey].forEach(model => {
                                    categoryList.list.push(
                                        {
                                            type:'item', text_left:collection[model].metadata.name,
                                            function:function(design){return function(){
                                                var p = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(unitPlacementPosition.x,unitPlacementPosition.y);
                                                _canvas_.control.scene.addUnit(p.x,p.y,0,design,collectionKey);
                                            }}(model),
                                        }
                                    );
                                });

                            //push sublist
                                collectionItemList.list.push(categoryList);
                        });

                    //if the collection has an order for it's categories; resort the item list to match
                        if(collection._collectionData != undefined && collection._collectionData.categoryOrder != undefined){
                            collectionItemList.list = collection._collectionData.categoryOrder.map(category => {
                                var result = collectionItemList.list.filter(item => item.categoryKey==category)[0];
                                if(result == undefined){ console.error('Error::menubar generation::create: bad sorting for "'+collectionKey+'" for the category: "'+category+'"'); }
                                return result
                            });
                        }

                    //add this item list to the output array
                        outputItemList.push(collectionItemList);
                }

                collections.metadata.mainList.forEach(collectionKey => { populator(collectionKey); });
                if(_canvas_.control.interaction.devMode()){
                    outputItemList.push({type:'break'});
                    collections.metadata.devList.forEach(collectionKey => { populator(collectionKey); });
                }

                return outputItemList;
            })(),
        }
    );

//tools
    _canvas_.control.gui.elements.menubar.dropdowns.push(
        {
            text:'tools',
            width:50,
            listWidth:150,
            listItemHeight:22.5,
            breakHeight: 0.5,
            spaceHeight: 1,
            itemList:[
                { type:'checkbox', text:'snapping', updateFunction:function(){return _canvas_.control.scene.activeSnapping();}, onclickFunction:function(val){_canvas_.control.scene.activeSnapping(val);} },
                { type:'checkbox', text:'dark mode', 
                    updateFunction:function(){return _canvas_.control.misc.currentStyleMode == 'dark';}, 
                    onclickFunction:function(val){
                        if(val){ _canvas_.control.misc.darkMode(); }
                        else{ _canvas_.control.misc.lightMode(); }
                    }
                },
            ]
        }
    );

//help
    _canvas_.control.gui.elements.menubar.dropdowns.push(
        {
            text:'help',
            width:50,
            listWidth:160,
            listItemHeight:22.5,
            breakHeight: 0.5,
            spaceHeight: 1,
            itemList:[
                {type:'item', text_left:'Help Docs', text_right:'(empty)', function:function(){ console.log('go to help site'); } },
                {type:'item', text_left:'Development Log', function:function(){window.open('https://raw.githubusercontent.com/metasophiea/curve/master/docs/notes/log');}},
                {type:'item', text_left:'Github', function:function(){window.open('https://github.com/metasophiea/curve');}},
            ]
        },
    );

//dev tools
    if(_canvas_.control.interaction.devMode()){
        _canvas_.control.gui.elements.menubar.dropdowns.push(
            {
                text:'dev',
                width:50,
                listWidth:210,
                listItemHeight:22.5,
                breakHeight: 0.5,
                spaceHeight: 1,
                itemList:[
                    {type:'item', text_left:'Release All Keyboard Keys', function:function(){ _canvas_.system.keyboard.releaseAll(); } },
                    {type:'textbreak',text:'last date layer was modified'}
                ].concat(
                    _canvas_.getVersionInformation().map(
                            item => {
                                if(item.name[0] == '_'){ item.name = item.name.substr(1); }
                                return item.name+': '+item.data.lastDateModified.y+'/'+item.data.lastDateModified.m+'/'+item.data.lastDateModified.d;
                            }
                        ).map(
                            item => ({type:'text',text:item})
                        ).reverse()
                )
            }
        );
    }