let dynamicGroup;


core.element.create('group','dynamicGroup').then(newId => {
    dynamicGroup = newId;
    core.arrangement.append(dynamicGroup);
    core.element.executeMethod(dynamicGroup,'heedCamera',[true]);

    core.element.create('rectangle','rectangle_1').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:30, y:30, width:200, height:200, colour:{r:0,g:0,b:0,a:1} }]);
    });
});


setTimeout(()=>{core.render.frame();},250);