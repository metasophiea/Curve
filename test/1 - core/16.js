_canvas_.layers.registerFunctionForLayer("core", function(){

    let rectangle_1 = _canvas_.core.element.create('Rectangle','test_rectangle_1');
    _canvas_.core.arrangement.append(rectangle_1);
    
    _canvas_.core.arrangement._dump();

    setTimeout(_canvas_.core.render.frame,100);

    setTimeout(() => {
        console.log( _canvas_.core.arrangement.getElementByAddress('/root/test_rectangle_1') );
        _canvas_.core.arrangement.getElementsUnderPoint(5,5).then(console.log);
    },100);
} );