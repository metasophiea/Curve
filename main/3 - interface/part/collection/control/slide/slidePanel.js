this.slidePanel = function(
    name='slidePanel', 
    x, y, width=80, height=95, angle=0, interactable=true,
    handleHeight=0.1, count=8, startValue=0, resetValue=0.5,
    handleStyle={r:0.78,g:0.78,b:0.78,a:1},
    backingStyle={r:0.58,g:0.58,b:0.58,a:1},
    slotStyle={r:0.2,g:0.2,b:0.2,a:1},
    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //slides
            for(var a = 0; a < count; a++){
                var temp = interfacePart.builder(
                    'slide', 'slide_'+a, {
                        x:a*(width/count), y:0,
                        width:width/count, height:height, interactable:interactable, handleHeight:handleHeight,
                        value:startValue, resetValue:resetValue,
                        style:{handle:handleStyle, backing:backingStyle, slot:slotStyle},
                        onchange:function(value){ if(!object.onchange){return;} object.onchange(this.id,value); },
                        onrelease:function(value){ if(!object.onrelease){return;} object.onrelease(this.id,value); },
                    }
                );
                temp.__calculationAngle = angle;
                object.append(temp);
            }

        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;

            for(var a = 0; a < count; a++){
                object.children()[a].interactable(bool);
            }
        };

    return object;
};