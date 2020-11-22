// this.connectionNode_audio = function(
//     name='connectionNode_audio',
//     x, y, angle=0, width=20, height=20, allowConnections=true, allowDisconnections=true,
//     isAudioOutput=false, audioContext,
//     cableConnectionPosition={x:1/2,y:1/2},
//     cableVersion=1,
//     dimStyle={r:255/255, g:244/255, b:220/255, a:1},
//     glowStyle={r:255/255, g:244/255, b:244/255, a:1},
//     cable_dimStyle={r:247/255, g:146/255, b:84/255, a:1},
//     cable_glowStyle={r:242/255, g:168/255, b:123/255, a:1},
//     onconnect=function(instigator){},
//     ondisconnect=function(instigator){},
// ){
//     //elements
//         const object = interfacePart.builder('dynamic','connectionNode',name,{
//             x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'audio', direction:(isAudioOutput ? 'out' : 'in'),
//             cableConnectionPosition:cableConnectionPosition, cableVersion:cableVersion,
//             style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
//             onconnect, ondisconnect
//         });
//         object._direction = isAudioOutput ? 'out' : 'in';

//     //circuitry
//         object.audioNode = audioContext.createAnalyser();
//         // object.audioNode = new _canvas_.library.audio.audioWorklet.nothing(_canvas_.library.audio.context);

//         //audio connections
//             object.out = function(){return object.audioNode;};
//             object.in = function(){return object.audioNode;};

//         object._onconnect = function(instigator){
//             if(object._direction == 'out'){ object.audioNode.connect(object.getForeignNode().audioNode); }
//         };
//         object._ondisconnect = function(instigator){
//             if(object._direction == 'out'){ object.audioNode.disconnect(object.getForeignNode().audioNode); }
//         };

//     return object;
// };

// interfacePart.partLibrary.dynamic.connectionNode_audio = function(name,data){
//     return interfacePart.collection.dynamic.connectionNode_audio(
//         name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections, data.isAudioOutput, _canvas_.library.audio.context, data.cableConnectionPosition, data.cableVersion,
//         data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
//         data.onconnect, data.ondisconnect,
//     ); 
// };
















this.connectionNode_audio = function(
    name='connectionNode_audio',
    x, y, angle=0, width=20, height=20, allowConnections=true, allowDisconnections=true,
    isAudioOutput=false, audioContext,
    cableConnectionPosition={x:1/2,y:1/2},
    cableVersion=1,
    dimStyle={r:255/255, g:244/255, b:220/255, a:1},
    glowStyle={r:255/255, g:244/255, b:244/255, a:1},
    cable_dimStyle={r:247/255, g:146/255, b:84/255, a:1},
    cable_glowStyle={r:242/255, g:168/255, b:123/255, a:1},
    onconnect=function(instigator){},
    ondisconnect=function(instigator){},
){
    //elements
        const object = interfacePart.builder('dynamic','connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'audio', direction:(isAudioOutput ? 'out' : 'in'),
            cableConnectionPosition:cableConnectionPosition, cableVersion:cableVersion,
            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
            onconnect, ondisconnect
        });
        object._direction = isAudioOutput ? 'out' : 'in';

    //circuitry
        object.audioNode = undefined; //audioContext.createAnalyser();

        object._onconnect = function(instigator){
            if( object.audioNode == undefined ){
                console.warn('local audioNode missing');
                return;
            }
            if( object.getForeignNode().audioNode == undefined ){
                console.warn('foreign audioNode missing');
                return;
            }
            
            if(object._direction == 'out'){
                object.audioNode.connect(object.getForeignNode().audioNode);
            }
        };
        object._ondisconnect = function(instigator){
            if( object.audioNode == undefined ){
                console.warn('local audioNode missing');
                return;
            }
            if( object.getForeignNode().audioNode == undefined ){
                console.warn('foreign audioNode missing');
                return;
            }
            
            if( object._direction == 'out' ){
                try {
                    object.audioNode.disconnect(object.getForeignNode().audioNode);
                } catch (err) {
                    console.warn('connectionNode_audio._ondisconnect : attempted disconnect faied');
                    console.log(err);
                }
            }
        };

    return object;
};

interfacePart.partLibrary.dynamic.connectionNode_audio = function(name,data){
    return interfacePart.collection.dynamic.connectionNode_audio(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections, data.isAudioOutput, _canvas_.library.audio.context, data.cableConnectionPosition, data.cableVersion,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        data.onconnect, data.ondisconnect,
    ); 
};