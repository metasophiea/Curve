_canvas_.interface.part.collection.control.dial_colourWithIndent_continuous = function(
    name='dial_colourWithIndent_continuous',
    x, y, radius=10, angle=0, interactable=true,
    value=0, resetValue=-1,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleStyle = {r:0.1,g:1,b:1,a:1},
    slotStyle =   {r:0,g:0,b:0,a:0},
    needleStyle = {r:1,g:1,b:1,a:1},

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = _canvas_.interface.part.builder('group',name,{x:x, y:y, angle:angle});
        
        //slot
            var slot = _canvas_.interface.part.builder('circle','slot',{radius:radius*1.1, detail:50, colour:slotStyle});
            object.append(slot);
        
        //handle
            var handle = _canvas_.interface.part.builder('circle','handle',{radius:radius, detail:50, colour:handleStyle});
            object.append(handle);

        //needle group
            var needleGroup = _canvas_.interface.part.builder('group','needleGroup',{ignored:true});
            object.append(needleGroup);

            //needle
                var needle = _canvas_.interface.part.builder('rectangleWithRoundEnds','needle',{
                    x:radius*0.8-radius/2, y:0,
                    angle:-Math.PI/2, height:radius/2, width:radius/8, colour:needleStyle});
                needleGroup.append(needle);




    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}

            value = a;
            needleGroup.angle(startAngle + maxAngle*value);
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
        var turningSpeed = radius*4;
        
        handle.ondblclick = function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue); 

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        handle.onwheel = function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}
            
            var move = event.deltaY/100;
            var globalScale = _canvas_.core.viewport.scale();
            set( value - move/(10*globalScale) );

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        handle.onmousedown = function(x,y,event){
            if(!interactable){return;}
            var initialValue = value;
            var initialY = event.Y;

            grappled = true;
            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    var value = initialValue;
                    var numerator = event.Y - initialY;
                    var divider = _canvas_.core.viewport.scale();
                    set( value - (numerator/(divider*turningSpeed) * window.devicePixelRatio), true );
                },
                function(event){
                    grappled = false;
                    if(object.onrelease != undefined){object.onrelease(value);}
                }
            );
        };




    //callbacks
        object.onchange = onchange; 
        object.onrelease = onrelease;

    //setup
        set(value);

    return object;
};
_canvas_.interface.part.collection.control.dial_colourWithIndent_discrete = function(
    name='dial_colourWithIndent_discrete',
    x, y, radius=10, angle=0, interactable=true,
    value=0, resetValue=0, optionCount=5,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleStyle = {r:1,g:0.1,b:0.1,a:1},
    slotStyle =   {r:0,g:0,b:0,a:0},
    needleStyle = {r:1,g:1,b:1,a:1},

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = _canvas_.interface.part.builder('group',name,{x:x, y:y, angle:angle});
        
        //dial
            var dial = _canvas_.interface.part.builder('dial_colourWithIndent_continuous',name,{
                x:0, y:0, radius:radius, angle:0, interactable:interactable,
                startAngle:startAngle, maxAngle:maxAngle,
                style:{ handle:handleStyle, slot:slotStyle, needle:needleStyle }
            });
            //clean out built-in interaction
            dial.getChildByName('handle').ondblclick = undefined;
            dial.getChildByName('handle').onwheel = undefined;
            dial.getChildByName('handle').onmousedown = undefined;

            object.append(dial);
        





    //graphical adjust
        function set(a,update=true){ 
            a = (a>(optionCount-1) ? (optionCount-1) : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}

            a = Math.round(a);
            value = a;
            dial.set( value/(optionCount-1) );
        };




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

        dial.getChildByName('handle').ondblclick = function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue);

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        dial.getChildByName('handle').onwheel = function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}

            var move = event.deltaY/100;

            acc += move;
            if( Math.abs(acc) >= 1 ){
                set( value -1*Math.sign(acc) );
                acc = 0;
                if(object.onrelease != undefined){object.onrelease(value);}
            }
        };
        dial.getChildByName('handle').onmousedown = function(x,y,event){
            if(!interactable){return;}
            var initialValue = value;
            var initialY = event.Y;

            grappled = true;
            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    var diff = Math.round( (event.Y - initialY)/25 );
                    set( initialValue - diff );
                    if(object.onchange != undefined){object.onchange(value);}
                },
                function(event){
                    grappled = false;
                    if(object.onrelease != undefined){object.onrelease(value);}
                }
            );
        };




    //callbacks
        object.onchange = onchange; 
        object.onrelease = onrelease;

    //setup
        set(value);

    return object;
};


_canvas_.interface.part.partLibrary.dial_colourWithIndent_continuous = function(name,data){ return _canvas_.interface.part.collection.control.dial_colourWithIndent_continuous(
    name, data.x, data.y, data.radius, data.angle, data.interactable, data.value, data.resetValue, data.startAngle, data.maxAngle,
    data.style.handle, data.style.slot, data.style.needle,
    data.onchange, data.onrelease,
); }
_canvas_.interface.part.partLibrary.dial_colourWithIndent_discrete = function(name,data){ return _canvas_.interface.part.collection.control.dial_colourWithIndent_discrete(
    name, data.x, data.y, data.radius, data.angle, data.interactable, data.value, data.resetValue, data.optionCount, data.startAngle, data.maxAngle,
    data.style.handle, data.style.slot, data.style.needle,
    data.onchange, data.onrelease,
); }