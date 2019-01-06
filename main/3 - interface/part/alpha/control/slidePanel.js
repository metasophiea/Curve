this.slidePanel = function(
    name='slidePanel', 
    x, y, width=80, height=95, angle=0,
    handleHeight=0.1, count=8, startValue=0, resetValue=0.5,
    handleStyle = 'rgba(200,200,200,1)',
    backingStyle = 'rgba(150,150,150,1)',
    slotStyle = 'rgba(50,50,50,1)'
){
    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //slides
            for(var a = 0; a < count; a++){
                var temp = interfacePart.builder(
                    'slide', 'slide_'+a, {
                        x:a*(width/count), y:0,
                        width:width/count, height:height,
                        value:startValue, resetValue:resetValue,
                        style:{handle:handleStyle, backing:backingStyle, slot:slotStyle},
                        onchange:function(value){ object.onchange(this.id,value); },
                        onrelease:function(value){ object.onrelease(this.id,value); },
                    }
                );
                // temp.dotFrame = true;
                temp.__calculationAngle = angle;
                object.append(temp);
            }

    return object;
};