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
            var temp = __globals.utility.getCartesian(startAngle+a*(maxAngle/points),r*arcDistance);
            arcPath.push( [temp.x,temp.y] );
            var temp = __globals.utility.getCartesian(startAngle+(a+0.5)*(maxAngle/points),pushDistance*r*arcDistance);
            arcPath.push( [temp.x,temp.y] );
        }
        var temp = __globals.utility.getCartesian(startAngle+maxAngle,r*arcDistance);
        arcPath.push( [temp.x,temp.y] );
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


    // methods
    object.get = function(){ return this._value; };
    object.set = function(value, live=false){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        if(this.onChange){ this.onChange(value); }
        if(!live&&this.onRelease){ this.onRelease(value); }
        this.children['needle'].rotation(startAngle + maxAngle*value);
    };object.set(0);
    

    //callback
    object.onChange = function(){};
    object.onRelease = function(){};


    //mouse interaction
    object.ondblclick = function(){ this.set(0.5); };
    object.onwheel = function(event){
        var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
        var globalScale = __globals.utility.getTransform(__globals.panes.global)[2];

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
            var divider = __globals.utility.getTransform(__globals.panes.global)[2];

            __globals.svgElement.tempRef.set( value - numerator/(divider*mux), true );
        };
        __globals.svgElement.onmouseup = function(){
            this.tempRef.set(this.tempRef.get());
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


    return object;
};