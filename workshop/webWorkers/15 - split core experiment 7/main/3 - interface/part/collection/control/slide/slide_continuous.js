this.slide_continuous = function(
    name='slide_continuous', 
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
        //handle
            const handle = interfacePart.builder('basic','rectangle','handle',{width:width, height:height*handleHeight, colour:handleStyle});
            object.append(handle);
        //invisible handle
            const invisibleHandle = interfacePart.builder('basic','rectangle','invisibleHandle',{y:-( height*0.01 )/2, width:width, height: height*(handleHeight+0.01) + handleHeight, colour:invisibleHandleStyle});
            object.append(invisibleHandle);
        //cover
            const cover = interfacePart.builder('basic','rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
            object.append(cover);

    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}
            
            value = a;
            handle.y( a*height*(1-handleHeight) );
            invisibleHandle.y( handle.y() - ( height*0.01 )/2 );
        }
        function currentMousePosition(event){
            const calculationAngle = object.getOffset().angle;
            return event.Y*Math.cos(calculationAngle) - event.X*Math.sin(calculationAngle);
        }

    //methods
        let grappled = false;

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
        cover.attachCallback('ondblclick', function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}

            set(resetValue);
            if(object.onrelease != undefined){object.onrelease(value);}
        });
        cover.attachCallback('onwheel', function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}

            const move = event.wheelDelta/100;
            const globalScale = _canvas_.core.viewport.scale();
            set( value + move/(10*globalScale) );
            if(object.onrelease != undefined){object.onrelease(value);}
        });
        // backingAndSlotCover.onmousedown = function(){};//to stop unit selection
        backingAndSlotCover.attachCallback('onclick', function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}

            //calculate the distance the click is from the top of the slider (accounting for angle)
                const offset = backingAndSlot.getOffset();
                const delta = {
                    x: x - (backingAndSlot.x() + offset.x),
                    y: y - (backingAndSlot.y() + offset.y),
                    a: 0 - (backingAndSlot.angle() + offset.angle),
                };
                const d = _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a ).y / cover.height();

            //use the distance to calculate the correct value to set the slide to
            //taking into account the slide handle's size also
                const value = d + 0.5*handleHeight*((2*d)-1);

            set(value);
            if(object.onrelease != undefined){object.onrelease(value);}
        });
        // invisibleHandle.onclick = function(x,y,event){};
        invisibleHandle.attachCallback('onmousedown', function(x,y,event){
            if(!interactable){return;}
            grappled = true;

            const initialValue = value;
            const initialY = currentMousePosition(event);
            const mux = height - height*handleHeight;

            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    const numerator = initialY-currentMousePosition(event);
                    const divider = _canvas_.core.viewport.scale();
                    set( initialValue - (numerator/(divider*mux) ) );
                },
                function(event){
                    grappled = false;
                }
            );
        });

    //setup
        set(value);

    //callbacks
        object.onchange = onchange; 
        object.onrelease = onrelease;

    return object;
};

interfacePart.partLibrary.control.slide_continuous = function(name,data){ return interfacePart.collection.control.slide_continuous(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, 
    data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
    data.onchange, data.onrelease
); };