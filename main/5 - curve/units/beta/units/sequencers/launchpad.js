this.launchpad = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'launchpad/';
    var colour = {
        checkbox:{
            check:{r:0.56,g:0.42,b:0.61,a:1},
            backing:{r:0.74,g:0.53,b:0.8,a:1},
            checkGlow:{r:0.56+0.15,g:0.42+0.15,b:0.61+0.15,a:1},
            backingGlow:{r:0.74+0.1,g:0.53+0.1,b:0.8+0.15,a:1},
        }
    }

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:1370, height:1200 },
        design:{ width:22.5, height:19.5 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    
    var design = {
        name:'launchpad',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                     },
            { x:measurements.drawing.width -offset, y:0                                     },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset   },
            { x:0,                                  y:measurements.drawing.height -offset   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_signal', name:'activate_step', data:{ 
                x:measurements.drawing.width-3.5, y:6.65 + 4.6, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
                onchange:function(value){if(value){step();}},
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'activate_upPage', data:{ 
                x:measurements.drawing.width-3.5, y:6.65+140 + 4.6, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
                onchange:function(value){if(value){backPage();}},
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'activate_downPage', data:{ 
                x:measurements.drawing.width-3.5, y:6.65+163.35 + 4.6, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
                onchange:function(value){if(value){nextPage();}},
            }},

            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'guide.png' }
            },

            {collection:'control', type:'button_image', name:'step', data:{
                x:193.35, y:6.65, width:20, height:20, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'step_up.png',
                backingURL__press:imageStoreURL_localPrefix+'step_down.png',
                onpress:step,
            }},
            {collection:'control', type:'button_image', name:'upPage', data:{
                x:193.35, y:6.65+140, width:20, height:20, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'upPage_up.png',
                backingURL__press:imageStoreURL_localPrefix+'upPage_down.png',
                onpress:backPage,
            }},
            {collection:'control', type:'button_image', name:'downPage', data:{
                x:193.35, y:6.65+163.35, width:20, height:20, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'downPage_up.png',
                backingURL__press:imageStoreURL_localPrefix+'downPage_down.png',
                onpress:nextPage,
            }},
        ]
    };
    //dynamic design
        for(var y = 0; y < 8; y++){
            design.elements.unshift(
                {collection:'dynamic', type:'connectionNode_signal', name:'output_'+y, data:{
                    x:0, y:6.65+4.6+10 + 23.34*y, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.signal,
                }},
            );

            design.elements.push(
                {collection:'display', type:'glowbox_circle', name:'LED_'+y, data:{
                    x:203.35, y:40 + 13.33*y, radius:2,
                    style:{glow:{r:0.97,g:0.89,b:0.99,a:1},dim:{r:0.1,g:0.1,b:0.1,a:1}},
                }}
            );

            for(var x = 0; x < 8; x++){
                design.elements.push(
                    {collection:'control', type:'checkbox_rectangle', name:y+'_'+x, data:{
                        x:6.65 + 23.34*x, y:6.65 + 23.34*y, width:20, height:20, 
                        style:{ check:colour.checkbox.check, backing:colour.checkbox.backing, checkGlow:colour.checkbox.checkGlow, backingGlow:colour.checkbox.backingGlow },
                        onchange:(function(x,y){return function(value){ state.pages[state.currentPage][y][x] = value; }})(x,y),
                    }}
                );
            }
        }
    
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //circuitry
        var state = {
            currentColumn:-1,
            currentPage:0,
            pages:[],
        };

        //populate pages
            for(var page = 0; page < 8; page++){
                state.pages.push([]);
                for(var y = 0; y < 8; y++){
                    state.pages[page].push([]);
                    for(var x = 0; x < 8; x++){
                        state.pages[page][y].push(false);
                    }
                }
            }

        function refresh(){
            for(var y = 0; y < 8; y++){
                object.elements.glowbox_circle['LED_'+y].off();
                for(var x = 0; x < 8; x++){
                    object.elements.checkbox_rectangle[y+'_'+x].set( state.pages[state.currentPage][y][x] );
                }
            }
            object.elements.glowbox_circle['LED_'+state.currentPage].on();
        }
        function changeToColumn(column){
            state.currentColumn = column;

            for(var x = 0; x < 8; x++){
                for(var y = 0; y < 8; y++){
                    object.elements.checkbox_rectangle[y+'_'+x].light(false);
                }
            }

            for(var y = 0; y < 8; y++){
                object.elements.connectionNode_signal['output_'+y].set(false);
                object.elements.checkbox_rectangle[y+'_'+state.currentColumn].light(true);
                if( state.pages[state.currentPage][y][state.currentColumn] ){
                    object.elements.connectionNode_signal['output_'+y].set(true);
                }
            }
        }
        function step(){
            state.currentColumn++; if(state.currentColumn > 7){state.currentColumn = 0;}
            changeToColumn(state.currentColumn);
        }
        function changeToPage(pageNumber){
            state.currentPage = pageNumber;
            refresh();
        }
        function nextPage(){
            state.currentPage++;
            if(state.currentPage > 7){state.currentPage = 0}
            changeToPage(state.currentPage);
        }
        function backPage(){
            state.currentPage--;
            if(state.currentPage < 0){state.currentPage = 7}
            changeToPage(state.currentPage);
        }

        changeToPage(0);

    //import/export
        object.exportData = function(){ return {
            currentPage:state.currentPage,
            currentColumn:state.currentColumn,
            pages:JSON.stringify(state.pages),
        }; };
        object.importData = function(data){
            state = {
                currentColumn:data.currentColumn,
                currentPage:data.currentPage,
                pages:JSON.parse(data.pages),
            };
            refresh();
        };

    //interface
        object.i = {
            getPages:function(){return state.pages;},
            currentPage:function(value){
                if(value==undefined){return state.currentPage;}
                changeToPage(value);
            },
            columnPosition:function(value){
                if(value==undefined){return state.currentColumn;}
                changeToColumn(value);
            },
            step:step,
            data:function(page,x,y,value){
                if(page == undefined || x == undefined || y == undefined){return;}
                if(value == undefined){ return state.pages[page][y][x]; }
                state.pages[page][y][x] = value;
                refresh();
            }
        };
        
    return object;
};



this.launchpad.metadata = {
    name:'Launchpad',
    category:'sequencers',
    helpURL:'/help/units/beta/launchpad/'
};