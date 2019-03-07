this.checkbox_image = function(
    name='checkbox_image',
    x, y, width=20, height=20, angle=0, interactable=true,
    uncheckURL='', checkURL='', uncheckGlowURL='', checkGlowStyle='',
    onchange = function(){},
){
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('group',name+'subGroup');
        //backing
            var backing = interfacePart.builder('image','backing',{width:width, height:height, url:uncheckURL});
            subject.append(backing);
        //cover
            subject.cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
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
                backing.imageURL(state.checked ? checkGlowStyle : uncheckGlowURL);
            }else{
                backing.imageURL(state.checked ? checkURL : uncheckURL);
            }
        };
        object.updateGraphics({checked:false,glowing:false});

    return object;
};