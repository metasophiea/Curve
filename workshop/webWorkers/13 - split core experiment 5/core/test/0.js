core.ready = function(){
    core.render.getCanvasDimensions().then(dimensions => {
            
        core.element.create('rectangle','rectangle_1').then(newId => {
            rectangleId_1 = newId;
            core.arrangement.append(rectangleId_1);
            core.element.executeMethod(rectangleId_1,'unifiedAttribute',[{ width:30, height:30, colour:{r:1,g:0,b:0,a:1} }]);
        });
        core.element.create('rectangle','rectangle_2').then(newId => {
            rectangleId_2 = newId;
            core.arrangement.append(rectangleId_2);
            core.element.executeMethod(rectangleId_2,'unifiedAttribute',[{ x:dimensions.width-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }]);
        });
        core.element.create('rectangle','rectangle_3').then(newId => {
            rectangleId_3 = newId;
            core.arrangement.append(rectangleId_3);
            core.element.executeMethod(rectangleId_3,'unifiedAttribute',[{ y:dimensions.height-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }]);
        });
        core.element.create('rectangle','rectangle_4').then(newId => {
            rectangleId_4 = newId;
            core.arrangement.append(rectangleId_4);
            core.element.executeMethod(rectangleId_4,'unifiedAttribute',[{ x:dimensions.width-30, y:dimensions.height-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }]);
        });
    });
};


setTimeout(core.render.frame,500)