// utility functions
    this.currentPosition = [];
    this.wheelInterpreter = function(y){
        return y/100;
        // return y > 0 ? 1 : -1;
    };
    this.functionListRunner = function(list){
        //function builder for working with the 'functionList' format

        return function(event){
            //run through function list, and activate functions where necessary
                for(var a = 0; a < list.length; a++){
                    var shouldRun = true;

                    //determine if all the requirements of this function are met
                        for(var b = 0; b < list[a].specialKeys.length; b++){
                            shouldRun = shouldRun && event[list[a].specialKeys[b]];
                            if(!shouldRun){break;} //(one is already not a match, so save time and just bail here)
                        }

                    //if all requirements were met, run the function
                    if(shouldRun){  
                        //if the function returns 'false', continue with the list; otherwise stop here
                            if( list[a].function(event) ){ break; }
                    }
                }
        }
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

        function grappleFunctionRunner(list){
            return function(event){
                //ensure that it's the action button on the mouse
                    if(event.button != 0){return;}
                
                //save target
                    system.svgElement.temp_target = this.target;

                //run through function list, and activate functions where necessary
                    system.mouse.functionListRunner(list)(event);
            }
        }

        grapple.onmousedown = grappleFunctionRunner( system.mouse.objectGrapple_functionList.onmousedown );
        grapple.onmouseup = grappleFunctionRunner( system.mouse.objectGrapple_functionList.onmouseup );
    };

    //duplication
    this.objectGrapple_functionList.onmousedown.push(
        {
            'specialKeys':[system.super.keys.alt],
            'function':function(event){
                if(system.super.readOnlyMode){return;}

                // if mousedown occurs over an object that isn't selected; select it
                    if( !system.selection.selectedObjects.includes(system.svgElement.temp_target) ){
                        system.selection.selectObject(system.svgElement.temp_target);
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

                return true;
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
                    if( !system.selection.selectedObjects.includes(system.svgElement.temp_target) ){
                        if(!event.shiftKey){ system.selection.deselectEverything(); }
                        system.selection.selectObject(system.svgElement.temp_target);
                    }

                // collect together information on the click position and the selected object's positions and section area
                    system.svgElement.temp_oldClickPosition = [event.x,event.y];
                    system.svgElement.temp_oldObjectPositions = [];
                    system.svgElement.temp_oldObjectSelectionArea = [];
                    for(var a = 0; a < system.selection.selectedObjects.length; a++){
                        system.svgElement.temp_oldObjectPositions.push( system.utility.element.getTransform(system.selection.selectedObjects[a]) );
                        system.svgElement.temp_oldObjectSelectionArea.push( Object.assign({},system.selection.selectedObjects[a].selectionArea) );
                    }

                // perform the move for all selected objects
                    system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                    system.svgElement.onmousemove = function(event){
                        for(var a = 0; a < system.selection.selectedObjects.length; a++){
                            // calculate new position
                                var clickPosition = system.svgElement.temp_oldClickPosition;
                                var position = {};
                                    position.x = system.svgElement.temp_oldObjectPositions[a].x;
                                    position.y = system.svgElement.temp_oldObjectPositions[a].y;
                                    position.s = system.svgElement.temp_oldObjectPositions[a].s;
                                    position.r = system.svgElement.temp_oldObjectPositions[a].r;
                                var globalScale = system.utility.workspace.getGlobalScale(system.selection.selectedObjects[a]);

                                position.x = (position.x-(clickPosition[0]-event.x)/globalScale);
                                position.y = (position.y-(clickPosition[1]-event.y)/globalScale);

                            // check for collisions, and adjust accordingly if required
                                // calculate new object base points
                                    var diff = {
                                        x: system.svgElement.temp_oldObjectPositions[a].x - position.x,
                                        y: system.svgElement.temp_oldObjectPositions[a].y - position.y
                                    };
                                    var box = system.svgElement.temp_oldObjectSelectionArea[a].box.map(function(a){return {x:a.x-diff.x, y:a.y-diff.y};});
                                    var points = system.svgElement.temp_oldObjectSelectionArea[a].points.map(function(a){return {x:a.x-diff.x, y:a.y-diff.y};});

                                // discover if these points collide with any of the other objects
                                // (if this object is free from clipping and global 'enableObjectClipping' is false; skip this step)
                                    function detectOverlap(box,points){
                                        var objects = system.pane.middleground.children;
                                        for(var b = 0; b < objects.length; b++){
                                            if(objects[b] != system.selection.selectedObjects[a] && objects[b].selectionArea){ //check compared object is not the moving object, and that it has a selection area
                                                if(system.utility.math.detectOverlap(points, objects[b].selectionArea.points, box, objects[b].selectionArea.box)){
                                                    return true;
                                                }
                                            }
                                        }
                                        return false;
                                    }
                                    var overlapDetected = system.selection.selectedObjects[a].clippingActive && system.super.enableObjectClipping ? detectOverlap(box,points) : false;

                                    // if so, don't change anything
                                    // if not, go ahead as usual (push object position update)
                                        if(!overlapDetected){
                                            system.utility.element.setTransform(system.selection.selectedObjects[a], position);
                                        }

                            // perform all redraws and updates for object
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

                return true;
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
                if( system.selection.selectedObjects.includes(system.svgElement.temp_target) ){
                    if( event.shiftKey && (system.selection.lastselectedObjects != system.svgElement.temp_target) ){
                        system.selection.deselectObject(system.svgElement.temp_target);
                    }
                    system.selection.lastselectedObjects = null;
                }

                return true;
            }
        }
    );










// onmousemove functions
    this.onmousemove_functionList = [];
    system.svgElement.onmousemove = function(event){
        //inform control of the mouse move
            control.mousemove(event);

        //perform workspace functions
            //perform functions only if the element in question and all of it's parents are ok with it
                if(system.utility.object.requestInteraction(event.x,event.y,'onmousemove','workspace')){
                    //run through function list, and activate functions where necessary
                        system.mouse.functionListRunner(system.mouse.onmousemove_functionList)(event);
                }
    };

    // register position
    this.onmousemove_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                system.mouse.currentPosition = [event.x, event.y];
                return true;
            }
        }
    );








// onmousedown functions
    this.onmousedown_functionList = [];
    system.svgElement.onmousedown = function(event){
        //inform control of the mouse down
            control.mousedown(event);

        //perform workspace functions
            //perform functions only if the element in question and all of it's parents are ok with it, and if the action button
            //is being used
                if( system.utility.object.requestInteraction(event.x,event.y,'onmousedown','workspace') && event.button == 0 ){
                    //run through function list, and activate functions where necessary
                        system.mouse.functionListRunner(system.mouse.onmousedown_functionList)(event);
                }
    };

    //group selection
    this.onmousedown_functionList.push(
        {
            'specialKeys':['shiftKey'],
            'function':function(event){
                if(system.super.readOnlyMode){return;}

                //setup
                    system.svgElement.tempData = {};
                    system.svgElement.tempElements = [];
                    system.svgElement.tempData.start = {'x':event.x, 'y':event.y};

                //create 'selection box' graphic and add it to the control pane
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
                            this.onmouseleave = null;
                            this.onmouseup = null;
                    };

                system.svgElement.onmouseleave = system.svgElement.onmouseup;

                system.svgElement.onmousemove(event);

                return true;
            }
        }
    );

    //panning 
    this.onmousedown_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                if(!system.super.mouseGripPanningEnabled){return;}

                system.selection.deselectEverything();
                system.svgElement.temp_oldPosition = system.utility.element.getTransform(system.pane.workspace);
                system.pane.workspace.setAttribute('clickPosition','['+event.x +','+ event.y+']');

                system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                system.svgElement.onmousemove = function(event){
                    var position = {};
                        position.x = system.svgElement.temp_oldPosition.x;
                        position.y = system.svgElement.temp_oldPosition.y;
                        position.s = system.svgElement.temp_oldPosition.s;
                        position.r = system.svgElement.temp_oldPosition.r;
                    var clickPosition = JSON.parse(system.pane.workspace.getAttribute('clickPosition'));
                    position.x = position.x-(clickPosition[0]-event.x);
                    position.y = position.y-(clickPosition[1]-event.y);
                    system.utility.element.setTransform(system.pane.workspace, position);
                };

                system.svgElement.onmouseup = function(){
                    this.onmousemove = system.svgElement.onmousemove_old;
                    delete system.svgElement.onmousemove_old;
                    system.pane.workspace.removeAttribute('clickPosition');
                    this.onmouseleave = null;
                    this.onmouseup = null;
                };

                system.svgElement.onmouseleave = system.svgElement.onmouseup;

                system.svgElement.onmousemove(event);

                return true;
            }
        }
    );







// onwheel functions
    this.onwheel_functionList = [];
    system.svgElement.onwheel = function(event){
        //inform control of the mouse wheel
            control.mousewheel(event);

        //perform workspace functions
            //perform functions only if the element in question and all of it's parents are ok with it
                if(system.utility.object.requestInteraction(event.x,event.y,'onwheel','workspace')){
                    //run through function list, and activate functions where necessary
                        system.mouse.functionListRunner(system.mouse.onwheel_functionList)(event);
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

                return true;
            }
        }
    );