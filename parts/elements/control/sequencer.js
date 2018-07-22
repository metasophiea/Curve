this.sequencer = function(
    id='sequencer',
    x, y, width, height, angle,
    xCount=64, yCount=10,

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

    backingStyle='fill:rgba(20,20,20,1);',
    selectionAreaStyle='fill:rgba(150,100,100,0.75);stroke:rgba(200,100,100,1);stroke-width:0.5;pointer-events:none;',

    blockStyle_body='fill:rgba(150,100,150,0.75);stroke:rgba(200,100,200,1);stroke-width:0.5;',
    blockStyle_bodyGlow='fill:rgba(200,100,200,0.9);stroke:rgba(200,100,200,1);stroke-width:0.5;',
    blockStyle_handle='fill:rgba(255,0,255,0.75);cursor:col-resize;',
    blockStyle_handleWidth=3,

    playheadStyle='stroke:rgb(240, 240, 240);',
){
    var state = {
        noteRegistry: new parts.elements.control.sequencer.noteRegistry(xCount,yCount),

        snapping:true,
        step:1/1,

        selectedNotes:[],
        activeNotes:[],

        playhead:{
            width:0.75,
            invisibleHandleMux:6,
            position:-1,
            held:false,
        },
        loop:{active:false, period:{start:0, end:xCount}},
    };

    //internal functions
        function cordinates2lineposition(xy){
            xy.y = Math.floor(xy.y*yCount);
            if(xy.y >= yCount){xy.y = yCount-1;}
        
            xy.x = state.snapping ? Math.round((xy.x*xCount)/state.step)*state.step : xy.x*xCount;
            if(xy.x < 0){xy.x =0;}
        
            return {line:xy.y, position:xy.x};
        }
        function drawBackground(){
            backingDrawArea.innerHTML = '';

            //background stipes
                //horizontal strips
                for(var a = 0; a < yCount; a++){
                    backingDrawArea.appendChild(
                        __globals.utility.experimental.elementMaker('rect','strip_horizontal_'+a,{
                            x1:0, y:a*(height/yCount),
                            width:width, height:height/yCount,
                            style:horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]],
                        })
                    );
                }
                //vertical strips
                for(var a = 0; a < xCount; a++){
                    backingDrawArea.appendChild(
                        __globals.utility.experimental.elementMaker('rect','strip_vertical_'+a,{
                            x:a*(width/xCount), y:0,
                            width:width/xCount, height:height,
                            style:verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]],
                        })
                    );
                }
        }
        function makePlayhead(){
            var playhead = __globals.utility.experimental.elementMaker('g','playhead',{});
            obj.appendChild(playhead);
            playhead.onmousedown = function(event){
                // var initialPosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,obj,width,height));
                __globals.utility.workspace.mouseInteractionHandler(
                    function(event){//move
                        state.playhead.held = true;
                        var livePosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,obj,width,height));
                        obj.playheadPosition(livePosition.position);
                    },
                    function(){state.playhead.held = false;}
                );
            };

            playhead.main = __globals.utility.experimental.elementMaker('line','main',{
                x1:0, y1:0,
                x2:0, y2:height,
                style:playheadStyle + 'stroke-width:'+state.playhead.width+';'
            });
            playhead.appendChild(playhead.main);

            playhead.main = __globals.utility.experimental.elementMaker('line','invisibleHandle',{
                x1:0, y1:0, x2:0, y2:height,
                style:'stroke:rgba(0,0,0,0); cursor: col-resize; stroke-width:'+state.playhead.width*state.playhead.invisibleHandleMux+';'
            });
            playhead.appendChild(playhead.main);
        }
        function makeNote(line, position, length, strength=1){
            var newID = state.noteRegistry.add({ line:line, position:position, length:length, strength:strength });
            var approvedData = state.noteRegistry.getNote(newID);
            var newNoteBlock = parts.elements.control.sequencer.noteBlock(newID, width/xCount, height/yCount, approvedData.line, approvedData.position, approvedData.length, false, blockStyle_body, blockStyle_bodyGlow, blockStyle_handle, blockStyle_handleWidth);
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
                    if(!event[__globals.super.keys.ctrl]){return;}
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

                    //if the alt key is pressed, clone the block
                    //(but don't select it, this is 'alt-click-and-drag to clone' trick)
                        if(event[__globals.super.keys.alt]){
                            for(var a = 0; a < state.selectedNotes.length; a++){
                                var temp = state.noteRegistry.getNote(parseInt(state.selectedNotes[a].id));
                                makeNote(temp.line, temp.position, temp.length, temp.strength);
                            }
                        }

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < state.selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(state.selectedNotes[a].id),
                                block: state.selectedNotes[a],
                                starting: state.noteRegistry.getNote(parseInt(state.selectedNotes[a].id)),
                            });
                        }

                    //block movement
                        var initialPosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,obj,width,height));
                        __globals.utility.workspace.mouseInteractionHandler(
                            function(event){//move
                                var livePosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,obj,width,height));
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
                        var initialPosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,obj,width,height));
                        __globals.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,obj,width,height));
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
                        var initialPosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,obj,width,height));
                        __globals.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,obj,width,height));
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
            var obj = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y, r:angle});
        //background
            var backing = __globals.utility.experimental.elementMaker('rect','backing',{width:width, height:height, style:backingStyle});
            obj.appendChild(backing);
            var backingDrawArea = __globals.utility.experimental.elementMaker('g','backingDrawArea',{});
            obj.appendChild(backingDrawArea);
            drawBackground();
        //interaction pane
            var interactionPlane = __globals.utility.experimental.elementMaker('rect','interactionPlane',{width:width, height:height, style:'fill:rgba(0,0,0,0);'});
            obj.appendChild(interactionPlane);
            interactionPlane.onmousedown = function(event){
                if(event.shiftKey){ //click-n-drag group select
                    var initialPositionData = __globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,width,height);
                    
                    var selectionArea = __globals.utility.experimental.elementMaker('rect','selectionArea',{
                        x:initialPositionData.x*width, y:initialPositionData.y*height,
                        width:0, height:0,
                        style:selectionAreaStyle,
                    });
                    obj.appendChild(selectionArea);

                    __globals.utility.workspace.mouseInteractionHandler(
                        function(event){//move
                            //live re-size the selection box
                                var livePositionData = __globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,width,height);
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
        
                                __globals.utility.element.setTransform_XYonly(selectionArea, transform.x*width, transform.y*height);
                        },
                        function(event){//stop
                            //remove selection box
                                selectionArea.remove();

                            //gather the corner points
                                var finishingPositionData = __globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,width,height);
                                var selectionBox = [{},{}];
                                if( initialPositionData.x < finishingPositionData.x ){
                                    selectionBox[0].x = initialPositionData.x*width;
                                    selectionBox[1].x = finishingPositionData.x*width;
                                }else{
                                    selectionBox[0].x = finishingPositionData.x*width;
                                    selectionBox[1].x = initialPositionData.x*width;
                                }
                                if( initialPositionData.y < finishingPositionData.y ){
                                    selectionBox[0].y = initialPositionData.y*height;
                                    selectionBox[1].y = finishingPositionData.y*height;
                                }else{
                                    selectionBox[0].y = finishingPositionData.y*height;
                                    selectionBox[1].y = initialPositionData.y*height;
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
                                            {x:temp.position*(width/xCount), y:temp.line*(height/yCount)},
                                            {x:(temp.position+temp.length)*(width/xCount), y:(temp.line+1)*(height/yCount)},
                                        ];

                                    if( __globals.utility.math.detectOverlap(selectionBox,block,selectionBox,block) ){ noteBlocks[a].select(true); }
                                }
                        }
                    );
                
                
                }else if(event[__globals.super.keys.alt]){ //create note
                    //deselect everything
                        while(state.selectedNotes.length > 0){
                            state.selectedNotes[0].deselect();
                        }
                    
                    //get the current location and make a new note there (with length 0)
                        var position = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,width,height));
                        var temp = makeNote(position.line,position.position,0);

                    //select this new block, and direct the mouse-down to the right handle (for user lengthening)
                        temp.noteBlock.select();
                        temp.noteBlock.rightHandle.onmousedown(event);

                }else{ //general panning (not implimented)
                    //deselect everything
                        while(state.selectedNotes.length > 0){
                            state.selectedNotes[0].deselect();
                        }
                }
            };
        //note pane
            var notePane = __globals.utility.experimental.elementMaker('g','notePane',{});
            obj.append(notePane);
            
    //controls
        obj.export = function(){return state.noteRegistry.export();};
        obj.import = function(data){state.noteRegistry.import(data);};
        obj.eventsBetween = function(start,end){ return state.noteRegistry.eventsBetween(start,end); };
        obj.getAllNotes = function(){return state.noteRegistry.getAllNotes(); };
        obj.addNote = function(line, position, length, strength=1){ makeNote(line, position, length, strength); };
        obj.addNotes = function(data){ for(var a = 0; a < data.length; a++){this.addNote(data[a].line, data[a].position, data[a].length, data[a].strength);} };

        obj.glowHorizontal = function(state,start,end){
            if(end == undefined){end = start;}

            for(var a = start; a < end; a++){
                __globals.utility.element.setStyle(
                    backingDrawArea.children['strip_horizontal_'+a],
                    state ? horizontalStripStyle_glow : horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]]
                );
            }
        };
        obj.glowVertical = function(state,start,end){
            if(end == undefined){end = start;}

            for(var a = start; a < end; a++){
                __globals.utility.element.setStyle(
                    backingDrawArea.children['strip_vertical_'+a],
                    state ? verticalStripStyle_glow : verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]]
                );
            }
        };

        obj.loopActive = function(a){
            if(a == undefined){return state.loop.active;}
            state.loop.active = a;

            obj.glowVertical(false,0,xCount);
            if( state.loop.active ){
                obj.glowVertical(true, 
                    state.loop.period.start < 0 ? 0 : state.loop.period.start, 
                    state.loop.period.end > xCount ? xCount : state.loop.period.end,
                );
            }
        };
        obj.loopPeriod = function(start,end){
            if(start == undefined || end == undefined){return state.loop.period;}
            if(start > end || start < 0 || end < 0){return;}

            state.loop.period = {start:start, end:end};

            if( state.loop.active ){
                obj.glowVertical(false,0,xCount);
                obj.glowVertical(true,
                    start < 0 ? 0 : start, 
                    end > xCount ? xCount : end,
                );
            }
        };

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
                if(state.playhead.position < 0 || state.playhead.position > xCount){ //outside vilible bounds
                    if( obj.children.playhead ){ obj.children.playhead.remove(); }
                }else{ //within vilible bounds
                    if( !obj.children.playhead ){ makePlayhead(); }
                    __globals.utility.element.setTransform_XYonly(obj.children.playhead, state.playhead.position*(width/xCount), 0);
                }
        };
        obj.step = function(a){
            if(a == undefined){return state.step;}
            state.step = a;
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

    //callbacks
        obj.event = function(events){};

    //setup

    return obj;
};
















this.sequencer.noteBlock = function(
    id, unit_x, unit_y,
    line, position, length, glow=false, 
    bodyStyle='fill:rgba(150,100,150,0.75);stroke:rgba(200,100,200,1);stroke-width:0.5;',
    bodyGlowStyle='fill:rgba(200,100,200,0.9);stroke:rgba(200,100,200,1);stroke-width:0.5;',
    handleStyle='fill:rgba(255,0,255,0.75);cursor:col-resize;',
    handleWidth=5,
){
    var selected = false;
    
    //elements
        var obj = __globals.utility.experimental.elementMaker('g',id,{y:line*unit_y, x:position*unit_x});
        obj.body = __globals.utility.experimental.elementMaker('rect','body',{width:length*unit_x, height:unit_y, style:bodyStyle});
        obj.leftHandle = __globals.utility.experimental.elementMaker('rect','leftHandle',{x:-handleWidth/2, width:handleWidth, height:unit_y,style:handleStyle});
        obj.rightHandle = __globals.utility.experimental.elementMaker('rect','rightHandle',{x:length*unit_x-handleWidth/2, width:handleWidth, height:unit_y, style:handleStyle});
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
            __globals.utility.element.setTransform_XYonly(obj.rightHandle, length*unit_x-handleWidth/2, 0);
        }
        function updateLineAndPosition(){
            __globals.utility.element.setTransform_XYonly(obj,position*unit_x, line*unit_y);
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
            if(glow){ __globals.utility.element.setStyle(obj.body, bodyGlowStyle); }
            else{     __globals.utility.element.setStyle(obj.body, bodyStyle);     }
        };
        obj.selected = function(a){
            if(a == undefined){return selected;}
            selected = a;
        };

    return obj;
};










this.sequencer.noteRegistry = function(rightLimit=-1,bottomLimit=-1,blockLengthLimit=-1){
    var notes = [];
    var selectedNotes = [];
    var events = [];
    var events_byID = [];
    var events_byPosition = {};
    var positions = [];

    this.__dump = function(){
        console.log('---- noteRegistry dump ----');

        console.log('\tnotes');
        for(var a = 0; a < notes.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(notes[a]) );
        }

        console.log('\tselectedNotes');
        for(var a = 0; a < selectedNotes.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(selectedNotes[a]) );
        }

        console.log('\tevents');
        for(var a = 0; a < events.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(events[a]) );
        }

        console.log('\tevents_byID');
        for(var a = 0; a < events_byID.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(events_byID[a]) );
        }

        console.log('\tevents_byPosition');
        var keys = Object.keys(events_byPosition);
        for(var a = 0; a < keys.length; a++){ 
            console.log( '\t\t', keys[a], ' ' + JSON.stringify(events_byPosition[keys[a]]) );
        }

        console.log('\tpositions');
        for(var a = 0; a < positions.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(positions[a]) );
        }
    };

    this.export = function(){
        return JSON.parse(JSON.stringify(
            {
                notes:              notes,
                selectedNotes:      selectedNotes,
                events:             events,
                events_byID:        events_byID,
                events_byPosition:  events_byPosition,
                positions:          positions,
            }
        ));
    };
    this.import = function(data){
        notes =             JSON.parse(JSON.stringify(data.notes));
        selectedNotes =     JSON.parse(JSON.stringify(data.selectedNotes));
        events =            JSON.parse(JSON.stringify(data.events));
        events_byID =       JSON.parse(JSON.stringify(data.events_byID));
        events_byPosition = JSON.parse(JSON.stringify(data.events_byPosition));
        positions =         JSON.parse(JSON.stringify(data.positions));
    };

    this.getAllNotes = function(){ return JSON.parse(JSON.stringify(notes)); };
    this.getAllEvents = function(){ return JSON.parse(JSON.stringify(events)); };
    this.getNote = function(id){
        if( notes[id] == undefined ){return;}
        return JSON.parse(JSON.stringify(notes[id]));
    };
    this.eventsBetween = function(start,end){
        //depending on whether theres an end position or not; get all the events positions that 
        //lie on the start positions, or get all the events that how positions which lie between
        //the start and end positions
        var eventNumbers = end == undefined ? 
            Array.from(new Set(positions.filter(function(a){return a == start;}))) : 
            Array.from(new Set(positions.filter(function(a){return a >= start && a < end;}))) ;

        //for each position, convert the number to a string, and gather the associated event number arrays
        //then, for each array, get each event and place that into the output array
        var compiledEvents = [];
        for(var a = 0; a < eventNumbers.length; a++){
            eventNumbers[a] = events_byPosition[String(eventNumbers[a])];
            for(var b = 0; b < eventNumbers[a].length; b++){
                compiledEvents.push(events[eventNumbers[a][b]]);
            }
        }

        //sort array by position (soonest first)
        return compiledEvents.sort(function(a, b){
            if(a.position < b.position) return -1;
            if(a.position > b.position) return 1;
            return 0;
        });
    };
    this.add = function(data,forceID){
        //clean up data
            if(data == undefined || !('line' in data) || !('position' in data) || !('length' in data)){return;}
            if(!('strength' in data)){data.strength = 1;}
        //check for and correct disallowed data
            if(data.line < 0){data.line = 0;}
            if(data.length < 0){data.length = 0;}
            if(data.position < 0){data.position = 0;}

            if(bottomLimit > -1 && (data.line > bottomLimit-1)){data.line = bottomLimit-1;}
            if(blockLengthLimit > -1 && (data.length > blockLengthLimit)){data.length = blockLengthLimit;}
            if(rightLimit > -1 && (data.position > rightLimit) ){data.position = rightLimit-data.length;}
            if(rightLimit > -1 && (data.position+data.length > rightLimit)){ data.length = rightLimit-data.position; }
            if(data.position+data.length > rightLimit){data.position = rightLimit-data.length;}

        //generate note ID
            var newID = 0;
            if(forceID == undefined){
                while(notes[newID] != undefined){newID++;}
            }else{newID = forceID;}

        //add note to storage
            notes[newID] = JSON.parse(JSON.stringify(data));

        //generate event data
            var newEvents = [
                {noteID:newID, line:data.line, position:data.position,               strength:data.strength},
                {noteID:newID, line:data.line, position:(data.position+data.length), strength:0}
            ];

        //add event data to storage
            var eventLocation = 0;
            //start event
                while(events[eventLocation] != undefined){eventLocation++;}
                events[eventLocation] = newEvents[0];
                events_byID[newID] = [eventLocation];
                if( events_byPosition[newEvents[0].position] == undefined ){
                    events_byPosition[newEvents[0].position] = [eventLocation];
                }else{
                    events_byPosition[newEvents[0].position].push(eventLocation);
                }
                positions.push(newEvents[0].position);
            //end event
                while(events[eventLocation] != undefined){eventLocation++;}
                events[eventLocation] = newEvents[1];
                events_byID[newID] = events_byID[newID].concat(eventLocation);
                if( events_byPosition[newEvents[1].position] == undefined ){
                    events_byPosition[newEvents[1].position] = [eventLocation];
                }else{
                    events_byPosition[newEvents[1].position].push(eventLocation);
                }
                positions.push(newEvents[1].position);

        return newID;
    };
    this.remove = function(id){
        if( notes[id] == undefined ){return;}

        delete notes[id];

        for(var a = 0; a < events_byID[id].length; a++){
            var tmp = events_byID[id][a];
            events_byPosition[events[tmp].position].splice( events_byPosition[events[tmp].position].indexOf(tmp) ,1);
            positions.splice(positions.indexOf(events[tmp].position),1);
            if( events_byPosition[events[tmp].position].length == 0 ){delete events_byPosition[events[tmp].position];}
            delete events[tmp];
        }

        delete events_byID[id];
    };
    this.update = function(id,data){
        //clean input
            if(data == undefined){return;}
            if(!('line' in data)){data.line = notes[id].line;}

            //Special cases where either by movement or lengthening, the note stretches further than the rightLimit
            //will allow. In these cases the note either has to be clipped, or prevented from moving further to the
            //right. In the case where a note is being lengthened and moved to the right; the system should opt to
            //clip it's length
            //Obviously, if there's no right limit don't bother
            if(rightLimit > -1){
                if('position' in data && 'length' in data){//clip length
                    if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                }else{
                    if('position' in data){//prevent movement
                        if(notes[id].length+data.position >= rightLimit){ data.position = rightLimit - notes[id].length; }
                    }else{ data.position = notes[id].position; }
                    if('length' in data){//clip length
                        if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                    }else{ data.length = notes[id].length; }
                }
            }

            if(!('strength' in data)){data.strength = notes[id].strength;}
        
        this.remove(id);
        this.add(data,id);
    };
    this.reset = function(){
        notes = [];
        selectedNotes = [];
        events = [];
        events_byID = [];
        events_byPosition = {};
        positions = [];
    };
};