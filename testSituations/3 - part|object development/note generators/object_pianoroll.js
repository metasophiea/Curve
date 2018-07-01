objects.pianoroll = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
    };
    var design = {
        type: 'pianoroll',
        x: x, y: y,
        base: {
            type:'path',
            points:[ 
                {x:0,y:0}, 
                {x:800,y:0}, 
                {x:800,y:150}, 
                {x:0,y:150}
            ], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_data', name:'midiout', data:{ 
                x: -5, y: 5, width: 5, height: 20,
            }},
        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.launchpad,design);

        obj.appendChild( parts.elements.control.pianoroll_3('mainroll', 10, 10, 780, 130) );

    return obj;
};