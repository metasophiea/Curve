this.dial_continuous = function(
    name='dial_continuous',
    x, y, r=15, angle=0,
    value=0, resetValue=-1,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleStyle = 'rgba(200,200,200,1)',
    slotStyle = 'rgba(50,50,50,1)',
    needleStyle = 'rgba(250,100,100,1)',

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        
        //slot
            var slot = canvas.part.builder('circle','slot',{r:r*1.1, style:{fill:slotStyle}});
            object.append(slot);

        //handle
            var handle = canvas.part.builder('circle','handle',{r:r, style:{fill:handleStyle}});
                object.append(handle);

        //needle group
            var needleGroup = canvas.part.builder('group','needleGroup',{ignored:true});
            object.append(needleGroup);

            //needle
                var needleWidth = r/5;
                var needleLength = r;
                var needle = canvas.part.builder('rectangle','needle',{x:needleLength/3, y:-needleWidth/2, height:needleWidth, width:needleLength, style:{fill:needleStyle}});
                    needleGroup.append(needle);




    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}

            value = a;
            needleGroup.parameter.angle(startAngle + maxAngle*value);
        }




    //methods
        var grappled = false;

        object.set = function(value,update){
            if(grappled){return;}
            set(value,update);
        };
        object.get = function(){return value;};




    //interaction
        var turningSpeed = r*4;
        
        handle.ondblclick = function(){
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue); 

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        handle.onwheel = function(x,y,event){
            if(grappled){return;}
            
            var move = event.deltaY/100;
            var globalScale = canvas.core.viewport.scale();
            set( value - move/(10*globalScale) );

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        handle.onmousedown = function(x,y,event){
            var initialValue = value;
            var initialY = event.y;

            grappled = true;
            canvas.system.mouse.mouseInteractionHandler(
                function(event){
                    var value = initialValue;
                    var numerator = event.y - initialY;
                    var divider = canvas.core.viewport.scale();
                    set( value - numerator/(divider*turningSpeed), true );
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