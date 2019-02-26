this.connectionNode_audio = function(
    name='connectionNode_audio',
    x, y, angle=0, width=20, height=20, allowConnections=true, allowDisconnections=true,
    isAudioOutput=false, audioContext,
    dimStyle={r:255/255, g:244/255, b:220/255, a:1},
    glowStyle={r:255/255, g:244/255, b:244/255, a:1},
    cable_dimStyle={r:247/255, g:146/255, b:84/255, a:1},
    cable_glowStyle={r:242/255, g:168/255, b:123/255, a:1},
    onconnect=function(){},
    ondisconnect=function(){},
){
    //elements
        var object = interfacePart.builder('connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'audio', direction:(isAudioOutput ? 'out' : 'in'),
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