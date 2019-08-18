this.connectionNode_signal = function(
    name='connectionNode_signal',
    x, y, angle=0, width=20, height=20,
    allowConnections=true, allowDisconnections=true,
    dimStyle={r:1,g:0.86,b:0.95,a:1},
    glowStyle={r:1,g:0.95,b:0.95,a:1},
    cable_dimStyle={r:0.96,g:0.32,b:0.57,a:1},
    cable_glowStyle={r:0.96,g:0.76,b:0.84,a:1},
    cableVersion=0,
    onchange=function(value){},
    onconnect=function(instigator){},
    ondisconnect=function(instigator){},
){
    //elements
        var object = interfacePart.builder('dynamic','connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'signal',
            cableVersion:cableVersion,
            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
            onconnect, ondisconnect
        });

    //circuitry
        var localValue = false;

        object._getLocalValue = function(){ return localValue; };
        object._update = function(){
            var val = object.read();
            if(val){ object.activate(); }
            else{ object.deactivate(); }
            object.onchange(val);
        }

        object.set = function(a){
            if(typeof a != 'boolean'){return;}

            localValue = a;

            object._update();
            if(object.getForeignNode()!=undefined){ object.getForeignNode()._update(); }
        };
        object.read = function(){ return localValue || (object.getForeignNode() != undefined ? object.getForeignNode()._getLocalValue() : false); };

        object._onconnect = function(instigator){
            if(object.getForeignNode()._getLocalValue()){object.activate();}
            object.onchange(object.getForeignNode()._getLocalValue());
        };
        object._ondisconnect = function(instigator){
            if(!localValue){object.deactivate();}
            object.onchange(localValue);
        };

    //callbacks
        object.onchange = onchange;

    return object;
};

interfacePart.partLibrary.dynamic.connectionNode_signal = function(name,data){ 
    return interfacePart.collection.dynamic.connectionNode_signal(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, data.cableVersion,
        data.onchange, data.onconnect, data.ondisconnect,
    ); 
};