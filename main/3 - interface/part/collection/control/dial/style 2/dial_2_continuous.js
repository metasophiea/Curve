this.dial_2_continuous = function(
    name='dial_2_continuous',
    x, y, radius=10, angle=0, interactable=true,
    value=0, resetValue=-1,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleStyle = {r:1,g:0.1,b:0.1,a:1},
    slotStyle =   {r:0,g:0,b:0,a:0},
    needleStyle = {r:1,g:1,b:1,a:1},

    onchange=function(){},
    onrelease=function(){},
){
    dev.log.partControl('.dial_2_continuous(...)'); //#development

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        
        //slot
            const slot = interfacePart.builder('basic','circle','slot',{radius:radius*1.1, detail:50, colour:slotStyle});
            object.append(slot);
        
        //handle
            const handle = interfacePart.builder('basic','circle','handle',{radius:radius, detail:50, colour:handleStyle});
            object.append(handle);

        //needle group
            const needleGroup = interfacePart.builder('basic','group','needleGroup',{ignored:true});
            object.append(needleGroup);

            //needle
                const needleWidth = radius/8;
                const needleLength = radius/2;
                const needle = interfacePart.builder('basic','rectangle','needle',{x:radius*0.8-needleLength, y:-needleWidth/2, height:needleWidth, width:needleLength, colour:needleStyle});
                needleGroup.append(needle);

                const needleTip = interfacePart.builder('basic','circle','needleTip',{x:radius*0.8, radius:needleWidth/2, detail:10, colour:needleStyle});
                needleGroup.append(needleTip);

                const needleBase = interfacePart.builder('basic','circle','needleBase',{x:radius*0.8-needleLength, radius:needleWidth/2, detail:10, colour:needleStyle});
                needleGroup.append(needleBase);

    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}

            value = a;
            needleGroup.angle(startAngle + maxAngle*value);
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
        
        handle.attachCallback('ondblclick',function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue); 

            if(object.onrelease != undefined){object.onrelease(value);}
        });
        handle.attachCallback('onwheel',function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}
            
            const move = event.wheelDelta/100;
            const globalScale = _canvas_.core.viewport.scale();
            set( value - move/(10*globalScale) );

            if(object.onrelease != undefined){object.onrelease(value);}
        });
        handle.attachCallback('onmousedown',function(x,y,event){
            if(!interactable){return;}
            const initialValue = value;
            const initialY = event.y;

            grappled = true;
            _canvas_.system.mouse.mouseInteractionHandler(
                function(x,y,event){
                    const value = initialValue;
                    const numerator = event.y - initialY;
                    const divider = _canvas_.core.viewport.scale();
                    set( value - (numerator/(divider*turningSpeed) * window.devicePixelRatio), true );
                },
                function(x,y,event){
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

interfacePart.partLibrary.control.dial_2_continuous = function(name,data){ return interfacePart.collection.control.dial_2_continuous(
    name,
    data.x, data.y, data.radius, data.angle, data.interactable,
    data.value, data.resetValue,
    data.startAngle, data.maxAngle,
    data.style.handle, data.style.slot, data.style.needle,
    data.onchange, data.onrelease
); };