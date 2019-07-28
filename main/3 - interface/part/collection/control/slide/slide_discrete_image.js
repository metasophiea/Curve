this.slide_discrete_image = function(
    name='slide_discrete_image', 
    x, y, width=10, height=95, angle=0, interactable=true,
    handleHeight=0.1, value=0, resetValue=-1, optionCount=5,
    handleURL, backingURL,
    invisibleHandleStyle = {r:1,g:0,b:0,a:0},
    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        
        //slide
            var slide = interfacePart.builder('control','slide_continuous_image',name,{
                x:0, y:0, width:width, height:height, angle:0, interactable:interactable,
                invisibleHandleStyle:invisibleHandleStyle, handleHeight:handleHeight,
                handleURL:handleURL, backingURL:backingURL,
            });
            object.append(slide);


    //graphical adjust
        function set(a,update=true){ 
            a = (a>(optionCount-1) ? (optionCount-1) : a);
            a = (a<0 ? 0 : a);

            a = Math.round(a); 
            if(update && object.onchange != undefined && value != a){object.onchange(a);}
            value = a;
            slide.set( value/(optionCount-1) );
        };
        function currentMousePosition(event){
            var calculationAngle = object.getOffset().angle;
            return event.Y*Math.cos(calculationAngle) - event.X*Math.sin(calculationAngle);
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
        var acc = 0;

        slide.getChildByName('cover').ondblclick = function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue);

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        slide.getChildByName('cover').onwheel = function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}

            var move = event.deltaY/100;

            acc += move;
            if( Math.abs(acc) >= 1 ){
                set( value +1*Math.sign(acc) );
                acc = 0;
                if(object.onrelease != undefined){object.onrelease(value);}
            }
        };
        slide.getChildByName('invisibleHandle').onmousedown = function(x,y,event){
            if(!interactable){return;}
            grappled = true;

            var initialValue = value/(optionCount-1);
            var initialY = currentMousePosition(event);
            var mux = height - height*handleHeight;

            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    var numerator = initialY-currentMousePosition(event);
                    var divider = _canvas_.core.viewport.scale();
                    set( (initialValue - (numerator/(divider*mux) ))*(optionCount-1) );
                },
                function(event){
                    grappled = false;
                }
            );
        };
        slide.getChildByName('backingAndSlotGroup').getChildByName('backingAndSlotCover').onclick = function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}

            //calculate the distance the click is from the top of the slider (accounting for angle)
                var backingAndSlot = slide.getChildByName('backingAndSlotGroup');
                var backingAndSlotCover = backingAndSlot.getChildByName('backingAndSlotCover');
                var offset = backingAndSlot.getOffset();
                var delta = {
                    x: event.X - (backingAndSlot.x() + offset.x),
                    y: event.Y - (backingAndSlot.y() + offset.y),
                    a: 0 - (backingAndSlot.angle() + offset.angle),
                };
                var d = _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a ).y / backingAndSlotCover.height();

            //use the distance to calculate the correct value to set the slide to
            //taking into account the slide handle's size also
                var value = d + 0.5*handleHeight*((2*d)-1);

            set(value*(optionCount-1));
            if(object.onrelease != undefined){object.onrelease(value);}
        };


    //callbacks
        object.onchange = onchange; 
        object.onrelease = onrelease;

    //setup
        set(value);

    return object;
};

interfacePart.partLibrary.control.slide_discrete_image = function(name,data){ return interfacePart.collection.control.slide_discrete_image(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, data.optionCount,
    data.handleURL, data.backingURL, data.invisibleHandle,
    data.onchange, data.onrelease
); };