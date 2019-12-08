_canvas_.core.go.add( function(){ 

    group_1 = _canvas_.core.element.create('group','group_1');
    group_2 = _canvas_.core.element.create('group','group_2');
    group_3 = _canvas_.core.element.create('group','group_3');
    group_4 = _canvas_.core.element.create('group','group_4');
    _canvas_.core.arrangement.append(group_1);

    let rectangle_1 = _canvas_.core.element.create('rectangle','test_rectangle_1');
    let rectangle_2 = _canvas_.core.element.create('rectangle','test_rectangle_2');
    let rectangle_3 = _canvas_.core.element.create('rectangle','test_rectangle_3');

    group_1.append(group_2);
    group_2.append(group_3);
    group_3.append(group_4);

    console.log('');
    group_4.clear();
    group_4.append(rectangle_1);
    group_4.clear();
    group_4.append(rectangle_1);
    group_4.clear();
    group_4.append(rectangle_1);
    group_4.clear();

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


} );