this.eightTrackMixer = function(x,y,a){
    var width = 1530; var height = 810;
    var shape = [
        {x:0,y:0},
        {x:width/6,y:0},
        {x:width/6,y:height/6},
        {x:0,y:height/6},
    ];
    var colours = [
        {r:1,g:0.01,b:0.02,a:1},
        {r:1,g:0.55,b:0,a:1},
        {r:1,g:0.93,b:0,a:1},
        {r:0,g:1,b:0,a:1},
        {r:0,g:1,b:0.81,a:1},
        {r:0,g:0.62,b:1,a:1},
        {r:0.08,g:0,b:1,a:1},
        {r:0.68,g:0,b:1,a:1}, 
    ];
    var design = {
        name:'eightTrackMixer',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'output_L', data:{ 
                x:105, y:0, width:5, height:15, angle:-Math.PI/2, isAudioOutput:true, cableVersion:2,
                style:{
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                }
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'output_R', data:{ 
                x:130, y:0, width:5, height:15, angle:-Math.PI/2, isAudioOutput:true, cableVersion:2,
                style:{
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                }
            }},

            {collection:'basic', type:'image', name:'backing', 
                data:{ x: -10/6, y: -10/6, width: (width+20)/6, height: (height+20)/6, url:'prototypeUnits/beta/2/Eight%20Track%20Mixer/eightTrackMixer_backing.png' }
            },
        ]
    };
    //dynamic design
    for(var a = 0; a < 8; a++){
        design.elements.push(
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dial_panner_'+a,data:{
                x:20 +30*a, y:32.75, radius:(165/6)/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, value:0.5, resetValue:0.5,
                style:{ handle:colours[a], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} }
            }},
        );
        design.elements.push(
            {collection:'control', type:'slide_image',name:'slide_volume_'+a,data:{
                x:12.5 +30*a, y:52.5, width:15, height:75, handleHeight:0.125, value:1, resetValue:0.5,
                handleURL:'prototypeUnits/beta/2/Eight%20Track%20Mixer/eightTrackMixer_volumeSlideHandles_'+a+'.png'
            }}
        );

        design.elements.unshift(
            {collection:'dynamic', type:'connectionNode_audio', name:'input_'+a, data:{ 
                x:27.5 +30*a, y:135, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2,
                style:{
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                }
            }},
        );

        design.elements.unshift(
            {collection:'dynamic', type:'connectionNode_voltage', name:'voltageConnection_panner_'+a, data:{ 
                x:0, y:20 +12.5*a, width:5, height:10, angle:Math.PI, cableVersion:2,
                style:{
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                }
            }},
        );

        design.elements.unshift(
            {collection:'dynamic', type:'connectionNode_voltage', name:'voltageConnection_volume_'+a, data:{ 
                x:255, y:30 +12.5*a, width:5, height:10, angle:0, cableVersion:2,
                style:{
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                }
            }},
        );
    }

    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //internal circuitry
        for(var a = 0; a < 8; a++){
            object['splitter_'+a] = new _canvas_.interface.circuit.channelMultiplier(_canvas_.library.audio.context,2);
            object.elements.connectionNode_audio['input_'+a].out().connect(object['splitter_'+a].in());
            object['splitter_'+a].out(0).connect( object.elements.connectionNode_audio['output_L'].in() );
            object['splitter_'+a].out(1).connect( object.elements.connectionNode_audio['output_R'].in() );

            object.elements.slide_image['slide_volume_'+a].onchange = function(a){
                return function(value){
                    object['splitter_'+a].inGain(2*(1-value));
                }
            }(a);
            object.elements.dial_colourWithIndent_continuous['dial_panner_'+a].onchange = function(a){
                return function(value){
                    object['splitter_'+a].outGain(0,value);
                    object['splitter_'+a].outGain(1,1-value);
                }
            }(a);
        }

    //interface
        object.i = {
            gain:function(track,value){object.elements.slide_image['slide_volume_'+track].set(value);},
            pan:function(track,value){object.elements.dial_colourWithIndent_continuous['dial_panner_'+track].set(value);},
        };

    //setup
        for(var a = 0; a < 8; a++){
            object.i.gain(a,0.5);
            object.i.pan(a,0.5);
        }
    
    return object;
};

this.eightTrackMixer.metadata = {
    name:'Eight Track Mixer',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/beta/eightTrackMixer/'
};