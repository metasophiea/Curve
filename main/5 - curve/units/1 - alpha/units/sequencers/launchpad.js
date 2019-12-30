this.launchpad = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'launchpad/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:1370, height:1200 },
                    design: { width:22.5, height:19.5 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.checkbox = {
                    check: {r:0.56,g:0.42,b:0.61,a:1},
                    backing: {r:0.74,g:0.53,b:0.8,a:1},
                    checkGlow: {r:0.71,g:0.57,b:0.76,a:1},
                    backingGlow: {r:0.84,g:0.63,b:0.95,a:1},
                };
                this.glowbox_circle = {
                    glow: {r:0.97,g:0.89,b:0.99,a:1},
                    dim: {r:0.1,g:0.1,b:0.1,a:1},
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'launchpad',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:(new Array(8).fill(0)).map( (item,y) => {
                return {collection:'dynamic', type:'connectionNode_signal', name:'output_'+y, data:{
                    x:0, y:85/4 + (70/3)*y, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.signal,
                }};
            }).concat([
                {collection:'dynamic', type:'connectionNode_signal', name:'activate_step', data:{ x:unitStyle.drawingValue.width-10/3, y:11.25, width:5, height:10, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'activate_upPage', data:{ x:unitStyle.drawingValue.width-10/3, y:151.25, width:5, height:10, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'activate_downPage', data:{ x:unitStyle.drawingValue.width-10/3, y:175, width:5, height:10, cableVersion:2, style:style.connectionNode.signal }},
    
                {collection:'basic', type:'image', name:'backing', 
                    data:{ 
                        x:-unitStyle.offset/2, y:-unitStyle.offset/2, 
                        width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, 
                        url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                    }
                },
    
                {collection:'control', type:'button_image', name:'step', data:{
                    x:(190+10/3), y:6.66, width:20, height:20, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'step_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'step_down.png',
                }},
                {collection:'control', type:'button_image', name:'upPage', data:{
                    x:(190+10/3), y:146.66, width:20, height:20, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'upPage_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'upPage_down.png',
                }},
                {collection:'control', type:'button_image', name:'downPage', data:{
                    x:(190+10/3), y:170, width:20, height:20, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'downPage_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'downPage_down.png',
                }},
            ]).concat(
                (new Array(8).fill(0)).map( (item,y) => {
                    return {collection:'display', type:'glowbox_circle', name:'LED_'+y, data:{
                        x:(200+10/3), y:40 + (10+10/3)*y, radius:2, style:unitStyle.glowbox_circle,
                    }}
                })
            ).concat(
                (new Array(8).fill(0)).flatMap( (item,y) => {
                    return (new Array(8).fill(0)).map( (item,x) => {
                        return {collection:'control', type:'checkbox_rectangle', name:y+'_'+x, data:{
                            x:(20 + 70*x)/3, y:(20 + 70*y)/3, width:20, height:20, style:unitStyle.checkbox,
                        }};
                    })
                })
            )
        });

    //circuitry
        const state = {
            currentColumn:-1,
            currentPage:0,
            pages:(new Array(8).fill(undefined)).map(() => {
                return (new Array(8).fill(undefined)).map(() => {
                    return (new Array(8).fill(false))
                })
            }),
        };
        function refresh(){
            for(let y = 0; y < 8; y++){
                object.elements.glowbox_circle['LED_'+y].off();
                for(let x = 0; x < 8; x++){
                    object.elements.checkbox_rectangle[y+'_'+x].set( state.pages[state.currentPage][y][x] );
                }
            }
            object.elements.glowbox_circle['LED_'+state.currentPage].on();
        }
        function changeToPage(pageNumber){
            state.currentPage = pageNumber;
            refresh();
        }
        function changeToColumn(column){
            if(state.currentColumn != -1){ for(let y = 0; y < 8; y++){ object.elements.checkbox_rectangle[y+'_'+state.currentColumn].light(false); } }

            state.currentColumn = column;

            for(let y = 0; y < 8; y++){
                object.elements.checkbox_rectangle[y+'_'+state.currentColumn].light(true);
                if( !object.elements.connectionNode_signal['output_'+y].read() && !state.pages[state.currentPage][y][state.currentColumn] ){ continue; }

                object.elements.connectionNode_signal['output_'+y].set(false);
                if( state.pages[state.currentPage][y][state.currentColumn] ){ object.elements.connectionNode_signal['output_'+y].set(true); }
            }
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
        function step(){
            let tmp = state.currentColumn+1; 
            if(tmp > 7){tmp = 0;}
            changeToColumn(tmp);
        }

    //wiring
        //hid
            object.elements.button_image.step.onpress = step;
            object.elements.button_image.upPage.onpress = backPage;
            object.elements.button_image.downPage.onpress = nextPage;
            for(let y = 0; y < 8; y++){ for(let x = 0; x < 8; x++){
                object.elements.checkbox_rectangle[y+'_'+x].onchange = (function(x,y){return function(value){ 
                    state.pages[state.currentPage][y][x] = value; 
                }})(x,y);
            } }
        //io
            object.io.signal.activate_step.onchange = function(value){if(value){step();}};
            object.io.signal.activate_upPage.onchange = function(value){if(value){backPage();}};
            object.io.signal.activate_downPage.onchange = function(value){if(value){nextPage();}};

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

    //import/export
        object.exportData = function(){ return {
            currentPage:state.currentPage,
            currentColumn:state.currentColumn,
            pages:JSON.stringify(state.pages),
        }; };
        object.importData = function(data){
            state.currentColumn = data.currentColumn;
            state.currentPage = data.currentPage;
            state.pages = JSON.parse(data.pages);
            refresh();
        };

    //setup/tearDown
        object.oncreate = function(){
            changeToPage(0);
        };

    return object;
};
this.launchpad.metadata = {
    name:'Launchpad',
    category:'sequencers',
    helpURL:'/help/units/beta/launchpad/'
};