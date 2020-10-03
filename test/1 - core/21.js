_canvas_.layers.registerFunctionForLayer("core", function(){

    let rect_1 = _canvas_.core.element.create('Rectangle','rect_1');
    rect_1.unifiedAttribute({width:50, height:50});
    _canvas_.core.arrangement.append(rect_1);
    rect_1.attachCallback('onmouseenterelement', () => { rect_1.colour({r:1,g:0.75,b:0.75,a:1}); _canvas_.core.render.frame(); } );
    rect_1.attachCallback('onmouseleaveelement', () => { rect_1.colour({r:1,g:0,b:0,a:1}); _canvas_.core.render.frame(); } );

    let group_1 = _canvas_.core.element.create('Group','group_1');
    group_1.unifiedAttribute({heeCamera:false});
    _canvas_.core.arrangement.append(group_1);
        let rect_2 = _canvas_.core.element.create('Rectangle','rect_2');
        rect_2.unifiedAttribute({x:100, width:50, height:50});
        group_1.append(rect_2);
        rect_2.attachCallback('onmouseenterelement', () => { rect_2.colour({r:1,g:0.75,b:0.75,a:1}); _canvas_.core.render.frame(); } );
        rect_2.attachCallback('onmouseleaveelement', () => { rect_2.colour({r:1,g:0,b:0,a:1}); _canvas_.core.render.frame(); } );

        // let rect_3 = _canvas_.core.element.create('Rectangle','rect_3');
        // rect_3.unifiedAttribute({x:200, width:50, height:50});
        // group_1.append(rect_3);

        // let group_2 = _canvas_.core.element.create('Group','group_2');
        // group_2.unifiedAttribute({x:300});
        // group_1.append(group_2);
        //     let rect_4 = _canvas_.core.element.create('Rectangle','rect_4');
        //     rect_4.unifiedAttribute({width:50, height:50});
        //     group_2.append(rect_4);

    let group_2 = _canvas_.core.element.create('Group','group_2');
    group_2.unifiedAttribute({heedCamera:true});
    _canvas_.core.arrangement.append(group_2);
        let group_3 = _canvas_.core.element.create('Group','group_3');
        group_3.unifiedAttribute({heedCamera:true});
        group_2.append(group_3);
            let rect_3 = _canvas_.core.element.create('Rectangle','rect_3');
            rect_3.unifiedAttribute({x:200, width:50, height:50});
            group_2.append(rect_3);
            rect_3.attachCallback('onmouseenterelement', () => { rect_3.colour({r:1,g:0.75,b:0.75,a:1}); _canvas_.core.render.frame(); } );
            rect_3.attachCallback('onmouseleaveelement', () => { rect_3.colour({r:1,g:0,b:0,a:1}); _canvas_.core.render.frame(); } );
        




    let tick = 0;
    setInterval(() => {
        let x = Math.sin(tick/20);
        let y = Math.cos(tick/20);
        _canvas_.core.viewport.position(x*55,y*55);
        _canvas_.core.render.frame();
        tick++;
    }, 50);
});