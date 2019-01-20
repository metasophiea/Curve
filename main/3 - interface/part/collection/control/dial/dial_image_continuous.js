this.dial_image_continuous = function(
    name='dial_image_continuous',
    x, y, r=15, angle=0, interactable=true,
    value=0, resetValue=-1,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleUrl = 'http://space.alglobus.net/Basics/whyImages/earthFromSpace.gif',
    slotUrl = 'https://i.ytimg.com/vi/JS7NYKqhrFo/hqdefault.jpg',
    needleUrl = 'http://coolinterestingstuff.com/wp-content/uploads/2012/09/space-4.jpg',

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        
        //slot
            var slot = interfacePart.builder('image','slot',{width:2.2*r, height:2.2*r, anchor:{x:0.5,y:0.5}, url:slotUrl});
            object.append(slot);

        //handle
            var handle = interfacePart.builder('image','handle',{width:2*r, height:2*r, anchor:{x:0.5,y:0.5}, url:handleUrl});
            object.append(handle);

        //needle group
            var needleGroup = interfacePart.builder('group','needleGroup',{ignored:true});
            object.append(needleGroup);

            //needle
                var needleWidth = r/5;
                var needleLength = r;
                var needle = interfacePart.builder('image','needle',{x:needleLength/3, y:-needleWidth/2, height:needleWidth, width:needleLength, url:needleUrl});
                    needleGroup.append(needle);




    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}

            value = a;
            needleGroup.parameter.angle(startAngle + maxAngle*value);
            handle.parameter.angle(startAngle + maxAngle*value);
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
        var turningSpeed = r*4;
        
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
            var globalScale = workspace.core.viewport.scale();
            set( value - move/(10*globalScale) );

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        handle.onmousedown = function(x,y,event){
            if(!interactable){return;}
            var initialValue = value;
            var initialY = event.y;

            grappled = true;
            workspace.system.mouse.mouseInteractionHandler(
                function(event){
                    var value = initialValue;
                    var numerator = event.y - initialY;
                    var divider = workspace.core.viewport.scale();
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