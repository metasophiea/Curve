_canvas_.layers.registerFunctionForLayer("core", function(){

    group_1 = _canvas_.core.element.create('Group','group_1');
    group_2 = _canvas_.core.element.create('Group','group_2');
    group_3 = _canvas_.core.element.create('Group','group_3');
    group_4 = _canvas_.core.element.create('Group','group_4');

    let rectangle_1 = _canvas_.core.element.create('Rectangle','test_rectangle_1');
    let rectangle_2 = _canvas_.core.element.create('Rectangle','test_rectangle_2');
    let rectangle_3 = _canvas_.core.element.create('Rectangle','test_rectangle_3');

    // _canvas_.core.arrangement.append(group_1);
    // group_1.append(group_2);
    // group_2.append(group_3);
    // group_3.append(group_4);

    // console.log('');
    // group_4.clear();
    // group_4.append(rectangle_1);
    // group_4.clear();
    // group_4.append(rectangle_1);
    // group_4.clear();
    // group_4.append(rectangle_1);
    // group_4.clear();
    // group_4.append(rectangle_1);

    // setTimeout( () => {
    //     console.log('');
    //     group_1.append(rectangle_1);
    //     group_1.append(rectangle_2);
    //     group_1.clear();
    //     group_1.append(rectangle_3);
    // }, 1000);

    // setTimeout( () => {
    //     console.log('');
    //     group_1.clear();
    //     group_1.append(rectangle_1);
    //     group_1.append(rectangle_2);
    //     group_1.remove(rectangle_2);
    // }, 2000);


    _canvas_.core.arrangement.append(group_1);
    group_1.append(group_2);
    group_2.append(rectangle_1);
    group_1.append(group_3);
    group_3.append(rectangle_2);
    console.log('-remove-');
    group_1.remove(group_3);

    _canvas_.core.arrangement.printTree('address',true);
    setTimeout( () => {_canvas_.core.arrangement.printTree('address');}, 500 );
} );