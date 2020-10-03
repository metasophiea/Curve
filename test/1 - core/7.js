_canvas_.layers.registerFunctionForLayer("core", function(){
    
    let rectangle_1 = _canvas_.core.element.create('Rectangle','test_rectangle_1');
    _canvas_.core.arrangement.append(rectangle_1);
    rectangle_1.unifiedAttribute({ x:30, y:30, width:200, height:200, colour:{r:1,g:0,b:0,a:1} });
    rectangle_1.attachCallback(
        'onmouseenterelement',
        () => {
            rectangle_1.colour({r:1,g:0.75,b:0.75,a:1});
            _canvas_.core.render.frame();
        }
    );
    rectangle_1.attachCallback(
        'onmouseleaveelement',
        () => {
            rectangle_1.colour({r:1,g:0,b:0,a:1});
            _canvas_.core.render.frame();
        }
    );




    let rectangle_2 = _canvas_.core.element.create('Rectangle','test_rectangle_2');
    _canvas_.core.arrangement.append(rectangle_2);
    rectangle_2.unifiedAttribute({ x:60, y:60, width:200, height:200, colour:{r:0,g:1,b:0,a:1} });
    // rectangle_2.attachCallback(
    //     'onmouseenterelement',
    //     () => {
    //         rectangle_2.colour({r:0.75,g:1,b:0.75,a:1});
    //         _canvas_.core.render.frame();
    //     }
    // );
    // rectangle_2.attachCallback(
    //     'onmouseleaveelement',
    //     () => {
    //         rectangle_2.colour({r:0,g:1,b:0,a:1});
    //         _canvas_.core.render.frame();
    //     }
    // );
    rectangle_2.attachCallback( 'onmousedown', () => console.log('onmousedown!') );
    rectangle_2.attachCallback( 'onmouseup', () => console.log('onmouseup!') );
    rectangle_2.attachCallback( 'onclick', (xy, event) => console.log('click!', xy, event) );
    rectangle_2.attachCallback( 'onwheel', (xy, event) => console.log('onwheel!', xy, event) );
    rectangle_2.attachCallback( 'onkeydown', (xy, event) => console.log('onkeydown!', xy, event) );
    rectangle_2.attachCallback( 'onkeyup', (xy, event) => console.log('onkeyup!', xy, event) );




    let rectangle_3 = _canvas_.core.element.create('Rectangle','test_rectangle_3');
    _canvas_.core.arrangement.append(rectangle_3);
    rectangle_3.unifiedAttribute({ x:90, y:90, width:260, height:200, colour:{r:0,g:0,b:1,a:1} });
    rectangle_3.attachCallback(
        'onmouseenterelement',
        () => {
            rectangle_3.colour({r:0.75,g:0.75,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );
    rectangle_3.attachCallback(
        'onmouseleaveelement',
        () => {
            rectangle_3.colour({r:0,g:0,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );
    rectangle_3.attachCallback(
        'ondblclick',
        () => {
            console.log('doubleclick!');
        }
    );




    let rectangle_4 = _canvas_.core.element.create('Rectangle','test_rectangle_4');
    _canvas_.core.arrangement.append(rectangle_4);
    rectangle_4.unifiedAttribute({ x:90, y:140, width:250, height:150, colour:{r:1,g:0,b:1,a:1} });
    rectangle_4.attachCallback(
        'onmouseenterelement',
        () => {
            rectangle_4.colour({r:1,g:0.75,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );
    rectangle_4.attachCallback(
        'onmouseleaveelement',
        () => {
            rectangle_4.colour({r:1,g:0,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );




    let rectangle_5 = _canvas_.core.element.create('Rectangle','test_rectangle_5');
    _canvas_.core.arrangement.append(rectangle_5);
    rectangle_5.unifiedAttribute({ x:90, y:300, width:250, height:150, angle:Math.PI/4, colour:{r:1,g:0,b:1,a:1} });
    rectangle_5.attachCallback(
        'onmouseenterelement',
        () => {
            rectangle_5.colour({r:1,g:0.75,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );
    rectangle_5.attachCallback(
        'onmouseleaveelement',
        () => {
            rectangle_5.colour({r:1,g:0,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );




    let polygon_1 = _canvas_.core.element.create('Polygon','test_polygon_1');
    _canvas_.core.arrangement.append(polygon_1);
    polygon_1.unifiedAttribute({
        pointsAsXYArray:[
            {x:300,y:100}, 
            {x:330,y:100}, 
            {x:330,y:130}, 
            {x:300,y:130},
            {x:280,y:115},
        ],
        colour:{r:1,g:0,b:1,a:1}
    });
    polygon_1.attachCallback(
        'onmouseenterelement',
        () => {
            polygon_1.colour({r:1,g:0.75,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );
    polygon_1.attachCallback(
        'onmouseleaveelement',
        () => {
            polygon_1.colour({r:1,g:0,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );




    let circle_1 = _canvas_.core.element.create('Circle','test_circle_1');
    _canvas_.core.arrangement.append(circle_1);
    circle_1.unifiedAttribute({
        x:400, y:200, radius:40,
        colour:{r:1,g:0,b:1,a:1}
    });
    circle_1.attachCallback(
        'onmouseenterelement',
        () => {
            circle_1.colour({r:1,g:0.75,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );
    circle_1.attachCallback(
        'onmouseleaveelement',
        () => {
            circle_1.colour({r:1,g:0,b:1,a:1});
            _canvas_.core.render.frame();
        }
    );




    let path_1 = _canvas_.core.element.create('Path','test_path_1');
    path_1.unifiedAttribute({
        pointsAsXYArray:[ {x:80+300,y:60}, {x:130+300,y:60}, {x:140+300,y:70}, {x:140+300,y:120}, {x:80+300,y:120} ],
        thickness:5,
        capType:'round',
        colour:{r:0.859,g:0.2,b:0.756,a:1} 
    });
    path_1.attachCallback(
        'onmouseenterelement',
        () => {
            path_1.colour({r:1,g:0.8,b:1,a:1} );
            _canvas_.core.render.frame();
        }
    );
    path_1.attachCallback(
        'onmouseleaveelement',
        () => {
            path_1.colour({r:0.859,g:0.2,b:0.756,a:1} );
            _canvas_.core.render.frame();
        }
    );
    _canvas_.core.arrangement.append(path_1);




    let clippingGroup_1 = _canvas_.core.element.create('Group','test_clippingGroup_1');
    clippingGroup_1.unifiedAttribute({ x:400, y:300, clipActive:true });
    _canvas_.core.arrangement.append(clippingGroup_1);

        let clippingGroup_rectangle_1 = _canvas_.core.element.create('Rectangle','test_clippingGroup_rectangle_1');
        clippingGroup_rectangle_1.unifiedAttribute({ x:0, y:0, width:60, height:60, colour:{r:0.732,g:0.756,b:0.892,a:1} });
        clippingGroup_rectangle_1.attachCallback( 'onmouseenterelement', () => { clippingGroup_rectangle_1.colour({r:1,g:0.756,b:1,a:1}); _canvas_.core.render.frame(); } );
        clippingGroup_rectangle_1.attachCallback( 'onmouseleaveelement', () => { clippingGroup_rectangle_1.colour({r:0.732,g:0.756,b:0.892,a:1}); _canvas_.core.render.frame(); } );
        clippingGroup_1.append(clippingGroup_rectangle_1);

        let clippingGroup_rectangle_2 = _canvas_.core.element.create('Rectangle','test_clippingGroup_rectangle_2');
        clippingGroup_rectangle_2.unifiedAttribute({ x:30, y:30, width:60, height:60, colour:{r:0.107,g:0.722,b:0.945,a:1} });
        clippingGroup_rectangle_2.attachCallback( 'onmouseenterelement', () => { clippingGroup_rectangle_2.colour({r:1,g:0.722,b:1,a:1}); _canvas_.core.render.frame(); } );
        clippingGroup_rectangle_2.attachCallback( 'onmouseleaveelement', () => { clippingGroup_rectangle_2.colour({r:0.107,g:0.722,b:0.945,a:1}); _canvas_.core.render.frame(); } );
        clippingGroup_1.append(clippingGroup_rectangle_2);

        let clippingGroup_rectangle_3 = _canvas_.core.element.create('Rectangle','test_clippingGroup_rectangle_3');
        clippingGroup_rectangle_3.unifiedAttribute({ x:40, y:-10, width:60, height:60, colour:{r:0.859,g:0.573,b:0.754,a:1} });
        clippingGroup_rectangle_3.attachCallback( 'onmouseenterelement', () => { clippingGroup_rectangle_3.colour({r:1,g:0.573,b:1,a:1}); _canvas_.core.render.frame(); } );
        clippingGroup_rectangle_3.attachCallback( 'onmouseleaveelement', () => { clippingGroup_rectangle_3.colour({r:0.859,g:0.573,b:0.754,a:1}); _canvas_.core.render.frame(); } );
        clippingGroup_1.append(clippingGroup_rectangle_3);

        let clippingGroup_rectangle_stencil = _canvas_.core.element.create('Rectangle','test_clippingGroup_rectangle_stencil');
        clippingGroup_rectangle_stencil.unifiedAttribute({ width:60, height:60 });
        clippingGroup_1.stencil(clippingGroup_rectangle_stencil);

    let rectangle_6 = _canvas_.core.element.create('Rectangle','test_clippingGroup_cover');
    rectangle_6.unifiedAttribute({ x:400, y:300, width:60, height:60, colour:{r:0.5,g:0.5,b:0.8,a:0} });
    _canvas_.core.arrangement.append(rectangle_6);




    _canvas_.core.if.operator.element.executeMethod.setDotFrame(1,true);
    _canvas_.core.if.operator.element.executeMethod.setDotFrame(2,true);
    _canvas_.core.if.operator.element.executeMethod.setDotFrame(3,true);
    _canvas_.core.if.operator.element.executeMethod.setDotFrame(4,true);
    _canvas_.core.if.operator.element.executeMethod.setDotFrame(5,true);
    _canvas_.core.if.operator.element.executeMethod.setDotFrame(6,true);
    _canvas_.core.if.operator.element.executeMethod.setDotFrame(7,true);
    _canvas_.core.if.operator.element.executeMethod.setDotFrame(8,true);

    // _canvas_.core.viewport.position(-100,-100);
    // _canvas_.core.viewport.angle(0.5);

    setTimeout(()=>{ _canvas_.core.render.frame(); },500);
} );    