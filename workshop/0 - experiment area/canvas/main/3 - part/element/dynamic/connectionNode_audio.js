this.connectionNode_audio = function(
    name='connectionNode_audio',
    x, y, angle=0, width=20, height=20, isAudioOutput=false, audioContext,
    dimStyle='rgba(255, 244, 220, 1)',
    glowStyle='rgba(255, 244, 244, 1)',
    cable_dimStyle='rgb(247, 146, 84)',
    cable_glowStyle='rgb(242, 168, 123)',
    onconnect=function(){},
    ondisconnect=function(){},
){
    //elements
        var object = canvas.part.builder('connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, type:'audio', direction:(isAudioOutput ? 'out' : 'in'),
            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
        });
        object._direction = isAudioOutput ? 'out' : 'in';

    //circuitry
        object.audioNode = audioContext.createAnalyser();

        //audio connections
            object.out = function(){return object.audioNode;};
            object.in = function(){return object.audioNode;};

        object.onconnect = function(instigator){
            if(object._direction == 'out'){ object.audioNode.connect(object.getForeignNode().audioNode); }
            if(onconnect){onconnect(instigator);}
        };
        object.ondisconnect = function(instigator){
            if(object._direction == 'out'){ object.audioNode.disconnect(object.getForeignNode().audioNode); }
            if(ondisconnect){ondisconnect(instigator);}
        };
    
    return object;
};