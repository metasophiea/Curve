this.connectionNode_voltage = function(
    name='connectionNode_voltage',
    x, y, angle=0, width=20, height=20,
    allowConnections=true, allowDisconnections=true,
    dimStyle={r:0.86,g:1,b:0.86,a:1},
    glowStyle={r:0.94,g:0.98,b:0.93,a:1},
    cable_dimStyle={r:0.32,g:0.96,b:0.43,a:1},
    cable_glowStyle={r:0.62,g:0.98,b:0.68,a:1},
    cableVersion=0,
    onchange=function(value){},
    onconnect=function(instigator){},
    ondisconnect=function(instigator){},
){
    //elements
        var object = interfacePart.builder('dynamic','connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'voltage',
            cableVersion:cableVersion,
            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
        });

    //circuitry
        var localValue = 0;

        object._getLocalValue = function(){ return localValue; };
        object._update = function(a){
            if(a>0){ object.activate(); }
            else{ object.deactivate(); }
            onchange(a);
        }

        object.set = function(a){
            localValue = a;

            var val = object.read();
            object._update(val);
            if(object.getForeignNode()!=undefined){ object.getForeignNode()._update(val); }
        };
        object.read = function(){ return localValue + (object.getForeignNode() != undefined ? object.getForeignNode()._getLocalValue() : false); };

        object.onconnect = function(instigator){
            if(onconnect){onconnect(instigator);}
            object._update(object.read());
        };
        object.ondisconnect = function(instigator){
            if(ondisconnect){ondisconnect(instigator);}
            object._update(localValue);
        };

    return object;
};

interfacePart.partLibrary.dynamic.connectionNode_voltage = function(name,data){ 
    return interfacePart.collection.dynamic.connectionNode_voltage(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, data.cableVersion,
        data.onchange, data.onconnect, data.ondisconnect,
    ); 
};