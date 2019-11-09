let t = 0;
let d = 100;
let shapes = [];

setTimeout(() => {
    console.log('');
    console.log('- get all available shapes');
    interface.getAvailableShapes(console.log);
},t+=d);
setTimeout(() => {
    console.log('');
    console.log('- get all methods for all available shapes');
    interface.getAvailableShapes(shapeTypes => {
        shapeTypes.forEach(type => {
            interface.getProxyableMethodsForShapeByShapeType(type,data => {
                console.log(type,data);
            });
        });
    });
},t+=d);

setTimeout(() => {
    console.log('');
    console.log('- create element');
    interface.createShape('element',console.log);
},t+=d);
setTimeout(() => {
    console.log('- read data');
    interface.executeShapeMethod(0,'getData',[],console.log);
},t+=d);
setTimeout(() => {
    console.log('- set data to 10');
    interface.executeShapeMethod(0,'setData',[10]);
},t+=d);
setTimeout(() => {
    console.log('- read data');
    interface.executeShapeMethod(0,'getData',[],console.log);
},t+=d);

setTimeout(() => {
    console.log('');
    console.log('- create group');
    interface.createShape('group',console.log);
},t+=d);
setTimeout(() => {
    console.log('- get children');
    interface.executeShapeMethod(1,'getChildren',[],console.log);
},t+=d);
setTimeout(() => {
    console.log('- add element to group');
    interface.executeShapeMethod(1,'addChild',[0],console.log);
},t+=d);
setTimeout(() => {
    console.log('- get children');
    interface.executeShapeMethod(1,'getChildren',[],console.log);
},t+=d);

setTimeout(() => {
    console.log('');
    console.log('- delete group');
    interface.deleteShape(1);
},t+=d);
setTimeout(() => {
    console.log('- create element');
    interface.createShape('element',console.log);
},t+=d);

setTimeout(() => {
    console.log('- getCreatedShapes');
    interface.getCreatedShapes(console.log);
},t+=d);








let proxyShape;
setTimeout(() => {
    console.log('');
    console.log('- create element as proxy shape');
    interface.createShapeWithProxy('element',ps => {console.log(ps);proxyShape = ps;});
},t+=d);
setTimeout(() => {
    console.log('- read data');
    proxyShape.getData(console.log);
},t+=d);
setTimeout(() => {
    console.log('- set data to 10');
    proxyShape.setData(10);
},t+=d);
setTimeout(() => {
    console.log('- read data');
    proxyShape.getData(console.log);
},t+=d);
let proxyGroup;
setTimeout(() => {
    console.log('- create group as proxy shape');
    interface.createShapeWithProxy('group',ps => {proxyGroup = ps;});
},t+=d);
setTimeout(() => {
    console.log('- get children');
    proxyGroup.getChildren(console.log);
},t+=d);
setTimeout(() => {
    console.log('- add child');
    proxyGroup.addChild(proxyShape);
},t+=d);
setTimeout(() => {
    console.log('- get children');
    proxyGroup.getChildren(console.log);
},t+=d);

setTimeout(() => {
    console.log('');
    console.log('- delete all shapes');
    interface.deleteAll();
},t+=d);
let proxyGroup_1;
setTimeout(() => {
    console.log('- create group as proxy shape');
    interface.createShapeWithProxy('group',ps => {proxyGroup_1 = ps;});
},t+=d);
let proxyGroup_2;
setTimeout(() => {
    console.log('- create another group as proxy shape');
    interface.createShapeWithProxy('group',ps => {proxyGroup_2 = ps;});
},t+=d);
let proxyShape_1;
let proxyShape_2;
let proxyShape_3;
setTimeout(() => {
    console.log('- create elements as proxy shapes');
    interface.createShapeWithProxy('element',ps => {proxyShape_1 = ps;});
    interface.createShapeWithProxy('element',ps => {proxyShape_2 = ps;});
    interface.createShapeWithProxy('element',ps => {proxyShape_3 = ps;});
},t+=d);
setTimeout(() => {
    console.log('- add as children in the order they were created');
    proxyGroup_1.addChild(proxyGroup_2);
    proxyGroup_2.addChild(proxyShape_1);
    proxyGroup_2.addChild(proxyShape_2);
    proxyGroup_2.addChild(proxyShape_3);
},t+=d);
setTimeout(() => {
    console.log('- get children');
    proxyGroup_2.getChildren(console.log);
},t+=d);
setTimeout(() => {
    console.log('- get children');
    proxyGroup_1.getChildren(console.log);
},t+=d);