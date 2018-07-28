objects.simpleObject = function(x,y,debug=false){
    var style = {
        background: 'fill:rgba(255,100,255,0.75); stroke:none;'
    };
    var design = {
        type: 'simpleObject',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:50,y:0},{x:50,y:50},{x:0,y:50}], 
            style:style.background
        },
        elements:[]
    };

    //main object
        var obj = __globals.utility.misc.objectBuilder(objects.testObject,design);

    return obj;
}