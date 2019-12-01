var group_1;
var rectangle_1;

_canvas_.core.meta.go = function(){
    group_1 = _canvas_.core.element.create('group','group_1');
    _canvas_.core.arrangement.append(group_1);

    rectangle_1 = _canvas_.core.element.create('rectangle','rectangle_1');

    setTimeout(() => {
        console.log( '-> printouts' );
        console.log('group_1.ignored() :',group_1.ignored());
        console.log('group_1.x() :',group_1.x());
        console.log('group_1.y() :',group_1.y());
        console.log('group_1.angle() :',group_1.angle());
        console.log('group_1.scale() :',group_1.scale());
        console.log('group_1.static() :',group_1.static());
        console.log('group_1.getChildren() :',group_1.getChildren());
        console.log('group_1.stencil() :',group_1.stencil());
        console.log('group_1.clipActive() :',group_1.clipActive());
        console.log('group_1.unifiedAttribute() :',group_1.unifiedAttribute());
    },500);

    setTimeout(() => {
        console.log('');
        console.log( '-> append rectangle_1' );
        group_1.append(rectangle_1);
    },1000);

    setTimeout(() => {
        console.log('');
        console.log('group_1.getChildren() :',group_1.getChildren());
    },1500);

    setTimeout(() => {
        console.log('');
        console.log( '-> append rectangle_1 (again)' );
        group_1.append(rectangle_1);
    },2000);

    setTimeout(() => {
        console.log('');
        console.log('group_1.getChildren() :',group_1.getChildren());
    },2500);

    setTimeout(() => {
        console.log('');
        console.log('group_1.contains() :',group_1.contains());
    },3000);

    setTimeout(() => {
        console.log('');
        console.log( '-> remove rectangle_1' );
        group_1.remove(rectangle_1);
    },3400);

    setTimeout(() => {
        console.log('');
        console.log('group_1.getChildren() :',group_1.getChildren());
    },4000);
};