// utility functions
    __globals.mouseInteraction = {};
    __globals.mouseInteraction.currentPosition = [];
    __globals.mouseInteraction.wheelInterpreter = function(y){
        return y/100;
        // return y > 0 ? 1 : -1;
    };















// grapple functions
    __globals.mouseInteraction.objectGrapple_functionList = {};
    __globals.mouseInteraction.objectGrapple_functionList.onmousedown = [];
    __globals.mouseInteraction.objectGrapple_functionList.onmouseup = [];
    __globals.mouseInteraction.declareObjectGrapple = function(grapple, target, creatorMethod){
        if(!creatorMethod){console.error('"declareObjectGrapple" requires a creatorMethod');return;}

        grapple.target = target ? target : grapple;
        grapple.target.creatorMethod = creatorMethod;
        grapple.target.grapple = grapple;
        grapple.target.style.transform = grapple.target.style.transform ? grapple.target.style.transform : 'translate(0px,0px) scale(1) rotate(0rad)';

        grapple.onmousedown = function(event){
            if(event.button != 0){return;}
            __globals.svgElement.temp_onmousedown_originalObject = this.target;

            for(var a = 0; a < __globals.mouseInteraction.objectGrapple_functionList.onmousedown.length; a++){
                var shouldRun = true;
                for(var b = 0; b < __globals.mouseInteraction.objectGrapple_functionList.onmousedown[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[__globals.mouseInteraction.objectGrapple_functionList.onmousedown[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ __globals.mouseInteraction.objectGrapple_functionList.onmousedown[a].function(event); break; }
            }
        };
        grapple.onmouseup = function(event){
            __globals.svgElement.temp_onmouseup_originalObject = this.target;

            for(var a = 0; a < __globals.mouseInteraction.objectGrapple_functionList.onmouseup.length; a++){
                var shouldRun = true;
                for(var b = 0; b < __globals.mouseInteraction.objectGrapple_functionList.onmouseup[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[__globals.mouseInteraction.objectGrapple_functionList.onmouseup[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ __globals.mouseInteraction.objectGrapple_functionList.onmouseup[a].function(event); break; }
            }
        };
    };

    //duplication
    __globals.mouseInteraction.objectGrapple_functionList.onmousedown.push(
        {
            'specialKeys':[__globals.super.keys.alt],
            'function':function(event){
                if(__globals.super.readOnlyMode){return;}

                // if mousedown occurs over an object that isn't selected; select it
                if( !__globals.selection.selectedObjects.includes(__globals.svgElement.temp_onmousedown_originalObject) ){
                    __globals.selection.selectObject(__globals.svgElement.temp_onmousedown_originalObject);
                }

                //perform duplication
                __globals.selection.duplicate();

                //start moving the first object in the object list
                // (the movement code will handle moving the rest)
                __globals.selection.selectedObjects[0].grapple.onmousedown(
                    {
                        'x':event.x, 'y':event.y,
                        'button':0
                    }
                );

            }
        }
    );
    //general moving
    __globals.mouseInteraction.objectGrapple_functionList.onmousedown.push(
        {
            'specialKeys':[],
            'function':function(event){
                if(__globals.super.readOnlyMode){return;}

                // if mousedown occurs over an object that isn't selected
                //  and if the shift key is not pressed
                //   deselect everything
                //  now, select the object we're working on if not selected
                if( !__globals.selection.selectedObjects.includes(__globals.svgElement.temp_onmousedown_originalObject) ){
                    if(!event.shiftKey){ __globals.selection.deselectEverything(); }
                    __globals.selection.selectObject(__globals.svgElement.temp_onmousedown_originalObject);
                }

                // collect together information on the click position and the selected object's positions
                __globals.svgElement.temp_oldClickPosition = [event.x,event.y];
                __globals.svgElement.temp_oldObjectPositions = [];
                for(var a = 0; a < __globals.selection.selectedObjects.length; a++){
                    __globals.svgElement.temp_oldObjectPositions.push( __globals.utility.element.getTransform(__globals.selection.selectedObjects[a]) );
                }

                // perform the move for all selected objects
                __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                __globals.svgElement.onmousemove = function(event){
                    for(var a = 0; a < __globals.selection.selectedObjects.length; a++){
                        var clickPosition = __globals.svgElement.temp_oldClickPosition;
                        var position = {};
                            position.x = __globals.svgElement.temp_oldObjectPositions[a].x;
                            position.y = __globals.svgElement.temp_oldObjectPositions[a].y;
                            position.s = __globals.svgElement.temp_oldObjectPositions[a].s;
                            position.r = __globals.svgElement.temp_oldObjectPositions[a].r;
                        var globalScale = __globals.utility.workspace.getGlobalScale(__globals.selection.selectedObjects[a]);

                        position.x = (position.x-(clickPosition[0]-event.x)/globalScale);
                        position.y = (position.y-(clickPosition[1]-event.y)/globalScale);

                        __globals.utility.element.setTransform(__globals.selection.selectedObjects[a], position);

                        //perform all redraws and updates for object
                        if( __globals.selection.selectedObjects[a].onMove ){__globals.selection.selectedObjects[a].onMove();}
                        if( __globals.selection.selectedObjects[a].updateSelectionArea ){__globals.selection.selectedObjects[a].updateSelectionArea();}
                        if( __globals.selection.selectedObjects[a].io ){
                            var keys = Object.keys( __globals.selection.selectedObjects[a].io );
                            for(var b = 0; b < keys.length; b++){ 
                                //account for node arrays
                                if( Array.isArray(__globals.selection.selectedObjects[a].io[keys[b]]) ){
                                    for(var c = 0; c < __globals.selection.selectedObjects[a].io[keys[b]].length; c++){
                                        __globals.selection.selectedObjects[a].io[keys[b]][c].redraw();
                                    }
                                }else{  __globals.selection.selectedObjects[a].io[keys[b]].redraw(); }
                            }
                        }
                    }
                };

                // clean-up code
                __globals.svgElement.onmouseup = function(){
                    this.onmousemove = null;
                    delete __globals.svgElement.tempElements;
                    this.onmousemove = __globals.svgElement.onmousemove_old;
                    delete this.temp_onmousedown_originalObject;
                    delete this.temp_oldClickPosition;
                    delete this.temp_oldObjectPositions;
                    delete this.onmouseleave;
                    delete this.onmouseup;
                };
            
                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;

                __globals.svgElement.onmousemove(event);
            }
        }
    );
    //selection
    __globals.mouseInteraction.objectGrapple_functionList.onmouseup.push(
        {
            'specialKeys':[],
            'function':function(event){
                //if mouse-up occurs over an object that is selected
                // and if the shift key is pressed
                // and if the object we're working on is not the most recently selected
                //  deselect the object we're working on
                // now set the most recently selected reference to null
                if( __globals.selection.selectedObjects.includes(__globals.svgElement.temp_onmouseup_originalObject) ){
                    if( event.shiftKey && (__globals.selection.lastSelectedObject != __globals.svgElement.temp_onmouseup_originalObject) ){
                        __globals.selection.deselectObject(__globals.svgElement.temp_onmouseup_originalObject);
                    }
                    __globals.selection.lastSelectedObject = null;
                }

            }
        }
    );










// onmousemove functions
    __globals.mouseInteraction.onmousemove_functionList = [];
    __globals.svgElement.onmousemove = function(event){
        //menu
        //workspace
        if(__globals.utility.object.requestInteraction(event.x,event.y,'onmousemove','workspace')){
            for(var a = 0; a < __globals.mouseInteraction.onmousemove_functionList.length; a++){
                var shouldRun = true;
                for(var b = 0; b < __globals.mouseInteraction.onmousemove_functionList[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[__globals.mouseInteraction.onmousemove_functionList[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ __globals.mouseInteraction.onmousemove_functionList[a].function(event); break; }
            }
        }
    };

    // register position
    __globals.mouseInteraction.onmousemove_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                __globals.mouseInteraction.currentPosition = [event.x, event.y];
            }
        }
    );








// onmousedown functions
    __globals.mouseInteraction.onmousedown_functionList = [];
    __globals.svgElement.onmousedown = function(event){
        //control
            control.mousedown(event);

        //workspace
        if(!__globals.utility.object.requestInteraction(event.x,event.y,'onmousedown','workspace') || event.button != 0){return;}
        for(var a = 0; a < __globals.mouseInteraction.onmousedown_functionList.length; a++){
            var shouldRun = true;
            for(var b = 0; b < __globals.mouseInteraction.onmousedown_functionList[a].specialKeys.length; b++){
                shouldRun = shouldRun && event[__globals.mouseInteraction.onmousedown_functionList[a].specialKeys[b]];
                if(!shouldRun){break;}
            }
            if(shouldRun){ __globals.mouseInteraction.onmousedown_functionList[a].function(event,__globals.panes.workspace); break; }
        }
    };

    //group selection
    __globals.mouseInteraction.onmousedown_functionList.push(
        {
            'specialKeys':['shiftKey'],
            'function':function(event,globalPane){
                // if(__globals.super.readOnlyMode){return;}

                //setup
                __globals.svgElement.tempData = {};
                __globals.svgElement.tempElements = [];
                __globals.svgElement.tempData.start = {'x':event.x, 'y':event.y};

                //create 'selection box' graphic and add it to the menu pane
                __globals.svgElement.tempElements.push(
                    __globals.utility.misc.elementMaker(
                        'path',null,{
                            path:[
                                __globals.svgElement.tempData.start,
                                __globals.svgElement.tempData.start,
                                __globals.svgElement.tempData.start,
                                __globals.svgElement.tempData.start
                            ], type:'L', style:'fill:rgba(120,120,255,0.25)'
                        }
                    )
                );
                for(var a = 0; a < __globals.svgElement.tempElements.length; a++){ __globals.panes.menu.append(__globals.svgElement.tempElements[a]); }

                //adjust selection box when the mouse moves
                __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                __globals.svgElement.onmousemove = function(event){
                    __globals.svgElement.tempData.end = {'x':event.x, 'y':event.y};

                    __globals.svgElement.tempElements[0].path(
                        [
                            {x:__globals.svgElement.tempData.start.x, y:__globals.svgElement.tempData.start.y},
                            {x:__globals.svgElement.tempData.end.x,   y:__globals.svgElement.tempData.start.y},
                            {x:__globals.svgElement.tempData.end.x,   y:__globals.svgElement.tempData.end.y},
                            {x:__globals.svgElement.tempData.start.x, y:__globals.svgElement.tempData.end.y}
                        ]
                    );
                    
                };

                //when the mouse is raised; 
                //  find the objects that are selected
                //  tell them they are selected (tell the rest they aren't)
                //  add the selected to the 'selected objects list'
                __globals.svgElement.onmouseup = function(){
                    //set up
                        __globals.selection.deselectEverything();
                        var start = __globals.utility.workspace.pointConverter.browser2workspace(__globals.svgElement.tempData.start.x,__globals.svgElement.tempData.start.y);
                        var end = __globals.utility.workspace.pointConverter.browser2workspace(__globals.svgElement.tempData.end.x,__globals.svgElement.tempData.end.y);
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
                    //(this is to ease the object reordering that happens in the "__globals.selection.selectObject"
                    //function)
                        var objects = __globals.panes.middleground.children;
                        var tempHolder = [];
                        for(var a = 0; a < objects.length; a++){
                            if(objects[a].selectionArea){
                                if(__globals.utility.math.detectOverlap(selectionArea.points, objects[a].selectionArea.points, selectionArea.box, objects[a].selectionArea.box)){
                                    tempHolder.push( objects[a] );
                                }
                            }
                        }
                        for(var a = 0; a < tempHolder.length; a++){ __globals.selection.selectObject(tempHolder[a]); }

                    //delete all temporary elements and attributes
                        delete __globals.svgElement.tempData;
                        for(var a = 0; a < __globals.svgElement.tempElements.length; a++){
                            __globals.panes.menu.removeChild( __globals.svgElement.tempElements[a] ); 
                            __globals.svgElement.tempElements[a] = null;
                        }
                        delete __globals.svgElement.tempElements;
                        this.onmousemove = __globals.svgElement.onmousemove_old;
                        delete __globals.svgElement.onmousemove_old;
                        this.onmouseleave = null;
                        globalPane.removeAttribute('oldPosition');
                        globalPane.removeAttribute('clickPosition');
                        this.onmouseleave = null;
                        this.onmouseup = null;
                };

                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;

                __globals.svgElement.onmousemove(event);
            }
        }
    );

    //panning 
    __globals.mouseInteraction.onmousedown_functionList.push(
        {
            'specialKeys':[],
            'function':function(event,globalPane){
                if(!__globals.super.mouseGripPanningEnabled){return;}

                __globals.selection.deselectEverything();
                __globals.svgElement.temp_oldPosition = __globals.utility.element.getTransform(globalPane);
                __globals.panes.workspace.setAttribute('clickPosition','['+event.x +','+ event.y+']');

                __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                __globals.svgElement.onmousemove = function(event){
                    var position = {};
                        position.x = __globals.svgElement.temp_oldPosition.x;
                        position.y = __globals.svgElement.temp_oldPosition.y;
                        position.s = __globals.svgElement.temp_oldPosition.s;
                        position.r = __globals.svgElement.temp_oldPosition.r;
                    var clickPosition = JSON.parse(globalPane.getAttribute('clickPosition'));
                    position.x = position.x-(clickPosition[0]-event.x);
                    position.y = position.y-(clickPosition[1]-event.y);
                    __globals.utility.element.setTransform(globalPane, position);
                };

                __globals.svgElement.onmouseup = function(){
                    this.onmousemove = __globals.svgElement.onmousemove_old;
                    delete __globals.svgElement.onmousemove_old;
                    globalPane.removeAttribute('oldPosition');
                    globalPane.removeAttribute('clickPosition');
                    this.onmouseleave = null;
                    this.onmouseup = null;
                };

                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;

                __globals.svgElement.onmousemove(event);

            }
        }
    );







// onwheel functions
    __globals.mouseInteraction.onwheel_functionList = [];
    __globals.svgElement.onwheel = function(event){
        //menu
        //workspace
        if(__globals.utility.object.requestInteraction(event.x,event.y,'onwheel','workspace')){
            for(var a = 0; a < __globals.mouseInteraction.onwheel_functionList.length; a++){
                var shouldRun = true;
                for(var b = 0; b < __globals.mouseInteraction.onwheel_functionList[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[__globals.mouseInteraction.onwheel_functionList[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ __globals.mouseInteraction.onwheel_functionList[a].function(event); break; }
            }
        }
    };

    __globals.mouseInteraction.onwheel_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                if(!__globals.super.mouseWheelZoomEnabled){return;}

                var zoomLimits = {'max':10, 'min':0.1};
                var position = __globals.utility.element.getTransform(__globals.panes.workspace);

                var XPosition = (event.x - position.x)/position.s;
                var YPosition = (event.y - position.y)/position.s;
                    var oldPixX = position.s * ( XPosition + position.x/position.s);
                    var oldPixY = position.s * ( YPosition + position.y/position.s);
                        // var mux = 1.25; position.s = position.s * ( event.deltaY < 0 ? 1*mux : 1/mux );
                        position.s -= position.s*__globals.mouseInteraction.wheelInterpreter(event.deltaY);
                        if( position.s > zoomLimits.max ){position.s = zoomLimits.max;}
                        if( position.s < zoomLimits.min ){position.s = zoomLimits.min;}
                    var newPixX = position.s * ( XPosition + position.x/position.s);
                    var newPixY = position.s * ( YPosition + position.y/position.s);
                position.x = position.x - ( newPixX - oldPixX );
                position.y = position.y - ( newPixY - oldPixY );

                __globals.utility.element.setTransform(__globals.panes.workspace, position);
            }
        }
    );