let dynamicGroup;


core.element.create('group','dynamicGroup').then(newId => {
    dynamicGroup = newId;
    core.arrangement.append(dynamicGroup);
    core.element.executeMethod(dynamicGroup,'heedCamera',[true]);

    core.element.create('rectangle','rectangle_1').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:30, y:30, width:200, height:200, colour:{r:0,g:0,b:0,a:1} }]);
        [
            'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
            'onmouseenterelement', 'onmouseleaveelement',
            'onkeydown', 'onkeyup',
        ].forEach(callbackType => {
            core.callback.attachCallback(newId,callbackType,(x,y,event)=>{console.log('rectangle_1 - '+callbackType,x,y,event);});
        });
    });
    core.element.create('rectangle','rectangle_2').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:60, y:30, width:200, height:200, colour:{r:1,g:1,b:0,a:1} }]);
        [
            'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
            'onmouseenterelement', 'onmouseleaveelement',
            'onkeydown', 'onkeyup',
        ].forEach(callbackType => {
            core.callback.attachCallback(newId,callbackType,(x,y,event)=>{console.log('rectangle_2 - '+callbackType,x,y,event);});
        });
    });
    core.element.create('rectangle','rectangle_3').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:90, y:30, width:200, height:200, colour:{r:1,g:0,b:1,a:1} }]);
        [
            'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
            'onmouseenterelement', 'onmouseleaveelement',
            'onkeydown', 'onkeyup',
        ].forEach(callbackType => {
            core.callback.attachCallback(newId,callbackType,(x,y,event)=>{console.log('rectangle_3 - '+callbackType,x,y,event);});
        });
    });
});


[
    'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
    'onmouseenterelement', 'onmouseleaveelement',
    'onkeydown', 'onkeyup',
].forEach(callbackType => {
    core.callback.functions[callbackType] = function(x,y,event,elements){console.log(callbackType+':',x,y,event,elements);}
});





setTimeout(()=>{core.render.frame();},250);