objects.testObject = function(x,y,debug=false){
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',

        handle: 'fill:rgba(230,230,230,1);',
        backing: 'fill:rgba(150,150,150,1);',
        slot: 'fill:rgba(50,50,50,1);',
    };

    var design = {
        type: 'testObject',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}], 
            style:style.background
        },
        elements:[
            {type:'slide',name:'slide_vertical',data:{
                x:5, y:40, width: 10, height: 120,
                style:{handle:style.handle+'cursor: row-resize;', backing:style.backing, slot:style.slot}, 
                onchange:function(data){console.log('slide_vertical onchange:',data);}, 
                onrelease:function(data){console.log('slide_vertical onrelease:',data);}
            }},
            {type:'slide',name:'slide_vertical_thin',data:{
                x:-6, y:40, width: 10, height: 120, handleHeight:0.0025, angle:0.1,
                style:{
                    handle:style.handle+'cursor: row-resize;', backing:style.backing, slot:style.slot,
                    invisibleHandle:'fill:rgba(0,0,0,0);cursor: row-resize;'
                }, 
                onchange:function(data){console.log('slide_vertical onchange:',data);}, 
                onrelease:function(data){console.log('slide_vertical onrelease:',data);}
            }},
            {type:'slide',name:'slide_horizontal',data:{
                x:15, y:40, width: 10, height: 120, angle:-Math.PI/2,
                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                onchange:function(data){console.log('slide_horizontal onchange:',data);}, 
                onrelease:function(data){console.log('slide_horizontal onrelease:',data);}
            }},
            {type:'slidePanel',name:'slidePanel',data:{
                x:20, y:45, width: 100, height: 120, count: 10, 
                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
            }},
            {type:'slidePanel',name:'slidePanel2',data:{
                x:125, y:145, width: 100, height: 120, count: 10, angle: -1,
                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
            }},
        ]
    };


    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.testObject,design);

    //setup
        setTimeout(function(){
        //     design.slide_vertical.slide_vertical.smoothSet(1,1,'s');
        //     design.slide_horizontal.slide_horizontal.smoothSet(1,1,'s');
            // console.log( design.slidePanel.slidePanel.smoothSet([0.3,0.3],1,'s') );
        },1000);

    return obj;
}


var testObject_1 = objects.testObject(50,50,true);
__globals.panes.middleground.append( testObject_1 );

__globals.utility.workspace.gotoPosition(-41.3953, -104.803, 2.24189, 0);