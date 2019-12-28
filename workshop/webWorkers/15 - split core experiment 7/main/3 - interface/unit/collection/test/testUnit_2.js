this.testUnit_2 = function(name,x,y,angle){
    var design = {
        name: name,
        model: 'testUnit_2',
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
            {collection:'basic', type:'rectangle', name:'testRectangle1', data:{ x:0, y:0, width:100, height:100, colour:{r:200/255,g:200/255,b:200/255,a:1} }},
            {collection:'basic', type:'rectangle', name:'testRectangle2', data:{ x:10, y:10, width:80, height:80, colour:{r:200/255,g:100/255,b:200/255,a:1} }},
        ],
    };

    //main object
        var object = interface.unit.builder(design);
    
    return object;
};








this.testUnit_2.devUnit = true;
this.testUnit_2.metadata = {
    name:'Test Unit 2',
    helpURL:'https://curve.metasophiea.com/help/units/test/testUnit_2/'
};