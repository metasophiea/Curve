this.needleOverlay = function(
    name='needleOverlay',
    x, y, width=120, height=60, angle=0, interactable=true, allowAreaSelection=true, needleWidth=1/Math.pow(2,9), 
    selectNeedle=true, selectionArea=true, concurrentMarkerCountLimit=-1, //'-1' is infinite
    needleStyles=[
        {r:0.94,g:0.94,b:0.94,a:1},
        {r:1,g:0.9,b:0.44,a:1},
    ],
    onchange=function(needle,value){}, 
    onrelease=function(needle,value){}, 
    selectionAreaToggle=function(bool){},
){
    var debugMode = !true;
    var needleData = {};
    var grappled = {};
    var markerCount = 0;

    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //backing
            var backing = interfacePart.builder('basic','rectangle','backing',{width:width, height:height, colour:{r:0,g:0,b:1,a:0}});
            object.append(backing);
        //control objects
            var controlObjectsGroup = interfacePart.builder('basic','group','controlObjectsGroup');
            object.append(controlObjectsGroup);

            var invisibleHandleWidth = width*needleWidth + width*0.005;
            var controlObjects = {};
            var selectionObjects = {};

            function generateNeedle(id,colour){
                var tmp = interfacePart.builder('basic','group',id);
                tmp.append( interfacePart.builder('basic','rectangle','handle',{
                    width:needleWidth*width, height:height, colour:colour,
                }));
                tmp.append( interfacePart.builder('basic','rectangle','invisibleHandle',{
                    x:(width*needleWidth - invisibleHandleWidth)/2, 
                    width:invisibleHandleWidth, height:height, colour:{r:1,g:0,b:0,a:0},
                }));

                tmp.getChildByName('invisibleHandle').onmouseenter = function(){_canvas_.core.viewport.cursor('col-resize');};
                tmp.getChildByName('invisibleHandle').onmouseleave = function(){_canvas_.core.viewport.cursor('default');};
                tmp.getChildByName('invisibleHandle').onmousedown = (function(needleID){return function(x,y,event){
                    if(!interactable){return;}

                    grappled[needleID] = true;

                    var initialValue = needleData[needleID];
                    var initialX = currentMousePosition_x(event);
                    var mux = (width - width*needleWidth);

                    _canvas_.system.mouse.mouseInteractionHandler(
                        function(event){
                            var numerator = initialX - currentMousePosition_x(event);
                            var divider = _canvas_.core.viewport.scale();
                            var location = initialValue - numerator/(divider*mux);
                            location = location < 0 ? 0 : location;
                            location = location > 1 ? 1 : location;
                            select(needleID,location);
                        },
                        function(event){
                            var numerator = initialX - currentMousePosition_x(event);
                            var divider = _canvas_.core.viewport.scale();
                            var location = initialValue - numerator/(divider*mux);
                            location = location < 0 ? 0 : location;
                            location = location > 1 ? 1 : location;
                            grappled[needleID] = false;
                            select(needleID,location);
                            if(object.onrelease != undefined){object.onrelease(needleID,location);}
                        },       
                    );
                }})(id);

                needleData[id] = 0;
                grappled[id] = false;

                return tmp;
            }

            //selection_A
                selectionObjects.selection_A = generateNeedle('selection_A',needleStyles[1]);
                selectionObjects.selection_A.getChildByName('invisibleHandle').onmouseenter = function(){_canvas_.core.viewport.cursor('col-resize');};
                selectionObjects.selection_A.getChildByName('invisibleHandle').onmousemove = function(){_canvas_.core.viewport.cursor('col-resize');};
                selectionObjects.selection_A.getChildByName('invisibleHandle').onmouseleave = function(){_canvas_.core.viewport.cursor('default');};
                selectionObjects.selection_A.getChildByName('invisibleHandle').onmousedown = function(x,y,event){
                    if(!allowAreaSelection){return;}
    
                    grappled['selection_A'] = true;
    
                    var initialValue = needleData['selection_A'];
                    var initialX = currentMousePosition_x(event);
                    var mux = (width - width*needleWidth);
    
                    _canvas_.system.mouse.mouseInteractionHandler(
                        function(event){
                            var numerator = initialX - currentMousePosition_x(event);
                            var divider = _canvas_.core.viewport.scale();
                            var location = initialValue - numerator/(divider*mux);
                            location = location < 0 ? 0 : location;
                            location = location > 1 ? 1 : location;
                            area(location,needleData.selection_B);
                        },
                        function(event){
                            var numerator = initialX - currentMousePosition_x(event);
                            var divider = _canvas_.core.viewport.scale();
                            var location = initialValue - numerator/(divider*mux);
                            location = location < 0 ? 0 : location;
                            location = location > 1 ? 1 : location;
                            grappled['selection_A'] = false;
                            area(location,needleData.selection_B);
                            if(object.onrelease != undefined){object.onrelease('selection_A',location);}
                        },       
                    );
                };
                needleData['selection_A'] = undefined;
            //selection_B
                selectionObjects.selection_B = generateNeedle('selection_B',needleStyles[1]);
                selectionObjects.selection_B.getChildByName('invisibleHandle').onmouseenter = function(){_canvas_.core.viewport.cursor('col-resize');};
                selectionObjects.selection_B.getChildByName('invisibleHandle').onmousemove = function(){_canvas_.core.viewport.cursor('col-resize');};
                selectionObjects.selection_B.getChildByName('invisibleHandle').onmouseleave = function(){_canvas_.core.viewport.cursor('default');};
                selectionObjects.selection_B.getChildByName('invisibleHandle').onmousedown = function(x,y,event){
                    if(!allowAreaSelection){return;}
    
                    grappled['selection_B'] = true;
    
                    var initialValue = needleData['selection_B'];
                    var initialX = currentMousePosition_x(event);
                    var mux = (width - width*needleWidth);
    
                    _canvas_.system.mouse.mouseInteractionHandler(
                        function(event){
                            var numerator = initialX - currentMousePosition_x(event);
                            var divider = _canvas_.core.viewport.scale();
                            var location = initialValue - numerator/(divider*mux);
                            location = location < 0 ? 0 : location;
                            location = location > 1 ? 1 : location;
                            area(needleData.selection_A,location);
                        },
                        function(event){
                            var numerator = initialX - currentMousePosition_x(event);
                            var divider = _canvas_.core.viewport.scale();
                            var location = initialValue - numerator/(divider*mux);
                            location = location < 0 ? 0 : location;
                            location = location > 1 ? 1 : location;
                            grappled['selection_B'] = false;
                            area(needleData.selection_A,location);
                            if(object.onrelease != undefined){object.onrelease('selection_B',location);}
                        },       
                    );
                };
                needleData['selection_B'] = undefined;
            //selection_area
                selectionObjects.selection_area = interfacePart.builder('basic','rectangle','selection_area',{ height:height, colour:_canvas_.library.math.blendColours(needleStyles[1],{r:0,g:0,b:0,a:0},0.5) });
                selectionObjects.selection_area.onmouseenter = function(){_canvas_.core.viewport.cursor('grab');};
                selectionObjects.selection_area.onmousemove = function(){_canvas_.core.viewport.cursor('grab');};
                selectionObjects.selection_area.onmouseleave = function(){_canvas_.core.viewport.cursor('default');};
                selectionObjects.selection_area.onmousedown = function(x,y,event){
                    if(!allowAreaSelection){return;}
    
                    _canvas_.core.viewport.cursor('grabbing');
                    grappled['selection_area'] = true;
    
                    var areaSize = needleData.selection_B - needleData.selection_A;
                    var initialValues = {A:needleData.selection_A, B:needleData.selection_B};
                    var initialX = currentMousePosition_x(event);
                    var mux = (width - width*needleWidth);
    
                    function calculate(event){
                        var numerator = initialX - currentMousePosition_x(event);
                        var divider = _canvas_.core.viewport.scale();
    
                        var location = {
                            A: initialValues.A - numerator/(divider*mux),
                            B: initialValues.B - numerator/(divider*mux),
                        };
    
                        if( location.A > 1 ){ location.A = 1; location.B = 1 + areaSize; }
                        if( location.B > 1 ){ location.B = 1; location.A = 1 - areaSize; }
                        if( location.A < 0 ){ location.A = 0; location.B = areaSize; }
                        if( location.B < 0 ){ location.B = 0; location.A = -areaSize; }
    
                        return location;
                    }
                    _canvas_.system.mouse.mouseInteractionHandler(
                        function(event){
                            var location = calculate(event);
                            area(location.A,location.B);
                        },
                        function(event){
                            _canvas_.core.viewport.cursor('grab');
    
                            var location = calculate(event);
    
                            selectionArea_grappled = false;
                            area(location.A,location.B);
                            if(object.onrelease != undefined){object.onrelease('selection_A',location.A);}
                            if(object.onrelease != undefined){object.onrelease('selection_B',location.B);}
                        },
                    );                    
                };

    //internal functions
        function currentMousePosition_x(event){ return event.X*Math.cos(angle) - event.Y*Math.sin(angle); }
        function getRelativeX(x,y){
            var offset = controlObjectsGroup.getOffset();
            var delta = {
                x: x - (controlObjectsGroup.x()     + offset.x),
                y: y - (controlObjectsGroup.y()     + offset.y),
                a: 0 - (controlObjectsGroup.angle() + offset.angle),
            };
            var d = _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a );

            return d.x/backing.width();
        }
        function needleJumpTo(needleID,location,style=needleStyles[0]){
            if(debugMode){ 
                console.log('needleOverlay2::needleJumpTo',needleID,location);
                console.log('\t\tconcurrentMarkerCountLimit:',concurrentMarkerCountLimit);
                console.log('\t\tmarkerCount:',markerCount);
            }

            //if the needle doesn't exist, create it
                if(controlObjects[needleID] == undefined){
                    //if there's too many markers, don't make a new one. Just bail
                    if(concurrentMarkerCountLimit > 0 && markerCount >= concurrentMarkerCountLimit){return -1;}

                    controlObjects[needleID] = generateNeedle(needleID,style);
                    markerCount++;
                }

            //if the needle isn't in the scene, add it
                if( !controlObjectsGroup.contains(controlObjects[needleID]) ){
                    controlObjectsGroup.append(controlObjects[needleID]);
                }

            //if the location is wrong, remove the needle and return
                if(location == undefined || location < 0 || location > 1){
                    controlObjectsGroup.remove(controlObjects[needleID]);
                    delete needleData[needleID];
                    delete grappled[needleID];
                    markerCount--;
                    return;
                }

            //actually set the location of the needle (adjusting for the size of needle)
                controlObjects[needleID].x( location*width - width*needleWidth*location );
            //save this value
                needleData[needleID] = location;
        }
        function select(needleID,position,update=true){ 
            if(!selectNeedle){return;}
            //if there's no input, return the value
            //if input is out of bounds, remove the needle
            //otherwise, set the position
            if(position == undefined){ return needleData[needleID]; }
            else if(position > 1 || position < 0){ needleJumpTo(needleID); }
            else{ needleJumpTo(needleID,position); }

            if(update && object.onchange != undefined){object.onchange(needleID,position);}
        }
        function computeSelectionArea(){
            //if the selection needles' data are missing (or they are the same position) remove the area element (if it exists) and return
                if(needleData.selection_A == undefined || needleData.selection_B == undefined || needleData.selection_A == needleData.selection_B){
                    if(controlObjectsGroup.contains(selectionObjects['selection_area'])){ controlObjectsGroup.remove(selectionObjects['selection_area']); }
                    if(object.selectionAreaToggle){object.selectionAreaToggle(false);}
                    delete needleData.selection_area;
                    return;
                }

            //if the area isn't in the scene, add it
                if( !controlObjectsGroup.contains(selectionObjects['selection_area']) ){
                    controlObjectsGroup.prepend(selectionObjects['selection_area']);
                    if(object.selectionAreaToggle){object.selectionAreaToggle(true);}
                }

            //compute area position and size
                if(needleData.selection_A < needleData.selection_B){
                    var A = needleData.selection_A;
                    var B = needleData.selection_B;
                }else{
                    var A = needleData.selection_B;
                    var B = needleData.selection_A;
                }
                var start = A - needleWidth*A + needleWidth
                var area = B - needleWidth*B - start; 
                if(area < 0){area = 0}

                selectionObjects['selection_area'].x(width*start);
                selectionObjects['selection_area'].width(width*area);
        }
        function area(positionA,positionB,update=true){
            if(!selectionArea){return;}

            //if there's no input, return the values
            if(positionA == undefined || positionB == undefined){
                return {A:needleData.selection_A, B:needleData.selection_B};
            }

            //if the needles aren't in the scene, add them
                if( !controlObjectsGroup.contains(selectionObjects['selection_A']) ){
                    controlObjectsGroup.prepend(selectionObjects['selection_A']);
                    controlObjectsGroup.prepend(selectionObjects['selection_B']);
                }

            //if input is out of bounds or if both bounds are set to 0, remove the needles
            //otherwise, set the position
                if(positionA > 1 || positionA < 0 || positionB > 1 || positionB < 0 || (positionA == 0 && positionB == 0) ){
                    controlObjectsGroup.remove(selectionObjects['selection_A']);
                    controlObjectsGroup.remove(selectionObjects['selection_B']);
                    needleData.selection_A = undefined;
                    needleData.selection_B = undefined;
                }else{
                    selectionObjects['selection_A'].x( positionA*width - width*needleWidth*positionA );
                    needleData['selection_A'] = positionA;
                    selectionObjects['selection_B'].x( positionB*width - width*needleWidth*positionB );
                    needleData['selection_B'] = positionB;
                }

            //you always gotta compute the selection area
                computeSelectionArea();

            if(update && object.onchange != undefined){object.onchange('selection_A',positionA);}
            if(update && object.onchange != undefined){object.onchange('selection_B',positionB);}
        }

    //interaction
        //clear space interaction
            backing.onmousedown = function(x,y,event){
                if( _canvas_.system.keyboard.pressedKeys.shift && allowAreaSelection ){
                    var firstPosition = getRelativeX(event.X,event.Y);
                    _canvas_.system.mouse.mouseInteractionHandler(
                        function(event){ 
                            var x = getRelativeX(event.X,event.Y);
                            if(x < 0){x = 0;}else if(x > 1){x = 1;}
                            object.area(firstPosition,x);
                        },    
                    );
                    return;
                }

                if(!interactable){return;}
                var x = getRelativeX(event.X,event.Y);
                var markerPositions = Object.keys(controlObjects).map(key => needleData[key]).map(position => Math.abs(position-x));
                var smallest = {value:markerPositions[0], index:0};
                for(var a = 1; a < markerPositions.length; a++){ if(smallest.value > markerPositions[a]){ smallest = {value:markerPositions[a], index:a}; } }
                select(smallest.index,x);
            };
        //doubleclick to destroy selection area
            selectionObjects.selection_A.ondblclick = function(){ if(!interactable){return;} area(-1,-1); _canvas_.core.viewport.cursor('default'); };
            selectionObjects.selection_B.ondblclick = selectionObjects.selection_A.ondblclick;
            selectionObjects.selection_area.ondblclick = selectionObjects.selection_A.ondblclick;
        
    //control
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };
        object.allowAreaSelection = function(bool){
            if(bool==undefined){return allowAreaSelection;}
            allowAreaSelection = bool;
        };
        object.select = function(needleID,position,update=true){
            if(position == undefined){return select(needleID);}

            if(grappled[needleID]){return;}
            select(needleID,position,update);
        };
        object.removeAllMarkers = function(){ Object.keys(controlObjects).forEach(ID => object.select(ID,-1)); };
        object.area = function(positionA,positionB,update=true){ return area(positionA,positionB,update); };
        object.areaIsActive = function(){ return !(needleData.selection_A == undefined && needleData.selection_B == undefined); };

        object.list = function(){
            var tmp = Object.assign({},needleData);
            delete tmp.selection_A;
            delete tmp.selection_B;
            return tmp;
        };

    //callback
        object.onchange = onchange;
        object.onrelease = onrelease;
        object.selectionAreaToggle = selectionAreaToggle;

    return object;
};

interfacePart.partLibrary.control.needleOverlay = function(name,data){ return interfacePart.collection.control.needleOverlay(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.allowAreaSelection,
    data.needleWidth, data.selectNeedle, data.selectionArea, data.concurrentMarkerCountLimit,
    data.style.needles,
    data.onchange, data.onrelease, data.selectionAreaToggle,
); };