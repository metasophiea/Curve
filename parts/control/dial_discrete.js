this.dial_discrete = function(
    id='dial_discrete',
    x, y, r,
    optionCount=5,
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
            var outerArc = parts.basic.path(id=null, path=arcPath, 'Q', outerArcStyle);
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


    //methods
<<<<<<< HEAD
        object.select = function(a=null, live=true, update=true){
            if(a==null){return this._selection;}

            a = (a>this._data.optionCount-1 ? this._data.optionCount-1 : a);
            a = (a<0 ? 0 : a);

            if(this._selection == a){/*nothings changed*/return;}

            this._selection = a;
            this._set( a/(this._data.optionCount-1) );
            if(update&&this.onChange){ this.onChange(a); }
            if(update&&!live&&this.onRelease){ this.onRelease(value); }
        };
        object._get = function(){ return this._value; };
        object._set = function(value){
            value = (value>1 ? 1 : value);
            value = (value<0 ? 0 : value);

            this._value = value;
            this.children['needle'].rotation(startAngle + maxAngle*value);
        };object._set(0);
  

    //callback
        object.onChange = function(){};
        object.onRelease = function(){};
=======
    object.select = function(a=null, live=true, update=true){
        if(a==null){return this._selection;}

        a = (a>this._data.optionCount-1 ? this._data.optionCount-1 : a);
        a = (a<0 ? 0 : a);

        if(this._selection == a){/*nothings changed*/return;}

        this._selection = a;
        this._set( a/(this._data.optionCount-1) );
        if(update&&this.onChange){ this.onChange(a); }
        if(update&&!live&&this.onRelease){ this.onRelease(value); }
    };
    object._get = function(){ return this._value; };
    object._set = function(value){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        this.children['needle'].rotation(startAngle + maxAngle*value);
    };object._set(0);
  

    //callback
    object.onChange = function(){};
    object.onRelease = function(){};
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c

    
    //mouse interaction
        object.ondblclick = function(){ this.select( Math.floor(optionCount/2) ); /*this._set(0.5);*/ };
        object.onwheel = function(event){
            var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
            var globalScale = __globals.utility.element.getTransform(__globals.panes.global).s;

            if(!object.onwheel.acc){object.onwheel.acc=0;}
            object.onwheel.acc += move/globalScale;
            if( Math.abs(object.onwheel.acc) >= 1 ){
                this.select( this.select()-1*Math.sign(object.onwheel.acc) );
                object.onwheel.acc = 0;
            }
        };
<<<<<<< HEAD
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
                var divider = __globals.utility.element.getTransform(__globals.panes.global).s;

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
=======
        __globals.svgElement.onmouseup = function(){
            this.tempRef.select(this.tempRef.select(),false);
            this.tempRef = null;
            
            __globals.svgElement.onmousemove = __globals.svgElement.onmousemove_old;
            __globals.svgElement.onmouseleave = __globals.svgElement.onmouseleave_old;
            __globals.svgElement.onmouseup = __globals.svgElement.onmouseup_old;

            __globals.svgElement.onmousemove_old = null;
            __globals.svgElement.onmouseleave_old = null;
            __globals.svgElement.onmouseup_old = null;
>>>>>>> 51477d723dd2a28778dc9c3fc77f89b46ea1b27c
        };
        

  return object;
};