this.dial_discrete_image = function(
    name='dial_discrete_image',
    x, y, radius=10, angle=0, interactable=true,
    value=0, resetValue=0, optionCount=5,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleURL, slotURL, needleURL,

    onchange=function(){},
    onrelease=function(){},
){
    dev.log.partControl('.dial_discrete_image(...)'); //#development

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        
        //dial
            const dial = interfacePart.builder('control','dial_continuous_image',name,{
                x:0, y:0, radius:radius, angle:0, interactable:interactable,
                startAngle:startAngle, maxAngle:maxAngle,
                handleURL:handleURL, slotURL:slotURL, needleURL:needleURL,
            });
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
        let acc = 0;

        dial.getChildByName('handle').attachCallback('ondblclick', function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue);

            if(object.onrelease != undefined){object.onrelease(value);}
        });
        dial.getChildByName('handle').attachCallback('onwheel', function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}

            const move = event.wheelDelta/100;

            acc += move;
            if( Math.abs(acc) >= 1 ){
                set( value -1*Math.sign(acc) );
                acc = 0;
                if(object.onrelease != undefined){object.onrelease(value);}
            }
        });
        dial.getChildByName('handle').attachCallback('onmousedown', function(x,y,event){
            if(!interactable){return;}
            const initialValue = value;
            const initialY = event.Y;

            grappled = true;
            _canvas_.system.mouse.mouseInteractionHandler(
                function(x,y,event){
                    const diff = Math.round( (event.Y - initialY)/25 );
                    set( initialValue - diff );
                    if(object.onchange != undefined){object.onchange(value);}
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

interfacePart.partLibrary.control.dial_discrete_image = function(name,data){ return interfacePart.collection.control.dial_discrete_image(
    name,
    data.x, data.y, data.radius, data.angle, data.interactable,
    data.value, data.resetValue, data.optionCount,
    data.startAngle, data.maxAngle,
    data.handleURL, data.slotURL, data.needleURL,
    data.onchange, data.onrelease
); };