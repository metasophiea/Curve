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
            var object = parts.basic.g(id, x, y, angle);
        //backing and slot group
            var backingAndSlot = parts.basic.g('backingAndSlotGroup', 0, 0, 0);
            object.appendChild(backingAndSlot);
            //backing
                var backing = parts.basic.rect('backing', 0, 0, width, height, 0, backingStyle);
                backingAndSlot.appendChild(backing);
            //slot
                var slot = parts.basic.rect('slot', width*0.45, (height*(handleHeight/2)), width*0.1, height*(1-handleHeight), 0, slotStyle);
                backingAndSlot.appendChild(slot);
        //handle
            var handle = parts.basic.rect('handle', 0, 0, width, height*handleHeight, 0, handleStyle);
            object.appendChild(handle);
        //invisible handle
            var invisibleHandleHeight = height*handleHeight + height*0.01;
            var invisibleHandle = parts.basic.rect('invisibleHandle', 0, (height*handleHeight - invisibleHandleHeight)/2, width, invisibleHandleHeight, 0, invisibleHandleStyle);
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
    
    //internal functionality
        function positionFromPoint(event){
            var elementOrigin = __globals.utility.element.getCumulativeTransform(backingAndSlot);
            var mouseClick = __globals.utility.workspace.pointConverter.browser2workspace(event.offsetX,event.offsetY);

            var temp = __globals.utility.math.cartesian2polar(
                mouseClick.x-elementOrigin.x,
                mouseClick.y-elementOrigin.y
            );
            temp.ang -= angle;
            temp = __globals.utility.math.polar2cartesian(temp.ang,temp.dis);

            return {x:temp.x/width,y:temp.y/height};
        }

    //methods
        object.set = function(value,update){
            if(grappled){return;}
            set(value,update);
        };
        object.smoothSet = function(target,time,curve,update){
            if(grappled){return;}

            var start = value;
            var mux = target - start;
            var stepsPerSecond = Math.round(Math.abs(mux)*100);
            var totalSteps = stepsPerSecond*time;

            var steps = [1];
            switch(curve){
                case 'linear': steps = __globals.utility.math.curveGenerator.linear(totalSteps); break;
                case 'sin': steps = __globals.utility.math.curveGenerator.sin(totalSteps); break;
                case 'cos': steps = __globals.utility.math.curveGenerator.cos(totalSteps); break;
                case 'exponential': steps = __globals.utility.math.curveGenerator.exponential(totalSteps); break;
                case 's': steps = __globals.utility.math.curveGenerator.s(totalSteps); break;
                case 'instant': default: break;
            }
            if(steps.length == 0){return;}

            if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
            object.smoothSet.interval = setInterval(function(){
                set( (start+(steps.shift()*mux)),update );
                if(steps.length == 0){clearInterval(object.smoothSet.interval);}
            },1000/stepsPerSecond);
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

            var y = positionFromPoint(event).y;
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

            __globals.svgElement.onmousemove = function(event){
                var numerator = initialY-currentMousePosition(event);
                var divider = __globals.utility.workspace.getGlobalScale(object);
                set( initialValue - numerator/(divider*mux) );
            };
            __globals.svgElement.onmouseup = function(){
                var numerator = initialY-currentMousePosition(event);
                var divider = __globals.utility.workspace.getGlobalScale(object);
                object.onrelease(initialValue - numerator/(divider*mux));

                __globals.svgElement.onmousemove = undefined;
                __globals.svgElement.onmouseleave = undefined;
                __globals.svgElement.onmouseup = undefined;
                grappled = false;
            };
            __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        };

    //callbacks
        object.onchange = function(){console.log('onchange');};
        object.onrelease = function(){console.log('onrelease');};

    //setup
        set(value);

    return object;
};