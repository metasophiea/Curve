this.connectionNode_data = function(
    name='connectionNode_data',
    x, y, angle=0, width=20, height=20, 
    allowConnections=true, allowDisconnections=true,
    dimStyle={r:220/255, g:244/255, b:255/255, a:1},
    glowStyle={r:244/255, g:244/255, b:255/255, a:1},
    cable_dimStyle={r:84/255, g:146/255, b:247/255, a:1},
    cable_glowStyle={r:123/255, g:168/255, b:242/255, a:1},
    cableConnectionPosition={x:1/2,y:1/2},
    cableVersion=0,
    onreceive=function(address, data){},
    ongive=function(address){},
    onconnect=function(instigator){},
    ondisconnect=function(instigator){},
){
    //elements
        var object = interfacePart.builder('dynamic','connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'data',
            cableConnectionPosition:cableConnectionPosition, cableVersion:cableVersion,
            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
            onconnect, ondisconnect
        });

    //circuitry
        object._flash = function(){
            this.activate();
            setTimeout(function(){ object.deactivate(); },100);
        };

        object.send = function(address,data){
            object._flash();
            if(object.getForeignNode()!=undefined){ object.getForeignNode()._flash(); }

            if(object.getForeignNode()!=undefined){ try{object.getForeignNode().onreceive(address,data);}catch(error){console.log('connectionNode_data::'+name+'onreceive error:',error);} }
        };
        object.request = function(address){
            object._flash();
            if(object.getForeignNode()!=undefined){ object.getForeignNode()._flash(); }

            if(object.getForeignNode()!=undefined){ try{object.getForeignNode().ongive(address);}catch(error){console.log('connectionNode_data::'+name+'ongive error:',error);} }
        };

        object.onreceive = onreceive;
        object.ongive = ongive;

    return object;
};

interfacePart.partLibrary.dynamic.connectionNode_data = function(name,data){ 
    return interfacePart.collection.dynamic.connectionNode_data(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, data.cableConnectionPosition, data.cableVersion,
        data.onreceive, data.ongive, data.onconnect, data.ondisconnect,
    ); 
};