part.element.control.dial_continuous = function(
    id='dial_continuous',
    x, y, r,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
    handleStyle = 'fill:rgba(175,175,175,1)',
    slotStyle = 'fill:rgba(50,50,50,1)',
    needleStyle = 'fill:rgba(250,100,100,1)',
    handleStyle_glow = 'fill:rgba(175,175,175,1)',
    slotStyle_glow = 'fill:rgba(254,255,219,1)',
    needleStyle_glow = 'fill:rgba(250,100,100,1)',
    arcDistance=1.35,
    outerArcStyle='fill:none; stroke:none;',
    outerArcStyle_glow='fill:none; stroke:none;',
){
    // elements
        var object = part.builder('g',id,{x:x, y:y});
            object._value = 0;
            object._data = {
                'mux':r*4
            };

        //arc
            var points = 5;
            var pushDistance = 1.11;
            var arcPath = [];
            for(var a = 0; a < points; a++){
                var temp = system.utility.math.polar2cartesian(startAngle+a*(maxAngle/points),r*arcDistance);
                arcPath.push( temp );
                var temp = system.utility.math.polar2cartesian(startAngle+(a+0.5)*(maxAngle/points),pushDistance*r*arcDistance);
                arcPath.push( temp );
            }
            var temp = system.utility.math.polar2cartesian(startAngle+maxAngle,r*arcDistance);
            arcPath.push( temp );

            var outerArc = part.builder('path','arc',{path:arcPath, lineType:'Q', style:outerArcStyle});
            object.appendChild(outerArc);

        //slot
            var slot = part.builder('circle','slot',{r:r*1.1, style:slotStyle});
                object.appendChild(slot);

        //handle
            var handle = part.builder('circle','slot',{r:r, style:handleStyle});
                object.appendChild(handle);

        //needle
            var needleWidth = r/5;
            var needleLength = r;
            var needle = part.builder('rect','needle',{height:needleWidth, width:needleLength, style:needleStyle});
                needle.x.baseVal.valueInSpecifiedUnits = needleLength/3;
                needle.y.baseVal.valueInSpecifiedUnits = -needleWidth/2;
                object.appendChild(needle);


    //methods
        object.get = function(){ return this._value; };
        object.set = function(value, live=false, update=true){
            value = (value>1 ? 1 : value);
            value = (value<0 ? 0 : value);

            this._value = value;
            if(update&&this.onchange){try{this.onchange(value);}catch(err){console.error('Error with dial_continuous:onchange\n',err);}}
            if(update&&!live&&this.onrelease){try{this.onrelease(value);}catch(err){console.error('Error with dial_continuous:onrelease\n',err);}}
            this.children['needle'].rotation(startAngle + maxAngle*value);
        };
        object.smoothSet = function(target,time,curve,update=true){
            var startTime = system.audio.context.currentTime;
            var startValue = value;
            var pointFunc = system.utility.math.curvePoint.linear;

            switch(curve){
                case 'linear': pointFunc = system.utility.math.curvePoint.linear; break;
                case 'sin': pointFunc = system.utility.math.curvePoint.sin; break;
                case 'cos': pointFunc = system.utility.math.curvePoint.cos; break;
                case 'exponential': pointFunc = system.utility.math.curvePoint.exponential; break;
                case 's': pointFunc = system.utility.math.curvePoint.s; break;
            }

            object.smoothSet.interval = setInterval(function(){
                var progress = (system.audio.context.currentTime-startTime)/time; if(progress > 1){progress = 1;}
                object.set( pointFunc(progress, startValue, target), true, update );
                if( (system.audio.context.currentTime-startTime) >= time ){ clearInterval(object.smoothSet.interval); }
            }, 1000/30);  
        };
        object.glow = function(state){
            if(state){
                system.utility.element.setStyle(outerArc,outerArcStyle_glow);
                system.utility.element.setStyle(slot,slotStyle_glow);
                system.utility.element.setStyle(handle,handleStyle_glow);
                system.utility.element.setStyle(needle,needleStyle_glow);
            }else{
                system.utility.element.setStyle(outerArc,outerArcStyle);
                system.utility.element.setStyle(slot,slotStyle);
                system.utility.element.setStyle(handle,handleStyle);
                system.utility.element.setStyle(needle,needleStyle);
            }
        };
        

    //callback
        object.onchange = function(){};
        object.onrelease = function(){};


    //mouse interaction
        object.ondblclick = function(){ this.set(0.5); };
        object.onwheel = function(event){
            var move = system.mouse.wheelInterpreter( event.deltaY );
            var globalScale = system.utility.workspace.getGlobalScale(object);

            this.set( this.get() - move/(10*globalScale) );
        };
        object.onmousedown = function(event){
            system.svgElement.onmousemove_old = system.svgElement.onmousemove;
            system.svgElement.onmouseleave_old = system.svgElement.onmouseleave;
            system.svgElement.onmouseup_old = system.svgElement.onmouseup;

            system.svgElement.tempRef = this;
            system.svgElement.tempRef._data.initialValue = this.get();
            system.svgElement.tempRef._data.initialY = event.y;
            system.svgElement.tempRef._data.mux = system.svgElement.tempRef._data.mux;
            system.svgElement.onmousemove = function(event){
                var mux = system.svgElement.tempRef._data.mux;
                var value = system.svgElement.tempRef._data.initialValue;
                var numerator = event.y-system.svgElement.tempRef._data.initialY;
                var divider = system.utility.workspace.getGlobalScale(object);

                system.svgElement.tempRef.set( value - numerator/(divider*mux), true );
            };
            system.svgElement.onmouseup = function(){
                this.tempRef.set(this.tempRef.get(),false);
                delete this.tempRef;

                system.svgElement.onmousemove = system.svgElement.onmousemove_old;
                system.svgElement.onmouseleave = system.svgElement.onmouseleave_old;
                system.svgElement.onmouseup = system.svgElement.onmouseup_old;

                system.svgElement.onmousemove_old = null;
                system.svgElement.onmouseleave_old = null;
                system.svgElement.onmouseup_old = null;
            };
            system.svgElement.onmouseleave = system.svgElement.onmouseup;
            system.svgElement.onmousemove(event);
        };

    //setup
        object.set(0);

    return object;
};