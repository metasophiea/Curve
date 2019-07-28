this.checkbox_rectangle = function(
    name='checkbox_rectangle',
    x, y, width=20, height=20, angle=0, interactable=true,
    checkStyle={r:0.58,g:0.58,b:0.58,a:1},
    backingStyle={r:0.78,g:0.78,b:0.78,a:1},
    checkGlowStyle={r:0.86,g:0.86,b:0.86,a:1},
    backingGlowStyle={r:0.86,g:0.86,b:0.86,a:1},
    onchange = function(){},
){
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('basic','group',name+'subGroup');
        //backing
            var backing = interfacePart.builder('basic','rectangle','backing',{width:width, height:height, colour:backingStyle});
            subject.append(backing);
        //check
            var checkrect = interfacePart.builder('basic','rectangle','checkrect',{x:width*0.1,y:height*0.1,width:width*0.8,height:height*0.8, colour:{r:0,g:0,b:0,a:0}});
            subject.append(checkrect);
        //cover
            subject.cover = interfacePart.builder('basic','rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
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
                checkrect.colour = state.checked ? checkGlowStyle : {r:0,g:0,b:0,a:0};
            }else{
                backing.colour = backingStyle;
                checkrect.colour = state.checked ? checkStyle : {r:0,g:0,b:0,a:0};
            }
        };
        object.updateGraphics({checked:false,glowing:false});

    return object;
};

interfacePart.partLibrary.control.checkbox_rectangle = function(name,data){ return interfacePart.collection.control.checkbox_rectangle(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
    data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
    data.onchange,
); };