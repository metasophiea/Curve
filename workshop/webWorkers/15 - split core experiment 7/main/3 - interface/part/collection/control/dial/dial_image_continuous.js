this.dial_continuous_image = function(
    name='dial_continuous_image',
    x, y, radius=10, angle=0, interactable=true,
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
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        
        //slot
            const slot = interfacePart.builder('basic','image','slot',{width:2.2*radius, height:2.2*radius, anchor:{x:0.5,y:0.5}, url:slotURL});
            object.append(slot);

        //handle
            const handle = interfacePart.builder('basic','image','handle',{width:2*radius, height:2*radius, anchor:{x:0.5,y:0.5}, url:handleURL});
            object.append(handle);

        //needle group
            const needleGroup = interfacePart.builder('basic','group','needleGroup',{ignored:true});
            object.append(needleGroup);

            //needle
                const needleWidth = radius/5;
                const needleLength = radius;
                const needle = interfacePart.builder('basic','image','needle',{x:needleLength/3, y:-needleWidth/2, height:needleWidth, width:needleLength, url:needleURL});
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
        let grappled = false;

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
        const turningSpeed = radius*32;
        
        handle.attachCallback('ondblclick', function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue); 

            if(object.onrelease != undefined){object.onrelease(value);}
        });
        handle.attachCallback('onwheel', function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}
            
            const move = event.wheelDelta/100;
            const globalScale = _canvas_.core.viewport.scale();
            set( value - move/(10*globalScale) );

            if(object.onrelease != undefined){object.onrelease(value);}
        });
        handle.attachCallback('onmousedown', function(x,y,event){
            if(!interactable){return;}
            const initialValue = value;
            const initialY = event.Y;

            grappled = true;
            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    const value = initialValue;
                    const numerator = event.Y - initialY;
                    const divider = _canvas_.core.viewport.scale();
                    set( value - (numerator/(divider*turningSpeed) * window.devicePixelRatio), true );
                },
                function(event){
                    grappled = false;
                    if(object.onrelease != undefined){object.onrelease(value);}
                }
            );
        });

    //callbacks
        object.onchange = onchange; 
        object.onrelease = onrelease;

    //setup
        set(value);

    return object;
};

interfacePart.partLibrary.control.dial_continuous_image = function(name,data){ return interfacePart.collection.control.dial_continuous_image(
    name,
    data.x, data.y, data.radius, data.angle, data.interactable,
    data.value, data.resetValue,
    data.startAngle, data.maxAngle,
    data.handleURL, data.slotURL, data.needleURL,
    data.onchange, data.onrelease
); };