let group_1;
let group_2;
let rectangle_1;
let rectangle_2;
let rectangle_3;

_canvas_.core.meta.go = function(){
    _canvas_.core.element.create('group','group_1').then(group => {
        group_1 = group;
        group.unifiedAttribute({ x:100, y:100 });
        _canvas_.core.arrangement.append(group);

        _canvas_.core.element.create('rectangle','rectangle_1').then(rectangle => {
            rectangle_1 = rectangle;
            rectangle.unifiedAttribute({ width:30, height:30, colour:{r:1,g:0,b:0,a:1} });
            group_1.append(rectangle_1);
        });

        _canvas_.core.element.create('group','group_2').then(group => {
            group_2 = group;
            group.unifiedAttribute({ x:50 });
            group_1.append(group);

            _canvas_.core.element.create('rectangle','rectangle_2').then(rectangle => {
                rectangle_2 = rectangle;
                rectangle.unifiedAttribute({ width:30, height:30, colour:{r:0,g:1,b:0,a:1} });
                group_2.append(rectangle_2);
            });

            _canvas_.core.element.create('rectangle','rectangle_3').then(rectangle => {
                rectangle_3 = rectangle;
                rectangle.unifiedAttribute({ x:50, width:30, height:30, colour:{r:0,g:0,b:1,a:1} });
                group_2.append(rectangle_3);
            });
        });
    });

    var tick = 0;
    setInterval(function(){
        group_1.angle(group_1.angle()+0.04);
        group_1.scale(1 + 0.5*Math.sin( 2*Math.PI*tick ));

        group_2.angle(group_2.angle()+0.04);
        group_2.scale(1 + 0.5*Math.sin( 2*Math.PI*tick ));

        rectangle_3.angle(rectangle_3.angle()+0.04);
        rectangle_3.scale(1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/2));

        tick += 0.01;
    },1000/40);
};

_canvas_.core.render.active(true);

setTimeout(()=>{_canvas_.core.arrangement.printTree()},500);