parts.modifier.onmousedownFunctions = function(grapple, target, creatorMethod){
    if(!creatorMethod){console.error('"onmousedownFunctions" requires a creatorMethod');return;}

    grapple.target = target ? target : grapple;
    grapple.target.creatorMethod = creatorMethod;
    grapple.target.grapple = grapple;
    grapple.target.style.transform = grapple.target.style.transform ? grapple.target.style.transform : 'translate(0px,0px) scale(1) rotate(0rad)';

    function movement(object, event){
        if(event.button != 0){return;}

        __globals.svgElement.tempRef = object;
        __globals.svgElement.tempRef.setAttribute('oldPosition','['+__globals.utility.getTransform(__globals.svgElement.tempRef)+']');
        __globals.svgElement.tempRef.setAttribute('clickPosition','['+event.x +','+ event.y+']');
        __globals.svgElement.onmousemove = function(event){
            var position = JSON.parse(__globals.svgElement.tempRef.getAttribute('oldPosition'));
            var clickPosition = JSON.parse(__globals.svgElement.tempRef.getAttribute('clickPosition'));
            var globalScale = __globals.utility.getTransform(__globals.panes.global)[2];
            position[0] = (position[0]-(clickPosition[0]-event.x)/globalScale);
            position[1] = position[1]-(clickPosition[1]-event.y)/globalScale;
            __globals.utility.setTransform(__globals.svgElement.tempRef, position);

            if( __globals.svgElement.tempRef.movementRedraw ){ __globals.svgElement.tempRef.movementRedraw(); }
        };
    
        __globals.svgElement.onmouseup = function(){
            __globals.svgElement.tempRef.removeAttribute('oldPosition');
            __globals.svgElement.tempRef.removeAttribute('clickPosition');
            this.onmousemove = null;
            this.onmouseleave = null;
            this.tempRef = null;
            this.onmouseup = null;
        };
    
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
    
        __globals.svgElement.onmousemove(event);
    }



    grapple.onmousedown_functionList = {};

    grapple.onmousedown = function(event, firstInteraction=true){
        // if( firstInteraction ){
        //     for(var a = 0; a < __globals.svgElement.selectedObjects.length; a++){
        //         if(grapple != __globals.svgElement.selectedObjects[a].grapple){
        //             __globals.svgElement.selectedObjects[a].grapple.onmousedown(event,false);
        //         }
        //     }
        // }

        var funcs = Object.keys(grapple.onmousedown_functionList);
        for(var a = 0; a < funcs.length; a++){
            if( (grapple.onmousedown_functionList[funcs[a]])(event) ){break;}
        }
    };

    grapple.onmousedown_functionList.copy = function(event){
        if(!event.shiftKey || !grapple.target.creatorMethod){return false;}

        var position = __globals.utility.getTransform(grapple.target);
        var newObject = grapple.target.creatorMethod(position[0],position[1]);

        __globals.utility.getPane(grapple.target).appendChild(newObject);

        if(newObject.copy){newObject.copy();}

        movement(newObject, event);

        return true;
    };
    grapple.onmousedown_functionList.move = function(event){ movement(grapple.target, event); };

};