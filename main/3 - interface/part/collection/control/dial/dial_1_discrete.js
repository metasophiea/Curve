this.dial_1_discrete = function(
    name='dial_1_discrete',
    x, y, radius=10, angle=0, interactable=true,
    value=0, resetValue=0, optionCount=5,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleStyle = {r:200/255, g:200/255, b:200/255, a:1},
    slotStyle =   {r:50/255,  g:50/255,  b:50/255,  a:1},
    needleStyle = {r:250/255, g:100/255, b:100/255, a:1},

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        
        //dial
            var dial = interfacePart.builder('control','dial_1_continuous',name,{
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

interfacePart.partLibrary.control.dial_1_discrete = function(name,data){ return interfacePart.collection.control.dial_1_discrete(
    name,
    data.x, data.y, data.radius, data.angle, data.interactable,
    data.value, data.resetValue, data.optionCount,
    data.startAngle, data.maxAngle,
    data.style.handle, data.style.slot, data.style.needle,
    data.onchange, data.onrelease
); };
interfacePart.partLibrary.control.dial_discrete = interfacePart.partLibrary.control.dial_1_discrete;