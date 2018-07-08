parts.elements.control.pianoroll_4 = function(
    id='pianoroll_4',
    x, y, width, height, angle=0,
    xCount=80, yCount=10,
){
    var style = {
        backing:'fill:rgba(50,50,50,1);',
    };
    var state = {
        snapping:false,
        noteRegistry: new parts.elements.control.pianoroll_4.noteRegistry(xCount),
        xCount:xCount,
        yCount:yCount,
    };

    //elements 
        var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y});
    //backing
        var backing = __globals.utility.experimental.elementMaker('rect','backing',{width:width, height:height, style:style.backing});
        object.appendChild(backing);

        object.append(
            parts.elements.control.pianoroll_4.noteBlock(
                0,
                {x:780/80,y:130/10},
                {obj:object, element:backing, width:width, height:height, state:state},
                {line:0, position:0, length:2},
                {
                    body:'fill:rgba(150,100,100,0.75);stroke:rgba(200,100,100,1);stroke-width:0.5;',
                    bodyGlow:'fill:rgba(200,100,100,0.9);stroke:rgba(200,100,100,1);stroke-width:0.5;',
                    handle:'fill:rgba(255,0,0,0.75);cursor:col-resize;',
                    handleWidth:2,
                }
            )
        );

    return object;
};


























parts.elements.control.pianoroll_4.noteRegistry = function(rightLimit=-1,blockLengthLimit=-1){
    var notes = [];
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
        var eventNumbers = positions.filter(function(a){return a >= start && a < end;});

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


parts.elements.control.pianoroll_4.XY2coordinates = function(xy,xCount,yCount,snapping){
    xy.y = Math.floor(xy.y*yCount);
    if(xy.y >= yCount){xy.y = yCount-1;}

    xy.x = snapping ? Math.round(xy.x*xCount) : xy.x*xCount;
    if(xy.x < 0){xy.x =0;}

    return {line:xy.y, position:xy.x};
};


parts.elements.control.pianoroll_4.noteBlock = function(id,basicUnit,worktopData/*={element:null,width:null,height:null}*/,data={line:0, position:0, length:0},style){
    var state = {
        id:id,
        line:data.line,
        position:data.position,
        length:data.length,
        glowing:false,
    };

    var design = {
        type:'noteBlock',
        skipGrapple:true,
        x:data.line*basicUnit.y, y:data.position*basicUnit.x,
        base:{
            type:'rect',
            x:0, y:0, width:data.length*basicUnit.x, height:basicUnit.y,
            style:style.body,
        },
        elements:[
            {type:'rect', name:'leftHandle', data:{
                x:-style.handleWidth/2, 
                width:style.handleWidth, height:basicUnit.y,
                style:style.handle
            }},
            {type:'rect', name:'rightHandle', data:{
                x:data.length*basicUnit.x-style.handleWidth/2, 
                width:style.handleWidth, height:basicUnit.y,
                style:style.handle
            }},
        ],
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(parts.elements.control.pianoroll_4.noteBlock,design);
        obj.id = id;

    //controls
        obj.line = function(a){
            if(a == undefined){return state.line;}
            state.line = a;
            __globals.utility.element.setTransform_XYonly(obj, state.position*basicUnit.x, state.line*basicUnit.y);
        };
        obj.position = function(a){
            if(a == undefined){return state.position;}
            state.position = a;
            __globals.utility.element.setTransform_XYonly(obj, state.position*basicUnit.x, state.line*basicUnit.y);};
        obj.length = function(a){
            if(a == undefined){return state.length;}
            state.length = a;
            design.base.width.baseVal.value = state.length*basicUnit.x;
            __globals.utility.element.setTransform_XYonly(design.rect.rightHandle, state.length*basicUnit.x-style.handleWidth/2, 0);
        };
        obj.glow = function(newState){
            if(newState == undefined){return state.glowing;}
            state.glowing = newState;
            if(state.glowing){ __globals.utility.element.setStyle(design.base,style.bodyGlow); }
            else{ __globals.utility.element.setStyle(design.base,style.body); }
        };

    //mouse control
        design.base.onmousedown = function(event){
            var initialPosition = parts.elements.control.pianoroll_4.XY2coordinates(__globals.utility.element.getPositionWithinFromMouse(event,worktopData.obj,worktopData.width,worktopData.height), worktopData.state.xCount, worktopData.state.yCount, worktopData.state.snapping);
            console.log(initialPosition);

            worktopData.obj.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
            worktopData.obj.onmouseleave = worktopData.obj.onmouseup;
            worktopData.obj.onmousemove = function(event){
                var livePosition = parts.elements.control.pianoroll_4.XY2coordinates(__globals.utility.element.getPositionWithinFromMouse(event,worktopData.obj,worktopData.width,worktopData.height), worktopData.state.xCount, worktopData.state.yCount, worktopData.state.snapping);
                console.log(livePosition);
            };
        };
    
    //callbacks
        obj.onselect = function(){};
        obj.ondeselect = function(){};
        obj.onmove = function(){};
        obj.onleftadjust = function(){};
        obj.onrightadjust = function(){};
        obj.onstrengthadjust = function(){};
        obj.ondelete = function(){};

    return obj;
};
// //noteBlock test
// var temp = parts.elements.control.pianoroll_4.noteBlock(
//     undefined,
//     {x:780/80,y:130/10},
//     {element:},
//     {line:0, position:0, length:2},
//     {
//         body:'fill:rgba(150,100,100,0.75);stroke:rgba(200,100,100,1);stroke-width:0.5;',
//         bodyGlow:'fill:rgba(200,100,100,0.9);stroke:rgba(200,100,100,1);stroke-width:0.5;',
//         handle:'fill:rgba(255,0,0,0.75);cursor:col-resize;',
//         handleWidth:2,
//     }
// );
// __globals.panes.middleground.append(temp);
// // temp.glow(true);
// // temp.line(1);
// // temp.position(1);
// // temp.length(1);