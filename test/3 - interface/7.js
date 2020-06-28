_canvas_.layers.registerFunctionForLayer("interface", function(){

    var design = {
        name: 'name of unit (unique to collection)',
        collection: 'name of the collection to which this unit belongs',
        x: 0, y: 0,
        space: [{x:-5,y:-5}, {x:105,y:-5}, {x:105,y:45}, {x:245,y:45}, {x:245,y:105}, {x:-5,y:105}],
        // spaceOutline: true,
        elements:[
            {collection:'basic', type:'rectangle', name:'rectangle0', data:{ x:0, y:0,   width:50, height:50, colour:{r:1,g:0,b:0,a:1} }},
            {collection:'basic', type:'rectangle', name:'rectangle1', data:{ x:50, y:0,  width:50, height:50, colour:{r:0,g:1,b:0,a:1} }},
            {collection:'basic', type:'rectangle', name:'rectangle2', data:{ x:50, y:50, width:50, height:50, colour:{r:1,g:1,b:0,a:1} }, grapple:true},
            {collection:'basic', type:'rectangle', name:'rectangle3', data:{ x:0, y:50,  width:50, height:50, colour:{r:0,g:0,b:1,a:1} }},

            {collection:'dynamic', type:'connectionNode', name:'connectionNode1', data:{ x:100, y:50 }},
            {collection:'dynamic', type:'connectionNode', name:'connectionNode2', data:{ x:100, y:80 }},
            {collection:'dynamic', type:'connectionNode_signal', name:'connectionNode_signal1', data:{ x:130, y:50 }},
            {collection:'dynamic', type:'connectionNode_signal', name:'connectionNode_signal2', data:{ x:130, y:80 }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'connectionNode_voltage1', data:{ x:160, y:50 }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'connectionNode_voltage2', data:{ x:160, y:80 }},
            {collection:'dynamic', type:'connectionNode_data', name:'connectionNode_data1', data:{ x:190, y:50 }},
            {collection:'dynamic', type:'connectionNode_data', name:'connectionNode_data2', data:{ x:190, y:80 }},
            {collection:'dynamic', type:'connectionNode_audio', name:'connectionNode_audio1', data:{ x:220, y:50, isAudioOutput:true }},
            {collection:'dynamic', type:'connectionNode_audio', name:'connectionNode_audio2', data:{ x:220, y:80, isAudioOutput:false }},
        ],
    };
    var newUnit = _canvas_.interface.unit.builder(design);
    _canvas_.system.pane.mm.append( newUnit );

    console.log( newUnit.io );

    _canvas_.core.render.active(true);
    _canvas_.core.viewport.stopMouseScroll(true);

});