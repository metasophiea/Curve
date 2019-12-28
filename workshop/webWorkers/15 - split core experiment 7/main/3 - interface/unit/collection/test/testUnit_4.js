this.testUnit_4 = function(name,x,y,angle){
    var shape = [
        {x:0,y:0},
        {x:400,y:200},
        {x:400,y:400},
        {x:0,y:400}
    ];
    var design = {
        name: name,
        model: 'testUnit_4',
        collection: 'test',
        x:x, y:y, angle:angle,
        space:shape,
        spaceOutline: true,
        elements:[
            {collection:'basic', type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:{r:200/255,g:200/255,b:200/255,a:0.1} } },
        ],
    };

    //main object
        var object = interface.unit.builder(design);
    
    return object;
};








this.testUnit_4.devUnit = true;
this.testUnit_4.metadata = {
    name:'Test Unit 4',
    helpURL:'https://curve.metasophiea.com/help/units/test/testUnit_4/'
};