var sequencer2 = function(
    id='sequencer2',
    x, y, width, height, angle,
    
    count_totalX=64, count_totalY=12,
    zoomLevel_x=1/2, zoomLevel_y=10/12,

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
        var totalSize =  {
            width:  width/zoomLevel_x,
            height: height/zoomLevel_y,
        };
        var viewposition = {x:0,y:0};
        var noteRegistry = new part.circuit.sequencing.noteRegistry(count_totalX,count_totalY);
        var selectedNotes = [];
        var activeNotes = [];
        var snapping = true;
        var step = 1/1;
        var loop = {active:false, period:{start:0, end:count_totalX}};
        var playhead = {
            width:0.75,
            invisibleHandleMux:6,
            position:-1,
            held:false,
            automoveViewposition:false,
        };

    //internal functions
        function drawBackground(){
            backgroundDrawArea.innerHTML = '';

            //background stipes
                //horizontal strips
                for(var a = 0; a < count_totalY; a++){
                    backgroundDrawArea.appendChild(
                        part.builder('rect','strip_horizontal_'+a,{
                            x1:0, y:a*(height/(count_totalY*zoomLevel_y)),
                            width:totalSize.width, height:height/(count_totalY*zoomLevel_y),
                            style:horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]],
                        })
                    );
                }
                //vertical strips
                for(var a = 0; a < count_totalX; a++){
                    backgroundDrawArea.appendChild(
                        part.builder('rect','strip_vertical_'+a,{
                            x:a*(width/(count_totalX*zoomLevel_x)), y:0,
                            width:width/(count_totalX*zoomLevel_x), height:totalSize.height,
                            style:verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]],
                        })
                    );
                }
        }
        function setViewposition(x,y){
            if(x == undefined && y == undefined){return viewposition;}
            if(x == undefined){ x = viewposition.x; }
            if(y == undefined){ y = viewposition.y; }

            //make sure things are between 0 and 1
            x = x<0?0:x; x = x>1?1:x;
            y = y<0?0:y; y = y>1?1:y;

            viewposition.x = x;
            viewposition.y = y;
            system.utility.element.setTransform_XYonly(
                workarea,
                -viewposition.x*(totalSize.width - width),
                -viewposition.y*(totalSize.height - height)
            );

            //adjust clipping box to follow where the viewport is looking
            var x_offSet = (totalSize.width - width) * viewposition.x;
            var y_offSet = (totalSize.height - height) * viewposition.y;
            var q = {
                tl:{x:x_offSet,       y:y_offSet},
                br:{x:x_offSet+width, y:y_offSet+height},
            };
            viewport.setAttribute('clip-path','polygon('+q.tl.x+'px '+q.tl.y+'px, '+q.tl.x+'px '+q.br.y+'px, '+q.br.x+'px '+q.br.y+'px, '+q.br.x+'px '+q.tl.y+'px)');

            obj.onpan({x:x,y:y});
        };
        function visible2coordinates(xy){
            return {
                x: zoomLevel_x*(xy.x - viewposition.x) + viewposition.x,
                y: zoomLevel_y*(xy.y - viewposition.y) + viewposition.y,
            };
        }
        function coordinates2lineposition(xy){
            xy.y = Math.floor(xy.y*count_totalY);
            if(xy.y >= count_totalY){xy.y = count_totalY-1;}
        
            xy.x = snapping ? Math.round((xy.x*count_totalX)/step)*step : xy.x*count_totalX;
            if(xy.x < 0){xy.x =0;}
        
            return {line:xy.y, position:xy.x};
        }
        function makeNote(line, position, length, strength=1){
            var newID = noteRegistry.add({ line:line, position:position, length:length, strength:strength });
            var approvedData = noteRegistry.getNote(newID);
            var newNoteBlock = part.element.control.sequencer.noteBlock(newID, width/(count_totalX*zoomLevel_x), height/(count_totalY*zoomLevel_y), approvedData.line, approvedData.position, approvedData.length, false, blockStyle_body, blockStyle_bodyGlow, blockStyle_handle, blockStyle_handleWidth);
            notePane.append(newNoteBlock);

            //augmenting the graphic element
                newNoteBlock.select = function(remainSelected=false){
                    if(selectedNotes.indexOf(this) != -1){ if(!remainSelected){this.deselect();} return; }
                    this.selected(true);
                    selectedNotes.push(this);
                    this.glow(true);
                };
                newNoteBlock.deselect = function(){
                    selectedNotes.splice(selectedNotes.indexOf(this),1);
                    this.selected(false);
                    this.glow(false);
                };
                newNoteBlock.delete = function(){
                    this.deselect();
                    noteRegistry.remove(parseInt(this.id));
                    this.remove();
                };
                newNoteBlock.ondblclick = function(event){
                    if(!event[system.super.keys.ctrl]){return;}
                    while(selectedNotes.length > 0){
                        selectedNotes[0].delete();
                    }
                };
                newNoteBlock.body.onmousedown = function(event){
                    //if the shift key is not pressed and this note is not already selected; deselect everything
                        if(!event.shiftKey && !newNoteBlock.selected()){
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
                            }
                        }
                    
                    //select this block
                        newNoteBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(selectedNotes[a].id),
                                block: selectedNotes[a],
                                starting: noteRegistry.getNote(parseInt(selectedNotes[a].id)),
                            });
                        }

                    //if the alt key is pressed, clone the block
                    //(but don't select it, this is 'alt-click-and-drag to clone' trick)
                    //this function isn't run until the first sign of movement
                    var cloned = false;
                    function cloneFunc(){
                        if(cloned){return;} cloned = true;
                        if(event[system.super.keys.alt]){
                            for(var a = 0; a < selectedNotes.length; a++){
                                var temp = noteRegistry.getNote(parseInt(selectedNotes[a].id));
                                makeNote(temp.line, temp.position, temp.length, temp.strength);
                            }
                        }
                    }

                    //block movement
                        var initialPosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                        system.utility.workspace.mouseInteractionHandler(
                            function(event){//move
                                cloneFunc(); //clone that block

                                var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                var diff = {
                                    line: livePosition.line - initialPosition.line,
                                    position: livePosition.position - initialPosition.position,
                                };
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    noteRegistry.update(activeBlocks[a].id, {
                                        line:activeBlocks[a].starting.line+diff.line,
                                        position:activeBlocks[a].starting.position+diff.position,
                                    });
        
                                    var temp = noteRegistry.getNote(activeBlocks[a].id);
        
                                    activeBlocks[a].block.line( temp.line );
                                    activeBlocks[a].block.position( temp.position );
                                }
                            },
                        );
                };
                newNoteBlock.leftHandle.onmousedown = function(event){
                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!event.shiftKey && !newNoteBlock.selected()){
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
                            }
                        }
                    
                    //select this block
                        newNoteBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(selectedNotes[a].id),
                                block: selectedNotes[a],
                                starting: noteRegistry.getNote(parseInt(selectedNotes[a].id)),
                            });
                        }
                    
                    //perform block length adjustment 
                        var initialPosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                        system.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                var diff = {position: initialPosition.position-livePosition.position};
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    if( activeBlocks[a].starting.position-diff.position < 0 ){ continue; } //this stops a block from getting longer, when it is unable to move any further to the left
                                    
                                    noteRegistry.update(activeBlocks[a].id, {
                                        length: activeBlocks[a].starting.length+diff.position,
                                        position: activeBlocks[a].starting.position-diff.position,
                                    });
                                    var temp = noteRegistry.getNote(activeBlocks[a].id);
                                    activeBlocks[a].block.position( temp.position );
                                    activeBlocks[a].block.length( temp.length );
                                }
                            }
                        );
                };
                newNoteBlock.rightHandle.onmousedown = function(event){
                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!event.shiftKey && !newNoteBlock.selected()){
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
                            }
                        }
                    
                    //select this block
                        newNoteBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(selectedNotes[a].id),
                                block: selectedNotes[a],
                                starting: noteRegistry.getNote(parseInt(selectedNotes[a].id)),
                            });
                        }

                    //perform block length adjustment 
                        var initialPosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                        system.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                var diff = {position: livePosition.position - initialPosition.position};
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    noteRegistry.update(activeBlocks[a].id, {length: activeBlocks[a].starting.length+diff.position});
                                    var temp = noteRegistry.getNote(activeBlocks[a].id);
                                    activeBlocks[a].block.position( temp.position );
                                    activeBlocks[a].block.length( temp.length );
                                }
                            }
                        );
                };

            return {id:newID, noteBlock:newNoteBlock};
        }
        function makePlayhead(){
            var newPlayhead = part.builder('g','playhead',{});
            workarea.appendChild(newPlayhead);
            newPlayhead.onmousedown = function(){
                playhead.held = true;
                system.utility.workspace.mouseInteractionHandler(
                    function(event){//move
                        var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                        obj.playheadPosition(livePosition.position);
                    },
                    function(){playhead.held = false;}
                );
            };

            newPlayhead.main = part.builder('line','main',{
                x1:0, y1:0,
                x2:0, y2:totalSize.height,
                style:playheadStyle + 'stroke-width:'+playhead.width+';'
            });
            newPlayhead.appendChild(newPlayhead.main);

            newPlayhead.invisibleHandle = part.builder('line','invisibleHandle',{
                x1:0, y1:0, x2:0, y2:totalSize.height,
                style:'stroke:rgba(0,0,0,0); cursor: col-resize; stroke-width:'+playhead.width*playhead.invisibleHandleMux+';'
            });
            newPlayhead.appendChild(newPlayhead.invisibleHandle);
        }

    //elements
        //main
            var obj = part.builder('g',id,{x:x, y:y, r:angle});
        //static backing
            var backing = part.builder('rect','backing',{width:width, height:height, style:backingStyle});
            obj.appendChild(backing);
        //viewport (for clipping the workarea)
            var viewport = part.builder('g','viewport',{});
            viewport.setAttribute('clip-path','polygon(0px 0px, '+width+'px 0px, '+width+'px '+height+'px, 0px '+height+'px)');
            obj.appendChild(viewport);
        //workarea
            var workarea = part.builder('g','workarea',{});
            viewport.appendChild(workarea);
            workarea.onkeydown = function(event){
                if(event.key == 'Delete' || event.key == 'Backspace'){
                    //delete all selected notes
                    while(selectedNotes.length > 0){
                        selectedNotes[0].delete();
                    }
                    return true;
                }
            };
            //moveable background
                var backgroundDrawArea = part.builder('g','backgroundDrawArea',{});
                workarea.appendChild(backgroundDrawArea);
                drawBackground();
            //interaction pane
                var interactionPlane = part.builder('rect','interactionPlane',{width:totalSize.width, height:totalSize.height, style:'fill:rgba(0,0,0,0);'});
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
                                    finishingPositionData.a.x *= totalSize.width;  finishingPositionData.b.y *= totalSize.height;
                                    finishingPositionData.b.x *= totalSize.width;  finishingPositionData.a.y *= totalSize.height;

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
                                    while(selectedNotes.length > 0){
                                        selectedNotes[0].deselect();
                                    }

                                //select the notes that overlap with the selection area
                                    var noteBlocks = notePane.getElementsByTagName('g');
                                    for(var a = 0; a < noteBlocks.length; a++){
                                        var temp = noteRegistry.getNote(parseInt(noteBlocks[a].id));
                                        var block = [
                                                {x:temp.position*(totalSize.width/count_totalX), y:temp.line*(totalSize.height/count_totalY)},
                                                {x:(temp.position+temp.length)*(totalSize.width/count_totalX), y:(temp.line+1)*(totalSize.height/count_totalY)},
                                            ];    
                                        if( system.utility.math.detectOverlap(selectionBox,block,selectionBox,block) ){ noteBlocks[a].select(true); }
                                    }
                            }
                        );
                    }else if(event[system.super.keys.alt]){ //create note
                        //deselect everything
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
                            }
                        
                        //get the current location and make a new note there (with length 0)
                            var position = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                            var temp = makeNote(position.line,position.position,0);
    
                        //select this new block, and direct the mouse-down to the right handle (for user lengthening)
                            temp.noteBlock.select();
                            temp.noteBlock.rightHandle.onmousedown(event);
                    }else if(system.keyboard.pressedKeys.Space){//panning
                        var initialPosition = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                        var old_viewposition = {x:viewposition.x, y:viewposition.y};
                        system.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                var diffPosition = {x:initialPosition.x-livePosition.x, y:initialPosition.y-livePosition.y};
                                setViewposition(
                                    old_viewposition.x + (diffPosition.x*(count_totalX*zoomLevel_x))/(count_totalX-(count_totalX*zoomLevel_x)),
                                    old_viewposition.y + (diffPosition.y*(count_totalY*zoomLevel_y))/(count_totalY-(count_totalY*zoomLevel_y)),
                                );
                            },
                            function(event){}
                        );
                    }else{ //elsewhere click
                        //deselect everything
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
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

        //step
        obj.step = function(a){
            if(a == undefined){return step;}
            state.step = a;
        };

        //viewport position
        obj.viewposition = setViewposition;

        //note interaction
        obj.export = function(){return noteRegistry.export();};
        obj.import = function(data){noteRegistry.import(data);};
        obj.eventsBetween = function(start,end){ return noteRegistry.eventsBetween(start,end); };
        obj.getAllNotes = function(){return noteRegistry.getAllNotes(); };
        obj.addNote = function(line, position, length, strength=1){ makeNote(line, position, length, strength); };
        obj.addNotes = function(data){ for(var a = 0; a < data.length; a++){this.addNote(data[a].line, data[a].position, data[a].length, data[a].strength);} };

        //loop
        obj.loopActive = function(a){
            if(a == undefined){return loop.active;}
            loop.active = a;

            obj.glowVertical(false,0,count_totalX);
            if( loop.active ){
                obj.glowVertical(true, 
                    loop.period.start < 0 ? 0 : loop.period.start, 
                    loop.period.end > count_totalX ? count_totalX : loop.period.end,
                );
            }
        };
        obj.loopPeriod = function(start,end){
            if(start == undefined || end == undefined){return loop.period;}
            if(start > end || start < 0 || end < 0){return;}

            loop.period = {start:start, end:end};

            if( loop.active ){
                obj.glowVertical(false,0,count_totalX);
                obj.glowVertical(true,
                    start < 0 ? 0 : start, 
                    end > count_totalX ? count_totalX : end,
                );
            }
        };

        //playhead
        obj.playheadPosition = function(val,stopActive=true){
            if(val == undefined){return playhead.position;}

            playhead.position = val;

            //send stop events for all active notes
                if(stopActive){
                    var events = [];
                    for(var a = 0; a < activeNotes.length; a++){
                        var tmp = noteRegistry.getNote(activeNotes[a]); if(tmp == null){continue;}
                        events.unshift( {noteID:activeNotes[a], line:tmp.line, position:loop.period.start, strength:0} );
                    }
                    activeNotes = [];
                    if(obj.event && events.length > 0){obj.event(events);}
                }

            //reposition graphical playhead
                if(playhead.position < 0 || playhead.position > count_totalX){
                    //outside vilible bounds, so remove
                    if( workarea.children.playhead ){ workarea.children.playhead.remove(); }
                }else{ 
                    //within vilible bounds, so either create or adjust
                    if( !workarea.children.playhead ){ makePlayhead(); }
                    system.utility.element.setTransform_XYonly(workarea.children.playhead, playhead.position*(totalSize.width/count_totalX), 0);
                    //if the new position is beyond the view in the viewport, adjust the viewport (putting the playhead on the leftmost side)
                    //(assuming automoveViewposition is set)
                    if(playhead.automoveViewposition){
                        var remainderSpace = count_totalX-(count_totalX*zoomLevel_x);
                        if( playhead.position < Math.floor(viewposition.x*remainderSpace)   || 
                            playhead.position > Math.floor(viewposition.x*remainderSpace) + (count_totalX*zoomLevel_x)  
                        ){ obj.viewposition( (playhead.position > remainderSpace ? remainderSpace : playhead.position)/remainderSpace ); }
                    }
                }
        };
        obj.progress = function(){
            //if the playhead is being held, just bail completly
                if(playhead.held){return;}
                
            //if there's no playhead; create one and set its position to 0
                if(playhead.position < 0){makePlayhead(); playhead.position = 0; }

            //gather together all the current events
                var events = obj.eventsBetween(playhead.position, playhead.position+step);

            //upon loop; any notes that are still active are to be ended
            //(so create end events for them, and push those into the current events list)
                if(loop.active && playhead.position == loop.period.start){
                    for(var a = 0; a < activeNotes.length; a++){
                        var tmp = noteRegistry.getNote(activeNotes[a]); if(tmp == null){continue;}
                        events.unshift( {noteID:activeNotes[a], line:tmp.line, position:loop.period.start, strength:0} );
                    }
                    activeNotes = [];
                }

            //add newly started notes to - and remove newly finished notes from - 'activeNotes'
                for(var a = 0; a < events.length; a++){
                    var index = activeNotes.indexOf(events[a].noteID);
                    if(index != -1 && events[a].strength == 0){
                        activeNotes.splice(index);
                    }else{
                        if( events[a].strength > 0 ){
                            activeNotes.push(events[a].noteID);
                        }
                    }
                }

            //progress position
                if( loop.active && (playhead.position+step == loop.period.end) ){
                    playhead.position = loop.period.start;
                }else{
                    playhead.position = playhead.position+step;
                }

            //update graphical playhead
                obj.playheadPosition(playhead.position,false);

            //perform event callback
                if(obj.event && events.length > 0){obj.event(events);}
        };
        
    //callbacks
        obj.onpan = function(data){};
        obj.event = function(events){};

    return obj;
};
















sequencer2.noteBlock = function(
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
















var testElement = system.utility.workspace.placeAndReturnObject( sequencer2(undefined, 50, 50, 500, 150, 0) );
testElement.loopActive(true);
testElement.loopPeriod(0,64);
setInterval(testElement.progress, 100);