this.slide = function(
    id='slide', 
    x, y, width, height, angle=0,
    handleHeight=0.1, value=0, resetValue=-1,
    handleStyle = 'fill:rgba(200,200,200,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)',
    invisibleHandleStyle = 'fill:rgba(0,0,0,0);',
){
    var grappled = false;

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
        //handle
            var handle = __globals.utility.experimental.elementMaker('rect','handle',{width:width,height:height*handleHeight, style:handleStyle});
            object.appendChild(handle);
        //invisible handle
            var invisibleHandleHeight = height*handleHeight + height*0.01;
            var invisibleHandle = __globals.utility.experimental.elementMaker('rect','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, style:invisibleHandleStyle});
            object.appendChild(invisibleHandle);

    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update){object.onchange(a);}
            
            value = a;
            handle.y.baseVal.valueInSpecifiedUnits = a*height*(1-handleHeight);
            invisibleHandle.y.baseVal.valueInSpecifiedUnits = a*height*(1-handleHeight);
        }
        object.__calculationAngle = angle;
        function currentMousePosition(event){
            return event.y*Math.cos(object.__calculationAngle) - event.x*Math.sin(object.__calculationAngle);
        }
    
    //methods
        object.set = function(value,update){
            if(grappled){return;}
            set(value,update);
        };
        object.smoothSet = function(target,time,curve,update){
            if(grappled){return;}

            var startTime = __globals.audio.context.currentTime;
            var startValue = value;
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
                set( pointFunc(progress, startValue, target), update );
                if( (__globals.audio.context.currentTime-startTime) >= time ){ clearInterval(object.smoothSet.interval); }
            }, 1000/30);            
        };
        object.get = function(){return value;};

    //interaction
        object.ondblclick = function(){
            if(resetValue<0){return;}
            if(grappled){return;}
            if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}

            set(resetValue);
            object.onrelease(value);
        };
        object.onwheel = function(){
            if(grappled){return;}
            if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}

            var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
            var globalScale = __globals.utility.workspace.getGlobalScale(object);
            set( value + move/(10*globalScale) );
            object.onrelease(value);
        };
        backingAndSlot.onclick = function(event){
            if(grappled){return;}
            if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}

            var y = __globals.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width,height).y;

            var value = y + 0.5*handleHeight*((2*y)-1);
            set(value);
            object.onrelease(value);
        };
        invisibleHandle.onmousedown = function(event){
            grappled = true;
            if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}

            var initialValue = value;
            var initialY = currentMousePosition(event);
            var mux = height - height*handleHeight;

            __globals.utility.workspace.mouseInteractionHandler(
                function(event){
                    var numerator = initialY-currentMousePosition(event);
                    var divider = __globals.utility.workspace.getGlobalScale(object);
                    set( initialValue - numerator/(divider*mux) );
                },
                function(event){
                    var numerator = initialY-currentMousePosition(event);
                    var divider = __globals.utility.workspace.getGlobalScale(object);
                    object.onrelease(initialValue - numerator/(divider*mux));
                    grappled = false;
                }
            );
        };

    //callbacks
        object.onchange = function(){};
        object.onrelease = function(){};

    //setup
        set(value);

    return object;
};