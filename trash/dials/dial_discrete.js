parts.elements.control.dial_discrete = function(
    id='dial_discrete',
    x, y, r,
    optionCount=5,
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
    var object = __globals.utility.misc.elementMaker('g',id,{x:x, y:y});
        object._value = 0;
        object._selection = 0;
        object._data = { 
            'optionCount':optionCount,
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
            var outerArc = __globals.utility.misc.elementMaker('path','arc',{path:arcPath, lineType:'Q', style:outerArcStyle});
            object.appendChild(outerArc);

        //slot
            var slot = __globals.utility.misc.elementMaker('circle','slot',{r:r*1.1, style:slotStyle});
                object.appendChild(slot);

        //handle
            var handle = __globals.utility.misc.elementMaker('circle','slot',{r:r, style:handleStyle});
                object.appendChild(handle);

        //needle
            var needleWidth = r/5;
            var needleLength = r;
            var needle = __globals.utility.misc.elementMaker('rect','needle',{height:needleWidth, width:needleLength, style:needleStyle});
                needle.x.baseVal.valueInSpecifiedUnits = needleLength/3;
                needle.y.baseVal.valueInSpecifiedUnits = -needleWidth/2;
                object.appendChild(needle);


    //methods
        object.select = function(a=null, live=true, update=true){
            if(a==null){return this._selection;}

            a = (a>this._data.optionCount-1 ? this._data.optionCount-1 : a);
            a = (a<0 ? 0 : a);

            if(this._selection == a){/*nothings changed*/return;}

            this._selection = a;
            this._set( a/(this._data.optionCount-1) );
            if(update&&this.onchange){ this.onchange(a); }
            if(update&&!live&&this.onrelease){ this.onrelease(value); }
        };
        object._get = function(){ return this._value; };
        object._set = function(value){
            value = (value>1 ? 1 : value);
            value = (value<0 ? 0 : value);

            this._value = value;
            this.children['needle'].rotation(startAngle + maxAngle*value);
        };
        object.glow = function(state){
            if(state){
                __globals.utility.element.setStyle(outerArc,outerArcStyle_glow);
                __globals.utility.element.setStyle(slot,slotStyle_glow);
                __globals.utility.element.setStyle(handle,handleStyle_glow);
                __globals.utility.element.setStyle(needle,needleStyle_glow);
            }else{
                __globals.utility.element.setStyle(outerArc,outerArcStyle);
                __globals.utility.element.setStyle(slot,slotStyle);
                __globals.utility.element.setStyle(handle,handleStyle);
                __globals.utility.element.setStyle(needle,needleStyle);
            }
        };
  

    //callback
        object.onchange = function(){};
        object.onrelease = function(){};

    
    //mouse interaction
        object.ondblclick = function(){ this.select( Math.floor(optionCount/2) ); /*this._set(0.5);*/ };
        object.onwheel = function(event){
            var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
            var globalScale = __globals.utility.workspace.getGlobalScale(object);

            if(!object.onwheel.acc){object.onwheel.acc=0;}
            object.onwheel.acc += move/globalScale;
            if( Math.abs(object.onwheel.acc) >= 1 ){
                this.select( this.select()-1*Math.sign(object.onwheel.acc) );
                object.onwheel.acc = 0;
            }
        };
        object.onmousedown = function(event){
            __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
            __globals.svgElement.onmouseleave_old = __globals.svgElement.onmouseleave;
            __globals.svgElement.onmouseup_old = __globals.svgElement.onmouseup;

            __globals.svgElement.tempRef = this;
            __globals.svgElement.tempRef._data.initialValue = this._get();
            __globals.svgElement.tempRef._data.initialY = event.y;
            __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.mux;
            __globals.svgElement.onmousemove = function(event){
                var mux = __globals.svgElement.tempRef._data.mux;
                var value = __globals.svgElement.tempRef._data.initialValue;
                var numerator = event.y-__globals.svgElement.tempRef._data.initialY;
                var divider = __globals.utility.workspace.getGlobalScale(object);

                __globals.svgElement.tempRef.select(
                    Math.round(
                        (__globals.svgElement.tempRef._data.optionCount-1)*(value - numerator/(divider*mux))
                    ) 
                );
            };
            __globals.svgElement.onmouseup = function(){
                this.tempRef.select(this.tempRef.select(),false);
                this.tempRef = null;
                
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

    //setup
        object._set(0);
        
  return object;
};