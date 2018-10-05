// utility functions
    this.currentPosition = [];
    this.wheelInterpreter = function(y){
        return y/100;
        // return y > 0 ? 1 : -1;
    };















// grapple functions
    this.objectGrapple_functionList = {};
    this.objectGrapple_functionList.onmousedown = [];
    this.objectGrapple_functionList.onmouseup = [];
    this.declareObjectGrapple = function(grapple, target, creatorMethod){
        if(!creatorMethod){console.error('"declareObjectGrapple" requires a creatorMethod');return;}

        grapple.target = target ? target : grapple;
        grapple.target.creatorMethod = creatorMethod;
        grapple.target.grapple = grapple;
        grapple.target.style.transform = grapple.target.style.transform ? grapple.target.style.transform : 'translate(0px,0px) scale(1) rotate(0rad)';

        grapple.onmousedown = function(event){
            if(event.button != 0){return;}
            system.svgElement.temp_onmousedown_originalObject = this.target;

            for(var a = 0; a < system.mouse.objectGrapple_functionList.onmousedown.length; a++){
                var shouldRun = true;
                for(var b = 0; b < system.mouse.objectGrapple_functionList.onmousedown[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[system.mouse.objectGrapple_functionList.onmousedown[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ system.mouse.objectGrapple_functionList.onmousedown[a].function(event); break; }
            }
        };
        grapple.onmouseup = function(event){
            system.svgElement.temp_onmouseup_originalObject = this.target;

            for(var a = 0; a < system.mouse.objectGrapple_functionList.onmouseup.length; a++){
                var shouldRun = true;
                for(var b = 0; b < system.mouse.objectGrapple_functionList.onmouseup[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[system.mouse.objectGrapple_functionList.onmouseup[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ system.mouse.objectGrapple_functionList.onmouseup[a].function(event); break; }
            }
        };
    };

    //duplication
    this.objectGrapple_functionList.onmousedown.push(
        {
            'specialKeys':[system.super.keys.alt],
            'function':function(event){
                if(system.super.readOnlyMode){return;}

                // if mousedown occurs over an object that isn't selected; select it
                if( !system.selection.selectedObjects.includes(system.svgElement.temp_onmousedown_originalObject) ){
                    system.selection.selectObject(system.svgElement.temp_onmousedown_originalObject);
                }

                //perform duplication
                system.selection.duplicate();

                //start moving the first object in the object list
                // (the movement code will handle moving the rest)
                system.selection.selectedObjects[0].grapple.onmousedown(
                    {
                        'x':event.x, 'y':event.y,
                        'button':0
                    }
                );

            }
        }
    );
    //general moving
    this.objectGrapple_functionList.onmousedown.push(
        {
            'specialKeys':[],
            'function':function(event){
                if(system.super.readOnlyMode){return;}

                // if mousedown occurs over an object that isn't selected
                //  and if the shift key is not pressed
                //   deselect everything
                //  now, select the object we're working on if not selected
                if( !system.selection.selectedObjects.includes(system.svgElement.temp_onmousedown_originalObject) ){
                    if(!event.shiftKey){ system.selection.deselectEverything(); }
                    system.selection.selectObject(system.svgElement.temp_onmousedown_originalObject);
                }

                // collect together information on the click position and the selected object's positions
                system.svgElement.temp_oldClickPosition = [event.x,event.y];
                system.svgElement.temp_oldObjectPositions = [];
                for(var a = 0; a < system.selection.selectedObjects.length; a++){
                    system.svgElement.temp_oldObjectPositions.push( system.utility.element.getTransform(system.selection.selectedObjects[a]) );
                }

                // perform the move for all selected objects
                system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                system.svgElement.onmousemove = function(event){
                    for(var a = 0; a < system.selection.selectedObjects.length; a++){
                        var clickPosition = system.svgElement.temp_oldClickPosition;
                        var position = {};
                            position.x = system.svgElement.temp_oldObjectPositions[a].x;
                            position.y = system.svgElement.temp_oldObjectPositions[a].y;
                            position.s = system.svgElement.temp_oldObjectPositions[a].s;
                            position.r = system.svgElement.temp_oldObjectPositions[a].r;
                        var globalScale = system.utility.workspace.getGlobalScale(system.selection.selectedObjects[a]);

                        position.x = (position.x-(clickPosition[0]-event.x)/globalScale);
                        position.y = (position.y-(clickPosition[1]-event.y)/globalScale);

                        system.utility.element.setTransform(system.selection.selectedObjects[a], position);

                        //perform all redraws and updates for object
                        if( system.selection.selectedObjects[a].onMove ){system.selection.selectedObjects[a].onMove();}
                        if( system.selection.selectedObjects[a].updateSelectionArea ){system.selection.selectedObjects[a].updateSelectionArea();}
                        if( system.selection.selectedObjects[a].io ){
                            var keys = Object.keys( system.selection.selectedObjects[a].io );
                            for(var b = 0; b < keys.length; b++){ 
                                //account for node arrays
                                if( Array.isArray(system.selection.selectedObjects[a].io[keys[b]]) ){
                                    for(var c = 0; c < system.selection.selectedObjects[a].io[keys[b]].length; c++){
                                        system.selection.selectedObjects[a].io[keys[b]][c].redraw();
                                    }
                                }else{  system.selection.selectedObjects[a].io[keys[b]].redraw(); }
                            }
                        }
                    }
                };

                // clean-up code
                system.svgElement.onmouseup = function(){
                    this.onmousemove = null;
                    delete system.svgElement.tempElements;
                    this.onmousemove = system.svgElement.onmousemove_old;
                    delete this.temp_onmousedown_originalObject;
                    delete this.temp_oldClickPosition;
                    delete this.temp_oldObjectPositions;
                    delete this.onmouseleave;
                    delete this.onmouseup;
                };
            
                system.svgElement.onmouseleave = system.svgElement.onmouseup;

                system.svgElement.onmousemove(event);
            }
        }
    );
    //selection
    this.objectGrapple_functionList.onmouseup.push(
        {
            'specialKeys':[],
            'function':function(event){
                //if mouse-up occurs over an object that is selected
                // and if the shift key is pressed
                // and if the object we're working on is not the most recently selected
                //  deselect the object we're working on
                // now set the most recently selected reference to null
                if( system.selection.selectedObjects.includes(system.svgElement.temp_onmouseup_originalObject) ){
                    if( event.shiftKey && (system.selection.lastselectedObjects != system.svgElement.temp_onmouseup_originalObject) ){
                        system.selection.deselectObject(system.svgElement.temp_onmouseup_originalObject);
                    }
                    system.selection.lastselectedObjects = null;
                }

            }
        }
    );










// onmousemove functions
    this.onmousemove_functionList = [];
    system.svgElement.onmousemove = function(event){
        //control
            control.mousemove(event);

        //workspace
        if(system.utility.object.requestInteraction(event.x,event.y,'onmousemove','workspace')){
            for(var a = 0; a < system.mouse.onmousemove_functionList.length; a++){
                var shouldRun = true;
                for(var b = 0; b < system.mouse.onmousemove_functionList[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[system.mouse.onmousemove_functionList[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ system.mouse.onmousemove_functionList[a].function(event); break; }
            }
        }
    };

    // register position
    this.onmousemove_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                system.mouse.currentPosition = [event.x, event.y];
            }
        }
    );








// onmousedown functions
    this.onmousedown_functionList = [];
    system.svgElement.onmousedown = function(event){
        //control
            control.mousedown(event);

        //workspace
        if(!system.utility.object.requestInteraction(event.x,event.y,'onmousedown','workspace') || event.button != 0){return;}
        for(var a = 0; a < system.mouse.onmousedown_functionList.length; a++){
            var shouldRun = true;
            for(var b = 0; b < system.mouse.onmousedown_functionList[a].specialKeys.length; b++){
                shouldRun = shouldRun && event[system.mouse.onmousedown_functionList[a].specialKeys[b]];
                if(!shouldRun){break;}
            }
            if(shouldRun){ system.mouse.onmousedown_functionList[a].function(event,system.pane.workspace); break; }
        }
    };

    //group selection
    this.onmousedown_functionList.push(
        {
            'specialKeys':['shiftKey'],
            'function':function(event,globalPane){
                // if(system.super.readOnlyMode){return;}

                //setup
                system.svgElement.tempData = {};
                system.svgElement.tempElements = [];
                system.svgElement.tempData.start = {'x':event.x, 'y':event.y};

                //create 'selection box' graphic and add it to the menu pane
                system.svgElement.tempElements.push(
                    part.builder(
                        'path',null,{
                            path:[
                                system.svgElement.tempData.start,
                                system.svgElement.tempData.start,
                                system.svgElement.tempData.start,
                                system.svgElement.tempData.start
                            ], type:'L', style:'fill:rgba(120,120,255,0.25)'
                        }
                    )
                );
                for(var a = 0; a < system.svgElement.tempElements.length; a++){ system.pane.control.append(system.svgElement.tempElements[a]); }

                //adjust selection box when the mouse moves
                system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                system.svgElement.onmousemove = function(event){
                    system.svgElement.tempData.end = {'x':event.x, 'y':event.y};

                    system.svgElement.tempElements[0].path(
                        [
                            {x:system.svgElement.tempData.start.x, y:system.svgElement.tempData.start.y},
                            {x:system.svgElement.tempData.end.x,   y:system.svgElement.tempData.start.y},
                            {x:system.svgElement.tempData.end.x,   y:system.svgElement.tempData.end.y},
                            {x:system.svgElement.tempData.start.x, y:system.svgElement.tempData.end.y}
                        ]
                    );
                    
                };

                //when the mouse is raised; 
                //  find the objects that are selected
                //  tell them they are selected (tell the rest they aren't)
                //  add the selected to the 'selected objects list'
                system.svgElement.onmouseup = function(){
                    //set up
                        system.selection.deselectEverything();
                        var start = system.utility.workspace.pointConverter.browser2workspace(system.svgElement.tempData.start.x,system.svgElement.tempData.start.y);
                        var end = system.utility.workspace.pointConverter.browser2workspace(system.svgElement.tempData.end.x,system.svgElement.tempData.end.y);
                        var selectionArea = {};
                    
                    //create selection box (correcting negative values along the way)
                        selectionArea.box = [{},{}];
                        if(start.x > end.x){ selectionArea.box[0].x = start.x; selectionArea.box[1].x = end.x; }
                        else{ selectionArea.box[0].x = end.x; selectionArea.box[1].x = start.x; }
                        if(start.y > end.y){ selectionArea.box[0].y = start.y; selectionArea.box[1].y = end.y; }
                        else{ selectionArea.box[0].y = end.y; selectionArea.box[1].y = start.y; }
                        //create poly of this box with clockwise wind
                        if( Math.sign(start.x-end.x) != Math.sign(start.y-end.y) ){
                            selectionArea.points = [start, {x:start.x, y:end.y}, end, {x:end.x, y:start.y}];
                        }else{ 
                            selectionArea.points = [start, {x:end.x, y:start.y}, end, {x:start.x, y:end.y}];
                        };
                        
                    //run though all middleground objects to see if they are selected in this box add the objects 
                    //that overlap with the selection area to a temporary array, then select them all in one go
                    //(this is to ease the object reordering that happens in the "system.selection.selectObject"
                    //function)
                        var objects = system.pane.middleground.children;
                        var tempHolder = [];
                        for(var a = 0; a < objects.length; a++){
                            if(objects[a].selectionArea){
                                if(system.utility.math.detectOverlap(selectionArea.points, objects[a].selectionArea.points, selectionArea.box, objects[a].selectionArea.box)){
                                    tempHolder.push( objects[a] );
                                }
                            }
                        }
                        for(var a = 0; a < tempHolder.length; a++){ system.selection.selectObject(tempHolder[a]); }

                    //delete all temporary elements and attributes
                        delete system.svgElement.tempData;
                        for(var a = 0; a < system.svgElement.tempElements.length; a++){
                            system.pane.control.removeChild( system.svgElement.tempElements[a] ); 
                            system.svgElement.tempElements[a] = null;
                        }
                        delete system.svgElement.tempElements;
                        this.onmousemove = system.svgElement.onmousemove_old;
                        delete system.svgElement.onmousemove_old;
                        this.onmouseleave = null;
                        globalPane.removeAttribute('oldPosition');
                        globalPane.removeAttribute('clickPosition');
                        this.onmouseleave = null;
                        this.onmouseup = null;
                };

                system.svgElement.onmouseleave = system.svgElement.onmouseup;

                system.svgElement.onmousemove(event);
            }
        }
    );

    //panning 
    this.onmousedown_functionList.push(
        {
            'specialKeys':[],
            'function':function(event,globalPane){
                if(!system.super.mouseGripPanningEnabled){return;}

                system.selection.deselectEverything();
                system.svgElement.temp_oldPosition = system.utility.element.getTransform(globalPane);
                system.pane.workspace.setAttribute('clickPosition','['+event.x +','+ event.y+']');

                system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                system.svgElement.onmousemove = function(event){
                    var position = {};
                        position.x = system.svgElement.temp_oldPosition.x;
                        position.y = system.svgElement.temp_oldPosition.y;
                        position.s = system.svgElement.temp_oldPosition.s;
                        position.r = system.svgElement.temp_oldPosition.r;
                    var clickPosition = JSON.parse(globalPane.getAttribute('clickPosition'));
                    position.x = position.x-(clickPosition[0]-event.x);
                    position.y = position.y-(clickPosition[1]-event.y);
                    system.utility.element.setTransform(globalPane, position);
                };

                system.svgElement.onmouseup = function(){
                    this.onmousemove = system.svgElement.onmousemove_old;
                    delete system.svgElement.onmousemove_old;
                    globalPane.removeAttribute('oldPosition');
                    globalPane.removeAttribute('clickPosition');
                    this.onmouseleave = null;
                    this.onmouseup = null;
                };

                system.svgElement.onmouseleave = system.svgElement.onmouseup;

                system.svgElement.onmousemove(event);

            }
        }
    );







// onwheel functions
    this.onwheel_functionList = [];
    system.svgElement.onwheel = function(event){
        //control
            control.mousewheel(event);

        //workspace
        if(system.utility.object.requestInteraction(event.x,event.y,'onwheel','workspace')){
            for(var a = 0; a < system.mouse.onwheel_functionList.length; a++){
                var shouldRun = true;
                for(var b = 0; b < system.mouse.onwheel_functionList[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[system.mouse.onwheel_functionList[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ system.mouse.onwheel_functionList[a].function(event); break; }
            }
        }
    };

    this.onwheel_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                if(!system.super.mouseWheelZoomEnabled){return;}

                var zoomLimits = {'max':10, 'min':0.1};
                var position = system.utility.element.getTransform(system.pane.workspace);

                var XPosition = (event.x - position.x)/position.s;
                var YPosition = (event.y - position.y)/position.s;
                    var oldPixX = position.s * ( XPosition + position.x/position.s);
                    var oldPixY = position.s * ( YPosition + position.y/position.s);
                        // var mux = 1.25; position.s = position.s * ( event.deltaY < 0 ? 1*mux : 1/mux );
                        position.s -= position.s*system.mouse.wheelInterpreter(event.deltaY);
                        if( position.s > zoomLimits.max ){position.s = zoomLimits.max;}
                        if( position.s < zoomLimits.min ){position.s = zoomLimits.min;}
                    var newPixX = position.s * ( XPosition + position.x/position.s);
                    var newPixY = position.s * ( YPosition + position.y/position.s);
                position.x = position.x - ( newPixX - oldPixX );
                position.y = position.y - ( newPixY - oldPixY );

                system.utility.element.setTransform(system.pane.workspace, position);
            }
        }
    );