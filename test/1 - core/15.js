var testGroup = _canvas_.core.shape.create('group');
    testGroup.name = 'testGroup';
    _canvas_.core.arrangement.append(testGroup);


var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'shape_1';
    tmp.x(10);
    tmp.y(10);
    tmp.width(30);
    tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    tmp.onadd = function(prepended){ console.log('this shape has been added to the ' + (prepended ? 'front' : 'back')); };
    tmp.onremove = function(prepended){ console.log('this shape has been removed'); };



testGroup.append(tmp);
testGroup.remove(tmp);
testGroup.prepend(tmp);



_canvas_.core.render.frame();