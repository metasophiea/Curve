this.slide = function(
    name='slide', 
    x, y, width=10, height=95, angle=0, interactable=true,
    handleHeight=0.1, value=0, resetValue=-1,
    handleStyle = {r:0.78,g:0.78,b:0.78,a:1},
    backingStyle = {r:0.58,g:0.58,b:0.58,a:1},
    slotStyle = {r:0.2,g:0.2,b:0.2,a:1},
    invisibleHandleStyle = {r:1,g:0,b:0,a:0},
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
                var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, colour:backingStyle});
                backingAndSlot.append(backing);
            //slot
                var slot = interfacePart.builder('rectangle','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), colour:slotStyle});
                backingAndSlot.append(slot);
            //backing and slot cover
                var backingAndSlotCover = interfacePart.builder('rectangle','backingAndSlotCover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                backingAndSlot.append(backingAndSlotCover);
        //handle
            var handle = interfacePart.builder('rectangle','handle',{width:width, height:height*handleHeight, colour:handleStyle});
            object.append(handle);
        //invisible handle
            var invisibleHandle = interfacePart.builder('rectangle','invisibleHandle',{y:-( height*0.01 )/2, width:width, height: height*(handleHeight+0.01) + handleHeight, colour:invisibleHandleStyle});
            object.append(invisibleHandle);
        //cover
            var cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
            object.append(cover);




    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}
            
            value = a;
            handle.y( a*height*(1-handleHeight) );
            invisibleHandle.y( handle.y() - ( height*0.01 )/2 );

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
        cover.ondblclick = function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}

            set(resetValue);
            if(object.onrelease != undefined){object.onrelease(value);}
        };
        cover.onwheel = function(){
            if(!interactable){return;}
            if(grappled){return;}

            var move = event.deltaY/100;
            var globalScale = _canvas_.core.viewport.scale();
            set( value + move/(10*globalScale) );
            if(object.onrelease != undefined){object.onrelease(value);}
        };
        backingAndSlotCover.onmousedown = function(event){};//to stop unit selection
        backingAndSlotCover.onclick = function(event){
            if(!interactable){return;}
            if(grappled){return;}

            //calculate the distance the click is from the top of the slider (accounting for angle)
                var offset = backingAndSlot.getOffset();
                var delta = {
                    x: event.x - (backingAndSlot.x() + offset.x),
                    y: event.y - (backingAndSlot.y() + offset.y),
                    a: 0 - (backingAndSlot.angle() + offset.angle),
                };
                var d = _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a ).y / backingAndSlotCover.height();

            //use the distance to calculate the correct value to set the slide to
            //taking into account the slide handle's size also
                var value = d + 0.5*handleHeight*((2*d)-1);

            set(value);
            if(object.onrelease != undefined){object.onrelease(value);}
        };
        invisibleHandle.onmousedown = function(event){
            if(!interactable){return;}
            grappled = true;

            var initialValue = value;
            var initialY = currentMousePosition(event);
            var mux = height - height*handleHeight;

            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    var numerator = initialY-currentMousePosition(event);
                    var divider = _canvas_.core.viewport.scale();
                    set( initialValue - (numerator/(divider*mux) ) );
                },
                function(event){
                    var numerator = initialY-currentMousePosition(event);
                    var divider = _canvas_.core.viewport.scale();
                    object.onrelease(initialValue - (numerator/(divider*mux) ) );
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