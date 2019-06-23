this.checkbox_polygon = function(
    name='checkbox_polygon',
    x, y, 
    outterPoints=[{x:0,y:4},{x:4,y:0}, {x:16,y:0},{x:20,y:4}, {x:20,y:16},{x:16,y:20}, {x:4,y:20},{x:0,y:16}],
    innerPoints=[ {x:2,y:4},{x:4,y:2}, {x:16,y:2},{x:18,y:4}, {x:18,y:16},{x:16,y:18}, {x:4,y:18},{x:2,y:16}],
    angle=0, interactable=true,
    checkStyle={r:0.58,g:0.58,b:0.58,a:1},
    backingStyle={r:0.78,g:0.78,b:0.78,a:1},
    checkGlowStyle={r:0.86,g:0.86,b:0.86,a:1},
    backingGlowStyle={r:0.86,g:0.86,b:0.86,a:1},
    onchange = function(){},
){
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('basic','group',name+'subGroup',{});
        //backing
            var backing = interfacePart.builder('basic','polygon','backing',{pointsAsXYArray:outterPoints, colour:backingStyle});
            subject.append(backing);
        //check
            var checkpoly = interfacePart.builder('basic','polygon','checkpoly',{pointsAsXYArray:innerPoints, colour:{r:0,g:0,b:0,a:0}});
            subject.append(checkpoly);
        //cover
            subject.cover = interfacePart.builder('basic','polygon','cover',{pointsAsXYArray:outterPoints, colour:{r:0,g:0,b:0,a:0}});
            subject.append(subject.cover);

    //generic checkbox part
        var object = interfacePart.builder(
            'control', 'checkbox_', name, {
                x:x, y:y, angle:angle, interactable:interactable,
                onchange:onchange,
                subject:subject,
            }
        );

    //graphical state adjust
        object.updateGraphics = function(state){
            if(state.glowing){
                backing.colour = backingGlowStyle;
                checkpoly.colour = state.checked ? checkGlowStyle : {r:0,g:0,b:0,a:0};
            }else{
                backing.colour = backingStyle;
                checkpoly.colour = state.checked ? checkStyle : {r:0,g:0,b:0,a:0};
            }
        };
        object.updateGraphics({checked:false,glowing:false});

    return object;
};