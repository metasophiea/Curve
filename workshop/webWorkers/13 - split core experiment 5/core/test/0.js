let rectangle_tl;
let rectangle_tr;
let rectangle_bl;
let rectangle_br;

core.ready = function(){
    core.render.getCanvasDimensions().then(dimensions => {
            
        core.element.create('rectangle','rectangle_1').then(newId => {
            rectangle_tl = newId;
            core.arrangement.append(rectangle_tl);
            core.element.executeMethod(rectangle_tl,'unifiedAttribute',[{ width:30, height:30, colour:{r:1,g:0,b:0,a:1} }]);
        });
        core.element.create('rectangle','rectangle_2').then(newId => {
            rectangle_tr = newId;
            core.arrangement.append(rectangle_tr);
            core.element.executeMethod(rectangle_tr,'unifiedAttribute',[{ x:dimensions.width-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }]);
        });
        core.element.create('rectangle','rectangle_3').then(newId => {
            rectangle_bl = newId;
            core.arrangement.append(rectangle_bl);
            core.element.executeMethod(rectangle_bl,'unifiedAttribute',[{ y:dimensions.height-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }]);
        });
        core.element.create('rectangle','rectangle_4').then(newId => {
            rectangle_br = newId;
            core.arrangement.append(rectangle_br);
            core.element.executeMethod(rectangle_br,'unifiedAttribute',[{ x:dimensions.width-30, y:dimensions.height-30, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }]);
        });
    });
};
setTimeout(core.render.frame,500);

window.onresize = function(){
    core.refresh().then(() => {
        core.render.getCanvasDimensions().then(dimensions => {
            core.element.boatload_executeMethod.load({
                id:rectangle_tl,
                method:'unifiedAttribute',
                argumentList:[{ x:0, y:0 }],
            });
            core.element.boatload_executeMethod.load({
                id:rectangle_tr,
                method:'unifiedAttribute',
                argumentList:[{ x:dimensions.width-30, y:0 }],
            });
            core.element.boatload_executeMethod.load({
                id:rectangle_bl,
                method:'unifiedAttribute',
                argumentList:[{ x:0, y:dimensions.height-30 }],
            });
            core.element.boatload_executeMethod.load({
                id:rectangle_br,
                method:'unifiedAttribute',
                argumentList:[{ x:dimensions.width-30, y:dimensions.height-30 }],
            });
            core.element.boatload_executeMethod.ship();
            core.render.frame();
        });
    });
};