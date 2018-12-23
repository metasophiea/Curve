this.sequencer = function(
    name='sequencer',
    x, y, width=300, height=100, angle=0,
    
    xCount=64, yCount=16,
    zoomLevel_x=1/1, zoomLevel_y=1/1,

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
    var _t = this;

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
            signalRegistry: new workspace.library.structure.signalRegistry(xCount,yCount),
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
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //static backing
            var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, style:{fill:backingStyle}});
            object.append(backing);
        //viewport stencil
            var stencil = interfacePart.builder('rectangle','stencil',{width:width, height:height});
            object.stencil(stencil);
            object.clip(true);

        //workarea
            var workarea = interfacePart.builder('group','workarea');
            object.append(workarea);
            //moveable background
                var backgroundDrawArea = interfacePart.builder('group','backgroundDrawArea');
                workarea.append(backgroundDrawArea);
                var backgroundDrawArea_horizontal = interfacePart.builder('group','backgroundDrawArea_horizontal');
                backgroundDrawArea.append(backgroundDrawArea_horizontal);
                var backgroundDrawArea_vertical = interfacePart.builder('group','backgroundDrawArea_vertical');
                backgroundDrawArea.append(backgroundDrawArea_vertical);
            //interaction pane back
                var interactionPlane_back = interfacePart.builder('rectangle','interactionPlane_back',{width:viewport.totalSize.width, height:viewport.totalSize.height, style:{fill:'rgba(0,0,0,0)'}});
                workarea.append(interactionPlane_back);
                interactionPlane_back.onwheel = function(x,y,event){};
            //signal block area
                var signalPane = interfacePart.builder('group','signalPane');
                workarea.append(signalPane);
            //interaction pane front
                var interactionPlane_front = interfacePart.builder('rectangle','interactionPlane_front',{width:viewport.totalSize.width, height:viewport.totalSize.height, style:{fill:'rgba(0,0,0,0)'}});
                workarea.append(interactionPlane_front);
                interactionPlane_front.onwheel = function(x,y,event){};
    //internal
        object.__calculationAngle = angle;
        function currentMousePosition(event){
            var workspacePoint = workspace.core.viewport.windowPoint2workspacePoint(event.x,event.y);
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
                        interfacePart.builder( 'rectangle', 'strip_horizontal_'+a,
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
                        interfacePart.builder( 'rectangle', 'strip_vertical_'+a,
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
                else{
                    if(d.topLeft == undefined){ d.topLeft = {x: viewport.viewArea.topLeft.x, y: viewport.viewArea.topLeft.y}; }
                    else{
                        if(d.topLeft.x == undefined){ d.topLeft.x = viewport.viewArea.topLeft.x; }
                        if(d.topLeft.y == undefined){ d.topLeft.y = viewport.viewArea.topLeft.y; }
                    }
                    if(d.bottomRight == undefined){ d.bottomRight = {x: viewport.bottomRight.topLeft.x, y: viewport.bottomRight.topLeft.ys}; }
                    else{
                        if(d.bottomRight.x == undefined){ d.bottomRight.x = viewport.viewArea.bottomRight.x; }
                        if(d.bottomRight.y == undefined){ d.bottomRight.y = viewport.viewArea.bottomRight.y; }
                    }
                }

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
                setViewposition(newX,newY,update);

            //update state
                viewport.viewArea = Object.assign(d,{});
        }
        function makeSignal(line, position, length, strength=signals.defaultStrength){
            //register signal and get new id. From the registry, get the approved signal values
                var newID = signals.signalRegistry.add({ line:line, position:position, length:length, strength:strength });
                var approvedData = signals.signalRegistry.getSignal(newID);

            //create graphical signal with approved values and append it to the pane
                var newSignalBlock = _t.sequencer.signalBlock(
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
                    if(!workspace.system.keyboard.pressedKeys.control){return;}
                    for(var a = 0; a < signals.selectedSignals.length; a++){
                        signals.selectedSignals[a].strength(signals.defaultStrength);
                        signals.signalRegistry.update(parseInt(signals.selectedSignals[a].name), {strength: signals.defaultStrength});
                    }
                };
                newSignalBlock.body.onmousedown = function(x,y,event){
                    //if spacebar is pressed; ignore all of this, and redirect to the interaction pane (for panning)
                        if(workspace.system.keyboard.pressedKeys.Space){
                            interactionPlane_back.onmousedown(x,y,event); return;
                        }

                    //if the shift key is not pressed and this note is not already selected; deselect everything
                        if(!workspace.system.keyboard.pressedKeys.shift && !newSignalBlock.selected()){
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
                        if(workspace.system.keyboard.pressedKeys.control){
                            var mux = 4;
                            var initialStrengths = activeBlocks.map(a => a.block.strength());
                            var initial = event.offsetY;
                            workspace.system.mouse.mouseInteractionHandler(
                                function(event){
                                    //check if ctrl is still pressed
                                        if(!workspace.system.keyboard.pressedKeys.ControlLeft && !workspace.system.keyboard.pressedKeys.ControlRight){ workspace.system.mouse.forceMouseUp(); }

                                    var diff = (initial - event.offsetY)/(workspace.core.viewport.scale()*height*mux);
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
                            if(workspace.system.keyboard.pressedKeys.alt){
                                for(var a = 0; a < signals.selectedSignals.length; a++){
                                    var temp = signals.signalRegistry.getSignal(parseInt(signals.selectedSignals[a].name));
                                    makeSignal(temp.line, temp.position, temp.length, temp.strength);
                                }
                            }
                        }

                    //block movement
                        var initialPosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                        workspace.system.mouse.mouseInteractionHandler(
                            function(event){
                                //clone that block (maybe)
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
                    var pressedKeys = workspace.system.keyboard.pressedKeys;

                    var cursor = 'default';
                    if( pressedKeys.alt ){ cursor = 'copy'; }
                    else if( pressedKeys.Space ){ cursor = 'grab'; }

                    workspace.core.viewport.cursor( cursor );
                };
                newSignalBlock.body.onkeydown = function(x,y,event){
                    var pressedKeys = workspace.system.keyboard.pressedKeys;
                    if(pressedKeys.alt){ workspace.core.viewport.cursor('copy'); }
                };
                newSignalBlock.body.onkeyup = function(x,y,event){
                    var pressedKeys = workspace.system.keyboard.pressedKeys;
                    if(!(pressedKeys.alt)){ workspace.core.viewport.cursor('default'); }
                };
                newSignalBlock.leftHandle.onmousedown = function(x,y,event){
                    //if spacebar is pressed; ignore all of this, and redirect to the interaction pane (for panning)
                        if(workspace.system.keyboard.pressedKeys.Space){
                            interactionPlane_back.onmousedown(x,y,event); return;
                        }
                        
                    //cloning situation
                        if(workspace.system.keyboard.pressedKeys.alt){
                            newSignalBlock.body.onmousedown(x,y,event);
                            return;
                        }

                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!workspace.system.keyboard.pressedKeys.shift && !newSignalBlock.selected()){
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
                        workspace.system.mouse.mouseInteractionHandler(
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
                newSignalBlock.leftHandle.onmousemove = function(x,y,event){
                    var pressedKeys = workspace.system.keyboard.pressedKeys;

                    var cursor = 'col-resize';
                    if( pressedKeys.alt ){ cursor = 'copy'; }
                    else if( pressedKeys.Space ){ cursor = 'grab'; }

                    workspace.core.viewport.cursor( cursor );
                };
                newSignalBlock.leftHandle.onmouseleave = function(x,y,event){workspace.core.viewport.cursor('default');};
                newSignalBlock.rightHandle.onmousedown = function(x,y,event,ignoreCloning=false){
                    //if spacebar is pressed; ignore all of this, and redirect to the interaction pane (for panning)
                        if(workspace.system.keyboard.pressedKeys.Space){
                            interactionPlane_back.onmousedown(x,y,event); return;
                        }

                    //cloning situation
                        if(!ignoreCloning && workspace.system.keyboard.pressedKeys.alt){
                            newSignalBlock.body.onmousedown(x,y,event);
                            return;
                        }

                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!workspace.system.keyboard.pressedKeys.shift && !newSignalBlock.selected()){
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
                        workspace.system.mouse.mouseInteractionHandler(
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
                newSignalBlock.rightHandle.onmousemove = function(x,y,event){
                    var pressedKeys = workspace.system.keyboard.pressedKeys;

                    var cursor = 'col-resize';
                    if( pressedKeys.alt ){ cursor = 'copy'; }
                    else if( pressedKeys.Space ){ cursor = 'grab'; }

                    workspace.core.viewport.cursor( cursor );
                };
                newSignalBlock.rightHandle.onmouseleave = function(x,y,event){workspace.core.viewport.cursor('default');};

            return {id:newID, signalBlock:newSignalBlock};
        }
        function deleteSelectedSignals(){
            while(signals.selectedSignals.length > 0){
                signals.selectedSignals[0].delete();
            }
        }
        function makePlayhead(){
            var newPlayhead = interfacePart.builder('group','playhead');
            workarea.append(newPlayhead);

            newPlayhead.main = interfacePart.builder('rectangle','main',{
                x: -playhead.width/2,
                width:playhead.width,
                height:viewport.totalSize.height,
                style:{ fill:playheadStyle },
            });
            newPlayhead.append(newPlayhead.main);

            newPlayhead.invisibleHandle = interfacePart.builder('rectangle','invisibleHandle',{
                x:-playhead.width*playhead.invisibleHandleMux/2 + playhead.width/2, 
                width: playhead.width*playhead.invisibleHandleMux,
                height:viewport.totalSize.height,
                style:{ fill:'rgba(255,0,0,0)' },
            })
            newPlayhead.append(newPlayhead.invisibleHandle);

            newPlayhead.invisibleHandle.onmousedown = function(){
                playhead.held = true;
                workspace.system.mouse.mouseInteractionHandler(
                    function(event){ object.playheadPosition(coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event))).position); },
                    function(){playhead.held = false;}
                );
            };

            newPlayhead.invisibleHandle.onmouseenter = function(x,y,event){workspace.core.viewport.cursor('col-resize');};
            newPlayhead.invisibleHandle.onmousemove = function(x,y,event){workspace.core.viewport.cursor('col-resize');};
            newPlayhead.invisibleHandle.onmouseleave = function(x,y,event){workspace.core.viewport.cursor('default');};

            playhead.present = true;

            return newPlayhead;
        }

    //controls
        object.viewposition = setViewposition;
        object.viewarea = setViewArea;
        object.step = function(a){
            if(a == undefined){return signals.step;}
            signals.step = a;
        };

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

                for(var a = start; a < end; a++){
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
            object.export = function(){return signals.signalRegistry.export();};
            object.import = function(data){signals.signalRegistry.import(data);};
            object.getAllSignals = function(){return signals.signalRegistry.getAllSignals(); };
            object.addSignal = function(line, position, length, strength=1){ makeSignal(line, position, length, strength); };
            object.addSignals = function(data){ for(var a = 0; a < data.length; a++){this.addSignal(data[a].line, data[a].position, data[a].length, data[a].strength);} };
            object.eventsBetween = function(start,end){ return signals.signalRegistry.eventsBetween(start,end); };
            
        //playhead
            object.automove = function(a){
                if(a == undefined){return playhead.automoveViewposition;}
                playhead.automoveViewposition = a;
            };
            object.playheadPosition = function(val,stopActive=true){
                if(val == undefined){return playhead.position;}
    
                playhead.position = val;
    
                //send stop events for all active notes
                    if(stopActive){
                        var events = [];
                        for(var a = 0; a < signals.activeSignals.length; a++){
                            var tmp = noteRegistry.getNote(signals.activeSignals[a]); if(tmp == null){continue;}
                            events.unshift( {noteID:signals.activeSignals[a], line:tmp.line, position:loop.period.start, strength:0} );
                        }
                        signals.activeSignals = [];
                        if(object.event && events.length > 0){object.event(events);}
                    }
    
                //reposition graphical playhead
                    var playheadObject = workarea.getElementsWithName('playhead')[0];
                    if(playhead.position < 0 || playhead.position > xCount){
                        //outside vilible bounds, so remove
                            if( playheadObject != undefined ){ playheadObject.parent.remove(playheadObject); }
                    }else{ 
                        //within vilible bounds, so either create or adjust
                            if( playheadObject == undefined ){ playheadObject = makePlayhead(); }
                            playheadObject.parameter.x( playhead.position*(viewport.totalSize.width/xCount) );
                        //if the new position is beyond the view in the viewport, adjust the viewport (putting the playhead on the leftmost side)
                        //(assuming automoveViewposition is set)
                            if(playhead.automoveViewposition){
                                var remainderSpace = xCount-(xCount*zoomLevel_x);
                                if( playhead.position < Math.floor(viewport.viewposition.x*remainderSpace) || 
                                    playhead.position > Math.floor(viewport.viewposition.x*remainderSpace) + (xCount*zoomLevel_x)  
                                ){ object.viewposition( (playhead.position > remainderSpace ? remainderSpace : playhead.position)/remainderSpace ); }
                            }
                    }
            };
            object.progress = function(){
                //if the playhead is being held, just bail completly
                    if(playhead.held){return;}
                    
                //gather together all the current events
                    var events = object.eventsBetween(playhead.position, playhead.position+signals.step);

                //upon loop; any notes that are still active are to be ended
                //(so create end events for them, and push those into the current events list)
                    if(loop.active && playhead.position == loop.period.start){
                        for(var a = 0; a < signals.activeSignals.length; a++){
                            var tmp = signals.signalRegistry.getSignal(signals.activeSignals[a]); if(tmp == null){continue;}
                            events.unshift( {noteID:signals.activeSignals[a], line:tmp.line, position:loop.period.start, strength:0} );
                        }
                        signals.activeSignals = [];
                    }

                //add newly started notes to - and remove newly finished notes from - 'signals.activeSignals'
                    for(var a = 0; a < events.length; a++){
                        var index = signals.activeSignals.indexOf(events[a].noteID);
                        if(index != -1 && events[a].strength == 0){
                            signals.activeSignals.splice(index);
                        }else{
                            if( events[a].strength > 0 ){
                                signals.activeSignals.push(events[a].noteID);
                            }
                        }
                    }

                //progress position
                    if( loop.active && (playhead.position+signals.step == loop.period.end) ){
                        playhead.position = loop.period.start;
                    }else{
                        playhead.position = playhead.position+signals.step;
                    }

                //update graphical playhead
                    object.playheadPosition(playhead.position,false);

                //perform event callback
                    if(object.event && events.length > 0){object.event(events);}
            };

    //interaction
        interactionPlane_back.onmousedown = function(x,y,event){
            var pressedKeys = workspace.system.keyboard.pressedKeys;

            if( pressedKeys.alt && pressedKeys.Space ){return;}

            if(pressedKeys.shift){//group select 
                var initialPositionData = currentMousePosition(event);
                var livePositionData =    currentMousePosition(event);
    
                var selectionArea = interfacePart.builder('rectangle','selectionArea',{
                    x:initialPositionData.x*width, y:initialPositionData.y*height,
                    width:0, height:0,
                    style:{fill:selectionAreaStyle}
                });
                object.append(selectionArea);
    
                workspace.system.mouse.mouseInteractionHandler(
                    function(event){
                        //get live position, and correct it so it's definitely within in the relevant area
                            livePositionData = currentMousePosition(event);
                            livePositionData.x = livePositionData.x < 0 ? 0 : livePositionData.x;
                            livePositionData.y = livePositionData.y < 0 ? 0 : livePositionData.y;
                            livePositionData.x = livePositionData.x > 1 ? 1 : livePositionData.x;
                            livePositionData.y = livePositionData.y > 1 ? 1 : livePositionData.y;
                            
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
    
                                if( workspace.library.math.detectOverlap.boundingBoxes( block, selectionBox ) ){signalPane.children[a].select(true);}
                            }
                    },
                );
            }else if(pressedKeys.alt){//draw signal
                //deselect everything
                    while(signals.selectedSignals.length > 0){
                        signals.selectedSignals[0].deselect();
                    }
                    
                //get the current location and make a new note there (with length 0)
                    var position = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                    var temp = makeSignal(position.line,position.position,0);

                //select this new block, and direct the mouse-down to the right handle (for user lengthening)
                    temp.signalBlock.select();
                    temp.signalBlock.rightHandle.onmousedown(undefined,undefined,event,true);
            }else if(pressedKeys.Space){//pan
                workspace.core.viewport.cursor('grabbing');

                var initialPosition = currentMousePosition(event);
                var old_viewport = {x:viewport.viewposition.x, y:viewport.viewposition.y};

                workspace.system.mouse.mouseInteractionHandler(
                    function(event){
                        var livePosition = currentMousePosition(event);
                        var diffPosition = {x:initialPosition.x-livePosition.x, y:initialPosition.y-livePosition.y};
                        setViewposition(
                            old_viewport.x - (diffPosition.x*zoomLevel_x)/(zoomLevel_x-1),
                            old_viewport.y - (diffPosition.y*zoomLevel_y)/(zoomLevel_y-1),
                        );
                    },
                    function(event){
                        if( 
                            workspace.library.math.detectOverlap.pointWithinBoundingBox( 
                                viewportPosition2internalPosition(currentMousePosition(event)), 
                                viewport.viewArea 
                            ) && workspace.system.keyboard.pressedKeys.Space
                        ){
                            workspace.core.viewport.cursor('grab');
                        }else{
                            workspace.core.viewport.cursor('default');
                        }
                    },
                );
            }else{//elsewhere click
                //deselect everything
                    while(signals.selectedSignals.length > 0){
                        signals.selectedSignals[0].deselect();
                    }
            }
        };
        interactionPlane_back.onmousemove = function(x,y,event){
            var pressedKeys = workspace.system.keyboard.pressedKeys;
            if( pressedKeys.alt ){ workspace.core.viewport.cursor('crosshair'); }
            else if( pressedKeys.Space ){ workspace.core.viewport.cursor('grab'); }
            else{ workspace.core.viewport.cursor('default'); }
        };
        interactionPlane_front.onkeydown = function(x,y,event){
            var pressedKeys = workspace.system.keyboard.pressedKeys;
            if( pressedKeys.Backspace || pressedKeys.Delete ){ deleteSelectedSignals(); }
            if( pressedKeys.Space ){ workspace.core.viewport.cursor('grab'); }
            if( pressedKeys.alt ){
                if( signalPane.getElementUnderPoint(x,y) != undefined ){
                    workspace.core.viewport.cursor('copy');
                }else{
                    workspace.core.viewport.cursor('crosshair');
                }
            }
        };
        interactionPlane_front.onkeyup = function(x,y,event){
            workspace.core.viewport.cursor('default');
        };

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
        var object = interfacePart.builder('group',String(name),{x:position*unit_x, y:line*unit_y});
        object.body = interfacePart.builder('rectangle','body',{width:length*unit_x, height:unit_y, style:{fill:currentStyles.body.fill, stroke:currentStyles.body.stroke, lineWidth:currentStyles.body.lineWidth}});
        object.leftHandle = interfacePart.builder('rectangle','leftHandle',{x:-handleWidth/2, width:handleWidth, height:unit_y, style:{fill:handleStyle}});
        object.rightHandle = interfacePart.builder('rectangle','rightHandle',{x:length*unit_x-handleWidth/2, width:handleWidth, height:unit_y, style:{fill:handleStyle}});
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
                    outputStyle.fill = workspace.library.misc.multiBlendColours(swatch.map(a => a.fill),ratio);
                }

            //if there's a stroke attribute; blend it and add it to the output
                if( swatch[0].hasOwnProperty('stroke') ){
                    outputStyle.stroke = workspace.library.misc.multiBlendColours(swatch.map(a => a.stroke),ratio);
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