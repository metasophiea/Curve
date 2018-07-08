parts.elements.control.pianoroll_5 = function(
    id='pianoroll_5',
    x, y, width, height, angle=0,
    xCount=80, yCount=13, xStripPattern=[1,0,0,0], yStripPattern=[0,0,1,0,1,0,1,0,0,1,0,1],
){
    var style = {
        backing:'fill:rgba(20,20,20,1);',
        selectionArea:'fill:rgba(100,100,150,0.75);stroke:rgba(100,100,200,1);stroke-width:0.5;pointer-events:none;',
        background:{
            verticalStrip:[
                'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(0,0,0,0);',
                'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(30,30,30,0.5);',
                'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(100,30,100,0.5);',
            ],
            horizontalStrip:[
                'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(100,100,100,0);',
                'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(120,120,120,0.5);'
            ],
        },
        block:{
            body:'fill:rgba(150,100,150,0.75);stroke:rgba(200,100,200,1);stroke-width:0.5;',
            bodyGlow:'fill:rgba(200,100,200,0.9);stroke:rgba(200,100,200,1);stroke-width:0.5;',
            handle:'fill:rgba(255,0,255,0.75);cursor:col-resize;',
            handleWidth:2,
        }
    };
    var state = {
        snapping:!false,
        noteRegistry: new parts.elements.control.pianoroll_5.noteRegistry(xCount,yCount),
        selectedNotes:[],
    };

    //internal functions
        function cordinates2lineposition(xy){
            xy.y = Math.floor(xy.y*yCount);
            if(xy.y >= yCount){xy.y = yCount-1;}
        
            xy.x = state.snapping ? Math.round(xy.x*xCount) : xy.x*xCount;
            if(xy.x < 0){xy.x =0;}
        
            return {line:xy.y, position:xy.x};
        }
        function makeNote(line, position, length, strength=1){
            var freshID = state.noteRegistry.add({line:line, position:position, length:length, strength:strength});
            var graphicElement = parts.elements.control.pianoroll_5.noteBlock(
                freshID, {x:width/xCount,y:height/yCount},
                line, position, length, false,
                style.block,
            );
            object.append(graphicElement);

            //augmenting the graphic element
                graphicElement.select = function(remainSelected=false){
                    if(state.selectedNotes.indexOf(this) != -1){ if(!remainSelected){this.deselect();} return; }
                    this.selected(true);
                    state.selectedNotes.push(this);
                    this.glow(true);
                };
                graphicElement.deselect = function(){
                    state.selectedNotes.splice(state.selectedNotes.indexOf(this),1);
                    this.selected(false);
                    this.glow(false);
                };
                graphicElement.delete = function(){
                    this.deselect();
                    state.noteRegistry.remove(parseInt(this.id));
                    this.remove();
                };
                graphicElement.ondblclick = function(event){
                    if(!event.metaKey){return;}
                    while(state.selectedNotes.length > 0){
                        state.selectedNotes[0].delete();
                    }
                };
                graphicElement.body.onmousedown = function(event){
                    if( !event.metaKey && !graphicElement.selected()){
                        while(state.selectedNotes.length > 0){
                            state.selectedNotes[0].deselect();
                        }
                    }
                    graphicElement.select(true);

                    if(event.altKey){
                        for(var a = 0; a < state.selectedNotes.length; a++){
                            var temp = state.noteRegistry.get_note(parseInt(state.selectedNotes[a].id));
                            makeNote(temp.line, temp.position, temp.length, temp.strength);
                        }
                    }
                    
                    var initialPosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                    var activeBlocks = [];
                    for(var a = 0; a < state.selectedNotes.length; a++){
                        activeBlocks.push({
                            id: parseInt(state.selectedNotes[a].id),
                            block: state.selectedNotes[a],
                            starting: state.noteRegistry.get_note(parseInt(state.selectedNotes[a].id)),
                        });
                    }
                    object.onmousemove = function(event){
                        var livePosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                        var diff = {
                            line: livePosition.line - initialPosition.line,
                            position: livePosition.position - initialPosition.position,
                        };

                        for(var a = 0; a < activeBlocks.length; a++){
                            state.noteRegistry.update(activeBlocks[a].id, {
                                line:activeBlocks[a].starting.line+diff.line,
                                position:activeBlocks[a].starting.position+diff.position,
                            });

                            var temp = state.noteRegistry.get_note(activeBlocks[a].id);

                            activeBlocks[a].block.line( temp.line );
                            activeBlocks[a].block.position( temp.position );
                        }
                    };
                    object.onmouseleave = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                    object.onmouseup = object.onmouseleave;
                };
                graphicElement.leftHandle.onmousedown = function(event){
                    if(!graphicElement.selected()){
                        while(state.selectedNotes.length > 0){
                            state.selectedNotes[0].deselect();
                        }
                    }
                    graphicElement.select(true);

                    var initialPosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                    var activeBlocks = [];
                    for(var a = 0; a < state.selectedNotes.length; a++){
                        activeBlocks.push({
                            id: parseInt(state.selectedNotes[a].id),
                            block: state.selectedNotes[a],
                            starting: state.noteRegistry.get_note(parseInt(state.selectedNotes[a].id)),
                        });
                    }
                    object.onmousemove = function(event){
                        var livePosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                        var diff = {position: initialPosition.position-livePosition.position};

                        for(var a = 0; a < activeBlocks.length; a++){
                            if( activeBlocks[a].starting.position-diff.position < 0 ){ continue; } //this stops a block from getting longer, when it is unable to move any further to the left
                            
                            state.noteRegistry.update(activeBlocks[a].id, {
                                length: activeBlocks[a].starting.length+diff.position,
                                position: activeBlocks[a].starting.position-diff.position,
                            });
                            var temp = state.noteRegistry.get_note(activeBlocks[a].id);
                            activeBlocks[a].block.position( temp.position );
                            activeBlocks[a].block.length( temp.length );
                        }
                    };
                    object.onmouseleave = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                    object.onmouseup = object.onmouseleave;
                };
                graphicElement.rightHandle.onmousedown = function(event){
                    if(!graphicElement.selected()){
                        while(state.selectedNotes.length > 0){
                            state.selectedNotes[0].deselect();
                        }
                    }
                    graphicElement.select(true);

                    var initialPosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                    var activeBlocks = [];
                    for(var a = 0; a < state.selectedNotes.length; a++){
                        activeBlocks.push({
                            id: parseInt(state.selectedNotes[a].id),
                            block: state.selectedNotes[a],
                            starting: state.noteRegistry.get_note(parseInt(state.selectedNotes[a].id)),
                        });
                    }
                    object.onmousemove = function(event){
                        var livePosition = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                        var diff = {position: livePosition.position - initialPosition.position};

                        for(var a = 0; a < activeBlocks.length; a++){
                            state.noteRegistry.update(activeBlocks[a].id, {length: activeBlocks[a].starting.length+diff.position});
                            var temp = state.noteRegistry.get_note(activeBlocks[a].id);
                            activeBlocks[a].block.length( temp.length );
                        }
                    };
                    object.onmouseleave = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                    object.onmouseup = object.onmouseleave;
                };

            return {id:freshID, element:graphicElement};
        }

    //elements 
        //main
            var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y});
        //background
            var backing = __globals.utility.experimental.elementMaker('rect','backing',{width:width, height:height, style:style.backing});
            object.appendChild(backing);

            //background strips
                var backgroundStrips = {horizontal:[], vertical:[]};
                //horizontal strips
                for(var a = 0; a < yCount; a++){
                    var temp = __globals.utility.experimental.elementMaker('rect','divisionstrip_horizontal_'+a,{
                        x1:0, y:a*(height/yCount),
                        width:width, height:height/yCount,
                        style:style.background.horizontalStrip[yStripPattern[a%yStripPattern.length]]
                    });
                    backgroundStrips.horizontal.push(temp);
                    object.appendChild(temp);
                }
                //vertical strips
                for(var a = 0; a < xCount; a++){
                    var temp = __globals.utility.experimental.elementMaker('rect','divisionstrip_vertical_'+a,{
                        x:a*(width/xCount), y:0,
                        width:width/xCount, height:height,
                        style:style.background.verticalStrip[xStripPattern[a%xStripPattern.length]]
                    });
                    backgroundStrips.vertical.push(temp);
                    object.appendChild(temp);
                }
        //interactionPlane
            var interactionPlane = __globals.utility.experimental.elementMaker('rect','interactionPlane',{width:width, height:height, style:'fill:rgba(0,0,0,0);'});
            object.appendChild(interactionPlane);
            interactionPlane.onmousedown = function(event){
                if(event.altKey){ //note creation
                    while(state.selectedNotes.length > 0){
                        state.selectedNotes[0].deselect();
                    }
                    var position = cordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,width,height));
                    var temp = makeNote(position.line,position.position,0);
                    temp.element.select();
                    temp.element.rightHandle.onmousedown(event);
                }else if(event.shiftKey){ //click-n-drag group select
                    var initialPositionData = __globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,width,height);
                    
                    var selectionArea = __globals.utility.experimental.elementMaker('rect','body',{
                        x:initialPositionData.x*width, y:initialPositionData.y*height,
                        width:0, height:0,
                        style:style.selectionArea,
                    });
                    object.appendChild(selectionArea);
                    
                    object.onmousemove = function(event){
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
                    };
                    object.onmouseup = function(event){
                        this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;
                        selectionArea.remove();
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

                        while(state.selectedNotes.length > 0){
                            state.selectedNotes[0].deselect();
                        }
                        var noteBlocks = object.getElementsByTagName('g');
                        for(var a = 0; a < noteBlocks.length; a++){
                            var temp = state.noteRegistry.get_note(parseInt(noteBlocks[a].id));
                            var block = [
                                    {x:temp.position*(width/xCount), y:temp.line*(height/yCount)},
                                    {x:(temp.position+temp.length)*(width/xCount), y:(temp.line+1)*(height/yCount)},
                                ];

                            if( __globals.utility.math.detectOverlap(selectionBox,block,selectionBox,block) ){ noteBlocks[a].select(true); }
                        }
                    };
                    object.onmouseleave = object.onmouseup;
                }else{ //general panning
                    while(state.selectedNotes.length > 0){
                        state.selectedNotes[0].deselect();
                    }
                }
            };

    //controls
        object.allNotes = function(){ return state.noteRegistry.all_notes(); };
        object.eventsBetween = function(start,end){ return state.noteRegistry.eventsBetween(start,end); };
        object.light_vertical = function(state,a,b){
            for(var i = a; i < b; i++){
                __globals.utility.element.setStyle(
                    backgroundStrips.vertical[i],
                    style.background.verticalStrip[state]
                );
            }
        };
    //callbacks

    //setup
        makeNote(5, 4, 4);
        makeNote(8, 8, 4);
        makeNote(7, 12, 4);
        // console.log(object.allNotes());
        console.log(object.eventsBetween(0,10));
        // object.light_vertical(2,2,5);


    return object;
};
















parts.elements.control.pianoroll_5.noteBlock = function(
    id, basicUnit,
    line, position, length, glow=false, 
    style
){
    //elements
        var obj = __globals.utility.experimental.elementMaker('g',id,{y:line*basicUnit.y, x:position*basicUnit.x});
        obj.body = __globals.utility.experimental.elementMaker('rect','body',{width:length*basicUnit.x, height:1*basicUnit.y, style:style.body});
        obj.leftHandle = __globals.utility.experimental.elementMaker('rect','leftHandle',{x:-style.handleWidth/2, width:style.handleWidth, height:1*basicUnit.y,style:style.handle});
        obj.rightHandle = __globals.utility.experimental.elementMaker('rect','rightHandle',{x:length*basicUnit.x-style.handleWidth/2, width:style.handleWidth, height:1*basicUnit.y, style:style.handle});
        obj.append(obj.body);
        obj.append(obj.leftHandle);
        obj.append(obj.rightHandle);
    
    //controls
        var state = {line:line, position:position, length:length, glow:glow, selected:false};
        obj.basicUnit = function(a){
            if(a == undefined){return basicUnit;}
            basicUnit = a;
            obj.body.width.baseVal.value = state.length*basicUnit.x;
            __globals.utility.element.setTransform_XYonly(obj, state.position*basicUnit.x, state.line*basicUnit.y);
        };
        obj.line = function(a){
            if(a == undefined){return state.line;}
            state.line = a;
            __globals.utility.element.setTransform_XYonly(obj, state.position*basicUnit.x, state.line*basicUnit.y);
        };
        obj.position = function(a){
            if(a == undefined){return state.position;}
            state.position = a;
            __globals.utility.element.setTransform_XYonly(obj, state.position*basicUnit.x, state.line*basicUnit.y);
        };
        obj.length = function(a){
            if(a == undefined){return state.length;}
            state.length = a;
            obj.body.width.baseVal.value = state.length*basicUnit.x;
            __globals.utility.element.setTransform_XYonly(obj.rightHandle, state.length*basicUnit.x-style.handleWidth/2, 0);
        };
        obj.glow = function(a){
            if(a == undefined){return state.glowing;}
            state.glowing = a;
            if(state.glowing){ 
                __globals.utility.element.setStyle(obj.body,style.bodyGlow);
            }else{
                __globals.utility.element.setStyle(obj.body,style.body);
            }
        };
        obj.selected = function(a){
            if(a == undefined){return state.selected;}
            state.selected = a;
        };

    return obj;
};
















parts.elements.control.pianoroll_5.noteRegistry = function(rightLimit=-1,bottomLimit=-1,blockLengthLimit=-1){
    var notes = [];
    var selectedNotes = [];
    var events = [];
    var events_byID = [];
    var events_byPosition = {};
    var positions = [];

    this.__dump = function(){
        console.log('---- noteRegistry dump ----');

        console.log('notes');
        for(var a = 0; a < notes.length; a++){ 
            console.log( '\t', a, ' ' + JSON.stringify(notes[a]) );
        }

        console.log('selectedNotes');
        for(var a = 0; a < selectedNotes.length; a++){ 
            console.log( '\t', a, ' ' + JSON.stringify(selectedNotes[a]) );
        }

        console.log('events');
        for(var a = 0; a < events.length; a++){ 
            console.log( '\t', a, ' ' + JSON.stringify(events[a]) );
        }

        console.log('events_byID');
        for(var a = 0; a < events_byID.length; a++){ 
            console.log( '\t', a, ' ' + JSON.stringify(events_byID[a]) );
        }

        console.log('events_byPosition');
        var keys = Object.keys(events_byPosition);
        for(var a = 0; a < keys.length; a++){ 
            console.log( '\t', keys[a], ' ' + JSON.stringify(events_byPosition[keys[a]]) );
        }

        console.log('positions');
        for(var a = 0; a < positions.length; a++){ 
            console.log( '\t', a, ' ' + JSON.stringify(positions[a]) );
        }
    };
    this.all_notes = function(){ return JSON.parse(JSON.stringify(notes)); };
    this.all_events = function(){ return JSON.parse(JSON.stringify(events)); };
    this.get_note = function(id){ return JSON.parse(JSON.stringify(notes[id])); };
    this.get_event = function(i){ return JSON.parse(JSON.stringify(events[i])); };
    this.eventsBetween = function(start=0,end=8){
        var compiledEvents = [];

        //get all the events positions that lie between the start and end positions
        var eventNumbers = Array.from(new Set(positions.filter(function(a){return a >= start && a < end;})));

        //for each position, convert the number to a string, and gather the associated event number arrays
        //then, for each array, get each event and place that into the output array
        for(var a = 0; a < eventNumbers.length; a++){
            eventNumbers[a] = events_byPosition[String(eventNumbers[a])];
            for(var b = 0; b < eventNumbers[a].length; b++){
                compiledEvents.push(events[eventNumbers[a][b]]);
            }
        }

        return compiledEvents;
    };
    this.add = function(data,forceID){
        //clean up data
            if(data == undefined || !('line' in data) || !('position' in data) || !('length' in data)){return;}
            if(!('strength' in data)){data.strength = 1;}
        //check for disallowed data
            if(data.length < 0){data.length = 0;}
            else if(data.length+data.position > rightLimit){data.length = rightLimit-data.position;}
            if(data.line < 0){data.line = 0;}
            else if(data.line > bottomLimit-1){data.line = bottomLimit-1;}
            if(data.position < 0){data.position = 0;}
            else if(data.position+data.length > rightLimit){data.position = rightLimit-data.length;}

        //generate note ID
            var newID = 0;
            if(forceID == undefined){
                while(notes[newID] != undefined){newID++;}
            }else{newID = forceID;}

        //add note to storage
            notes[newID] = JSON.parse(JSON.stringify(data));

        //generate event data
            var newEvents = [
                {noteID:newID, line:data.line, position:data.position,             strength:data.strength},
                {noteID:newID, line:data.line, position:data.position+data.length, strength:0}
            ];

        //add event data to storage
            var eventLocation = 0;
            //start event
                while(events[eventLocation] != undefined){eventLocation++;}
                events[eventLocation] = newEvents[0];
                events_byID[newID] = [eventLocation];
                if( events_byPosition[data.position] == undefined ){
                    events_byPosition[data.position] = [eventLocation];
                }else{
                    events_byPosition[data.position].push(eventLocation);
                }
                positions.push(data.position);
            //end event
                while(events[eventLocation] != undefined){eventLocation++;}
                events[eventLocation] = newEvents[1];
                events_byID[newID] = events_byID[newID].concat(eventLocation);
                if( events_byPosition[data.position+data.length] == undefined ){
                    events_byPosition[data.position+data.length] = [eventLocation];
                }else{
                    events_byPosition[data.position+data.length].push(eventLocation);
                }
                positions.push(data.position+data.length);

        return newID;
    };
    this.remove = function(id){
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
            if(!('position' in data)){data.position = notes[id].position;}
            if(!('length' in data)){data.length = notes[id].length;}
            if(!('strength' in data)){data.strength = notes[id].strength;}
        
        this.remove(id);
        this.add(data,id);
    };
};