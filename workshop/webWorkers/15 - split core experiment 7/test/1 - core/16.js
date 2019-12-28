_canvas_.core.go.add( function(){ 

    let rectangle_1 = _canvas_.core.element.create('rectangle','test_rectangle_1');
    _canvas_.core.arrangement.append(rectangle_1);

    console.log( _canvas_.core.arrangement.getElementByAddress('/root/test_rectangle_1') );
    console.log( _canvas_.core.arrangement.getElementsUnderPoint(5,5) );
    
    _canvas_.core.arrangement._dump();

    setTimeout(_canvas_.core.render.frame,100);
} );