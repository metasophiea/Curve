this.dial_continuous = function(
    id='dial_continuous',
    x, y, r,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
    handleStyle = 'fill:rgba(200,200,200,1)',
    slotStyle = 'fill:rgba(50,50,50,1)',
    needleStyle = 'fill:rgba(250,100,100,1)',
    arcDistance=1.35,
    outerArcStyle='fill:none; stroke:none;',
){
    // elements
        var object = parts.basic.g(id, x, y);
            object._value = 0;
            object._data = {
                'mux':r*4
            };

        //arc
            var points = 5;
            var pushDistance = 1.11;
            var arcPath = [];
            for(var a = 0; a < points; a++){
                var temp = __globals.utility.math.polar2cartesian(startAngle+a*(maxAngle/points),r*arcDistance);
                arcPath.push( temp );
                var temp = __globals.utility.math.polar2cartesian(startAngle+(a+0.5)*(maxAngle/points),pushDistance*r*arcDistance);
                arcPath.push( temp );
            }
            var temp = __globals.utility.math.polar2cartesian(startAngle+maxAngle,r*arcDistance);
            arcPath.push( temp );
            var outerArc = parts.basic.path(id='arc', path=arcPath, 'Q', outerArcStyle);
            object.appendChild(outerArc);

        //slot
            var slot = parts.basic.circle(null, 0, 0, r*1.1, 0, slotStyle);
                object.appendChild(slot);

        //handle
            var handle = parts.basic.circle(null, 0, 0, r, 0, handleStyle);
                object.appendChild(handle);

        //needle
            var needleWidth = r/5;
            var needleLength = r;
            var needle = parts.basic.rect('needle', 0, 0, needleLength, needleWidth, 0, needleStyle);
                needle.x.baseVal.valueInSpecifiedUnits = needleLength/3;
                needle.y.baseVal.valueInSpecifiedUnits = -needleWidth/2;
                object.appendChild(needle);


    // methods
        object.get = function(){ return this._value; };
        object.set = function(value, live=false, update=true){
            value = (value>1 ? 1 : value);
            value = (value<0 ? 0 : value);

            this._value = value;
            if(update&&this.onChange){ this.onChange(value); }
            if(update&&!live&&this.onRelease){ this.onRelease(value); }
            this.children['needle'].rotation(startAngle + maxAngle*value);
        };object.set(0);
        object.smoothSet = function(target,time,curve,update=true){
            var start = this.get();
            var mux = target-start;
            var stepsPerSecond = Math.round(Math.abs(mux)*100);
            var totalSteps = stepsPerSecond*time;

            var steps = [1];
            switch(curve){
                case 'linear': steps = __globals.utility.math.curveGenerator.linear(totalSteps); break;
                case 'exponential': steps = __globals.utility.math.curveGenerator.exponential(totalSteps); break;
                case 'sin': steps = __globals.utility.math.curveGenerator.sin(totalSteps); break;
                case 'cos': steps = __globals.utility.math.curveGenerator.cos(totalSteps); break;
                case 's': steps = __globals.utility.math.curveGenerator.s(totalSteps); break;
                case 'instant': default: break;
            }

            if(steps.length == 0){return;}

            if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
            object.smoothSet.interval = setInterval(function(){
                object.set( (start+(steps.shift()*mux)),true,update );
                if(steps.length == 0){clearInterval(object.smoothSet.interval);}
            },1000/stepsPerSecond);
        };
        

    //callback
        object.onChange = function(){};
        object.onRelease = function(){};


    //mouse interaction
        object.ondblclick = function(){ this.set(0.5); };
        object.onwheel = function(event){
            var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
            var globalScale = __globals.utility.element.getTransform(__globals.panes.global).s;

            this.set( this.get() - move/(10*globalScale) );
        };
        object.onmousedown = function(event){
            __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
            __globals.svgElement.onmouseleave_old = __globals.svgElement.onmouseleave;
            __globals.svgElement.onmouseup_old = __globals.svgElement.onmouseup;

            __globals.svgElement.tempRef = this;
            __globals.svgElement.tempRef._data.initialValue = this.get();
            __globals.svgElement.tempRef._data.initialY = event.y;
            __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.mux;
            __globals.svgElement.onmousemove = function(event){
                var mux = __globals.svgElement.tempRef._data.mux;
                var value = __globals.svgElement.tempRef._data.initialValue;
                var numerator = event.y-__globals.svgElement.tempRef._data.initialY;
                var divider = __globals.utility.element.getTransform(__globals.panes.global).s;

                __globals.svgElement.tempRef.set( value - numerator/(divider*mux), true );
            };
            __globals.svgElement.onmouseup = function(){
                this.tempRef.set(this.tempRef.get(),false);
                delete this.tempRef;

                __globals.svgElement.onmousemove = __globals.svgElement.onmousemove_old;
                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseleave_old;
                __globals.svgElement.onmouseup = __globals.svgElement.onmouseup_old;

                __globals.svgElement.onmousemove_old = null;
                __globals.svgElement.onmouseleave_old = null;
                __globals.svgElement.onmouseup_old = null;
            };
            __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
            __globals.svgElement.onmousemove(event);
        };


    return object;
};