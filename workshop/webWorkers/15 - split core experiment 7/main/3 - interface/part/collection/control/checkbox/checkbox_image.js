this.checkbox_image = function(
    name='checkbox_image',
    x, y, width=20, height=20, angle=0, interactable=true,
    uncheckURL='', checkURL='', uncheckGlowURL='', checkGlowStyle='',
    onchange = function(){},
){
    dev.log.partControl('.checkbox_image(...)'); //#development

    //adding on the specific shapes
        //main
            const subject = interfacePart.builder('basic','group',name+'subGroup');
        //backing
            const backing = interfacePart.builder('basic','image','backing',{width:width, height:height, url:uncheckURL});
            subject.append(backing);
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
                backing.url(state.checked ? checkGlowStyle : uncheckGlowURL);
            }else{
                backing.url(state.checked ? checkURL : uncheckURL);
            }
        };
        object.updateGraphics({checked:false,glowing:false});

    return object;
};

interfacePart.partLibrary.control.checkbox_image = function(name,data){ return interfacePart.collection.control.checkbox_image(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
    data.uncheckURL, data.checkURL, data.uncheckGlowURL, data.checkGlowURL,
    data.onchange,
); };