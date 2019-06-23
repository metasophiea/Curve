this.connectionNode_data = function(
    name='connectionNode_data',
    x, y, angle=0, width=20, height=20, 
    allowConnections=true, allowDisconnections=true,
    dimStyle={r:220/255, g:244/255, b:255/255, a:1},
    glowStyle={r:244/255, g:244/255, b:255/255, a:1},
    cable_dimStyle={r:84/255, g:146/255, b:247/255, a:1},
    cable_glowStyle={r:123/255, g:168/255, b:242/255, a:1},
    cableVersion=0,
    onreceivedata=function(address, data){},
    ongivedata=function(address){},
    onconnect=function(){},
    ondisconnect=function(){},
){
    //elements
        var object = interfacePart.builder('connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'data',
            cableVersion:cableVersion,
            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
            onconnect, ondisconnect
        });

    //circuitry
        function flash(obj){
            obj.activate();
            setTimeout(function(){ if(obj==undefined){return;} obj.deactivate(); },100);
            if(obj.getForeignNode()!=undefined){
                obj.getForeignNode().activate();
                setTimeout(function(){ if(obj==undefined || obj.getForeignNode() == undefined){return;} obj.getForeignNode().deactivate(); },100);
            }
        }

        object.send = function(address,data){
            flash(object);

            if(object.getForeignNode()!=undefined){ object.getForeignNode().onreceivedata(address,data); }
        };
        object.request = function(address){
            flash(object);

            if(object.getForeignNode()!=undefined){ object.getForeignNode().ongivedata(address); }
        };

        object.onreceivedata = onreceivedata;
        object.ongivedata = ongivedata;

    return object;
};