this.checkbox_rectangle = function(
    name='checkbox_rectangle',
    x, y, width=20, height=20, angle=0, interactable=true,
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
            var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, style:{fill:backingStyle}});
            subject.append(backing);
        //check
            var checkrect = interfacePart.builder('rectangle','checkrect',{x:width*0.1,y:height*0.1,width:width*0.8,height:height*0.8, style:{fill:'rgba(0,0,0,0)'}});
            subject.append(checkrect);
        //cover
            subject.cover = interfacePart.builder('rectangle','cover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
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