var infSeq = function(
    id='infSeq',
    x, y, width, height, angle,
    count={
        totalX:64, totalY:12,
        visibleX:32, visibleY:10,
    },

    backingStyle='fill:rgba(20,20,20,1);',
    selectionAreaStyle='fill:rgba(150,100,100,0.75);stroke:rgba(200,100,100,1);stroke-width:0.5;pointer-events:none;',

    blockStyle_body='fill:rgba(150,100,150,0.75);stroke:rgba(200,100,200,1);stroke-width:0.5;',
    blockStyle_bodyGlow='fill:rgba(200,100,200,0.9);stroke:rgba(200,100,200,1);stroke-width:0.5;',
    blockStyle_handle='fill:rgba(255,0,255,0.75);cursor:col-resize;',
    blockStyle_handleWidth=3,

    horizontalStripStyle_pattern=[0,1],
    horizontalStripStyle_glow='stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(120,120,120,0.8);',
    horizontalStripStyle_styles=[
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(120,120,120,0.5);',
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(100,100,100,0);',
    ],
    verticalStripStyle_pattern=[0],
    verticalStripStyle_glow='stroke:rgba(252,244,128,0.5);stroke-width:0.5;fill:rgba(229, 221, 112,0.25);',
    verticalStripStyle_styles=[
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(30,30,30,0.5);',
    ],

    playheadStyle='stroke:rgb(240, 240, 240);',
){

    //state
        var state = {
            noteRegistry: new part.circuit.sequencing.noteRegistry(count.totalX,count.totalY),
    
            snapping:true,
            step:1/1,

            selectedNotes:[],
            activeNotes:[],

            playhead:{
                width:0.75,
                invisibleHandleMux:6,
                position:-1,
                held:false,
                automoveViewposition:false,
            },
            loop:{active:false, period:{start:0, end:count.totalX}},

            viewposition:{x:0,y:0},
            totalSize: {
                width:  width*(count.totalX/count.visibleX),
                height: height*(count.totalY/count.visibleY),
            },
        };

    //internal functions
        function visible2coordinates(xy){
            return {
                x: (count.visibleX*(xy.x-state.viewposition.x))/count.totalX + state.viewposition.x,
                y: (count.visibleY*(xy.y-state.viewposition.y))/count.totalY + state.viewposition.y,
            };
        }
        function coordinates2lineposition(xy){
            xy.y = Math.floor(xy.y*count.totalY);
            if(xy.y >= count.totalY){xy.y = count.totalY-1;}
        
            xy.x = state.snapping ? Math.round((xy.x*count.totalX)/state.step)*state.step : xy.x*count.totalX;
            if(xy.x < 0){xy.x =0;}
        
            return {line:xy.y, position:xy.x};
        }
        function drawBackground(){
            backgroundDrawArea.innerHTML = '';

            //background stipes
                //horizontal strips
                for(var a = 0; a < count.totalY; a++){
                    backgroundDrawArea.appendChild(
                        part.builder('rect','strip_horizontal_'+a,{
                            x1:0, y:a*(height/count.visibleY),
                            width:state.totalSize.width, height:height/count.visibleY,
                            style:horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]],
                        })
                    );
                }
                //vertical strips
                for(var a = 0; a < count.totalX; a++){
                    backgroundDrawArea.appendChild(
                        part.builder('rect','strip_vertical_'+a,{
                            x:a*(width/count.visibleX), y:0,
                            width:width/count.visibleX, height:state.totalSize.height,
                            style:verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]],
                        })
                    );
                }
        }
        function makePlayhead(){
            var playhead = part.builder('g','playhead',{});
            workarea.appendChild(playhead);
            playhead.onmousedown = function(event){
                system.utility.workspace.mouseInteractionHandler(
                    function(event){//move
                        state.playhead.held = true;
                        var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,state.totalSize.width,state.totalSize.height));
                        obj.playheadPosition(livePosition.position);
                    },
                    function(){state.playhead.held = false;}
                );
            };

            playhead.main = part.builder('line','main',{
                x1:0, y1:0,
                x2:0, y2:state.totalSize.height,
                style:playheadStyle + 'stroke-width:'+state.playhead.width+';'
            });
            playhead.appendChild(playhead.main);

            playhead.invisibleHandle = part.builder('line','invisibleHandle',{
                x1:0, y1:0, x2:0, y2:state.totalSize.height,
                style:'stroke:rgba(0,0,0,0); cursor: col-resize; stroke-width:'+state.playhead.width*state.playhead.invisibleHandleMux+';'
            });
            playhead.appendChild(playhead.invisibleHandle);
        }
        function makeNote(line, position, length, strength=1){
            var newID = state.noteRegistry.add({ line:line, position:position, length:length, strength:strength });
            var approvedData = state.noteRegistry.getNote(newID);
            var newNoteBlock = part.element.control.sequencer.noteBlock(newID, width/count.visibleX, height/count.visibleY, approvedData.line, approvedData.position, approvedData.length, false, blockStyle_body, blockStyle_bodyGlow, blockStyle_handle, blockStyle_handleWidth);
            notePane.append(newNoteBlock);

            //augmenting the graphic element
                newNoteBlock.select = function(remainSelected=false){
                    if(state.selectedNotes.indexOf(this) != -1){ if(!remainSelected){this.deselect();} return; }
                    this.selected(true);
                    state.selectedNotes.push(this);
                    this.glow(true);
                };
                newNoteBlock.deselect = function(){
                    state.selectedNotes.splice(state.selectedNotes.indexOf(this),1);
                    this.selected(false);
                    this.glow(false);
                };
                newNoteBlock.delete = function(){
                    this.deselect();
                    state.noteRegistry.remove(parseInt(this.id));
                    this.remove();
                };
                newNoteBlock.ondblclick = function(event){
                    if(!event[system.super.keys.ctrl]){return;}
                    while(state.selectedNotes.length > 0){
                        state.selectedNotes[0].delete();
                    }
                };
                newNoteBlock.body.onmousedown = function(event){
                    //if the shift key is not pressed and this note is not already selected; deselect everything
                        if(!event.shiftKey && !newNoteBlock.selected()){
                            while(state.selectedNotes.length > 0){
                                state.selectedNotes[0].deselect();
                            }
                        }
                    
                    //select this block
                        newNoteBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < state.selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(state.selectedNotes[a].id),
                                block: state.selectedNotes[a],
                                starting: state.noteRegistry.getNote(parseInt(state.selectedNotes[a].id)),
                            });
                        }

                    //if the alt key is pressed, clone the block
                    //(but don't select it, this is 'alt-click-and-drag to clone' trick)
                    //this function isn't run until the first sign of movement
                    var cloned = false;
                    function cloneFunc(){
                        if(cloned){return;} cloned = true;
                        if(event[system.super.keys.alt]){
                            for(var a = 0; a < state.selectedNotes.length; a++){
                                var temp = state.noteRegistry.getNote(parseInt(state.selectedNotes[a].id));
                                makeNote(temp.line, temp.position, temp.length, temp.strength);
                            }
                        }
                    }

                    //block movement
                        var initialPosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,state.totalSize.width,state.totalSize.height));
                        system.utility.workspace.mouseInteractionHandler(
                            function(event){//move
                                cloneFunc(); //clone that block

                                var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,state.totalSize.width,state.totalSize.height));
                                var diff = {
                                    line: livePosition.line - initialPosition.line,
                                    position: livePosition.position - initialPosition.position,
                                };
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    state.noteRegistry.update(activeBlocks[a].id, {
                                        line:activeBlocks[a].starting.line+diff.line,
                                        position:activeBlocks[a].starting.position+diff.position,
                                    });
        
                                    var temp = state.noteRegistry.getNote(activeBlocks[a].id);
        
                                    activeBlocks[a].block.line( temp.line );
                                    activeBlocks[a].block.position( temp.position );
                                }
                            },
                        );
                };
                newNoteBlock.leftHandle.onmousedown = function(event){
                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!event.shiftKey && !newNoteBlock.selected()){
                            while(state.selectedNotes.length > 0){
                                state.selectedNotes[0].deselect();
                            }
                        }
                    
                    //select this block
                        newNoteBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < state.selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(state.selectedNotes[a].id),
                                block: state.selectedNotes[a],
                                starting: state.noteRegistry.getNote(parseInt(state.selectedNotes[a].id)),
                            });
                        }
                    
                    //perform block length adjustment 
                        var initialPosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,state.totalSize.width,state.totalSize.height));
                        system.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,state.totalSize.width,state.totalSize.height));
                                var diff = {position: initialPosition.position-livePosition.position};
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    if( activeBlocks[a].starting.position-diff.position < 0 ){ continue; } //this stops a block from getting longer, when it is unable to move any further to the left
                                    
                                    state.noteRegistry.update(activeBlocks[a].id, {
                                        length: activeBlocks[a].starting.length+diff.position,
                                        position: activeBlocks[a].starting.position-diff.position,
                                    });
                                    var temp = state.noteRegistry.getNote(activeBlocks[a].id);
                                    activeBlocks[a].block.position( temp.position );
                                    activeBlocks[a].block.length( temp.length );
                                }
                            }
                        );
                };
                newNoteBlock.rightHandle.onmousedown = function(event){
                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!event.shiftKey && !newNoteBlock.selected()){
                            while(state.selectedNotes.length > 0){
                                state.selectedNotes[0].deselect();
                            }
                        }
                    
                    //select this block
                        newNoteBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < state.selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(state.selectedNotes[a].id),
                                block: state.selectedNotes[a],
                                starting: state.noteRegistry.getNote(parseInt(state.selectedNotes[a].id)),
                            });
                        }

                    //perform block length adjustment 
                        var initialPosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,state.totalSize.width,state.totalSize.height));
                        system.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,state.totalSize.width,state.totalSize.height));
                                var diff = {position: livePosition.position - initialPosition.position};
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    state.noteRegistry.update(activeBlocks[a].id, {length: activeBlocks[a].starting.length+diff.position});
                                    var temp = state.noteRegistry.getNote(activeBlocks[a].id);
                                    activeBlocks[a].block.position( temp.position );
                                    activeBlocks[a].block.length( temp.length );
                                }
                            }
                        );
                };

            return {id:newID, noteBlock:newNoteBlock};
        }

    //elements 
        //main
            var obj = part.builder('g',id,{x:x, y:y, r:angle});
        //static backing
            var backing = part.builder('rect','backing',{width:width, height:height, style:backingStyle});
            obj.appendChild(backing);
        //viewport
            var viewport = part.builder('g','viewport',{});
            viewport.setAttribute('clip-path','polygon(0px 0px, '+width+'px 0px, '+width+'px '+height+'px, 0px '+height+'px)');
            obj.appendChild(viewport);
        //workarea
            var workarea = part.builder('g','workarea',{});
            viewport.appendChild(workarea);
            workarea.onkeydown = function(event){
                if(event.key == 'Delete' || event.key == 'Backspace'){
                    //delete all selected notes
                    while(state.selectedNotes.length > 0){
                        state.selectedNotes[0].delete();
                    }
                    return true;
                }
            };
            //moveable background
                var backgroundDrawArea = part.builder('g','backgroundDrawArea',{});
                workarea.appendChild(backgroundDrawArea);
                drawBackground();
            //interaction pane
                var interactionPlane = part.builder('rect','interactionPlane',{width:state.totalSize.width, height:state.totalSize.height, style:'fill:rgba(0,0,0,0);'});
                workarea.appendChild(interactionPlane);
                interactionPlane.onmousedown = function(event){

                    if(event.shiftKey){ //click-n-drag group select
                        var initialPositionData = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                        var livePositionData = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                        
                        var selectionArea = part.builder('rect','selectionArea',{
                            x:initialPositionData.x*width, y:initialPositionData.y*height,
                            width:0, height:0,
                            style:selectionAreaStyle,
                        });
                        obj.appendChild(selectionArea);
    
                        system.utility.workspace.mouseInteractionHandler(
                            function(event){//move
                                //live re-size the selection box
                                    livePositionData = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                    var diff = {x:livePositionData.x-initialPositionData.x, y:livePositionData.y-initialPositionData.y};
            
                                    var transform = {};
                                    if(diff.x < 0){ 
                                        selectionArea.width.baseVal.value = -diff.x*width;
                                        transform.x = initialPositionData.x+diff.x;
                                    }else{ 
                                        selectionArea.width.baseVal.value = diff.x*width;
                                        transform.x = initialPositionData.x;
                                    }
                                    if(diff.y < 0){ 
                                        selectionArea.height.baseVal.value = -diff.y*height;
                                        transform.y = initialPositionData.y+diff.y;
                                    }else{ 
                                        selectionArea.height.baseVal.value = diff.y*height;
                                        transform.y = initialPositionData.y;
                                    }
            
                                    system.utility.element.setTransform_XYonly(selectionArea, transform.x*width, transform.y*height);
                            },
                            function(){//stop
                                //remove selection box
                                    selectionArea.remove();

                                //gather the corner points
                                    var finishingPositionData = {
                                        a:visible2coordinates(initialPositionData),
                                        b:visible2coordinates(livePositionData),
                                    };
                                    finishingPositionData.a.x *= state.totalSize.width;  finishingPositionData.b.y *= state.totalSize.height;
                                    finishingPositionData.b.x *= state.totalSize.width;  finishingPositionData.a.y *= state.totalSize.height;

                                    var selectionBox = [{},{}];
                                    if( finishingPositionData.a.x < finishingPositionData.b.x ){
                                        selectionBox[0].x = finishingPositionData.a.x;
                                        selectionBox[1].x = finishingPositionData.b.x;
                                    }else{
                                        selectionBox[0].x = finishingPositionData.b.x;
                                        selectionBox[1].x = finishingPositionData.a.x;
                                    }
                                    if( finishingPositionData.a.y < finishingPositionData.b.y ){
                                        selectionBox[0].y = finishingPositionData.a.y;
                                        selectionBox[1].y = finishingPositionData.b.y;
                                    }else{
                                        selectionBox[0].y = finishingPositionData.b.y;
                                        selectionBox[1].y = finishingPositionData.a.y;
                                    }

                                //deselect everything
                                    while(state.selectedNotes.length > 0){
                                        state.selectedNotes[0].deselect();
                                    }

                                //select the notes that overlap with the selection area
                                    var noteBlocks = notePane.getElementsByTagName('g');
                                    for(var a = 0; a < noteBlocks.length; a++){
                                        var temp = state.noteRegistry.getNote(parseInt(noteBlocks[a].id));
                                        var block = [
                                                {x:temp.position*(state.totalSize.width/count.totalX), y:temp.line*(state.totalSize.height/count.totalY)},
                                                {x:(temp.position+temp.length)*(state.totalSize.width/count.totalX), y:(temp.line+1)*(state.totalSize.height/count.totalY)},
                                            ];    
                                        if( system.utility.math.detectOverlap(selectionBox,block,selectionBox,block) ){ noteBlocks[a].select(true); }
                                    }
                            }
                        );
                    }else if(event[system.super.keys.alt]){ //create note
                        //deselect everything
                            while(state.selectedNotes.length > 0){
                                state.selectedNotes[0].deselect();
                            }
                        
                        //get the current location and make a new note there (with length 0)
                            var position = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,state.totalSize.width,state.totalSize.height));
                            var temp = makeNote(position.line,position.position,0);
    
                        //select this new block, and direct the mouse-down to the right handle (for user lengthening)
                            temp.noteBlock.select();
                            temp.noteBlock.rightHandle.onmousedown(event);
                    }else if(system.keyboard.pressedKeys.Space){//panning
                        var initialPosition = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                        var old_viewposition = {x:state.viewposition.x, y:state.viewposition.y};
                        system.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                var diffPosition = {x:initialPosition.x-livePosition.x, y:initialPosition.y-livePosition.y};
                                obj.viewposition(
                                    old_viewposition.x + (diffPosition.x*count.visibleX)/(count.totalX-count.visibleX),
                                    old_viewposition.y + (diffPosition.y*count.visibleY)/(count.totalY-count.visibleY),
                                );
                            },
                            function(event){}
                        );
                    }else{ //elsewhere click
                        //deselect everything
                            while(state.selectedNotes.length > 0){
                                state.selectedNotes[0].deselect();
                            }
                    }

                };
            //note block area
                var notePane = part.builder('g','notePane',{});
                workarea.appendChild(notePane);


    //controls
        //background
        obj.glowHorizontal = function(state,start,end){
            if(end == undefined){end = start+1;}

            for(var a = start; a < end; a++){
                system.utility.element.setStyle(
                    backgroundDrawArea.children['strip_horizontal_'+a],
                    state ? horizontalStripStyle_glow : horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]]
                );
            }
        };
        obj.glowVertical = function(state,start,end){
            if(end == undefined){end = start+1;}

            for(var a = start; a < end; a++){
                system.utility.element.setStyle(
                    backgroundDrawArea.children['strip_vertical_'+a],
                    state ? verticalStripStyle_glow : verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]]
                );
            }
        };

        //viewport position
        obj.viewposition = function(x,y){
            if(x == undefined && y == undefined){return state.viewposition;}
            if(x == undefined){ x = state.viewposition.x; }
            if(y == undefined){ y = state.viewposition.y; }

            //make sure things are between 0 and 1
            x = x<0?0:x; x = x>1?1:x;
            y = y<0?0:y; y = y>1?1:y;

            state.viewposition.x = x;
            state.viewposition.y = y;
            system.utility.element.setTransform_XYonly(
                workarea,
                -state.viewposition.x*(state.totalSize.width - width),
                -state.viewposition.y*(state.totalSize.height - height)
            );

            //adjust clipping box to follow where the viewport is looking
            var x_offSet = (state.totalSize.width - width) * state.viewposition.x;
            var y_offSet = (state.totalSize.height - height) * state.viewposition.y;
            var q = {
                tl:{x:x_offSet,       y:y_offSet},
                br:{x:x_offSet+width, y:y_offSet+height},
            };
            viewport.setAttribute('clip-path','polygon('+q.tl.x+'px '+q.tl.y+'px, '+q.tl.x+'px '+q.br.y+'px, '+q.br.x+'px '+q.br.y+'px, '+q.br.x+'px '+q.tl.y+'px)');

            obj.onpan({x:x,y:y});
        };

        //note interaction
        obj.export = function(){return state.noteRegistry.export();};
        obj.import = function(data){state.noteRegistry.import(data);};
        obj.eventsBetween = function(start,end){ return state.noteRegistry.eventsBetween(start,end); };
        obj.getAllNotes = function(){return state.noteRegistry.getAllNotes(); };
        obj.addNote = function(line, position, length, strength=1){ makeNote(line, position, length, strength); };
        obj.addNotes = function(data){ for(var a = 0; a < data.length; a++){this.addNote(data[a].line, data[a].position, data[a].length, data[a].strength);} };

        //loop
        obj.loopActive = function(a){
            if(a == undefined){return state.loop.active;}
            state.loop.active = a;

            obj.glowVertical(false,0,count.totalX);
            if( state.loop.active ){
                obj.glowVertical(true, 
                    state.loop.period.start < 0 ? 0 : state.loop.period.start, 
                    state.loop.period.end > count.totalX ? count.totalX : state.loop.period.end,
                );
            }
        };
        obj.loopPeriod = function(start,end){
            if(start == undefined || end == undefined){return state.loop.period;}
            if(start > end || start < 0 || end < 0){return;}

            state.loop.period = {start:start, end:end};

            if( state.loop.active ){
                obj.glowVertical(false,0,count.totalX);
                obj.glowVertical(true,
                    start < 0 ? 0 : start, 
                    end > count.totalX ? count.totalX : end,
                );
            }
        };

        //playhead
        obj.playheadPosition = function(val,stopActive=true){
            if(val == undefined){return state.playhead.position;}

            state.playhead.position = val;

            //send stop events for all active notes
                if(stopActive){
                    var events = [];
                    for(var a = 0; a < state.activeNotes.length; a++){
                        var tmp = state.noteRegistry.getNote(state.activeNotes[a]); if(tmp == null){continue;}
                        events.unshift( {noteID:state.activeNotes[a], line:tmp.line, position:state.loop.period.start, strength:0} );
                    }
                    state.activeNotes = [];
                    if(obj.event && events.length > 0){obj.event(events);}
                }

            //reposition graphical playhead
                if(state.playhead.position < 0 || state.playhead.position > count.totalX){
                    //outside vilible bounds, so remove
                    if( workarea.children.playhead ){ workarea.children.playhead.remove(); }
                }else{ 
                    //within vilible bounds, so either create or adjust
                    if( !workarea.children.playhead ){ makePlayhead(); }
                    system.utility.element.setTransform_XYonly(workarea.children.playhead, state.playhead.position*(state.totalSize.width/count.totalX), 0);
                    //if the new position is beyond the view in the viewport, adjust the viewport (putting the playhead on the leftmost side)
                    //(assuming automoveViewposition is set)
                    if(state.playhead.automoveViewposition){
                        var remainderSpace = count.totalX-count.visibleX;
                        if( state.playhead.position < Math.floor(state.viewposition.x*remainderSpace)   || 
                            state.playhead.position > Math.floor(state.viewposition.x*remainderSpace) + count.visibleX  
                        ){ obj.viewposition( (state.playhead.position > remainderSpace ? remainderSpace : state.playhead.position)/remainderSpace ); }
                    }
                }
        };
        obj.progress = function(){
            //if the playhead is being held, just bail completly
                if(state.playhead.held){return;}
                
            //if there's no playhead; create one and set its position to 0
                if(state.playhead.position < 0){makePlayhead(); state.playhead.position = 0; }

            //gather together all the current events
                var events = obj.eventsBetween(state.playhead.position, state.playhead.position+state.step);

            //upon loop; any notes that are still active are to be ended
            //(so create end events for them, and push those into the current events list)
                if(state.loop.active && state.playhead.position == state.loop.period.start){
                    for(var a = 0; a < state.activeNotes.length; a++){
                        var tmp = state.noteRegistry.getNote(state.activeNotes[a]); if(tmp == null){continue;}
                        events.unshift( {noteID:state.activeNotes[a], line:tmp.line, position:state.loop.period.start, strength:0} );
                    }
                    state.activeNotes = [];
                }

            //add newly started notes to - and remove newly finished notes from - 'activeNotes'
                for(var a = 0; a < events.length; a++){
                    var index = state.activeNotes.indexOf(events[a].noteID);
                    if(index != -1 && events[a].strength == 0){
                        state.activeNotes.splice(index);
                    }else{
                        if( events[a].strength > 0 ){
                            state.activeNotes.push(events[a].noteID);
                        }
                    }
                }

            //progress position
                if( state.loop.active && (state.playhead.position+state.step == state.loop.period.end) ){
                    state.playhead.position = state.loop.period.start;
                }else{
                    state.playhead.position = state.playhead.position+state.step;
                }

            //update graphical playhead
                obj.playheadPosition(state.playhead.position,false);

            //perform event callback
                if(obj.event && events.length > 0){obj.event(events);}
        };

    //callback
        obj.onpan = function(data){};

    return obj;
};
















infSeq.noteBlock = function(
    id, unit_x, unit_y,
    line, position, length, glow=false, 
    bodyStyle='fill:rgba(150,100,150,0.75);stroke:rgba(200,100,200,1);stroke-width:0.5;',
    bodyGlowStyle='fill:rgba(200,100,200,0.9);stroke:rgba(200,100,200,1);stroke-width:0.5;',
    handleStyle='fill:rgba(255,0,255,0.75);cursor:col-resize;',
    handleWidth=5,
){
    var selected = false;
    
    //elements
        var obj = part.builder('g',id,{y:line*unit_y, x:position*unit_x});
        obj.body = part.builder('rect','body',{width:length*unit_x, height:unit_y, style:bodyStyle});
        obj.leftHandle = part.builder('rect','leftHandle',{x:-handleWidth/2, width:handleWidth, height:unit_y,style:handleStyle});
        obj.rightHandle = part.builder('rect','rightHandle',{x:length*unit_x-handleWidth/2, width:handleWidth, height:unit_y, style:handleStyle});
        obj.append(obj.body);
        obj.append(obj.leftHandle);
        obj.append(obj.rightHandle);

    //internal functions
        function updateHeight(){
            obj.body.height.baseVal.value = unit_y;
            obj.leftHandle.height.baseVal.value = unit_y;
            obj.rightHandle.height.baseVal.value = unit_y;
        }
        function updateLength(){
            obj.body.width.baseVal.value = length*unit_x;
            system.utility.element.setTransform_XYonly(obj.rightHandle, length*unit_x-handleWidth/2, 0);
        }
        function updateLineAndPosition(){
            system.utility.element.setTransform_XYonly(obj,position*unit_x, line*unit_y);
        }

    //controls
        obj.unit = function(x,y){
            if(x == undefined || y == undefined){return {x:unit_x,y:unit_y};}
            unit_x = x;
            unit_y = y;
            updateHeight();
            updateLength();
            updateLineAndPosition();
        };
        obj.line = function(a){
            if(a == undefined){return line;}
            line = a;
            updateLineAndPosition();
        };
        obj.position = function(a){
            if(a == undefined){return position;}
            position = a;
            updateLineAndPosition();
        };
        obj.length = function(a){
            if(a == undefined){return length;}
            length = a;
            updateLength();
        };
        obj.glow = function(a){
            if(a == undefined){return glow;}
            glow = a;
            if(glow){ system.utility.element.setStyle(obj.body, bodyGlowStyle); }
            else{     system.utility.element.setStyle(obj.body, bodyStyle);     }
        };
        obj.selected = function(a){
            if(a == undefined){return selected;}
            selected = a;
        };

    return obj;
};
















var testElement = system.utility.workspace.placeAndReturnObject( infSeq(undefined, 50, 50, 500, 150, 0) );

var horiz = system.utility.workspace.placeAndReturnObject(
    part.builder('slide','hSlide',{x:50, y:240, width:20, height:500, angle:-Math.PI/2, handleHeight:0.05})
);
horiz.onchange = function(value){ testElement.viewposition(value); };

var vert = system.utility.workspace.placeAndReturnObject(
    part.builder('slide','vSlide',{x:20, y:50, width:20, height:150, handleHeight:0.1})
);
vert.onchange = function(value){ testElement.viewposition(undefined, value); };



testElement.onpan = function(data){
    horiz.set(data.x,false);
    vert.set(data.y,false);
};




testElement.loopActive(true);
testElement.loopPeriod(0,64);
setInterval(testElement.progress, 100);