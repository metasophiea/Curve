this.testUnit_5 = function(name,x,y,angle){
    const design = {
        name: name,
        model: 'testUnit_5',
        collection: 'test',
        x:x, y:y, angle:angle,
        space: [
            {x:0,y:0}, 
            {x:100,y:0}, 
            {x:100,y:100}, 
            {x:0,y:100}, 
        ],
        // spaceOutline: true,
        elements:[
            {collection:'dynamic', type:'connectionNode', name:'test_connectionNode1', data:{ cableVersion:2, x:110, y:60, height:50, width:50, angle:Math.PI/2 }},
            {collection:'basic', type:'rectangle', name:'testRectangle1', data:{ x:0, y:0, width:100, height:100, colour:{r:100/255,g:100/255,b:100/255,a:1} }},
            {collection:'basic', type:'rectangle', name:'testRectangle2', data:{ x:10, y:10, width:90, height:90, colour:{r:130/255,g:130/255,b:130/255,a:1} }},
            {collection:'basic', type:'rectangle', name:'testRectangle3', data:{ x:20, y:20, width:80, height:80, colour:{r:160/255,g:160/255,b:160/255,a:1} }},
            {collection:'basic', type:'rectangle', name:'testRectangle4', data:{ x:30, y:30, width:70, height:70, colour:{r:190/255,g:190/255,b:190/255,a:1} }},
            {collection:'basic', type:'rectangle', name:'testRectangle5', data:{ x:0, y:0, width:50, height:50, colour:{r:220/255,g:220/255,b:220/255,a:1} }},
        ],
    };

    //main object
        const object = interface.unit.builder(design);
    
    // mouse interaction
        object.elements.rectangle.testRectangle5.attachCallback('onmousedown', () => {console.log('onmousedown');});

    return object;
};








this.testUnit_5.devUnit = true;
this.testUnit_5.metadata = {
    name:'Test Unit 5',
    helpURL:'https://curve.metasophiea.com/help/units/test/testUnit_5/'
};