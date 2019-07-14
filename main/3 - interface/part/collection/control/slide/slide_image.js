this.slide_image = function(
    name='slide_image', 
    x, y, width=10, height=95, angle=0, interactable=true,
    handleHeight=0.1, value=0, resetValue=-1,
    
    handleURL, backingURL,

    invisibleHandleStyle = {r:1,g:0,b:0,a:0},
    onchange=function(){},
    onrelease=function(){},
){
    //default to non-image version if handle image link is missing
        if(handleURL == undefined){
            return this.slide(
                name, x, y, width, height, angle, interactable,
                handleHeight, value, resetValue,
                handleURL, backingURL, invisibleHandleStyle,
                onchange, onrelease,
            );
        }

    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //backing and slot group
            var backingAndSlot = interfacePart.builder('basic','group','backingAndSlotGroup');
            object.append(backingAndSlot);
            //backing
                if(backingURL != undefined){
                    var backing = interfacePart.builder('basic','image','backing',{width:width, height:height, url:backingURL});
                    backingAndSlot.append(backing);
                }
            //backing and slot cover
                var backingAndSlotCover = interfacePart.builder('basic','rectangle','backingAndSlotCover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                backingAndSlot.append(backingAndSlotCover);
        //handle
            var handle = interfacePart.builder('basic','image','handle',{width:width, height:height*handleHeight, url:handleURL});
            object.append(handle);
        //invisible handle
            var invisibleHandle = interfacePart.builder('basic','rectangle','invisibleHandle',{y:-( height*0.01 )/2, width:width, height:height*(handleHeight+0.01) + handleHeight, colour:invisibleHandleStyle});
            object.append(invisibleHandle);
        //cover
            var cover = interfacePart.builder('basic','rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
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
            return event.Y*Math.cos(object.__calculationAngle) - event.X*Math.sin(object.__calculationAngle);
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
        backingAndSlotCover.onmousedown = function(){};//to stop unit selection
        backingAndSlotCover.onclick = function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}

            //calculate the distance the click is from the top of the slider (accounting for angle)
                var offset = backingAndSlot.getOffset();
                var delta = {
                    x: event.X - (backingAndSlot.x()+ offset.x),
                    y: event.Y - (backingAndSlot.y()+ offset.y),
                    a: 0 - (backingAndSlot.angle() + offset.angle),
                };
                var d = _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a ).y / backingAndSlotCover.height();

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