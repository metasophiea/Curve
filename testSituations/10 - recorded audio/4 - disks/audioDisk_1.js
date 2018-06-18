objects.audioDisk1 = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(100,100,100,1)',
    };
    var design = {
        type: 'testObject_recorder',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:50,y:0},{x:50,y:50},{x:0,y:50}], 
            style:style.background
        },
        elements:[
            {type:'circle', name:'circle', data: {
                x:25, y: 25, r:20, style:'fill:rgba(150,150,150,1)'
            }},
        ]
    };

    //main object
    var obj = __globals.utility.experimental.objectBuilder(objects.testObject_recorder2,design);

    //circuitry
    obj.port = new parts.audio.audioDisk1();

    return obj;
};