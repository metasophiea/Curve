let group_1;
let group_2;
let rectangle_1;
let rectangle_2;
let rectangle_3;

_canvas_.layers.registerFunctionForLayer("core", function(){

    group_1 = _canvas_.core.element.create('Group','group_1');
    group_1.unifiedAttribute({ x:100, y:100 });
    _canvas_.core.arrangement.append(group_1);

    group_2 = _canvas_.core.element.create('Group','group_2');
    group_2.unifiedAttribute({ x:50 });
    group_1.append(group_2);

    rectangle_1 = _canvas_.core.element.create('Rectangle','rectangle_1');
    rectangle_1.unifiedAttribute({ width:30, height:30, colour:{r:1,g:0,b:0,a:1} });
    group_1.append(rectangle_1);

    rectangle_2 = _canvas_.core.element.create('Rectangle','rectangle_2');
    rectangle_2.unifiedAttribute({ width:30, height:30, colour:{r:0,g:1,b:0,a:1} });
    group_2.append(rectangle_2);

    rectangle_3 = _canvas_.core.element.create('Rectangle','rectangle_3');
    rectangle_3.unifiedAttribute({ x:50, width:30, height:30, colour:{r:0,g:0,b:1,a:1} });
    group_2.append(rectangle_3);

    // _canvas_.core.render.active(true);

    setTimeout(()=>{
        console.log('');
        _canvas_.core.arrangement.printTree('address');
    },500);

    setTimeout(()=>{
        console.log('');
        _canvas_.core.arrangement.areParents(rectangle_3, [rectangle_2,group_2]).then(console.log);
        _canvas_.core.arrangement.areParents(rectangle_3, [group_1]).then(console.log);
        _canvas_.core.arrangement.areParents(rectangle_3, [rectangle_2]).then(console.log);
        _canvas_.core.arrangement.areParents(rectangle_1, [group_2]).then(console.log);
        _canvas_.core.arrangement.areParents(rectangle_2, [group_1,group_2]).then(console.log);
    },1000);
} );
