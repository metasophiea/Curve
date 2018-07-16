parts.elements.control.pianoroll_3 = function(
    id='pianoroll_3',
    x, y, width, height, angle=0,
    xCount=80, yCount=10, xEmphasisCount=4, yEmphasisCount=12,
){
    var state = {
        snapping:!true,
        noteRegistry: new parts.elements.control.pianoroll_3.noteRegistry(xCount),
        selectedNotes:[],
        playrate:4, //every second, 'state.playrate' "lengths" pass by
        playInterval: null,
        playmark:0,
        playRefreshRate:0.1,
    };
    var style = {
        backing:'fill:rgba(50,50,50,1);',
        division:'stroke:rgba(120,120,120,1);stroke-width:0.5;pointer-events:none;',
        emphasisDivision:'stroke:rgba(220,220,220,1);stroke-width:0.5;pointer-events:none;',
        selectionArea:'fill:rgba(100,100,150,0.75);stroke:rgba(100,100,200,1);stroke-width:0.5;pointer-events:none;',
        block:{
            body:'fill:rgba(150,100,100,0.75);stroke:rgba(200,100,100,1);stroke-width:0.5;',
            bodyGlow:'fill:rgba(200,100,100,0.9);stroke:rgba(200,100,100,1);stroke-width:0.5;',
            handle:'fill:rgba(255,0,0,0.75);cursor:col-resize;',
            handleWidth:2,
        },
    };

    //internal functions
        function getCoordinates(position){
            position.y = Math.floor(position.y*yCount);
            if(position.y >= yCount){position.y = yCount-1;}

            position.x = state.snapping ? Math.round(position.x*xCount) : position.x*xCount;
            if(position.x < 0){position.x =0;}

            return {line:position.y, position:position.x};
        }
        function deselectAll(){
            while(state.selectedNotes.length > 0){ state.selectedNotes[0].deselect(); }
        }
        function removeBlock(block){
            state.noteRegistry.remove(parseInt(block.id));
            state.selectedNotes.splice(state.selectedNotes.indexOf(block), 1);
            block.remove();
        }
        function makeBlock(positionData, that, event){
            if(positionData == undefined){
                positionData = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,that,width,height));
                positionData.length = 0;
            }

            var selected = false;

            var newBlock = parts.elements.control.pianoroll_3.noteBlock(
                {x:width/xCount,y:height/yCount},
                state.noteRegistry.add({line:positionData.line, position:positionData.position, length:positionData.length}),
                positionData.line, positionData.position, positionData.length, style.block
            );
            newBlock.ondblclick = function(event){
                if(!event[__globals.super.keys.ctrl]){return;}
                removeBlock(this);

                while(state.selectedNotes.length > 0){
                    removeBlock(state.selectedNotes[0]);
                }
            };
            newBlock.body.onmousedown = function(event){
                //strength adjustment
                    if(event.shiftKey){
                        var initialPosition = {x:event.offsetX, y:event.offsetY};
                        __globals.svgElement.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
                        __globals.svgElement.onmousemove = function(event){
                            var livePosition = {x:event.offsetX, y:event.offsetY};
                            var diff = {x:initialPosition.x-livePosition.x, y:initialPosition.y-livePosition.y};

                            state.noteRegistry.changeStrengthBy(newBlock.id, diff.y/window.innerHeight);
                            for(var a = 0; a < state.selectedNotes.length; a++){
                                state.noteRegistry.changeStrengthBy(state.selectedNotes[a].id, diff.y/window.innerHeight);
                            }
                        };
                        return;
                }

                //selecting
                    if(event[__globals.super.keys.ctrl] && !selected){ newBlock.select(); }
                    else if(event[__globals.super.keys.ctrl] && selected){newBlock.deselect();return;}
                    else if(event[__globals.super.keys.alt]){
                        //selecting
                            if(!selected){ deselectAll(); newBlock.select(); }
                        //the trick - the cloned note blocks take the place of the originals
                        for(var a = 0; a < state.selectedNotes.length; a++){
                            makeBlock(state.noteRegistry.get_note(parseInt(state.selectedNotes[a].id)));
                        }
                    }
                    else if(!selected){ deselectAll(); newBlock.select(); }

                //general movement of all selected blocks
                    var initialPosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                    var activeBlocks = [];
                    for(var a = 0; a < state.selectedNotes.length; a++){
                        activeBlocks.push({
                            blockID: parseInt(state.selectedNotes[a].id),
                            startingPosition: state.noteRegistry.get_note(parseInt(state.selectedNotes[a].id)),
                        });
                    }
                    object.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                    object.onmouseleave = object.onmouseup;
                    object.onmousemove = function(event){
                        var livePosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,this,width,height));
                        for(var a = 0; a < state.selectedNotes.length; a++){
                            activeBlocks[a].new = {
                                line: activeBlocks[a].startingPosition.line + (livePosition.line-initialPosition.line),
                                position: activeBlocks[a].startingPosition.position + (livePosition.position-initialPosition.position),
                            };
                            state.noteRegistry.update(activeBlocks[a].blockID,{ line:activeBlocks[a].new.line, position:activeBlocks[a].new.position });
                            var temp = state.noteRegistry.get_note(activeBlocks[a].blockID);
                            state.selectedNotes[a].location(temp.line, temp.position);
                        }
                    };
            };
            newBlock.rightHandle.onmousedown = function(event){
                //selecting
                    if(!selected){ deselectAll(); newBlock.select(); }

                //general right handle adjustment of all selected blocks
                    var initialPosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                    var activeBlocks = [];
                    for(var a = 0; a < state.selectedNotes.length; a++){
                        activeBlocks.push({
                            blockID: parseInt(state.selectedNotes[a].id),
                            startingPosition: state.noteRegistry.get_note(parseInt(state.selectedNotes[a].id)),
                        });
                    }
                    object.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                    object.onmouseleave = object.onmouseup;
                    object.onmousemove = function(event){
                        var livePosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,this,width,height));
                        for(var a = 0; a < state.selectedNotes.length; a++){
                            activeBlocks[a].newLength = activeBlocks[a].startingPosition.length + (livePosition.position-initialPosition.position);
                            if(activeBlocks[a].newLength < 0){activeBlocks[a].newLength = 0;}
                            state.noteRegistry.update(activeBlocks[a].blockID,{ length:activeBlocks[a].newLength });
                            var temp = state.noteRegistry.get_note(activeBlocks[a].blockID);
                            state.selectedNotes[a].length(temp.length);
                        }
                    };
            };
            newBlock.leftHandle.onmousedown = function(event){
                //selecting
                    if(!selected){ deselectAll(); newBlock.select(); }
                
                //general left handle adjustment of all selected blocks
                    var initialPosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                    var activeBlocks = [];
                    for(var a = 0; a < state.selectedNotes.length; a++){
                        activeBlocks.push({
                            blockID: parseInt(state.selectedNotes[a].id),
                            startingPosition: state.noteRegistry.get_note(parseInt(state.selectedNotes[a].id)),
                        });
                    }
                    object.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                    object.onmouseleave = object.onmouseup;
                    object.onmousemove = function(event){
                        var livePosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,this,width,height));
                        for(var a = 0; a < state.selectedNotes.length; a++){
                            activeBlocks[a].new = {
                                length: activeBlocks[a].startingPosition.length - (livePosition.position-initialPosition.position),
                                position: activeBlocks[a].startingPosition.position + (livePosition.position-initialPosition.position),
                            };
                            if(activeBlocks[a].new.length < 0){ activeBlocks[a].new.position += activeBlocks[a].new.length; activeBlocks[a].new.length = 0; }
                            if( activeBlocks[a].new.position < 0 ){ continue; } //this stops a block from getting longer, when it is unable to move any further to the left
                            state.noteRegistry.update(activeBlocks[a].blockID,{ position:activeBlocks[a].new.position, length:activeBlocks[a].new.length });
                            var temp = state.noteRegistry.get_note(activeBlocks[a].blockID);
                            state.selectedNotes[a].length(temp.length);
                            state.selectedNotes[a].location(temp.line, temp.position);
                        }
                    };
            };

            newBlock.select = function(){
                newBlock.glow(true); 
                selected = true;
                state.selectedNotes.push(newBlock);
            };
            newBlock.deselect = function(){
                newBlock.glow(false); 
                selected = false;
                state.selectedNotes.splice(state.selectedNotes.indexOf(newBlock), 1);
            };

            object.appendChild(newBlock);

            if(event != undefined){
                newBlock.rightHandle.onmousedown(event);
            }
        }


    //elements 
        var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y});

        //backing
        var backing = __globals.utility.experimental.elementMaker('rect','backing',{width:width,height:height, style:style.backing});
        object.appendChild(backing);
        backing.onmousedown = function(event){
            if(event[__globals.super.keys.alt]){
                makeBlock(undefined,this,event);
            }else{ 
                //click-n-drag group select
                deselectAll();

                var initialPositionData = __globals.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                var selectionArea = __globals.utility.experimental.elementMaker('rect','body',{
                    x:initialPositionData.x*width, y:initialPositionData.y*height,
                    width:0, height:0,
                    style:style.selectionArea,
                });
                object.appendChild(selectionArea);
                object.onmouseup = function(event){
                    this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;
                    selectionArea.remove();
                    var finishingPositionData = __globals.utility.element.getPositionWithinFromMouse(event,backing,width,height);

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

                    var noteBlocks = object.getElementsByTagName('g');
                    for(var a = 0; a < noteBlocks.length; a++){
                        var temp = state.noteRegistry.get_note(parseInt(noteBlocks[a].id));
                        var block = [
                                {x:temp.position*(width/xCount), y:temp.line*(height/yCount)},
                                {x:(temp.position+temp.length)*(width/xCount), y:(temp.line+1)*(height/yCount)},
                            ];

                        if( __globals.utility.math.detectOverlap(selectionBox,block,selectionBox,block) ){ noteBlocks[a].select(); }
                    }


                };
                object.onmouseleave = object.onmouseup;
                object.onmousemove = function(event){
                    var livePositionData = __globals.utility.element.getPositionWithinFromMouse(event,backing,width,height);
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
            }
        };

        //division lines
            //vertical
            for(var a = 0; a < yCount; a++){
                var tempStyle = a%yEmphasisCount == 0 ? style.emphasisDivision : style.division;
                object.appendChild(__globals.utility.experimental.elementMaker('line','divisionline_vertical',{
                    x1:0,x2:width,
                    y1:a*(height/yCount),y2:a*(height/yCount), 
                    style:tempStyle,
                }));
            }
            //horizontal
            for(var a = 0; a < xCount; a++){
                var tempStyle = a%xEmphasisCount == 0 ? style.emphasisDivision : style.division;
                object.appendChild(__globals.utility.experimental.elementMaker('line','divisionline_horizontal',{
                    x1:a*(width/xCount), x2:a*(width/xCount),
                    y1:0, y2:height,
                    style:tempStyle}
                ));
            }

    //controls
        object.play = function(start,end,loop=false){
            state.playmark = start/state.playrate;

            function playback(){
                var _start = state.playmark*state.playrate;
                var _end = (state.playmark+state.playRefreshRate)*state.playrate;
                if(object.signal){object.signal(state.noteRegistry.eventsBetween(_start,_end));}
                if(_end >= end){
                    clearInterval(state.playInterval);
                    if(loop){
                        setTimeout(
                            function(){
                                state.playmark = start/state.playrate;
                                playback();
                                state.playInterval = setInterval(playback,state.playRefreshRate*1000);
                            } ,state.playRefreshRate*1000
                        );
                    }
                }

                state.playmark += state.playRefreshRate;
            }

            playback();
            state.playInterval = setInterval(playback,state.playRefreshRate*1000);
        };

    //callbacks
        object.signal = function(signal){console.log(signal);};

    //setup?
    makeBlock({line:1, position:0.5, length:8});
    makeBlock({line:3, position:2, length:8});
    object.play(0,10);

    return object;
};












parts.elements.control.pianoroll_3.noteRegistry = function(rightLimit=-1,blockLengthLimit=-1){
    var notes = [];  // eg. [{line:2, position:5.5, length:8, strength:0.6},{line:1, position:0, length:1, strength:0.01}]
    var events = []; // eg. [{line:2, position:5.5, strength:0.6},{line:2, position:13.5, strength:0}]
    var events_byID = []; //eg. [0,1],[2,3]
    var events_byPosition = {}; //eg. [5.5:[0],13.5:[1]]
    var positions = []; //eg. [5.5,13.5]


    this.all_notes = function(){ return JSON.parse(JSON.stringify(notes)); };
    this.all_events = function(){ return JSON.parse(JSON.stringify(events)); };
    this.get_note = function(id){ return JSON.parse(JSON.stringify(notes[id])); };
    this.get_event = function(i){ return JSON.parse(JSON.stringify(events[i])); };
    this.eventsBetween = function(start=0,end=8){
        var compiledEvents = [];
        // console.log('events_byPosition',events_byPosition);
        // console.log('positions',positions);
        var eventNumbers = positions.filter(function(a){return a >= start && a < end;});

        for(var a = 0; a < eventNumbers.length; a++){
            eventNumbers[a]= events_byPosition[String(eventNumbers[a])];
            for(var b = 0; b < eventNumbers[a].length; b++){
                compiledEvents.push(events[eventNumbers[a][b]]);
            }
        }
        return compiledEvents;
    };

    this.add = function(data,forceID){
        //clean up into data
            if(data == undefined || !('line' in data) || !('position' in data) || !('length' in data)){return;}
            if(!('strength' in data)){data.strength = 1;}

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
















parts.elements.control.pianoroll_3.noteBlock = function(basicUnit,id,line,position,length=0,style){
    var obj = __globals.utility.experimental.elementMaker('g',id,{y:line*basicUnit.y, x:position*basicUnit.x});

    obj.body = __globals.utility.experimental.elementMaker('rect','body',{
        width:length*basicUnit.x, height:1*basicUnit.y,
        style:style.body
    });
    obj.append(obj.body);

    obj.leftHandle = __globals.utility.experimental.elementMaker('rect','leftHandle',{
        x:-style.handleWidth/2,
        width:style.handleWidth, height:1*basicUnit.y,
        style:style.handle
    });
    obj.append(obj.leftHandle);

    obj.rightHandle = __globals.utility.experimental.elementMaker('rect','rightHandle',{
        x:length*basicUnit.x-style.handleWidth/2,
        width:style.handleWidth, height:1*basicUnit.y,
        style:style.handle
    });
    obj.append(obj.rightHandle);

    obj.location = function(line,position){
        __globals.utility.element.setTransform_XYonly(obj, position*basicUnit.x, line*basicUnit.y);
    };
    obj.length = function(length){
        if(length == undefined){return obj.body.width.baseVal.value/basicUnit.x;}
        obj.body.width.baseVal.value = length*basicUnit.x;
        __globals.utility.element.setTransform_XYonly(obj.rightHandle, length*basicUnit.x-style.handleWidth/2, 0);
    };
    obj.glowing = false;
    obj.glow = function(state){
        obj.glowing = state;
        if(obj.glowing){ __globals.utility.element.setStyle(obj.body,style.bodyGlow); }
        else{ __globals.utility.element.setStyle(obj.body,style.body); }
    };

    return obj;
};