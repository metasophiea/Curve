this.rangeslide = function(
    id='rangeslide', 
    x, y, width, height, angle=0,
    handleHeight=0.025, spanWidth=0.75, values={start:0,end:1}, resetvalues={start:-1,end:-1},
    handleStyle='fill:rgba(200,200,200,1)',
    backingStyle='fill:rgba(150,150,150,1)',
    slotStyle='fill:rgba(50,50,50,1)',
    invisibleHandleStyle='fill:rgba(0,0,0,0);',
    spanStyle='fill:rgba(200,0,200,0.5);',
){
    var grappled = false;
    var handleNames = ['start','end'];

    //elements
        //main
            var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y, r:angle});
        //backing and slot group
            var backingAndSlot = __globals.utility.experimental.elementMaker('g','backingAndSlotGroup',{});
            object.appendChild(backingAndSlot);
            //backing
                var backing = __globals.utility.experimental.elementMaker('rect','backing',{width:width,height:height, style:backingStyle});
                backingAndSlot.appendChild(backing);
            //slot
                var slot = __globals.utility.experimental.elementMaker('rect','slot',{x:width*0.45,y:(height*(handleHeight/2)),width:width*0.1,height:height*(1-handleHeight), style:slotStyle});
                backingAndSlot.appendChild(slot);

        //span
            var span = __globals.utility.experimental.elementMaker('rect','span',{
                x:width*((1-spanWidth)/2), y:height*handleHeight,
                width:width*spanWidth, height:height - 2*height*handleHeight, 
                style:spanStyle
            });
            object.appendChild(span);

        //handles
            var handles = {}
            for(var a = 0; a < handleNames.length; a++){
                //grouping
                    handles[handleNames[a]] = __globals.utility.experimental.elementMaker('g','handle_'+a,{})
                    object.appendChild(handles[handleNames[a]]);
                //handle
                    var handle = __globals.utility.experimental.elementMaker('rect','handle',{width:width,height:height*handleHeight, style:handleStyle});
                    handles[handleNames[a]].appendChild(handle);
                //invisible handle
                    var invisibleHandleHeight = height*handleHeight + height*0.01;
                    var invisibleHandle = __globals.utility.experimental.elementMaker('rect','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, style:invisibleHandleStyle});
                    handles[handleNames[a]].appendChild(invisibleHandle);
            }

    //graphical adjust
        function set(a,handle,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            //make sure the handle order is maintained
            //if necessary, one handle should push the other, though not past the ends
                switch(handle){
                    default: console.error('unknown handle to adjust'); break;
                    case 'start':
                        if((values.end - a + handleHeight*(a - values.end - 1)) < 0){
                            if( (a + handleHeight) > 1 ){ a = 1 - handleHeight; }
                            values.start = a;
                            values.end = a + handleHeight;
                        }
                    break;
                    case 'end': 
                        if((a - values.start + handleHeight*(values.start - a - 1)) < 0){
                            if( (a - handleHeight) < 0 ){ a = handleHeight; }
                            values.start = a - handleHeight;
                            values.end = a;
                        }
                    break;
                }

            //fill in data
                values[handle] = a;

            //adjust y positions
                __globals.utility.element.setTransform_XYonly(handles.start,0,values.start*height*(1-handleHeight));
                __globals.utility.element.setTransform_XYonly(handles.end,0,values.end*height*(1-handleHeight));

            //adjust span height (with a little bit of padding so the span is under the handles a little)
                __globals.utility.element.setTransform_XYonly(span, width*((1-spanWidth)/2), height*(handleHeight + values.start - handleHeight*(values.start + 0.1)));
                span.height.baseVal.value = height*( values.end - values.start + handleHeight*(values.start - values.end - 1 + 0.2) );

            if(update && object.onchange){object.onchange(values);}
        }
        function pan(a){
            var diff = values.end - values.start;

            var newPositions = [ a, a+diff ];
            if(newPositions[0] <= 0){
                newPositions[1] = newPositions[1] - newPositions[0];
                newPositions[0] = 0;
            }
            else if(newPositions[1] >= 1){
                newPositions[0] = newPositions[0] - (newPositions[1]-1);
                newPositions[1] = 1;
            }

            set( newPositions[0],'start' );
            set( newPositions[1],'end' );
        }

    //methods
        object.get = function(){return values;};
        object.set = function(values,update){
            if(grappled){return;}
            if(values.start){set(values.start,'start',update);}
            if(values.end){set(values.end,'end',update);}
        };
        object.smoothSet = function(targets,time,curve,update){
            if(grappled){return;}

            var startTime = __globals.audio.context.currentTime;
            var startValues = JSON.parse(JSON.stringify(values));
            var pointFunc = __globals.utility.math.curvePoint.linear;

            switch(curve){
                case 'linear': pointFunc = __globals.utility.math.curvePoint.linear; break;
                case 'sin': pointFunc = __globals.utility.math.curvePoint.sin; break;
                case 'cos': pointFunc = __globals.utility.math.curvePoint.cos; break;
                case 'exponential': pointFunc = __globals.utility.math.curvePoint.exponential; break;
                case 's': pointFunc = __globals.utility.math.curvePoint.s; break;
            }

            object.smoothSet.interval = setInterval(function(){
                var progress = (__globals.audio.context.currentTime-startTime)/time; if(progress > 1){progress = 1;}
                if(targets.start != undefined){set( pointFunc(progress, startvalues.start, targets.start),'start', update );}
                if(targets.end != undefined){set( pointFunc(progress, startvalues.end, targets.end),'end', update );}
                if( (__globals.audio.context.currentTime-startTime) >= time ){
                    if(object.onrelease){object.onrelease(values);}
                    clearInterval(object.smoothSet.interval);
                }
            }, 1000/30); 
        };
        
    //interaction
        //background click
            backingAndSlot.onclick = function(event){
                if(grappled){return;}
                if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}

                var y = __globals.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width,height).y;
                y = y + 0.5*handleHeight*((2*y)-1);

                Math.abs(values.start-y) < Math.abs(values.end-y) ? set(y,'start') : set(y,'end');
            };

        //double-click reset
            object.ondblclick = function(){
                if(resetvalues.start<0 || resetvalues.end<0){return;}
                if(grappled){return;}
                if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}

                set(resetvalues.start,'start');
                set(resetvalues.end,'end');
                object.onrelease(values);
            };

        //span panning - expand/shrink
            object.onwheel = function(){
                if(grappled){return;}
                if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}

                var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
                var globalScale = __globals.utility.workspace.getGlobalScale(object);
                var val = move/(10*globalScale);

                set(values.start-val,'start');
                set(values.end+val,'end');
            };

        //span panning - drag
            span.onmousedown = function(event){
                grappled = true;
                if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}

                var initialValue = values.start;
                var initialPosition = __globals.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);

                __globals.utility.workspace.mouseInteractionHandler(
                    function(event){
                        var livePosition = __globals.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);
                        pan( initialValue+(livePosition.y-initialPosition.y) )
                        object.onchange(values);
                    },
                    function(event){
                        var livePosition = __globals.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);
                        pan( initialValue+(livePosition.y-initialPosition.y) )
                        object.onrelease(values);
                        grappled = false;
                    }
                );
            };

        //handle movement
            for(var a = 0; a < handleNames.length; a++){
                handles[handleNames[a]].onmousedown = (function(a){
                    return function(event){
                        grappled = true;
                        if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
            
                        var initialValue = values[handleNames[a]];
                        var initialPosition = __globals.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);
                        
                        __globals.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = __globals.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);
                                set( initialValue+(livePosition.y-initialPosition.y),handleNames[a] );
                                object.onchange(values);
                            },
                            function(event){
                                var livePosition = __globals.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);
                                set( initialValue+(livePosition.y-initialPosition.y),handleNames[a] );
                                object.onrelease(values);
                                grappled = false;
                            }
                        );
                    }
                })(a);
            }
      
    //callbacks
        object.onchange = function(){};
        object.onrelease = function(){};  

    //setup
        set(0,'start');
        set(1,'end');

    return object;
};