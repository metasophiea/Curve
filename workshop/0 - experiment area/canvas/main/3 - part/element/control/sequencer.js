this.sequencer = function(
    name='sequencer',
    x, y, width=300, height=100, angle=0,
    
    xCount=64, yCount=16,
    zoomLevel_x=1/2, zoomLevel_y=1/2,

    backingStyle='rgba(20,20,20,1)',
    selectionAreaStyle='rgba(209, 189, 222, 1)',

    blockStyle_body=[
        {fill:'rgba(138,138,138,0.6)', stroke:'rgba(175,175,175,0.95)', lineWidth:0.5},
        {fill:'rgba(130,199,208,0.6)', stroke:'rgba(130,199,208,0.95)', lineWidth:0.5},
        {fill:'rgba(129,209,173,0.6)', stroke:'rgba(129,209,173,0.95)', lineWidth:0.5},
        {fill:'rgba(234,238,110,0.6)', stroke:'rgba(234,238,110,0.95)', lineWidth:0.5},
        {fill:'rgba(249,178,103,0.6)', stroke:'rgba(249,178,103,0.95)', lineWidth:0.5},
        {fill:'rgba(255, 69, 69,0.6)', stroke:'rgba(255, 69, 69,0.95)', lineWidth:0.5},
    ],
    blockStyle_bodyGlow=[
        {fill:'rgba(138,138,138,0.8)', stroke:'rgba(175,175,175,1)', lineWidth:0.5},
        {fill:'rgba(130,199,208,0.8)', stroke:'rgba(130,199,208,1)', lineWidth:0.5},
        {fill:'rgba(129,209,173,0.8)', stroke:'rgba(129,209,173,1)', lineWidth:0.5},
        {fill:'rgba(234,238,110,0.8)', stroke:'rgba(234,238,110,1)', lineWidth:0.5},
        {fill:'rgba(249,178,103,0.8)', stroke:'rgba(249,178,103,1)', lineWidth:0.5},
        {fill:'rgba(255, 69, 69,0.8)', stroke:'rgba(255, 69, 69,1)', lineWidth:0.5},
    ],    
    blockStyle_handle='rgba(200,0,0,0)',
    blockStyle_handleWidth=3,

    horizontalStripStyle_pattern=[0,1],
    horizontalStripStyle_glow={fill:'rgba(120,120,120,0.8)', stroke:'rgba(120,120,120,1)', lineWidth:0.5},
    horizontalStripStyle_styles=[
        {fill:'rgba(120,120,120,0.5)', stroke:'rgba(120,120,120,1)', lineWidth:0.5},
        {fill:'rgba(100,100,100,  0)', stroke:'rgba(120,120,120,1)', lineWidth:0.5},
    ],
    verticalStripStyle_pattern=[0],
    verticalStripStyle_glow={fill:'rgba(229, 221, 112,0.25)', stroke:'rgba(252,244,128,0.5)', lineWidth:0.5},
    verticalStripStyle_styles=[
        {fill:'rgba(30,30,30,0.5)', stroke:'rgba(120,120,120,1)', lineWidth:0.5},
    ],

    playheadStyle='rgb(240, 240, 240)',

    onpan=function(data){},
    onchangeviewarea=function(data){},
    event=function(events){},
){

    //settings
        const viewport = {
            totalSize:{
                width:  width/zoomLevel_x,
                height: height/zoomLevel_y,
            },
            viewposition: {x:0,y:0},
            viewArea:{
                topLeft:     {x:0, y:0},
                bottomRight: {x:zoomLevel_x, y:zoomLevel_y},
            }
        };
        const blocks = {
            step:1/1,
            snapping: true,
            defaultStrength: 0.5,
            selectedBlocks: [],
            activeBlocks: [],
            blockRegistry: new canvas.library.structure.blockRegistry(xCount,yCount),
        };
        const loop = {
            active:false, 
            period:{
                start:0, 
                end:xCount
            },
        };
        const playhead = {
            present:false,
            width:0.75,
            invisibleHandleMux:4,
            position:-1,
            held:false,
            automoveViewposition:false,
        };




    
    //elements 
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        //static backing
            var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{fill:backingStyle}});
            object.append(backing);
        //viewport stencil
            var stencil = canvas.part.builder('rectangle','stencil',{width:width, height:height});
            object.stencil(stencil);
            object.clip(true);

        //workarea
            var workarea = canvas.part.builder('group','workarea');
            object.append(workarea);
            //moveable background
                var backgroundDrawArea = canvas.part.builder('group','backgroundDrawArea');
                workarea.append(backgroundDrawArea);
                var backgroundDrawArea_horizontal = canvas.part.builder('group','backgroundDrawArea_horizontal');
                backgroundDrawArea.append(backgroundDrawArea_horizontal);
                var backgroundDrawArea_vertical = canvas.part.builder('group','backgroundDrawArea_vertical');
                backgroundDrawArea.append(backgroundDrawArea_vertical);
            //interaction pane
                var interactionPlane = canvas.part.builder('rectangle','interactionPlane',{width:viewport.totalSize.width, height:viewport.totalSize.height, style:{fill:'rgba(0,0,0,0)'}});
                workarea.append(interactionPlane);
                interactionPlane.onwheel = function(x,y,event){};
            //block block area
                var blockPane = canvas.part.builder('group','blockPane');
                workarea.append(blockPane);

    //internal
        object.__calculationAngle = angle;
        function currentMousePosition(event){
            return {
                x: (event.x*Math.cos(object.__calculationAngle) - event.y*Math.sin(object.__calculationAngle)) / width,
                y: (event.y*Math.cos(object.__calculationAngle) - event.x*Math.sin(object.__calculationAngle)) / height,
            };
        }
        function visible2coordinates(xy){
            return {
                x: zoomLevel_x*(xy.x - viewport.viewposition.x) + viewport.viewposition.x,
                y: zoomLevel_y*(xy.y - viewport.viewposition.y) + viewport.viewposition.y,
            };
        }
        function coordinates2lineposition(xy){
            xy.y = Math.floor(xy.y*yCount);
            if(xy.y >= yCount){xy.y = yCount-1;}
        
            xy.x = blocks.snapping ? Math.round((xy.x*xCount)/step)*step : xy.x*xCount;
            if(xy.x < 0){xy.x =0;}
        
            return {line:xy.y, position:xy.x};
        }
        function drawBackground(){
            //horizontal strips
                backgroundDrawArea_horizontal.clear();
                for(var a = 0; a < yCount; a++){
                    var style = horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]];
                    backgroundDrawArea_horizontal.append(
                        canvas.part.builder( 'rectangle', 'strip_horizontal_'+a,
                            {
                                x:0, y:a*(height/(yCount*zoomLevel_y)),
                                width:viewport.totalSize.width, height:height/(yCount*zoomLevel_y),
                                style:{ fill:style.fill, stroke:style.stroke, lineWidth:style.lineWidth }
                            }
                        )
                    );
                }

            //vertical strips
                backgroundDrawArea_vertical.clear();
                for(var a = 0; a < xCount; a++){
                    var style = verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]];
                    backgroundDrawArea_vertical.append(
                        canvas.part.builder( 'rectangle', 'strip_vertical_'+a,
                            {
                                x:a*(width/(xCount*zoomLevel_x)), y:0,
                                width:width/(xCount*zoomLevel_x), height:viewport.totalSize.height,
                                style:{ fill:style.fill, stroke:style.stroke, lineWidth:style.lineWidth }
                            }
                        )
                    );
                }
        }
        function setViewposition(x,y,update=true){
            if(x == undefined && y == undefined){return viewport.viewposition;}
            if(x == undefined || isNaN(x)){ x = viewport.viewposition.x; }
            if(y == undefined || isNaN(y)){ y = viewport.viewposition.y; }

            //make sure things are between 0 and 1
                x = x<0?0:x; x = x>1?1:x;
                y = y<0?0:y; y = y>1?1:y;

            //perform transform
                viewport.viewposition.x = x;
                viewport.viewposition.y = y;
                workarea.parameter.x( -viewport.viewposition.x*(viewport.totalSize.width - width) );
                workarea.parameter.y( -viewport.viewposition.y*(viewport.totalSize.height - height) );

            //update viewport.viewArea
                viewport.viewArea = {
                    topLeft:     { x:x - zoomLevel_x*x,     y:y - zoomLevel_y*y     },
                    bottomRight: { x:x + zoomLevel_x*(1-x), y:y + zoomLevel_y*(1-y) },
                };
        }
        function adjustZoom(x,y){
            if(x == undefined && y == undefined){return {x:zoomLevel_x, y:zoomLevel_y};}
            var maxZoom = 0.01;

            //(in a bid for speed, I've written the following code in an odd way, so that if both x and y scales are being changed, then
            //all the elements will be adjusted together (instead of having to repeat resizings of shapes))
            if(x != undefined && x != zoomLevel_x && y != undefined && y != zoomLevel_y ){
                //make sure things are between 0.01 and 1
                    x = x<maxZoom?maxZoom:x; x = x>1?1:x;
                    y = y<maxZoom?maxZoom:y; y = y>1?1:y;

                //update state
                    zoomLevel_x = x;
                    zoomLevel_y = y;
                    viewport.totalSize.width = width/zoomLevel_x;
                    viewport.totalSize.height = height/zoomLevel_y;

                //update interactionPlane
                    interactionPlane.parameter.width( viewport.totalSize.width );
                    interactionPlane.parameter.height( viewport.totalSize.width );

                //update background strips
                    for(var a = 0; a < xCount; a++){
                        backgroundDrawArea_vertical.children[a].parameter.x( a*(width/(xCount*zoomLevel_x)) );
                        backgroundDrawArea_vertical.children[a].parameter.width( width/(xCount*zoomLevel_x) );
                        backgroundDrawArea_vertical.children[a].parameter.height( viewport.totalSize.height );
                    }
                    for(var a = 0; a < yCount; a++){
                        backgroundDrawArea_horizontal.children[a].parameter.y( a*(height/(yCount*zoomLevel_y)) );
                        backgroundDrawArea_horizontal.children[a].parameter.height( height/(yCount*zoomLevel_y) );
                        backgroundDrawArea_horizontal.children[a].parameter.width( viewport.totalSize.width );
                    }

                //update blocks
                    for(var a = 0; a < blockPane.children.length; a++){
                        blockPane.children[a].unit(width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y));
                    }

                //update playhead (if there is one)
                    if(playhead.present){
                        workarea.getElementsWithName('playhead')[0].getElementsWithName('main')[0].parameter.height(viewport.totalSize.height);
                        workarea.getElementsWithName('playhead')[0].getElementsWithName('invisibleHandle')[0].parameter.height(viewport.totalSize.height);
                        workarea.getElementsWithName('playhead')[0].parameter.x( playhead.position*(viewport.totalSize.width/xCount) );
                }
            }else if( x != undefined && x != zoomLevel_x ){
                //make sure things are between maxZoom and 1
                    x = x<maxZoom?maxZoom:x; x = x>1?1:x;

                //update state
                    zoomLevel_x = x;
                    viewport.totalSize.width = width/zoomLevel_x;

                //update interactionPlane
                    interactionPlane.parameter.width( viewport.totalSize.width );

                //update background strips
                    for(var a = 0; a < xCount; a++){
                        backgroundDrawArea_vertical.children[a].parameter.x( a*(width/(xCount*zoomLevel_x)) );
                        backgroundDrawArea_vertical.children[a].parameter.width( width/(xCount*zoomLevel_x) );
                    }
                    for(var a = 0; a < yCount; a++){
                        backgroundDrawArea_horizontal.children[a].parameter.width( viewport.totalSize.width );
                    }

                //update blocks
                    for(var a = 0; a < blockPane.children.length; a++){
                        blockPane.children[a].unit(width/(xCount*zoomLevel_x), undefined);
                    }

                //update playhead (if there is one)
                    if(playhead.present){
                        workarea.getElementsWithName('playhead')[0].parameter.x( playhead.position*(viewport.totalSize.width/xCount) );
                    }
            }else if( y != undefined && y != zoomLevel_y ){
                //make sure things are between maxZoom and 1
                    y = y<maxZoom?maxZoom:y; y = y>1?1:y;

                //update state
                    zoomLevel_y = y;
                    viewport.totalSize.height = height/zoomLevel_y;

                //update interactionPlane
                    interactionPlane.parameter.height( viewport.totalSize.width );
                
                //update background strips
                    for(var a = 0; a < xCount; a++){
                        backgroundDrawArea_vertical.children[a].parameter.height( viewport.totalSize.height );
                    }
                    for(var a = 0; a < yCount; a++){
                        backgroundDrawArea_horizontal.children[a].parameter.y( a*(height/(yCount*zoomLevel_y)) );
                        backgroundDrawArea_horizontal.children[a].parameter.height( height/(yCount*zoomLevel_y) );
                    }

                //update blocks
                    for(var a = 0; a < blockPane.children.length; a++){
                        blockPane.children[a].unit(undefined, height/(yCount*zoomLevel_y));
                    }

                //update playhead (if there is one)
                    if(playhead.present){
                        workarea.getElementsWithName('playhead')[0].getElementsWithName('main')[0].parameter.height(viewport.totalSize.height);
                        workarea.getElementsWithName('playhead')[0].getElementsWithName('invisibleHandle')[0].parameter.height(viewport.totalSize.height);
                    }
            }
        }
        function setViewArea(d,update=true){
            //clean off input
                if(d == undefined || (d.topLeft == undefined && d.bottomRight == undefined)){return viewport.viewArea;}
                if(d.topLeft == undefined){ d.topLeft.x = viewport.viewArea.topLeft.x; d.topLeft.y = viewport.viewArea.topLeft.y; }
                if(d.bottomRight == undefined){ d.bottomRight.x = viewport.viewArea.topLeft.x; d.bottomRight.y = viewport.viewArea.topLeft.y; }

            //first adjust the zoom, if the distance between the areas changed
                var x = (viewport.viewArea.bottomRight.x-viewport.viewArea.topLeft.x) != (d.bottomRight.x-d.topLeft.x);
                var y = (d.bottomRight.y-d.topLeft.y)!=(viewport.viewArea.bottomRight.y-viewport.viewArea.topLeft.y);
                
                if(x && y){ adjustZoom( (d.bottomRight.x-d.topLeft.x),(d.bottomRight.y-d.topLeft.y) ); }
                else if(x){ adjustZoom( (d.bottomRight.x-d.topLeft.x),undefined ); }
                else if(y){ adjustZoom( undefined,(d.bottomRight.y-d.topLeft.y) ); }

            //update pan
                var newX = 0; var newY = 0;
                if( (1-(d.bottomRight.x-d.topLeft.x)) != 0 ){ newX = d.topLeft.x + d.topLeft.x*((d.bottomRight.x-d.topLeft.x)/(1-(d.bottomRight.x-d.topLeft.x))); }
                if( (1-(d.bottomRight.y-d.topLeft.y)) != 0 ){ newY = d.topLeft.y + d.topLeft.y*((d.bottomRight.y-d.topLeft.y)/(1-(d.bottomRight.y-d.topLeft.y))); }
                setviewport.viewposition(newX,newY,update);

            //update state
                viewport.viewArea = Object.assign(d,{});
        }
        function makePlayhead(){
            var newPlayhead = canvas.part.builder('group','playhead');
            workarea.append(newPlayhead);

            newPlayhead.main = canvas.part.builder('rectangle','main',{
                width:playhead.width,
                height:viewport.totalSize.height,
                style:{ fill:playheadStyle },
            });
            newPlayhead.append(newPlayhead.main);

            newPlayhead.invisibleHandle = canvas.part.builder('rectangle','invisibleHandle',{
                x:-playhead.width*playhead.invisibleHandleMux/2 + playhead.width/2, 
                width: playhead.width*playhead.invisibleHandleMux,
                height:viewport.totalSize.height,
                style:{ fill:'rgba(255,0,0,0.5)' },
            })
            newPlayhead.append(newPlayhead.invisibleHandle);

            newPlayhead.invisibleHandle.onmousedown = function(){
                playhead.held = true;
                canvas.system.mouse.mouseInteractionHandler(
                    function(event){ object.playheadPosition( coordinates2lineposition(currentMousePosition()).position ); },
                    function(){playhead.held = false;}
                );
            };

            newPlayhead.invisibleHandle.onmouseenter = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
            newPlayhead.invisibleHandle.onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};

            playhead.present = true;
        }
        function makeNote(line, position, length, strength=defaultStrength){
            //register block and get new id. From the registry, get the approved block values
                var newID = blocks.blockRegistry.add({ line:line, position:position, length:length, strength:strength });
                var approvedData = blocks.blockRegistry.getNote(newID);

            //create graphical block with approved values and append it to the pane
                var newEventBlock = canvas.part.element.control.sequencer.eventBlock(newID, width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y), approvedData.line, approvedData.position, approvedData.length, approvedData.strength, false, blockStyle_body, blockStyle_bodyGlow, blockStyle_handle, blockStyle_handleWidth);
                blockPane.append(newEventBlock);

            //add block controls to graphical block
                newEventBlock.select = function(remainSelected=false){};
                newEventBlock.deselect = function(){};
                newEventBlock.delete = function(){};
                newEventBlock.ondblclick = function(event){};
                newEventBlock.body.onmousedown = function(event){};
                newEventBlock.leftHandle.onmousedown = function(event){};
                newEventBlock.rightHandle.onmousedown = function(event){};

            return {id:newID, noteBlock:newEventBlock};
        }

    //controls
        object.viewport = setViewposition;
        object.viewarea = setViewArea;

        //background
            object.glowHorizontal = function(state,start,end){
                if(end == undefined){end = start+1;}

                for(var a = start; a <= end; a++){
                    var tmp = state ? horizontalStripStyle_glow : horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]];
                    backgroundDrawArea_horizontal.children[a].style.fill = tmp.fill;
                    backgroundDrawArea_horizontal.children[a].style.stroke = tmp.stroke;
                    backgroundDrawArea_horizontal.children[a].style.lineWidth = tmp.lineWidth;
                }
            };
            object.glowVertical = function(state,start,end){
                if(end == undefined){end = start+1;}

                for(var a = start; a <= end; a++){
                    var tmp = state ? verticalStripStyle_glow : verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]];
                    backgroundDrawArea_vertical.children[a].style.fill = tmp.fill;
                    backgroundDrawArea_vertical.children[a].style.stroke = tmp.stroke;
                    backgroundDrawArea_vertical.children[a].style.lineWidth = tmp.lineWidth;
                }
            };
        
        //looping
            object.loopActive = function(bool){
                if(bool == undefined){return loop.active;}
                loop.active = bool;

                object.glowVertical(false,0,xCount);
                if( loop.active ){
                    object.glowVertical(true, 
                        loop.period.start < 0 ? 0 : loop.period.start, 
                        loop.period.end > xCount ? xCount : loop.period.end,
                    );
                }
            };
            object.loopPeriod = function(start,end){
                if(start == undefined || end == undefined){return loop.period;}
                if(start > end || start < 0 || end < 0){return;}

                loop.period = {start:start, end:end};

                if( loop.active ){
                    object.glowVertical(false,0,xCount);
                    object.glowVertical(true,
                        start < 0 ? 0 : start, 
                        end > xCount ? xCount : end,
                    );
                }
            };

        //playhead
            object.automove = function(bool){
                if(bool == undefined){return playhead.automoveViewposition;}
                playhead.automoveViewposition = bool;
            };
            object.playheadPosition = function(val,stopActive=true){
                if(val == undefined){return playhead.position;}
    
                playhead.position = val;
    
                //send stop events for all active blocks
                    if(stopActive){
                        var events = [];
                        for(var a = 0; a < blocks.activeBlocks.length; a++){
                            var tmp = blockRegistry.getBlock(blocks.activeBlocks[a]); if(tmp == null){continue;}
                            events.unshift( {blockID:blocks.activeBlocks[a], line:tmp.line, position:loop.period.start, strength:0} );
                        }
                        blocks.activeBlocks = [];
                        if(object.event && events.length > 0){object.event(events);}
                    }
    
                //reposition graphical playhead
                    if(playhead.position < 0 || playhead.position > xCount){
                        //outside viable bounds, so remove
                        if( playhead.present ){ workarea.remove(workarea.getElementsWithName('playhead')[0]); playhead.present = false; }
                    }else{ 
                        //within viable bounds, so either create or adjust
                        if( !playhead.present ){ makePlayhead(); }
                        workarea.getElementsWithName('playhead')[0].parameter.x( 
                            playhead.position*(viewport.totalSize.width/xCount) - playhead.width/2
                        );

                        //if the new position is beyond the view in the viewport, adjust the viewport (putting the playhead on the leftmost side)
                        //(assuming automoveViewposition is set)
                        if(playhead.automoveViewposition){
                            var remainderSpace = xCount-(xCount*zoomLevel_x);
                            if( playhead.position < Math.floor(viewposition.x*remainderSpace)   || 
                                playhead.position > Math.floor(viewposition.x*remainderSpace) + (xCount*zoomLevel_x)  
                            ){ object.viewposition( (playhead.position > remainderSpace ? remainderSpace : playhead.position)/remainderSpace ); }
                        }
                    }
            };
            object.progress = function(){
                //if the playhead is being held, just bail completely
                    if(playhead.held){return;}
                    
                //if there's no playhead; create one and set its position to 0
                    if(!playhead.present){makePlayhead(); playhead.position = 0; }
    
                //gather together all the current events
                    var events = object.eventsBetween(playhead.position, playhead.position+blocks.step);
    
                //upon loop; any blocks that are still active are to be ended
                //(so create end events for them, and push those into the current events list)
                    if(loop.active && playhead.position == loop.period.start){
                        for(var a = 0; a < blocks.activeBlocks.length; a++){
                            var tmp = blockRegistry.getBlock(activeBlocks[a]); if(tmp == null){continue;}
                            events.unshift( {blockID:blocks.activeBlocks[a], line:tmp.line, position:loop.period.start, strength:0} );
                        }
                        blocks.activeBlocks = [];
                    }
    
                //add newly started blocks to - and remove newly finished blocks from - 'blocks.activeBlocks'
                    for(var a = 0; a < events.length; a++){
                        var index = blocks.activeBlocks.indexOf(events[a].blockID);
                        if(index != -1 && events[a].strength == 0){
                            blocks.activeBlocks.splice(index);
                        }else{
                            if( events[a].strength > 0 ){
                                blocks.activeBlocks.push(events[a].blockID);
                            }
                        }
                    }
    
                //progress position
                    if( loop.active && (playhead.position+blocks.step == loop.period.end) ){
                        playhead.position = loop.period.start;
                    }else{
                        playhead.position = playhead.position+step;
                    }
    
                //update graphical playhead
                    object.playheadPosition(playhead.position,false);
    
                //perform event callback
                    if(object.event && events.length > 0){object.event(events);}
            };

        //blocks
            object.addBlock = function(line, position, length, strength=1){ makeNote(line, position, length, strength); };

    //interaction
        interactionPlane.onmousedown = function(x,y,event){
            if(event.shiftKey){ //click-n-drag group select
            }else if(event.altKey){ //create block
            }else if(canvas.system.keyboard.pressedKeys.Space){//panning
                var initialPosition = currentMousePosition(event);
                var old_viewport = {x:viewport.viewposition.x, y:viewport.viewposition.y};
                canvas.system.mouse.mouseInteractionHandler(
                    function(event){
                        var livePosition = currentMousePosition(event);
                        var diffPosition = {x:initialPosition.x-livePosition.x, y:initialPosition.y-livePosition.y};
                        var scale = canvas.core.viewport.scale();
                        setViewposition(
                            old_viewport.x - (diffPosition.x*zoomLevel_x)/((zoomLevel_x-1)*scale),
                            old_viewport.y - (diffPosition.y*zoomLevel_y)/((zoomLevel_y-1)*scale),
                        );
                    },
                    function(event){},
                );
            }else{//elsewhere click
                //deselect everything
                    while(blocks.selectedblocks.length > 0){
                        blocks.selectedblocks[0].deselect();
                    }
            }
        };

    //callbacks
        object.onpan = onpan;
        object.onchangeviewarea = onchangeviewarea;
        object.event = event;

    //setup
        drawBackground();

    return object;
};








this.sequencer.eventBlock = function(
    name, unit_x, unit_y,
    line, position, length, strength=1, glow=false, 
    bodyStyle=[
        {fill:'rgba(138,138,138,0.6)',stroke:'rgba(175,175,175,0.8)', lineWidth:0.5},
        {fill:'rgba(130,199,208,0.6)',stroke:'rgba(130,199,208,0.8)', lineWidth:0.5},
        {fill:'rgba(129,209,173,0.6)',stroke:'rgba(129,209,173,0.8)', lineWidth:0.5},
        {fill:'rgba(234,238,110,0.6)',stroke:'rgba(234,238,110,0.8)', lineWidth:0.5},
        {fill:'rgba(249,178,103,0.6)',stroke:'rgba(249,178,103,0.8)', lineWidth:0.5},
        {fill:'rgba(255, 69, 69,0.6)',stroke:'rgba(255, 69, 69,0.8)', lineWidth:0.5},
    ],
    bodyGlowStyle=[
        {fill:'rgba(138,138,138,0.8)',stroke:'rgba(175,175,175,1)',lineWidth:0.5},
        {fill:'rgba(130,199,208,0.8)',stroke:'rgba(130,199,208,1)',lineWidth:0.5},
        {fill:'rgba(129,209,173,0.8)',stroke:'rgba(129,209,173,1)',lineWidth:0.5},
        {fill:'rgba(234,238,110,0.8)',stroke:'rgba(234,238,110,1)',lineWidth:0.5},
        {fill:'rgba(249,178,103,0.8)',stroke:'rgba(249,178,103,1)',lineWidth:0.5},
        {fill:'rgba(255, 69, 69,0.8)',stroke:'rgba(255, 69, 69,1)',lineWidth:0.5},
    ],
    handleStyle='rgba(255,0,255,0)',
    handleWidth=5,
){
    var selected = false;
    var minLength = handleWidth/4;
    var currentStyles = {
        body:getBlendedColour(bodyStyle,strength),
        glow:getBlendedColour(bodyGlowStyle,strength),
    };
    
    //elements
        var obj = canvas.part.builder('group',String(name),{x:position*unit_x, y:line*unit_y});
        obj.body = canvas.part.builder('rectangle','body',{width:length*unit_x, height:unit_y, style:currentStyles.body});
        obj.leftHandle = canvas.part.builder('rectangle','leftHandle',{x:-handleWidth/2, width:handleWidth, height:unit_y, style:{fill:handleStyle}});
        obj.rightHandle = canvas.part.builder('rectangle','rightHandle',{x:length*unit_x-handleWidth/2, width:handleWidth, height:unit_y, style:{fill:handleStyle}});
        obj.append(obj.body);
        obj.append(obj.leftHandle);
        obj.append(obj.rightHandle);

    //internal functions
        function updateHeight(){
            obj.body.parameter.height(unit_y);
            obj.leftHandle.parameter.height(unit_y);
            obj.rightHandle.parameter.height(unit_y);
        }
        function updateLength(){
            obj.body.parameter.width(length*unit_x);
            obj.rightHandle.parameter.x(length*unit_x-handleWidth/2);
        }
        function updateLineAndPosition(){ updateLine(); updatePosition(); }
        function updateLine(){ obj.parameter.y(line*unit_y); }
        function updatePosition(){ obj.parameter.x(position*unit_x); }
        function getBlendedColour(swatch,ratio){
            var outputStyle = swatch[0];

            //if there's a fill attribute; blend it and add it to the template
                if( swatch[0].hasOwnProperty('fill') ){
                    outputStyle.fill = canvas.library.misc.multiBlendColours(swatch.map(a => a.fill),ratio);
                }

            //if there's a stroke attribute; blend it and add it to the template
                if( swatch[0].hasOwnProperty('stroke') ){
                    outputStyle.stroke = canvas.library.misc.multiBlendColours(swatch.map(a => a.stroke),ratio);
                }

            //pack up the template and return
                return outputStyle;
        }

    //controls
        obj.unit = function(x,y){
            if(x == undefined && y == undefined){return {x:unit_x,y:unit_y};}
            //(awkward bid for speed)
            else if( x == undefined ){
                unit_y = y;
                updateHeight();
                updateLine();
            }else if( y == undefined ){
                unit_x = x;
                updateLength();
                updatePosition();
            }else{
                unit_x = x;
                unit_y = y;
                updateHeight();
                updateLength();
                updateLineAndPosition();
            }
        };
        obj.line = function(a){
            if(a == undefined){return line;}
            line = a;
            updateLine();
        };
        obj.position = function(a){
            if(a == undefined){return position;}
            position = a;
            updatePosition();
        };
        obj.length = function(a){
            if(a == undefined){return length;}
            length = a < (minLength/unit_x) ? (minLength/unit_x) : a;
            updateLength();
        };
        obj.strength = function(a){
            if(a == undefined){return strength;}
            a = a > 1 ? 1 : a; a = a < 0 ? 0 : a;
            strength = a;
            currentStyles = {
                body:getBlendedColour(bodyStyle,strength),
                glow:getBlendedColour(bodyGlowStyle,strength),
            };
            obj.glow(glow);
        };
        obj.glow = function(a){
            if(a == undefined){return glow;}
            glow = a;
            if(glow){ obj.body.style = currentStyles.glow; }
            else{     obj.body.style = currentStyles.body; }
        };
        obj.selected = function(a){
            if(a == undefined){return selected;}
            selected = a;
        };

    return obj;
};