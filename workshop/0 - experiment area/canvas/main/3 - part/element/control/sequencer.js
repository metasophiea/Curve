this.sequencer = function(
    name='sequencer',
    x, y, width=300, height=100, angle=0,
    
    xCount=64, yCount=16,
    zoomLevel_x=1/2, zoomLevel_y=1/2,

    backingStyle='rgba(20,20,20,1)',
    selectionAreaStyle='rgba(209, 189, 222, 0.5)',

    signalStyle_body=[
        {fill:'rgba(138,138,138,0.6)', stroke:'rgba(175,175,175,0.95)', lineWidth:0.5},
        {fill:'rgba(130,199,208,0.6)', stroke:'rgba(130,199,208,0.95)', lineWidth:0.5},
        {fill:'rgba(129,209,173,0.6)', stroke:'rgba(129,209,173,0.95)', lineWidth:0.5},
        {fill:'rgba(234,238,110,0.6)', stroke:'rgba(234,238,110,0.95)', lineWidth:0.5},
        {fill:'rgba(249,178,103,0.6)', stroke:'rgba(249,178,103,0.95)', lineWidth:0.5},
        {fill:'rgba(255, 69, 69,0.6)', stroke:'rgba(255, 69, 69,0.95)', lineWidth:0.5},
    ],
    signalStyle_bodyGlow=[
        {fill:'rgba(138,138,138,0.8)', stroke:'rgba(175,175,175,1)', lineWidth:0.5},
        {fill:'rgba(130,199,208,0.8)', stroke:'rgba(130,199,208,1)', lineWidth:0.5},
        {fill:'rgba(129,209,173,0.8)', stroke:'rgba(129,209,173,1)', lineWidth:0.5},
        {fill:'rgba(234,238,110,0.8)', stroke:'rgba(234,238,110,1)', lineWidth:0.5},
        {fill:'rgba(249,178,103,0.8)', stroke:'rgba(249,178,103,1)', lineWidth:0.5},
        {fill:'rgba(255, 69, 69,0.8)', stroke:'rgba(255, 69, 69,1)', lineWidth:0.5},
    ],    
    signalStyle_handle='rgba(200,0,0,0)',
    signalStyle_handleWidth=3,

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
        const signals = {
            step:1/1,
            snapping: true,
            defaultStrength: 0.5,
            selectedSignals: [],
            activeSignals: [],
            signalRegistry: new canvas.library.structure.signalRegistry(xCount,yCount),
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
            //interaction pane back
                var interactionPlane_back = canvas.part.builder('rectangle','interactionPlane_back',{width:viewport.totalSize.width, height:viewport.totalSize.height, style:{fill:'rgba(0,0,0,0)'}});
                workarea.append(interactionPlane_back);
                interactionPlane_back.onwheel = function(x,y,event){};
            //signal block area
                var signalPane = canvas.part.builder('group','signalPane');
                workarea.append(signalPane);
            //interaction pane back
                var interactionPlane_front = canvas.part.builder('rectangle','interactionPlane_front',{width:viewport.totalSize.width, height:viewport.totalSize.height, style:{fill:'rgba(0,0,0,0)'}});
                workarea.append(interactionPlane_front);
                interactionPlane_front.onwheel = function(x,y,event){};
    //internal
        object.__calculationAngle = angle;
        function currentMousePosition(event){
            var workspacePoint = canvas.core.viewport.windowPoint2workspacePoint(event.x,event.y);
            var point = {
                x: workspacePoint.x - backing.extremities.points[0].x, 
                y: workspacePoint.y - backing.extremities.points[0].y,
            };
            return {
                x: (point.x*Math.cos(object.__calculationAngle) - point.y*Math.sin(object.__calculationAngle)) / width,
                y: (point.y*Math.cos(object.__calculationAngle) - point.x*Math.sin(object.__calculationAngle)) / height,
            };
        }
        function viewportPosition2internalPosition(xy){
            return {x: viewport.viewArea.topLeft.x + xy.x*zoomLevel_x, y:viewport.viewArea.topLeft.y + xy.y*zoomLevel_y };
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
        
            xy.x = signals.snapping ? Math.round((xy.x*xCount)/signals.step)*signals.step : xy.x*xCount;
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

                //update interactionPlane_back
                    interactionPlane_back.parameter.width( viewport.totalSize.width );
                    interactionPlane_back.parameter.height( viewport.totalSize.width );

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

                //update signals
                    for(var a = 0; a < signalPane.children.length; a++){
                        signalPane.children[a].unit(width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y));
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

                //update interactionPlane_back
                    interactionPlane_back.parameter.width( viewport.totalSize.width );

                //update background strips
                    for(var a = 0; a < xCount; a++){
                        backgroundDrawArea_vertical.children[a].parameter.x( a*(width/(xCount*zoomLevel_x)) );
                        backgroundDrawArea_vertical.children[a].parameter.width( width/(xCount*zoomLevel_x) );
                    }
                    for(var a = 0; a < yCount; a++){
                        backgroundDrawArea_horizontal.children[a].parameter.width( viewport.totalSize.width );
                    }

                //update signals
                    for(var a = 0; a < signalPane.children.length; a++){
                        signalPane.children[a].unit(width/(xCount*zoomLevel_x), undefined);
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

                //update interactionPlane_back
                    interactionPlane_back.parameter.height( viewport.totalSize.width );
                
                //update background strips
                    for(var a = 0; a < xCount; a++){
                        backgroundDrawArea_vertical.children[a].parameter.height( viewport.totalSize.height );
                    }
                    for(var a = 0; a < yCount; a++){
                        backgroundDrawArea_horizontal.children[a].parameter.y( a*(height/(yCount*zoomLevel_y)) );
                        backgroundDrawArea_horizontal.children[a].parameter.height( height/(yCount*zoomLevel_y) );
                    }

                //update signals
                    for(var a = 0; a < signalPane.children.length; a++){
                        signalPane.children[a].unit(undefined, height/(yCount*zoomLevel_y));
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
        // function makePlayhead(){
        //     var newPlayhead = canvas.part.builder('group','playhead');
        //     workarea.append(newPlayhead);

        //     newPlayhead.main = canvas.part.builder('rectangle','main',{
        //         width:playhead.width,
        //         height:viewport.totalSize.height,
        //         style:{ fill:playheadStyle },
        //     });
        //     newPlayhead.append(newPlayhead.main);

        //     newPlayhead.invisibleHandle = canvas.part.builder('rectangle','invisibleHandle',{
        //         x:-playhead.width*playhead.invisibleHandleMux/2 + playhead.width/2, 
        //         width: playhead.width*playhead.invisibleHandleMux,
        //         height:viewport.totalSize.height,
        //         style:{ fill:'rgba(255,0,0,0.5)' },
        //     })
        //     newPlayhead.append(newPlayhead.invisibleHandle);

        //     newPlayhead.invisibleHandle.onmousedown = function(){
        //         playhead.held = true;
        //         canvas.system.mouse.mouseInteractionHandler(
        //             function(event){ object.playheadPosition( coordinates2lineposition(currentMousePosition()).position ); },
        //             function(){playhead.held = false;}
        //         );
        //     };

        //     newPlayhead.invisibleHandle.onmouseenter = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
        //     newPlayhead.invisibleHandle.onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};

        //     playhead.present = true;
        // }
        function makeSignal(line, position, length, strength=signals.defaultStrength){
            //register signal and get new id. From the registry, get the approved signal values
                var newID = signals.signalRegistry.add({ line:line, position:position, length:length, strength:strength });
                var approvedData = signals.signalRegistry.getSignal(newID);

            //create graphical signal with approved values and append it to the pane
                var newSignalBlock = canvas.part.element.control.sequencer.signalBlock(
                    newID, width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y), 
                    approvedData.line, approvedData.position, approvedData.length, approvedData.strength, 
                    false, signalStyle_body, signalStyle_bodyGlow, signalStyle_handle, signalStyle_handleWidth
                );
                signalPane.append(newSignalBlock);

            //add signal controls to graphical signal block
                newSignalBlock.select = function(remainSelected=false){
                    if(signals.selectedSignals.indexOf(this) != -1){ if(!remainSelected){this.deselect();} return; }
                    this.selected(true);
                    signals.selectedSignals.push(this);
                    this.glow(true);
                };
                newSignalBlock.deselect = function(){
                    signals.selectedSignals.splice(signals.selectedSignals.indexOf(this),1);
                    this.selected(false);
                    this.glow(false);
                };
                newSignalBlock.delete = function(){
                    this.deselect();
                    signals.signalRegistry.remove(parseInt(this.name));
                    this.parent.remove(this);
                };

            //add interactions to graphical signal block
                newSignalBlock.ondblclick = function(x,y,event){
                    if(!event.ctrlKey){return;}
                    for(var a = 0; a < signals.selectedSignals.length; a++){
                        signals.selectedSignals[a].strength(signals.defaultStrength);
                        signals.signalRegistry.update(parseInt(signals.selectedSignals[a].name), {strength: signals.defaultStrength});
                    }
                };
                newSignalBlock.body.onmousedown = function(x,y,event){
                    //if spacebar is pressed; ignore all of this, and redirect to the interaction pane (for panning)
                        if(canvas.system.keyboard.pressedKeys.hasOwnProperty('Space') && canvas.system.keyboard.pressedKeys){
                            interactionPlane_back.onmousedown(x,y,event); return;
                        }

                    //if the shift key is not pressed and this note is not already selected; deselect everything
                        if(!event.shiftKey && !newSignalBlock.selected()){
                            while(signals.selectedSignals.length > 0){
                                signals.selectedSignals[0].deselect();
                            }
                        }

                    //select this block
                        newSignalBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < signals.selectedSignals.length; a++){
                            activeBlocks.push({
                                name: parseInt(signals.selectedSignals[a].name),
                                block: signals.selectedSignals[a],
                                starting: signals.signalRegistry.getSignal(parseInt(signals.selectedSignals[a].name)),
                            });
                        }

                    //if control key is pressed; this is a strength-change operation
                        if(event.ctrlKey){
                            var mux = 4;
                            var initialStrengths = activeBlocks.map(a => a.block.strength());
                            var initial = event.offsetY;
                            canvas.system.mouse.mouseInteractionHandler(
                                function(event){
                                    //check if ctrl is still pressed
                                        if(!canvas.system.keyboard.pressedKeys.ControlLeft && !canvas.system.keyboard.pressedKeys.ControlRight){ canvas.system.mouse.forceMouseUp(); }

                                    var diff = (initial - event.offsetY)/(canvas.core.viewport.scale()*height*mux);
                                    for(var a = 0; a < activeBlocks.length; a++){
                                        activeBlocks[a].block.strength(initialStrengths[a] + diff);
                                        signals.signalRegistry.update(activeBlocks[a].name, { strength: initialStrengths[a] + diff });
                                    }
                                }
                            );
                            return;
                        }

                    //if the alt key is pressed, clone the block
                    //(but don't select it, this is the 'alt-click-and-drag to clone' trick)
                    //this function isn't run until the first sign of movement
                        var cloned = false;
                        function cloneFunc(){
                            if(cloned){return;} cloned = true;
                            if(event.altKey){
                                for(var a = 0; a < signals.selectedSignals.length; a++){
                                    var temp = signals.signalRegistry.getSignal(parseInt(signals.selectedSignals[a].name));
                                    makeSignal(temp.line, temp.position, temp.length, temp.strength);
                                }
                            }
                        }

                    //block movement
                        var initialPosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                        canvas.system.mouse.mouseInteractionHandler(
                            function(event){
                                //clone that block
                                    cloneFunc();

                                var livePosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                                var diff = {
                                    line: livePosition.line - initialPosition.line,
                                    position: livePosition.position - initialPosition.position,
                                };
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    signals.signalRegistry.update(activeBlocks[a].name, {
                                        line:activeBlocks[a].starting.line+diff.line,
                                        position:activeBlocks[a].starting.position+diff.position,
                                    });
        
                                    var temp = signals.signalRegistry.getSignal(activeBlocks[a].name);
        
                                    activeBlocks[a].block.line( temp.line );
                                    activeBlocks[a].block.position( temp.position );
                                }
                            }
                        );
                };
                newSignalBlock.body.onmousemove = function(x,y,event){
                    var pressedKeys = canvas.system.keyboard.pressedKeys;
                    canvas.core.viewport.cursor( (pressedKeys.AltLeft || pressedKeys.AltRight) ? 'copy' : 'default' );
                };
                newSignalBlock.body.onkeydown = function(x,y,event){
                    var pressedKeys = canvas.system.keyboard.pressedKeys;
                    if(pressedKeys.AltLeft || pressedKeys.AltRight){ canvas.core.viewport.cursor('copy'); }
                };
                newSignalBlock.body.onkeyup = function(x,y,event){
                    var pressedKeys = canvas.system.keyboard.pressedKeys;
                    if(!(pressedKeys.AltLeft || pressedKeys.AltRight)){ canvas.core.viewport.cursor('default'); }
                };
                newSignalBlock.leftHandle.onmousedown = function(x,y,event){
                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!event.shiftKey && !newSignalBlock.selected()){
                            while(signals.selectedSignals.length > 0){
                                signals.selectedSignals[0].deselect();
                            }
                        }
                
                    //select this block
                        newSignalBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < signals.selectedSignals.length; a++){
                            activeBlocks.push({
                                name: parseInt(signals.selectedSignals[a].name),
                                block: signals.selectedSignals[a],
                                starting: signals.signalRegistry.getSignal(parseInt(signals.selectedSignals[a].name)),
                            });
                        }
                    
                    //perform block length adjustment 
                        var initialPosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                        canvas.system.mouse.mouseInteractionHandler(
                            function(event){
                                var livePosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                                var diff = {position: initialPosition.position-livePosition.position};
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    if( activeBlocks[a].starting.position-diff.position < 0 ){ continue; } //this stops a block from getting longer, when it is unable to move any further to the left
                                    
                                    signals.signalRegistry.update(activeBlocks[a].name, {
                                        length: activeBlocks[a].starting.length+diff.position,
                                        position: activeBlocks[a].starting.position-diff.position,
                                    });
                                    var temp = signals.signalRegistry.getSignal(activeBlocks[a].name);
                                    activeBlocks[a].block.position( temp.position );
                                    activeBlocks[a].block.length( temp.length );
                                }
                            }
                        );
                };
                newSignalBlock.leftHandle.onmousemove = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
                newSignalBlock.leftHandle.onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};
                newSignalBlock.rightHandle.onmousedown = function(x,y,event){
                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!event.shiftKey && !newSignalBlock.selected()){
                            while(signals.selectedSignals.length > 0){
                                signals.selectedSignals[0].deselect();
                            }
                        }
                    
                    //select this block
                        newSignalBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < signals.selectedSignals.length; a++){
                            activeBlocks.push({
                                name: parseInt(signals.selectedSignals[a].name),
                                block: signals.selectedSignals[a],
                                starting: signals.signalRegistry.getSignal(parseInt(signals.selectedSignals[a].name)),
                            });
                        }

                    //perform block length adjustment 
                        var initialPosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                        canvas.system.mouse.mouseInteractionHandler(
                            function(event){
                                var livePosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                                var diff = {position: livePosition.position - initialPosition.position};
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    signals.signalRegistry.update(activeBlocks[a].name, {length: activeBlocks[a].starting.length+diff.position});
                                    var temp = signals.signalRegistry.getSignal(activeBlocks[a].name);
                                    activeBlocks[a].block.position( temp.position );
                                    activeBlocks[a].block.length( temp.length );
                                }
                            }
                        );
                };
                newSignalBlock.rightHandle.onmousemove = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
                newSignalBlock.rightHandle.onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};

            return {id:newID, signalBlock:newSignalBlock};
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

        //signals
            object.addSignal = function(line, position, length, strength=1){ makeSignal(line, position, length, strength); };

    //interaction
        var tmp = {};
        var panningCode = {
            start:function(x,y,event){
                tmp.onmousemove = interactionPlane_front.onmousemove;
                interactionPlane_front.onmousemove = function(){};
                tmp.onmouseleave = interactionPlane_front.onmouseleave;
                interactionPlane_front.onmouseleave = function(){};

                canvas.core.viewport.cursor('grabbing');

                var initialPosition = currentMousePosition(event);
                var old_viewport = {x:viewport.viewposition.x, y:viewport.viewposition.y};

                canvas.system.mouse.mouseInteractionHandler(
                    function(event){
                        var livePosition = currentMousePosition(event);
                        var diffPosition = {x:initialPosition.x-livePosition.x, y:initialPosition.y-livePosition.y};
                        setViewposition(
                            old_viewport.x - (diffPosition.x*zoomLevel_x)/(zoomLevel_x-1),
                            old_viewport.y - (diffPosition.y*zoomLevel_y)/(zoomLevel_y-1),
                        );
                    },
                    function(event){
                        canvas.core.viewport.cursor('grab');
                    },
                );
            },
            stop:function(x,y,event){
                interactionPlane_front.onmousemove = tmp.onmousemove;
                interactionPlane_front.onmouseleave = tmp.onmouseleave;
            },
        };
        var click_n_drag = function(x,y,event){
            var initialPositionData = currentMousePosition(event);
            var livePositionData =    currentMousePosition(event);

            var selectionArea = canvas.part.builder('rectangle','selectionArea',{
                x:initialPositionData.x*width, y:initialPositionData.y*height,
                width:0, height:0,
                style:{fill:selectionAreaStyle}
            });
            object.append(selectionArea);

            canvas.system.mouse.mouseInteractionHandler(
                function(event){
                    //get live position, and correct it so it's definitely within in the relevant area
                        livePositionData = currentMousePosition(event);
                        livePositionData.x < 0 ? 0 : livePositionData.x;
                        livePositionData.y < 0 ? 0 : livePositionData.y;
                        livePositionData.x > 1 ? 1 : livePositionData.x;
                        livePositionData.y > 1 ? 1 : livePositionData.y;
                        
                    //gather difference between this point and the initial
                        var diff = {
                            x:livePositionData.x - initialPositionData.x, 
                            y:livePositionData.y - initialPositionData.y
                        };

                    //account for an inverse rectangle
                        var transform = {
                            x: initialPositionData.x, y: initialPositionData.y, 
                            width: 1, height: 1,
                        };
                        
                        if(diff.x < 0){ transform.width = -1;  transform.x += diff.x; }
                        if(diff.y < 0){ transform.height = -1; transform.y += diff.y; }

                    //update rectangle 
                        selectionArea.parameter.x(transform.x*width);
                        selectionArea.parameter.y(transform.y*height);
                        selectionArea.parameter.width(  transform.width  * diff.x*width  );
                        selectionArea.parameter.height( transform.height * diff.y*height );
                },
                function(event){
                    //remove selection box
                        selectionArea.parent.remove(selectionArea);

                    //gather the corner points
                        var finishingPositionData = {
                            a: visible2coordinates(initialPositionData),
                            b: visible2coordinates(livePositionData),
                        };
                        finishingPositionData.a.x *= viewport.totalSize.width; finishingPositionData.b.y *= viewport.totalSize.height;
                        finishingPositionData.b.x *= viewport.totalSize.width; finishingPositionData.a.y *= viewport.totalSize.height;

                        var selectionBox = { topLeft:{ x:0, y:0 }, bottomRight:{ x:0, y:0 } };
                        if( finishingPositionData.a.x < finishingPositionData.b.x ){
                            selectionBox.topLeft.x =     finishingPositionData.a.x;
                            selectionBox.bottomRight.x = finishingPositionData.b.x;
                        }else{
                            selectionBox.topLeft.x =     finishingPositionData.b.x;
                            selectionBox.bottomRight.x = finishingPositionData.a.x;
                        }
                        if( finishingPositionData.a.y < finishingPositionData.b.y ){
                            selectionBox.topLeft.y =     finishingPositionData.a.y;
                            selectionBox.bottomRight.y = finishingPositionData.b.y;
                        }else{
                            selectionBox.topLeft.y =     finishingPositionData.b.y;
                            selectionBox.bottomRight.y = finishingPositionData.a.y;
                        }

                    //deselect everything
                        while(signals.selectedSignals.length > 0){
                            signals.selectedSignals[0].deselect();
                        }

                    //select the notes that overlap with the selection area
                        for(var a = 0; a < signalPane.children.length; a++){
                            var temp = signals.signalRegistry.getSignal(parseInt(signalPane.children[a].name));
                            var block = { 
                                    topLeft:{
                                        x:temp.position * (viewport.totalSize.width/xCount), 
                                        y:temp.line *     (viewport.totalSize.height/yCount)},
                                    bottomRight:{
                                        x:(temp.position+temp.length) * (viewport.totalSize.width/xCount), 
                                        y:(temp.line+1)*                (viewport.totalSize.height/yCount)
                                    },
                            };

                            if( canvas.library.math.detectOverlap.boundingBoxes( block, selectionBox ) ){signalPane.children[a].select(true);}
                        }
                },
            );
        };
        var createSignal = function(x,y,event){};

        interactionPlane_front.onkeydown = function(x,y,event){
            var pressedKeys = canvas.system.keyboard.pressedKeys;
            if(pressedKeys.Delete || pressedKeys.Backspace){
                //delete all selected notes
                while(signals.selectedSignals.length > 0){
                    signals.selectedSignals[0].delete();
                }
            }else if(pressedKeys.Space){
                canvas.core.viewport.cursor('grab');
                tmp.onmousedown = interactionPlane_front.onmousedown;
                interactionPlane_front.onmousedown = panningCode.start;
            }
        };
        interactionPlane_front.onkeyup = function(x,y,event){
            if(!canvas.system.keyboard.pressedKeys.Space){
                canvas.core.viewport.cursor('default');
                panningCode.stop();
                interactionPlane_front.onmousedown = tmp.onmousedown;
            }
        };

        interactionPlane_back.onmousedown = function(x,y,event){
            if(event.shiftKey){ click_n_drag(x,y,event); }
            else if(event.altKey){ createSignal(x,y,event); }
            else{//elsewhere click
                //deselect everything
                    while(signals.selectedSignals.length > 0){
                        signals.selectedSignals[0].deselect();
                    }
            }
        };
        interactionPlane_front.onmouseleave = function(x,y,event){ canvas.core.viewport.cursor('default'); };
    //callbacks
        object.onpan = onpan;
        object.onchangeviewarea = onchangeviewarea;
        object.event = event;

    //setup
        drawBackground();

    return object;
};








this.sequencer.signalBlock = function(
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
        var object = canvas.part.builder('group',String(name),{x:position*unit_x, y:line*unit_y});
        object.body = canvas.part.builder('rectangle','body',{width:length*unit_x, height:unit_y, style:{fill:currentStyles.body.fill, stroke:currentStyles.body.stroke, lineWidth:currentStyles.body.lineWidth}});
        object.leftHandle = canvas.part.builder('rectangle','leftHandle',{x:-handleWidth/2, width:handleWidth, height:unit_y, style:{fill:handleStyle}});
        object.rightHandle = canvas.part.builder('rectangle','rightHandle',{x:length*unit_x-handleWidth/2, width:handleWidth, height:unit_y, style:{fill:handleStyle}});
        object.append(object.body);
        object.append(object.leftHandle);
        object.append(object.rightHandle);

    //internal functions
        function updateHeight(){
            object.body.parameter.height(unit_y);
            object.leftHandle.parameter.height(unit_y);
            object.rightHandle.parameter.height(unit_y);
        }
        function updateLength(){
            object.body.parameter.width(length*unit_x);
            object.rightHandle.parameter.x(length*unit_x-handleWidth/2);
        }
        function updateLineAndPosition(){ updateLine(); updatePosition(); }
        function updateLengthAndHeight(){ updateLength(); updateHeight(); }
        function updateLine(){ object.parameter.y(line*unit_y); }
        function updatePosition(){ object.parameter.x(position*unit_x); }
        function getBlendedColour(swatch,ratio){
            var outputStyle = Object.assign({},swatch[0]);

            //if there's a fill attribute; blend it and add it to the output 
                if( swatch[0].hasOwnProperty('fill') ){
                    outputStyle.fill = canvas.library.misc.multiBlendColours(swatch.map(a => a.fill),ratio);
                }

            //if there's a stroke attribute; blend it and add it to the output
                if( swatch[0].hasOwnProperty('stroke') ){
                    outputStyle.stroke = canvas.library.misc.multiBlendColours(swatch.map(a => a.stroke),ratio);
                }

            return outputStyle;
        }

    //controls
        object.unit = function(x,y){
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
                updateLengthAndHeight();
                updateLineAndPosition();
            }
        };
        object.line = function(a){
            if(a == undefined){return line;}
            line = a;
            updateLine();
        };
        object.position = function(a){
            if(a == undefined){return position;}
            position = a;
            updatePosition();
        };
        object.length = function(a){
            if(a == undefined){return length;}
            length = a < (minLength/unit_x) ? (minLength/unit_x) : a;
            updateLength();
        };
        object.strength = function(a){
            if(a == undefined){return strength;}
            a = a > 1 ? 1 : a; a = a < 0 ? 0 : a;
            strength = a;
            currentStyles = {
                body:getBlendedColour(bodyStyle,strength),
                glow:getBlendedColour(bodyGlowStyle,strength),
            };
            object.glow(glow);
        };
        object.glow = function(a){
            if(a == undefined){return glow;}
            glow = a;
            if(glow){ 
                object.body.style.fill = currentStyles.glow.fill;
                object.body.style.stroke = currentStyles.glow.stroke;
                object.body.style.lineWidth = currentStyles.glow.lineWidth;
            }else{    
                object.body.style.fill = currentStyles.body.fill;
                object.body.style.stroke = currentStyles.body.stroke;
                object.body.style.lineWidth = currentStyles.body.lineWidth;
            }            
        };
        object.selected = function(a){
            if(a == undefined){return selected;}
            selected = a;
        };

    return object;
};