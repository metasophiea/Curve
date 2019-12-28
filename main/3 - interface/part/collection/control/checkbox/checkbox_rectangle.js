this.checkbox_rectangle = function(
    name='checkbox_rectangle',
    x, y, width=20, height=20, angle=0, interactable=true,
    percentageSize=0.9,
    checkStyle={r:0.58,g:0.58,b:0.58,a:1},
    backingStyle={r:0.78,g:0.78,b:0.78,a:1},
    checkGlowStyle={r:0.86,g:0.86,b:0.86,a:1},
    backingGlowStyle={r:0.86,g:0.86,b:0.86,a:1},
    onchange = function(){},
){
    dev.log.partControl('.checkbox_rectangle(...)'); //#development

    //adding on the specific shapes
        //main
            const subject = interfacePart.builder('basic','group',name+'subGroup');
        //backing
            const backing = interfacePart.builder('basic','rectangle','backing',{width:width, height:height, colour:backingStyle});
            subject.append(backing);
        //check
            const checkrect = interfacePart.builder('basic','rectangle','checkrect',{
                x:width*(1-percentageSize),
                y:height*(1-percentageSize),
                width:width*(percentageSize*2 - 1),
                height:height*(percentageSize*2 - 1), 
                colour:{r:0,g:0,b:0,a:0}
            });
            subject.append(checkrect);
        //cover
            subject.cover = interfacePart.builder('basic','rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
            subject.append(subject.cover);

    //generic checkbox part
        const object = interfacePart.builder(
            'control', 'checkbox_', name, {
                x:x, y:y, angle:angle, interactable:interactable,
                onchange:onchange,
                subject:subject,
            }
        );

    //graphical state adjust
        object.updateGraphics = function(state){
            if(state.glowing){
                backing.colour(backingGlowStyle);
                checkrect.colour(state.checked ? checkGlowStyle : {r:0,g:0,b:0,a:0});
            }else{
                backing.colour(backingStyle);
                checkrect.colour(state.checked ? checkStyle : {r:0,g:0,b:0,a:0});
            }
        };
        object.updateGraphics({checked:false,glowing:false});

    return object;
};

interfacePart.partLibrary.control.checkbox_rectangle = function(name,data){ return interfacePart.collection.control.checkbox_rectangle(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
    data.percentageSize,
    data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
    data.onchange,
); };