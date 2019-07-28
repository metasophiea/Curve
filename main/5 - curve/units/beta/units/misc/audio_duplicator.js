this.audio_duplicator = function(x,y,a){
    var width = 320; var height = 320;
    var div = 6.4;
    var shape = [
        {x:0,y:0},
        {x:width/div*(0.85/5),y:0},
        {x:width/div*(4.5/5),y:height/div*(1/5)},
        {x:width/div*(4.5/5),y:height/div*(4/5)},
        {x:width/div*(0.85/5),y:height/div},
        {x:0,y:height/div},

        {x:-width/div*(0.9/10),y:height/div*(4/5)},
        {x:-width/div*(1.25/10),y:height/div*(2.5/5)},
        {x:-width/div*(0.9/10),y:height/div*(1/5)},
    ];
    var design = {
        name:'audio_duplicator',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                x:(width/div)*(4.5/5)-0.5, y:(height/div)/2 - 7.5, width:5, height:15, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow,
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                },
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'output_1', data:{ 
                x:-width/div*(0.9/10), y:(height/div)/2 - 2.5, width:5, height:15, angle:0.15+Math.PI, isAudioOutput:true, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow 
                }
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'output_2', data:{ 
                x:-width/div*(0.45/10), y:(height/div) - 7.5, width:5, height:15, angle:-0.15+Math.PI, isAudioOutput:true, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow, 
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow 
                }
            }},

            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-(width/div)*(1.25/10), y: -10/6, width: (width+20)/div, height: (height+20)/div, url:'prototypeUnits/beta/2/audio_duplicator/audio_duplicator_backing.png' }
            },
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    return object;
};



this.audio_duplicator.metadata = {
    name:'Audio Duplicator',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/beta/audio_duplicator/'
};