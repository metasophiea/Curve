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

    var tick = 0;
    const em = _canvas_.core.element.executeMethod;
    setInterval(function(){
        em(groupId_1,'angle').then(angle => { em(groupId_1,'angle',[angle+0.04]); });
        em(groupId_1,'scale',[1 + 0.5*Math.sin( 2*Math.PI*tick )]);

        em(groupId_2,'angle').then(angle => { em(groupId_2,'angle',[angle+0.04]); });
        em(groupId_2,'scale',[1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/4 )]);

        em(rectangleId_3,'angle').then(angle => { em(rectangleId_3,'angle',[angle+0.04]); });
        em(rectangleId_3,'scale',[1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/2)]);

        tick += 0.01;
    },1000/40);
};

_canvas_.core.render.active(true);

setTimeout(()=>{_canvas_.core.arrangement.printTree()},500);