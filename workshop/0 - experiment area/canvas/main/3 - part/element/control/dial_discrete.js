this.dial_discrete = function(
    name='dial_discrete',
    x, y, r=15, angle=0,
    value=0, resetValue=0, optionCount=5,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleStyle = 'rgba(175,175,175,1)',
    slotStyle = 'rgba(50,50,50,1)',
    needleStyle = 'rgba(250,100,100,1)',

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        
        //dial
            var dial = canvas.part.builder('dial_continuous',name,{
                x:0, y:0, r:r, angle:0,
                startAngle:startAngle, smaxAngle:maxAngle,
                style:{ handleStyle:handleStyle, slotStyle:slotStyle, needleStyle:needleStyle }
            });
            //clean out built-in interation
            dial.getChildByName('handle').ondblclick = undefined;
            dial.getChildByName('handle').onwheel = undefined;
            dial.getChildByName('handle').onmousedown = undefined;

            object.append(dial);
        





    //graphical adjust
        function set(a,update=true){
            a = (a>(optionCount-1) ? (optionCount-1) : a);
            a = (a<0 ? 0 : a);

            if(update && object.change != undefined){object.onchange(a);}

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




    //interaction
        var acc = 0;

        dial.getChildByName('handle').ondblclick = function(){
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue);

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        dial.getChildByName('handle').onwheel = function(x,y,event){
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
            var initialValue = value;
            var initialY = event.y;

            grappled = true;
            canvas.system.mouse.mouseInteractionHandler(
                function(event){
                    var diff = Math.round( (event.y - initialY)/25 );
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
        set(0);

    return object;
};