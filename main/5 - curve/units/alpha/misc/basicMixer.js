this.basicMixer = function(x,y,a){
    var connectionCount = 8;
    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        markings: {fill:'rgba(150,150,150,1)'},
        h1: {fill:'rgba(0,0,0,1)', font:'8pt Courier New'},
        h2: {fill:'rgb(150,150,150)', font:'5pt Courier New'},

        dial:{
            handle: {fill:'rgba(220,220,220,1)'},
            slot: {fill:'rgba(50,50,50,1)'},
            needle: {fill:'rgba(250,150,150,1)'},
        }
    };
    var design = {
        name:'basicMixer',
        category: 'misc',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:100,y:0},{x:100,y:207.5},{x:0,y:207.5}],
        // spaceOutline: true,
        elements:[
            {type:'connectionNode_audio', name:'output_0', data:{ x:-10, y:5, width:20, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'output_1', data:{ x:-10, y:30, width:20, height:20, isAudioOutput:true }},

            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:100,y:0},{x:100,y:207.5},{x:0,y:207.5}], style:style.background }},

            {type:'text', name:'gain', data:{ x:77.5, y:8, text:'gain', style:style.h2 } }, 
            {type:'text', name:'pan', data:{  x:54,   y:8, text:'pan', style:style.h2 } }, 
            
            {type:'rectangle', name:'vertical', data:{ x:22.5, y:6, width:2, height:190, style:style.markings }},
            {type:'rectangle', name:'overTheTop', data:{ x:10, y:6, width:14, height:2, style:style.markings }},
            {type:'rectangle', name:'down', data:{ x:10, y:6, width:2, height:35, style:style.markings }},
            {type:'rectangle', name:'inTo0', data:{ x:2, y:14, width:10, height:2, style:style.markings }},
            {type:'rectangle', name:'inTo1', data:{ x:2, y:39, width:10, height:2, style:style.markings }},
        ],
    };

    //dynamic design
    for(var a = 0; a < connectionCount; a++){
        design.elements.unshift(
            {type:'connectionNode_audio', name:'input_'+a, data:{ 
                x:90, y:10+(a*25), width:20, height:20 
            }},
        );

        design.elements.push(
            {type:'rectangle', name:'line_'+a, data:{
                x:23, y:19.1+a*25, width:75, height:2, 
                style:style.markings,
            }}
        );

        design.elements.push(
            {type:'dial_continuous',name:'gain_'+a,data:{
                x:85, y:20+a*25, r:8, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }}
        );
        design.elements.push(
            {type:'dial_continuous',name:'pan_'+a,data:{
                x:60, y:20+a*25, r:8, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }}
        );
    }

    //main object
        var object = workspace.interface.unit.builder(this.basicMixer,design);

    

    //internal circuitry
        for(var a = 0; a < connectionCount; a++){
            object['splitter_'+a] = new workspace.interface.circuit.channelMultiplier(workspace.library.audio.context,2);
            object.elements.connectionNode_audio['input_'+a].out().connect(object['splitter_'+a].in());
            object['splitter_'+a].out(0).connect( object.elements.connectionNode_audio['output_0'].in() );
            object['splitter_'+a].out(1).connect( object.elements.connectionNode_audio['output_1'].in() );

            object.elements.dial_continuous['gain_'+a].onchange = function(a){
                return function(value){
                    object['splitter_'+a].inGain(value);
                }
            }(a);
            object.elements.dial_continuous['gain_'+a].onchange = function(a){
                return function(value){
                    object['splitter_'+a].outGain(0,value);
                    object['splitter_'+a].outGain(1,1-value);
                }
            }(a);
        }

    //interface
        object.i = {
            gain:function(track,value){object.elements.dial_continuous['gain_'+track].set(value);},
            pan:function(track,value){object.elements.dial_continuous['pan_'+track].set(value);},
        };

    //setup
        for(var a = 0; a < connectionCount; a++){
            object.i.gain(a,0.5);
            object.i.pan(a,0.5);
        }
    
    return object;
};

this.basicMixer.metadata = {
    name:'Basic Audio Mixer',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/basicAudioMixer/'
};