var group_1;
var rectangle_1;

_canvas_.core.meta.go = function(){
    _canvas_.core.element.create('rectangle','rectangle_1').then(rectangle => {
        rectangle_1 = rectangle;
    });
    _canvas_.core.element.create('group','group_1').then(group => {
        group_1 = group;
        _canvas_.core.arrangement.append(group);
    });

    setTimeout(() => {
        console.log( '-> printouts' );
        group_1.ignored().then(result => {console.log('group_1.ignored() :',result);});
        group_1.x().then(result => {console.log('group_1.x() :',result);});
        group_1.y().then(result => {console.log('group_1.y() :',result);});
        group_1.angle().then(result => {console.log('group_1.angle() :',result);});
        group_1.scale().then(result => {console.log('group_1.scale() :',result);});
        group_1.static().then(result => {console.log('group_1.static() :',result);});
        group_1.children().then(result => {console.log('group_1.children() :',result);});
        group_1.stencil().then(result => {console.log('group_1.stencil() :',result);});
        group_1.clipActive().then(result => {console.log('group_1.clipActive() :',result);});
        group_1.unifiedAttribute().then(result => {console.log('group_1.unifiedAttribute() :',result);});
    },500);

    setTimeout(() => {
        console.log('');
        console.log( '-> append rectangle_1' );
        group_1.append(rectangle_1);
    },1000);

    setTimeout(() => {
        console.log('');
        group_1.children().then(result => {console.log('group_1.children() :',result);});
    },1500);

    setTimeout(() => {
        console.log('');
        console.log( '-> append rectangle_1 (again)' );
        group_1.append(rectangle_1);
    },2000);

    setTimeout(() => {
        console.log('');
        group_1.children().then(result => {console.log('group_1.children() :',result);});
    },2500);

    setTimeout(() => {
        console.log('');
        group_1.contains(rectangle_1).then(result => {console.log('group_1.contains() :',result);});
    },3000);

    setTimeout(() => {
        console.log('');
        console.log( '-> remove rectangle_1' );
        group_1.remove(rectangle_1);
    },3400);

    setTimeout(() => {
        console.log('');
        group_1.children().then(result => {console.log('group_1.children() :',result);});
    },4000);
};