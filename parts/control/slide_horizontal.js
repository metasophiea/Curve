this.slide_horizontal = function(
    id='slide_horizontal', 
    x, y, width, height,
    handleStyle = 'fill:rgba(200,200,200,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._value = 0;
        object._data = {
            'w':width,
            'handleSize':0.9
        };
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    var slot = parts.basic.rect(null, width*0.05, height*0.45, width*0.9, height*0.1, 0, slotStyle);
        object.appendChild(slot);
    var handle = parts.basic.rect('handle', 0, 0, width*0.1, height, 0, handleStyle);
        object.appendChild(handle);


    //methods
    object.get = function(){ return this._value; };
    object.set = function(value, live=false, update=true){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        if(update&&this.onchange){ this.onchange(value); }
        if(update&&!live&&this.onrelease){ this.onrelease(value); }
        this.children['handle'].x.baseVal.valueInSpecifiedUnits = value*this._data.w*this._data.handleSize;
    };
    object.smoothSet = function(target,time,curve,update=true){
        var start = this.get();
        var mux = target-start;
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
            object.set( (start+(steps.shift()*mux)),true,update );
            if(steps.length == 0){clearInterval(object.smoothSet.interval);}
        },1000/stepsPerSecond);
    };


    //callback
    object.onchange = function(){};
    object.onrelease = function(){};

    
    //mouse interaction
    object.ondblclick = function(){ this.set(0.5); };
    object.onwheel = function(event){
        var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
        var globalScale = __globals.utility.workspace.getGlobalScale(object);

        this.set( this.get() + move/(10*globalScale) );
    }; 
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.tempRef._data.initialValue = this.get();
        __globals.svgElement.tempRef._data.initialX = event.x;
        __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.w*__globals.svgElement.tempRef._data.handleSize;
        __globals.svgElement.onmousemove = function(event){
            var mux = __globals.svgElement.tempRef._data.mux;
            var value = __globals.svgElement.tempRef._data.initialValue;
            var numerator = __globals.svgElement.tempRef._data.initialX-event.x;
            var divider = __globals.utility.workspace.getGlobalScale(object);

            __globals.svgElement.tempRef.set( value - numerator/(divider*mux), true );
        };
        __globals.svgElement.onmouseup = function(){
            __globals.svgElement.tempRef.set( __globals.svgElement.tempRef.get(), false );
            this.tempRef = null;
            this.onmousemove = null;
            this.onmouseleave = null;
            this.onmouseup = null;
        };
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        __globals.svgElement.onmousemove(event);
    };

    return object;
};