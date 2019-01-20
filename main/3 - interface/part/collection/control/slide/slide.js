this.slide = function(
    name='slide', 
    x, y, width=10, height=95, angle=0, interactable=true,
    handleHeight=0.1, value=0, resetValue=-1,
    handleStyle = 'rgba(200,200,200,1)',
    backingStyle = 'rgba(150,150,150,1)',
    slotStyle = 'rgba(50,50,50,1)',
    invisibleHandleStyle = 'rgba(255,0,0,0)',
    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //backing and slot group
            var backingAndSlot = interfacePart.builder('group','backingAndSlotGroup');
            object.append(backingAndSlot);
            //backing
                var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, style:{fill:backingStyle}});
                backingAndSlot.append(backing);
            //slot
                var slot = interfacePart.builder('rectangle','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), style:{fill:slotStyle}});
                backingAndSlot.append(slot);
            //backing and slot cover
                var backingAndSlotCover = interfacePart.builder('rectangle','backingAndSlotCover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
                backingAndSlot.append(backingAndSlotCover);
        //handle
            var handle = interfacePart.builder('rectangle','handle',{width:width, height:height*handleHeight, style:{fill:handleStyle}});
            object.append(handle);
        //invisible handle
            var invisibleHandleHeight = height*handleHeight + height*0.01;
            var invisibleHandle = interfacePart.builder('rectangle','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, style:{fill:invisibleHandleStyle}});
            object.append(invisibleHandle);




    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}
            
            value = a;
            handle.y = a*height*(1-handleHeight);
            invisibleHandle.y = a*height*(1-handleHeight);

            handle.computeExtremities();
            invisibleHandle.computeExtremities();
        }
        object.__calculationAngle = angle;
        function currentMousePosition(event){
            return event.y*Math.cos(object.__calculationAngle) - event.x*Math.sin(object.__calculationAngle);
        }




    //methods
        var grappled = false;

        object.set = function(value,update){
            if(grappled){return;}
            set(value,update);
        };
        object.get = function(){return value;};
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };




    //interaction
        object.ondblclick = function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}

            set(resetValue);
            if(object.onrelease != undefined){object.onrelease(value);}
        };
        object.onwheel = function(){
            if(!interactable){return;}
            if(grappled){return;}

            var move = event.deltaY/100;
            var globalScale = workspace.core.viewport.scale();
            set( value + move/(10*globalScale) );
            if(object.onrelease != undefined){object.onrelease(value);}
        };
        backingAndSlot.onmousedown = function(x,y,event){};//to stop unit selection
        backingAndSlot.onclick = function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}

            //calculate the distance the click is from the top of the slider (accounting for angle)
                var offset = backingAndSlot.getOffset();
                var delta = {
                    x: x - (backingAndSlot.x     + offset.x),
                    y: y - (backingAndSlot.y     + offset.y),
                    a: 0 - (backingAndSlot.angle + offset.a),
                };
                var d = workspace.library.math.cartesianAngleAdjust( delta.x, delta.y, delta.a ).y / backingAndSlotCover.height;

            //use the distance to calculate the correct value to set the slide to
            //taking into account the slide handle's size also
                var value = d + 0.5*handleHeight*((2*d)-1);

            set(value);
            if(object.onrelease != undefined){object.onrelease(value);}
        };
        invisibleHandle.onmousedown = function(x,y,event){
            if(!interactable){return;}
            grappled = true;

            var initialValue = value;
            var initialY = currentMousePosition(event);
            var mux = height - height*handleHeight;

            workspace.system.mouse.mouseInteractionHandler(
                function(event){
                    var numerator = initialY-currentMousePosition(event);
                    var divider = workspace.core.viewport.scale();
                    set( initialValue - (numerator/(divider*mux) * window.devicePixelRatio) );
                },
                function(event){
                    var numerator = initialY-currentMousePosition(event);
                    var divider = workspace.core.viewport.scale();
                    object.onrelease(initialValue - (numerator/(divider*mux) * window.devicePixelRatio) );
                    grappled = false;
                }
            );
        };



    //setup
        set(value);

    //callbacks
        object.onchange = onchange; 
        object.onrelease = onrelease;

    return object;
};