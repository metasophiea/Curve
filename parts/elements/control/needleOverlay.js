this.needleOverlay = function(
    id='needleOverlay',
    x, y, width, height, angle=0, needleWidth=0.00125, selectNeedle=true, selectionArea=true,
    needleStyles=['fill:rgba(240, 240, 240, 1);','fill:rgba(255, 231, 114, 1);'],
){
    var needleData = {};

    //elements
        //main
            var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y});
        //backing
            var backing = __globals.utility.experimental.elementMaker('rect','backing',{width:width,height:height,style:'fill:rgba(100,100,100, 0);'});
            object.appendChild(backing);
        //control objects
            var invisibleHandleWidth = width*needleWidth + width*0.005;
            var controlObjects = {};
                //lead
                controlObjects.lead = __globals.utility.experimental.elementMaker('g','lead',{});
                controlObjects.lead.append(__globals.utility.experimental.elementMaker('rect','handle',{width:needleWidth*width,height:height,style:needleStyles[0]}));
                controlObjects.lead.append(__globals.utility.experimental.elementMaker('rect','invisibleHandle',{x:(width*needleWidth - invisibleHandleWidth)/2, width:invisibleHandleWidth,height:height,style:'fill:rgba(255,0,0,0);cursor: col-resize;'}));
                //selection_A
                controlObjects.selection_A = __globals.utility.experimental.elementMaker('g','selection_A',{});
                controlObjects.selection_A.append(__globals.utility.experimental.elementMaker('rect','handle',{width:needleWidth*width,height:height,style:needleStyles[1]}));
                controlObjects.selection_A.append(__globals.utility.experimental.elementMaker('rect','invisibleHandle',{x:(width*needleWidth - invisibleHandleWidth)/2, width:invisibleHandleWidth,height:height,style:'fill:rgba(255,0,0,0);cursor: col-resize;'}) );
                //selection_B
                controlObjects.selection_B = __globals.utility.experimental.elementMaker('g','selection_B',{});
                controlObjects.selection_B.append(__globals.utility.experimental.elementMaker('rect','handle',{width:needleWidth*width,height:height,style:needleStyles[1]}));
                controlObjects.selection_B.append(__globals.utility.experimental.elementMaker('rect','invisibleHandle',{x:(width*needleWidth - invisibleHandleWidth)/2, width:invisibleHandleWidth,height:height,style:'fill:rgba(255,0,0,0);cursor: col-resize;'}) );
                //selection_area
                controlObjects.selection_area = __globals.utility.experimental.elementMaker('rect','selection_area',{height:height,style:needleStyles[1]+'opacity:0.33; cursor: move;'});
                //generic needles
                controlObjects.generic = [];
            var controlObjectsGroup = __globals.utility.experimental.elementMaker('g','controlObjectsGroup',{})
            object.append(controlObjectsGroup);

    //internal functions
        function setGenericNeedle(number,location,specialStyle={}){
            if(controlObjects.generic[number] && location != undefined){
                __globals.utility.element.setTransform_XYonly( controlObjects.generic[number], location*width - width*needleWidth*location, 0);
            }else if(controlObjects.generic[number]){
                controlObjects.generic[number].remove();
                delete controlObjects.generic[number];
            }else{
                controlObjects.generic[number] = __globals.utility.experimental.elementMaker('g','generic_'+number,{x:(location*width - needleWidth*width/2), style:specialStyle})
                controlObjects.generic[number].append( __globals.utility.experimental.elementMaker('rect','handle',{width:needleWidth*width,height:height,style:needleStyles[0]}) );
                controlObjects.generic[number].append( __globals.utility.experimental.elementMaker('rect','invisibleHandle',{x:(width*needleWidth - invisibleHandleWidth)/2, width:invisibleHandleWidth,height:height,style:'fill:rgba(255,0,0,0);'}) );
                controlObjectsGroup.append( controlObjects.generic[number] );
            }
        }
        //place the selected needle at the selected location
        function needleJumpTo(needle,location){
            //if the location is wrong, remove the needle and return
            if(location == undefined || location < 0 || location > 1){
                controlObjects[needle].remove();
                delete needleData[needle];
                return;
            }

            //if the needle isn't in the scene, add it
            if( !controlObjectsGroup.contains(controlObjects[needle]) ){
                controlObjectsGroup.append(controlObjects[needle]);
            }

            //actualy set the location of the needle (adjusting for the size of needle)
            __globals.utility.element.setTransform_XYonly( controlObjects[needle], location*width - width*needleWidth*location, 0);
            //save this value
            needleData[needle] = location;
        }
        function computeSelectionArea(){
            //if the selection needles' data are missing (or they are the same position) remove the area element and return
            if(needleData.selection_A == undefined || needleData.selection_B == undefined || needleData.selection_A == needleData.selection_B){
                controlObjects.selection_area.remove();
                object.selectionAreaToggle(false);
                delete needleData.selection_area;
                return;
            }

            //if the area isn't in the scene, add it
            if( !controlObjectsGroup.contains(controlObjects.selection_area) ){
                controlObjectsGroup.append(controlObjects.selection_area);
                object.selectionAreaToggle(true);
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

            __globals.utility.element.setTransform_XYonly(controlObjects.selection_area, width*start, 0);
            controlObjects.selection_area.setAttribute('width',width*area);
        }

    //interaction
        //generic onmousedown code for interaction
        function needle_onmousedown(needleName,callback){
            if(object.onchange){ object.onchange(needleName,__globals.utility.element.getPositionWithinFromMouse(event,object,width,height).x); }
            __globals.svgElement.onmousemove = function(event){
                var x = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height).x;

                needleJumpTo(needleName,x);
                if(object.onchange){ object.onchange(needleName,x); }
                if(callback){callback();}
            };
            __globals.svgElement.onmouseup = function(event){
                var x = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height).x;
                needleJumpTo(needleName,x);
                if(object.onrelease){ object.onrelease(needleName,x); }
                if(callback){callback();}
                __globals.svgElement.onmousemove = undefined;
                __globals.svgElement.onmouseleave = undefined;
                __globals.svgElement.onmouseup = undefined;
            };
            __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        }

        backing.onmousedown = function(event){
            if(!event.shiftKey){
                if(!selectNeedle){return;}
                needleJumpTo('lead',__globals.utility.element.getPositionWithinFromMouse(event,object,width,height).x);
                needle_onmousedown('lead');
            }
            else{
                if(!selectionArea){return;}
                needleJumpTo('selection_A',__globals.utility.element.getPositionWithinFromMouse(event,object,width,height).x);
                needle_onmousedown('selection_B',computeSelectionArea);
            }
        };
        controlObjects.lead.onmousedown = function(){ needle_onmousedown('lead'); };
        controlObjects.selection_A.onmousedown = function(){
            needle_onmousedown('selection_A',computeSelectionArea); 
        };
        controlObjects.selection_B.onmousedown = function(){
            needle_onmousedown('selection_B',computeSelectionArea); 
        };
        controlObjects.selection_area.onmousedown = function(){
            __globals.svgElement.onmousemove = function(event){
                var divider = __globals.utility.workspace.getGlobalScale(object);
                var newAlocation = needleData['selection_A']+event.movementX/(width*divider);
                var newBlocation = needleData['selection_B']+event.movementX/(width*divider);

                if(newAlocation > 1 || newAlocation < 0 || newBlocation > 1 || newBlocation < 0){return;}

                if(object.onchange){ object.onchange('selection_A',newAlocation); object.onchange('selection_B',newBlocation); }
                needleJumpTo('selection_A',newAlocation);
                needleJumpTo('selection_B',newBlocation);
                computeSelectionArea();
            };
            __globals.svgElement.onmouseup = function(event){
                if(object.onrelease){ object.onrelease('selection_A',needleData.selection_A); object.onrelease('selection_B',needleData.selection_B); }
                __globals.svgElement.onmousemove = undefined;
                __globals.svgElement.onmouseleave = undefined;
                __globals.svgElement.onmouseup = undefined;
            };
        };
        
        //doubleclick to destroy selection area
        controlObjects.selection_A.ondblclick = function(){
            needleJumpTo('selection_A');
            needleJumpTo('selection_B');
            computeSelectionArea();
        };
        controlObjects.selection_B.ondblclick = controlObjects.selection_A.ondblclick;
        controlObjects.selection_area.ondblclick = controlObjects.selection_A.ondblclick;

    //controls
        object.select = function(position,update=true){
            if(!selectNeedle){return;}
            //if there's no input, return the value
            //if input is out of bounds, remove the needle
            //otherwise, set the position
            if(position == undefined){ return needleData.lead; }
            else if(position > 1 || position < 0){ needleJumpTo('lead'); }
            else{ needleJumpTo('lead',position); }
        };
        object.area = function(positionA,positionB){
            if(!selectionArea){return;}

            //if there's no input, return the values
            //if input is out of bounds, remove the needles
            //otherwise, set the position
            if(positionA == undefined || positionB == undefined){
                return {A:needleData.selection_A, B:needleData.selection_B};
            }else if(positionA > 1 || positionA < 0 || positionB > 1 || positionB < 0 ){
                needleJumpTo('selection_A');
                needleJumpTo('selection_B');
            }else{
                needleJumpTo('selection_A',positionA);
                needleJumpTo('selection_B',positionB);
            }

            //you always gotta computer the selection area
            computeSelectionArea();
        };
        object.genericNeedle = function(number,position,specialStyle=''){
            setGenericNeedle(number,position,specialStyle);
        };

    //callbacks
        object.onchange = function(needle,value){};
        object.onrelease = function(needle,value){};
        object.selectionAreaToggle = function(bool){};

    return object;
};