this.checkbox_polygon = function(
    name='checkbox_polygon',
    x, y, 
    outterPoints=[{x:0,y:4},{x:4,y:0}, {x:16,y:0},{x:20,y:4}, {x:20,y:16},{x:16,y:20},{x:4,y:20},{x:0,y:16}],
    innerPoints=[ {x:2,y:4},{x:4,y:2}, {x:16,y:2},{x:18,y:4}, {x:18,y:16},{x:16,y:18}, {x:4,y:18},{x:2,y:16}],
    angle=0, interactable=true,
    checkStyle = 'rgba(150,150,150,1)',
    backingStyle = 'rgba(200,200,200,1)',
    checkGlowStyle = 'rgba(220,220,220,1)',
    backingGlowStyle = 'rgba(220,220,220,1)',
    onchange = function(){},
){
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('group',name+'subGroup',{});
        //backing
            var backing = interfacePart.builder('polygon','backing',{points:outterPoints, style:{fill:backingStyle}});
            subject.append(backing);
        //check
            var checkrect = interfacePart.builder('polygon','checkrect',{points:innerPoints, style:{fill:'rgba(0,0,0,0)'}});
            subject.append(checkrect);
        //cover
            subject.cover = interfacePart.builder('polygon','cover',{points:outterPoints, style:{fill:'rgba(0,0,0,0)'}});
            subject.append(subject.cover);

    //generic checkbox part
        var object = interfacePart.builder(
            'checkbox_', name, {
                x:x, y:y, angle:angle, interactable:interactable,
                onchange:onchange,
                subject:subject,
            }
        );

    //graphical state adjust
        object.updateGraphics = function(state){
            if(state.glowing){
                backing.style.fill = backingGlowStyle;
                checkrect.style.fill = state.checked ? checkGlowStyle : 'rgba(0,0,0,0)';
            }else{
                backing.style.fill = backingStyle;
                checkrect.style.fill = state.checked ? checkStyle : 'rgba(0,0,0,0)';
            }
        };
        object.updateGraphics({checked:false,glowing:false});

    return object;
};