this.checkbox_image = function(
    name='checkbox_image',
    x, y, width=20, height=20, angle=0, interactable=true,
    uncheckURL, checkURL, checkGlowURL, backingGlowURL,
    onchange = function(){},
){
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('group',name+'subGroup',{});
        //backing
            var backing = interfacePart.builder('image','backing',{width:width, height:height, url:uncheckURL});
            subject.append(backing);
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
                backing.url = state.checked ? checkGlowURL : uncheckGlowURL;
            }else{
                backing.url = state.checked ? checkURL : uncheckURL;
            }
        };
        object.updateGraphics({checked:false,glowing:false});

    return object;
};