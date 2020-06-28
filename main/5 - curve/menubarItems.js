_canvas_.layers.registerFunctionForLayer("control", function(){
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
                    {type:'button', text_left:'New Scene', function:function(){ _canvas_.control.scene.new(true); } },
                    {type:'button', text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ _canvas_.control.scene.load(undefined,undefined,true); } },
                    {type:'button', text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ _canvas_.control.scene.save('project.crv',true); } },
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
                    {type:'button', text_left:'Undo',      text_right:'ctrl-z',       function:function(){_canvas_.control.actionRegistry.undo();} },
                    {type:'button', text_left:'Redo',      text_right:'ctrl-shift-z', function:function(){_canvas_.control.actionRegistry.redo();} },
                    {type:'break'},
                    {type:'button', text_left:'Cut',       text_right:'ctrl-x', function:function(){_canvas_.control.selection.cut();}       },
                    {type:'button', text_left:'Copy',      text_right:'ctrl-c', function:function(){_canvas_.control.selection.copy();}      },
                    {type:'button', text_left:'Paste',     text_right:'ctrl-v', function:function(){_canvas_.control.selection.paste();}     },
                    {type:'button', text_left:'Duplicate', text_right:'ctrl-b', function:function(){_canvas_.control.selection.duplicate();} },
                    {type:'button', text_left:'Delete',    text_right:'del',    function:function(){_canvas_.control.selection.delete();}    },
                    {type:'break'},
                    {type:'button', text_left:'Select Everything', text_right:'ctrl-a', function:function(){_canvas_.control.selection.selectEverything();} },
                    {type:'button', text_left:'Deselect Everything', text_right:'ctrl-shift-a', function:function(){_canvas_.control.selection.deselectEverything();} },
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
                    const collections = _canvas_.interface.unit.collection;
                    const outputItemList = [];
                    const unitPlacementPosition = {x:30,y:30};

                    function populator(collectionKey){
                        const collection = collections[collectionKey];
                        const collectionItemList = {
                            type:'list', 
                            text:collection._collectionData ? collection._collectionData.name : collectionKey, 
                            list:[],
                            itemWidth:collection._collectionData ? collection._collectionData.itemWidth : 260, 
                        };

                        //for this collection, sort models into their categories
                            const categorySortingList = {};
                            Object.keys(collection).sort().filter(a => a[0]!='_').forEach(modelKey => {
                                const model = collection[modelKey]; //console.log(model.metadata);
                                if(model.metadata.category == undefined){ model.metadata.category = 'unknown'; }
                                if(!categorySortingList.hasOwnProperty(model.metadata.category)){ categorySortingList[model.metadata.category] = []; }
                                categorySortingList[model.metadata.category].push(modelKey);
                            });

                        //run though categories and generate item list for this collection (except the "" one)
                            Object.keys(categorySortingList).sort().forEach(categoryKey => {
                                if(categoryKey == ""){return;}

                                //get category printing name
                                    let categoryPrintingName = categoryKey;
                                    let itemWidth = undefined;
                                    if(collection._categoryData != undefined){
                                        if(collection._categoryData[categoryKey] != undefined){
                                            categoryPrintingName = collection._categoryData[categoryKey].printingName;
                                            itemWidth = collection._categoryData[categoryKey].itemWidth;
                                        }
                                    }

                                //generate sub list for this category
                                    const categoryList = { type:'list', text:categoryPrintingName, categoryKey:categoryKey, list:[], itemWidth:itemWidth, };
                                    categorySortingList[categoryKey].forEach(model => {
                                        categoryList.list.push(
                                            {
                                                type:'button', text_left:collection[model].metadata.name,
                                                function:function(design){return function(){
                                                    const p = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(unitPlacementPosition.x,unitPlacementPosition.y);
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
                                    const result = collectionItemList.list.filter(item => item.categoryKey==category)[0];
                                    if(result == undefined){ console.error('Error::menubar generation::create: bad sorting for "'+collectionKey+'" for the category: "'+category+'"'); }
                                    return result
                                });
                            }

                        //add this item list to the output array
                            outputItemList.push(collectionItemList);

                        //if there is one, add the units from the "" list to the main list
                            if( categorySortingList[""] != undefined){
                                categorySortingList[""].forEach(model => {
                                    collectionItemList.list.push(
                                        {
                                            type:'button', text_left:collection[model].metadata.name,
                                            function:function(design){return function(){
                                                const p = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(unitPlacementPosition.x,unitPlacementPosition.y);
                                                _canvas_.control.scene.addUnit(p.x,p.y,0,design,collectionKey);
                                            }}(model),
                                        }
                                    );
                                });
                            }
                    }

                    collections.metadata.mainList.forEach(collectionKey => { populator(collectionKey); });
                    if(_canvas_.control.interaction.development()){
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
                listWidth:170,
                listItemHeight:22.5,
                breakHeight: 0.5,
                spaceHeight: 1,
                itemList:[
                    { type:'checkbox', text:'Snapping', updateFunction:function(){return _canvas_.control.scene.activeSnapping();}, onclickFunction:function(val){_canvas_.control.scene.activeSnapping(val);} },
                    { type:'checkbox', text:'Dark Mode', 
                        updateFunction:function(){return _canvas_.control.gui.style.currentStyleMode == 'dark';}, 
                        onclickFunction:function(val){
                            if(val){ _canvas_.control.gui.style.darkMode(); }
                            else{ _canvas_.control.gui.style.lightMode(); }
                        }
                    },
                    { type:'radio', text:'Mouse Wheel Mode', itemWidth:150, 
                        options:['Magic', 'Clicky Wheel'],
                        updateFunction:function(){
                            if( _canvas_.control.mouseWheelMode == 'magic' ){ return 0; }
                            if( _canvas_.control.mouseWheelMode == 'clickyWheel' ){ return 1; }
                        },
                        onclickFunction:function(value){
                            _canvas_.control.mouseWheelMode = ['magic','clickyWheel'][value];
                        }
                    },
                    {type:'button', text_left:'Reset Viewport', function:function(){
                        _canvas_.control.viewport.position(0,0);
                        _canvas_.control.viewport.scale(1);
                    } },
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
                    {type:'button', text_left:'Help Docs', text_right:'(empty)', function:function(){ console.log('go to help site'); } },
                    {type:'button', text_left:'Development Log', function:function(){window.open('https://raw.githubusercontent.com/metasophiea/curve/master/docs/notes/log');}},
                    {type:'button', text_left:'Github', function:function(){window.open('https://github.com/metasophiea/curve');}},
                    {type:'button', text_left:'Ideas List', function:function(){window.open('https://raw.githubusercontent.com/metasophiea/curve/master/docs/notes/ideas');}},
                    {type:'button', text_left:'Unit Development', function:function(){window.open('https://raw.githubusercontent.com/metasophiea/curve/master/docs/notes/units');}},
                    {type:'button', text_left:'Bug Tracker', function:function(){window.open('https://raw.githubusercontent.com/metasophiea/curve/master/docs/notes/bugs');}},
                ]
            },
        );

    //dev tools
        if(_canvas_.control.interaction.development()){
            _canvas_.control.gui.elements.menubar.dropdowns.push(
                {
                    text:'dev',
                    width:50,
                    listWidth:210,
                    listItemHeight:22.5,
                    breakHeight: 0.5,
                    spaceHeight: 1,
                    itemList:[
                        {type:'button', text_left:'Release All Keyboard Keys', function:function(){ _canvas_.system.keyboard.releaseAll(); } },
                        {type:'button', text_left:'Reset Cursor', function:function(){ _canvas_.core.viewport.cursor('default'); } },
                        {type:'checkbox', text_left:'Limit Frame Rate (30fps)', 
                            updateFunction:_canvas_.core.render.activeLimitToFrameRate, 
                            onclickFunction:function(val){_canvas_.core.render.activeLimitToFrameRate(val);}
                        },
                        { type:'checkbox', text:'No Unload Warning', 
                            updateFunction:function(){return !_canvas_.control.interaction.unloadWarning(); }, 
                            onclickFunction:function(val){ _canvas_.control.interaction.unloadWarning(!val); }
                        },
                        { type:'checkbox', text:'Frame Skipping', 
                            updateFunction:function(){return _canvas_.core.render.allowFrameSkipping(); }, 
                            onclickFunction:function(val){ _canvas_.core.render.allowFrameSkipping(val); }
                        },
                        { type:'checkbox', text:'Stat Readout', 
                            updateFunction:function(){return _canvas_.core.stats.onScreenAutoPrint(); }, 
                            onclickFunction:function(val){ _canvas_.core.stats.onScreenAutoPrint(val); }
                        },
                        {type:'break'}
                    ].concat(
                        _canvas_.layers.getVersionInformation().map(item => {
                            if(item.name[0] == '_'){ item.name = item.name.substr(1); }
                            return {
                                name:item.name,
                                date:item.data.lastDateModified.y+'/'+_canvas_.library.misc.padString(item.data.lastDateModified.m,2,'0')+'/'+_canvas_.library.misc.padString(item.data.lastDateModified.d,2,'0')
                            }
                        } ).map( item => ({type:'text', text_left:item.name, text_centre:'-', text_right:item.date})
                        ).reverse()
                    )
                }
            );
        }

    //push changes to menubar
        _canvas_.control.gui.heavyRefresh();
});