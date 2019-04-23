this.audio_duplicator = function(x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        markings:{r:150/255,g:150/255,b:150/255,a:1},
    };
    var design = {
        name: 'audio_duplicator',
        category:'misc',
        collection: 'alpha',
        x:x, y:y, a:a,
        space: [{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
        // spaceOutline: true,
        elements:[
            {type:'connectionNode_audio', name:'input', data:{ type:0, x:55, y:5, width:10, height:20 }},
            {type:'connectionNode_audio', name:'output_1', data:{ type:1, x:-10, y:5, width:10, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'output_2', data:{ type:1, x:-10, y:30, width:10, height:20, isAudioOutput:true }},

            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}], colour:style.background} },

            {type:'polygon', name:'upperArrow', data:{ pointsAsXYArray:[{x:10, y:11}, {x:2.5,y:16},{x:10, y:21}], colour:style.markings }},
            {type:'polygon', name:'lowerArrow', data:{ pointsAsXYArray:[{x:10, y:36},{x:2.5,y:41}, {x:10, y:46}], colour:style.markings }},
            {type:'rectangle', name:'topHorizontal', data:{ x:5, y:15, width:45, height:2, colour:style.markings }},
            {type:'rectangle', name:'vertical', data:{ x:27.5, y:15, width:2, height:25.5, colour:style.markings }},
            {type:'rectangle', name:'bottomHorizontal', data:{ x:5, y:40, width:24.5, height:2, colour:style.markings }},
        ],
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.audio_duplicator,design);

    //circuitry
        object.elements.connectionNode_audio.input.out().connect( object.elements.connectionNode_audio.output_1.in() );
        object.elements.connectionNode_audio.input.out().connect( object.elements.connectionNode_audio.output_2.in() );
         
    return object;
};

this.audio_duplicator.metadata = {
    name:'Audio Duplicator',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/audioDuplicator/'
};