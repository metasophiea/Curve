var design = {
    name: 'name of unit (unique to collection)',
    collection: 'name of the collection to which this unit belongs',
    x: 0, y: 0,
    space: [{x:-5,y:-5}, {x:105,y:-5}, {x:105,y:45}, {x:245,y:45}, {x:245,y:105}, {x:-5,y:105}],
    // spaceOutline: true,
    elements:[
        {type:'rectangle', name:'rectangle0', data:{ x:0, y:0,   width:50, height:50, style:{fill:'rgba(255,0,0,1)'} }},
        {type:'rectangle', name:'rectangle1', data:{ x:50, y:0,  width:50, height:50, style:{fill:'rgba(0,255,0,1)'} }},
        {type:'rectangle', name:'rectangle2', data:{ x:50, y:50, width:50, height:50, style:{fill:'rgba(255,255,0,1)'} }, grapple:true},
        {type:'rectangle', name:'rectangle3', data:{ x:0, y:50,  width:50, height:50, style:{fill:'rgba(0,0,255,1)'} }},

        {type:'connectionNode', name:'connectionNode1', data:{ x:100, y:50 }},
        {type:'connectionNode', name:'connectionNode2', data:{ x:100, y:80 }},
        {type:'connectionNode_signal', name:'connectionNode_signal1', data:{ x:130, y:50 }},
        {type:'connectionNode_signal', name:'connectionNode_signal2', data:{ x:130, y:80 }},
        {type:'connectionNode_voltage', name:'connectionNode_voltage1', data:{ x:160, y:50 }},
        {type:'connectionNode_voltage', name:'connectionNode_voltage2', data:{ x:160, y:80 }},
        {type:'connectionNode_data', name:'connectionNode_data1', data:{ x:190, y:50 }},
        {type:'connectionNode_data', name:'connectionNode_data2', data:{ x:190, y:80 }},
        {type:'connectionNode_audio', name:'connectionNode_audio1', data:{ x:220, y:50, isAudioOutput:true }},
        {type:'connectionNode_audio', name:'connectionNode_audio2', data:{ x:220, y:80, isAudioOutput:false }},
    ],
};
var newUnit = workspace.interface.unit.test.builder(function(){console.log('make new unit!');},design);
workspace.system.pane.mm.append( newUnit );

console.log( newUnit.io );

workspace.core.render.active(true);
workspace.core.viewport.stopMouseScroll(true);