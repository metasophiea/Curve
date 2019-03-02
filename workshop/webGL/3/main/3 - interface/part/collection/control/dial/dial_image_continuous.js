this.dial_continuous_image = function(
    name='dial_continuous_image',
    x, y, radius=15, angle=0, interactable=true,
    value=0, resetValue=-1,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleURL, slotURL, needleURL,
    
    onchange=function(){},
    onrelease=function(){},
){
    //default to non-image version if image links are missing
        if(handleURL == undefined || slotURL == undefined || needleURL == undefined){
            return this.dial_continuous(
                name, x, y, radius, angle, interactable, value, resetValue, startAngle, maxAngle,
                undefined, undefined, undefined,
                onchange, onrelease
            );
        }

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        
        //slot
            var slot = interfacePart.builder('image','slot',{width:2.2*radius, height:2.2*radius, anchor:{x:0.5,y:0.5}, url:slotURL});
            object.append(slot);

        //handle
            var handle = interfacePart.builder('image','handle',{width:2*radius, height:2*radius, anchor:{x:0.5,y:0.5}, url:handleURL});
            object.append(handle);

        //needle group
            var needleGroup = interfacePart.builder('group','needleGroup',{ignored:true});
            object.append(needleGroup);

            //needle
                var needleWidth = radius/5;
                var needleLength = radius;
                var needle = interfacePart.builder('image','needle',{x:needleLength/3, y:-needleWidth/2, height:needleWidth, width:needleLength, url:needleURL});
                    needleGroup.append(needle);




    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}

            value = a;
            needleGroup.angle(startAngle + maxAngle*value);
            handle.angle(startAngle + maxAngle*value);
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
            var initialY = event.y;

            grappled = true;
            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    var value = initialValue;
                    var numerator = event.y - initialY;
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