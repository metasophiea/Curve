//// removal

// _canvas_.layers.registerFunctionForLayer("core", function(){

//     group_1 = _canvas_.core.element.create('group','group_1');
//     group_1.unifiedAttribute({ x:100, y:100 });
//     group_1.attachCallback( 'onadd', function(){console.log('group_1:onadd');} );
//     group_1.attachCallback( 'onremove', function(){console.log('group_1:onremove');} );
//     _canvas_.core.arrangement.append(group_1);

//     group_2 = _canvas_.core.element.create('group','group_2');
//     group_2.unifiedAttribute({ x:50 });
//     group_2.attachCallback( 'onadd', function(){console.log('group_2:onadd');} );
//     group_2.attachCallback( 'onremove', function(){console.log('group_2:onremove');} );
//     group_1.append(group_2);

//     rectangle_1 = _canvas_.core.element.create('rectangle','rectangle_1');
//     rectangle_1.unifiedAttribute({ width:30, height:30, colour:{r:1,g:0,b:0,a:1} });
//     rectangle_1.attachCallback( 'onadd', function(){console.log('rectangle_1:onadd');} );
//     rectangle_1.attachCallback( 'onremove', function(){console.log('rectangle_1:onremove');} );
//     group_1.append(rectangle_1);

//     rectangle_2 = _canvas_.core.element.create('rectangle','rectangle_2');
//     rectangle_2.unifiedAttribute({ width:30, height:30, colour:{r:0,g:1,b:0,a:1} });
//     rectangle_2.attachCallback( 'onadd', function(){console.log('rectangle_2:onadd');} );
//     rectangle_2.attachCallback( 'onremove', function(){console.log('rectangle_2:onremove');} );
//     group_2.append(rectangle_2);

//     rectangle_3 = _canvas_.core.element.create('rectangle','rectangle_3');
//     rectangle_3.unifiedAttribute({ x:50, width:30, height:30, colour:{r:0,g:0,b:1,a:1} });
//     rectangle_3.attachCallback( 'onadd', function(){console.log('rectangle_3:onadd');} );
//     rectangle_3.attachCallback( 'onremove', function(){console.log('rectangle_3:onremove');} );
//     group_2.append(rectangle_3);

//     setTimeout(_canvas_.core.render.frame,100);

//     setTimeout(function(){
//         console.log('');
//         _canvas_.core.arrangement.printTree();
//     },250);

//     setTimeout(function(){
//         console.log('');
//         console.log('> group_1.remove(rectangle_2)');
//         group_1.remove(rectangle_2);
//     },500);


//     setTimeout(function(){
//         console.log('');
//         _canvas_.core.render.frame();
//         _canvas_.core.arrangement.printTree();
//     },750);
// } );








//// shifting

_canvas_.layers.registerFunctionForLayer("core", function(){

    group_1 = _canvas_.core.element.create('group','group_1');
    group_1.unifiedAttribute({ x:100, y:100 });
    group_1.attachCallback( 'onshift', function(data){console.log('group_1:onshift :', data);} );
    _canvas_.core.arrangement.append(group_1);

    group_2 = _canvas_.core.element.create('group','group_2');
    group_2.unifiedAttribute({ x:50, y:50 });
    group_2.attachCallback( 'onshift', function(data){console.log('group_2:onshift :', data);} );
    group_1.append(group_2);

    rectangle_1 = _canvas_.core.element.create('rectangle','rectangle_1');
    rectangle_1.unifiedAttribute({ width:100, height:100, colour:{r:1,g:0,b:0,a:1} });
    rectangle_1.attachCallback( 'onshift', function(data){console.log('rectangle_1:onshift :', data);} );
    group_1.append(rectangle_1);

    rectangle_2 = _canvas_.core.element.create('rectangle','rectangle_2');
    rectangle_2.unifiedAttribute({ width:100, height:100, colour:{r:0,g:1,b:0,a:1} });
    rectangle_2.attachCallback( 'onshift', function(data){console.log('rectangle_2:onshift :', data);} );
    group_2.append(rectangle_2);

    rectangle_3 = _canvas_.core.element.create('rectangle','rectangle_3');
    rectangle_3.unifiedAttribute({ x:50, y:50, width:100, height:100, colour:{r:0,g:0,b:1,a:1} });
    rectangle_3.attachCallback( 'onshift', function(data){console.log('rectangle_3:onshift :', data);} );
    group_2.append(rectangle_3);

    setTimeout(_canvas_.core.render.frame,100);

    // setTimeout(function(){
    //     console.log('');
        _canvas_.core.arrangement.printTree();
    // },250);

    // setTimeout(function(){
    //     console.log('');
    //     console.log('> group_2.remove(rectangle_3,0)');
        group_2.shift(rectangle_3,0);
    // },500);

    // setTimeout(function(){
    //     console.log('');
        _canvas_.core.render.frame();
        _canvas_.core.arrangement.printTree();
    // },750);

    // setTimeout(function(){
    //     console.log('');
    //     console.log('> group_1.remove(rectangle_1,0)');
        group_1.shift(rectangle_1,0);
    // },1000);

    // setTimeout(function(){
    //     console.log('');
        _canvas_.core.render.frame();
        _canvas_.core.arrangement.printTree();
    // },1250);


    group_1.shift(group_2,0);
} );
