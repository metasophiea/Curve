this.testUnit_2 = function(x,y,a){
    var design = {
        name: 'testUnit_2',
        collection: 'test',
        x:x, y:y, a:a,
        space: [
            {x:0,y:0}, 
            {x:100,y:0}, 
            {x:100,y:100}, 
            {x:0,y:100}, 
        ],
        // spaceOutline: true,
        elements:[
            {type:'rectangle', name:'testRectangle1', data:{ x:0, y:0, width:100, height:100, style:{fill:'rgba(200,200,200,1)'} }},
            {type:'rectangle', name:'testRectangle2', data:{ x:10, y:10, width:80, height:80, style:{fill:'rgba(200,100,200,1)'} }},
        ],
    };

    //main object
        var object = interface.unit.builder(this.testUnit_2,design);
    
    return object;
};








this.testUnit_2.devUnit = true;
this.testUnit_2.metadata = {
    name:'Test Unit 2',
    helpURL:'https://curve.metasophiea.com/help/units/test/testUnit_2/'
};