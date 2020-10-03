this.rangeslide = function(
    name='rangeslide', 
    x, y, width=10, height=95, angle=0, interactable=true,
    handleHeight=0.1, spanWidth=0.75, values={start:0,end:1}, resetValues={start:-1,end:-1},
    handleStyle={r:0.78,g:0.78,b:0.78,a:1},
    backingStyle={r:0.58,g:0.58,b:0.58,a:1},
    slotStyle={r:0.2,g:0.2,b:0.2,a:1},
    invisibleHandleStyle={r:1,g:0,b:0,a:0},
    spanStyle={r:0.78,g:0,b:0.78,a:0.5},
    onchange=function(){},
    onrelease=function(){},
){
    dev.log.partControl('.rangeslide(...)'); //#development

    let grappled = false;
    const handleNames = ['start','end'];

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //backing and slot group
            const backingAndSlot = interfacePart.builder('basic','group','backingAndSlotGroup');
            object.append(backingAndSlot);
            //backing
                const backing = interfacePart.builder('basic','rectangle','backing',{width:width, height:height, colour:backingStyle});
                backingAndSlot.append(backing);
            //slot
                const slot = interfacePart.builder('basic','rectangle','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), colour:slotStyle});
                backingAndSlot.append(slot);
            //backing and slot cover
                const backingAndSlotCover = interfacePart.builder('basic','rectangle','backingAndSlotCover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                backingAndSlot.append(backingAndSlotCover);

        //span
            const span = interfacePart.builder('basic','rectangle','span',{x:width*((1-spanWidth)/2), y:height*handleHeight, width:width*spanWidth, height:height - 2*height*handleHeight, colour:spanStyle });
            object.append(span);

        //handles
            const handles = {}
            for(let a = 0; a < handleNames.length; a++){
                //grouping
                    handles[handleNames[a]] = interfacePart.builder('basic','group','handle_'+a,{})
                    object.append(handles[handleNames[a]]);
                //handle
                    const handle = interfacePart.builder('basic','rectangle','handle',{width:width,height:height*handleHeight, colour:handleStyle});
                    handles[handleNames[a]].append(handle);
                //invisible handle
                    const invisibleHandleHeight = height*handleHeight + height*0.01;
                    const invisibleHandle = interfacePart.builder('basic','rectangle','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, colour:invisibleHandleStyle});
                    handles[handleNames[a]].append(invisibleHandle);
            }

        //cover
            const cover = interfacePart.builder('basic','rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
            object.append(cover);

    //graphical adjust
        function set(a,handle,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            //make sure the handle order is maintained
            //if necessary, one handle should push the other, though not past the ends
                switch(handle){
                    default: console.error('unknown handle to adjust'); break;
                    case 'start':
                        {
                            //don't allow start slide to encrouch on end slider's space
                                if( a / (1-(handleHeight/(1-handleHeight))) >= 1 ){ a = 1-(handleHeight/(1-handleHeight)); }

                            //if start slide bumps up against end slide; move end slide accordingly
                                const start_rightEdge = a + (1-a)*handleHeight;
                                const end_leftEdge = values.end - (values.end)*handleHeight;
                                if( start_rightEdge >= end_leftEdge ){
                                    values.end = start_rightEdge/(1-handleHeight);
                                }
                        }
                    break;
                    case 'end':
                        {
                            //don't allow end slide to encrouch on start slider's space
                                if( a / (handleHeight/(1-handleHeight)) <= 1 ){ a = handleHeight/(1-handleHeight); }

                            //if end slide bumps up against start slide; move start slide accordingly
                                const start_rightEdge= values.start + (1-values.start)*handleHeight;
                                const end_leftEdge = a - (a)*handleHeight;
                                if( start_rightEdge >= end_leftEdge ){
                                    values.start = (end_leftEdge - handleHeight)/(1-handleHeight);
                                }
                        }
                    break;
                }

            //fill in data
                values[handle] = a;

            //adjust y positions
                handles.start.y( values.start*height*(1-handleHeight) );
                handles.end.y( values.end*height*(1-handleHeight) );

            //adjust span height (with a little bit of padding so the span is under the handles a little)
                span.y( height*(handleHeight + values.start - handleHeight*(values.start + 0.1)) );
                span.height( height*( values.end - values.start + handleHeight*(values.start - values.end - 1 + 0.2) ) );

            if(update && object.onchange){object.onchange(values);}
        }
        function pan(a){
            const diff = values.end - values.start;

            const newPositions = [ a, a+diff ];
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
            if(values.start != undefined){set(values.start,'start',update);}
            if(values.end != undefined){set(values.end,'end',update);}
        };
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };
        
    //interaction
        function getPositionWithinFromMouse(x,y){
            //calculate the distance the click is from the top of the slider (accounting for angle)
                const offset = backingAndSlot.getOffset();
                const delta = {
                    x: x - (backingAndSlot.x()     + offset.x),
                    y: y - (backingAndSlot.y()     + offset.y),
                    a: 0 - (backingAndSlot.angle() + offset.angle),
                };

            return _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a ).y / backingAndSlotCover.height();
        }
        function currentMousePosition(event){
            const calculationAngle = object.getOffset().angle;
            return event.y*Math.cos(calculationAngle) - event.x*Math.sin(calculationAngle);
        }

        //background click
            //to stop clicks passing through the span
                span.attachCallback('onmousedown', function(){});
                span.attachCallback('onclick', function(){});
                
            backingAndSlotCover.attachCallback('onmousedown', function(){}); //to stop unit selection
            backingAndSlotCover.attachCallback('onclick', function(x,y,event){
                if(!interactable){return;}
                if(grappled){return;}

                //calculate the distance the click is from the top of the slider (accounting for angle)
                    const d = getPositionWithinFromMouse(x,y);

                //use the distance to calculate the correct value to set the slide to
                //taking into account the slide handle's size also
                    const value = d + 0.5*handleHeight*((2*d)-1);

                //whichever handle is closer; move that handle to the mouse's position
                    Math.abs(values.start-value) < Math.abs(values.end-value) ? set(value,'start') : set(value,'end');
            });

        //double-click reset
            cover.attachCallback('ondblclick', function(){
                if(!interactable){return;}
                if(resetValues.start<0 || resetValues.end<0){return;}
                if(grappled){return;}

                set(resetValues.start,'start');
                set(resetValues.end,'end');
                object.onrelease(values);
            } );

        //span panning - expand/shrink
            cover.attachCallback('onwheel', function(x,y,event){
                if(!interactable){return;}
                if(grappled){return;}

                const move = event.wheelDelta/100;
                const globalScale = _canvas_.core.viewport.scale();
                const val = move/(10*globalScale);

                set(values.start-val,'start');
                set(values.end+val,'end');
            } );

        //span panning - drag
            span.attachCallback('onmousedown', function(x,y,event){
                if(!interactable){return;}
                grappled = true;

                const initialValue = values.start;
                const initialY = currentMousePosition(event);
                const mux = height - height*handleHeight;

                _canvas_.system.mouse.mouseInteractionHandler(
                    function(x,y,event){
                        const numerator = initialY - currentMousePosition(event);
                        const divider = _canvas_.core.viewport.scale();
                        pan( initialValue - (numerator/(divider*mux)) )
                        object.onchange(values);
                    },
                    function(x,y,event){
                        object.onrelease(values);
                        grappled = false;
                    }
                );
            } );

        //handle movement
            for(let a = 0; a < handleNames.length; a++){
                handles[handleNames[a]].getChildren()[1].attachCallback('onclick', function(){});
                handles[handleNames[a]].getChildren()[1].attachCallback('onmousedown', (function(a){
                    return function(x,y,event){
                        if(!interactable){return;}
                        grappled = true;

                        const initialValue = values[handleNames[a]];
                        const initialY = currentMousePosition(event);
                        const mux = height - height*handleHeight;

                        _canvas_.system.mouse.mouseInteractionHandler(
                            function(x,y,event){
                                const numerator = initialY-currentMousePosition(event);
                                const divider = _canvas_.core.viewport.scale();
                                set( initialValue - (numerator/(divider*mux) ), handleNames[a] );
                            },
                            function(x,y,event){
                                object.onrelease(values);
                                grappled = false;
                            }
                        );
                    }
                })(a) );
            }

    //callbacks
        object.onchange = onchange;
        object.onrelease = onrelease;  

    //setup
        set(0,'start');
        set(1,'end');

    return object;
};

interfacePart.partLibrary.control.rangeslide = function(name,data){ return interfacePart.collection.control.rangeslide(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
    data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span,
    data.onchange, data.onrelease
); };