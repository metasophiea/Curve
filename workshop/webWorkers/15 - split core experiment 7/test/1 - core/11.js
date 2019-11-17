let groupId_1;
let groupId_2;
let rectangleId_1;
let rectangleId_2;
let rectangleId_3;

_canvas_.core.meta.go = function(){
    _canvas_.core.meta.createSetAppend( 'group','group_1', {x:100, y:100} ).then(id => {
        groupId_1 = id;

        _canvas_.core.meta.createSetAppend( 'rectangle','rectangle_1', {width:30, height:30, colour:{r:1,g:0,b:0,a:1}}, groupId_1).then(id => {
            rectangleId_1 = id;
        });

        _canvas_.core.meta.createSetAppend('group','group_2', {x:50}, groupId_1).then(id => {
            groupId_2 = id;

            _canvas_.core.meta.createSetAppend( 'rectangle','rectangle_2', {width:30, height:30, colour:{r:0,g:1,b:0,a:1}}, groupId_2).then(id => {
                rectangleId_2 = id;
            });
            _canvas_.core.meta.createSetAppend( 'rectangle','rectangle_3', {x:50, width:30, height:30, colour:{r:0,g:0,b:1,a:1}}, groupId_2).then(id => {
                rectangleId_3 = id;
            });
        });
    });
};

// _canvas_.core.render.active(true);

setTimeout(()=>{_canvas_.core.arrangement.printTree()},500);

setTimeout(()=>{
    _canvas_.core.arrangement.areParents(rectangleId_3, [rectangleId_2,groupId_2]).then(console.log);
    _canvas_.core.arrangement.areParents(rectangleId_3, [groupId_1]).then(console.log);
    _canvas_.core.arrangement.areParents(rectangleId_3, [rectangleId_2]).then(console.log);
    _canvas_.core.arrangement.areParents(rectangleId_1, [groupId_2]).then(console.log);
    _canvas_.core.arrangement.areParents(rectangleId_2, [groupId_1,groupId_2]).then(console.log);
},1000);
