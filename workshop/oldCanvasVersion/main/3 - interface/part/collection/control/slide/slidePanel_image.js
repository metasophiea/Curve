this.slidePanel = function(
    name='slidePanel', 
    x, y, width=80, height=95, angle=0, interactable=true,
    handleHeight=0.1, count=8, startValue=0, resetValue=0.5,

    handleURL, backingURL, slotURL, overlayURL,

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //slides
            for(var a = 0; a < count; a++){
                var temp = interfacePart.builder(
                    'slide_image', 'slide_'+a, {
                        x:a*(width/count), y:0,
                        width:width/count, height:height, interactable:interactable, handleHeight:handleHeight,
                        value:startValue, resetValue:resetValue,
                        handleURL:handleURL, backingURL:backingURL, slotURL:slotURL,
                        onchange:function(value){ if(!object.onchange){return;} object.onchange(this.id,value); },
                        onrelease:function(value){ if(!object.onrelease){return;} object.onrelease(this.id,value); },
                    }
                );
                // temp.dotFrame = true;
                temp.__calculationAngle = angle;
                object.append(temp);
            }
        //overlay
            if(overlayURL != undefined){
                var overlay = interfacePart.builder('image','overlay',{width:width, height:height, url:overlayURL});
                object.append(overlay);
            }

        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;

            for(var a = 0; a < count; a++){
                object.children[a].interactable(bool);
            }
        };

    return object;
};