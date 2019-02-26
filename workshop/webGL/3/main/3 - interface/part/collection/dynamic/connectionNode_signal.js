this.connectionNode_signal = function(
    name='connectionNode_signal',
    x, y, angle=0, width=20, height=20,
    allowConnections=true, allowDisconnections=true,
    dimStyle={r:1,g:0.86,b:0.95,a:1}, // 'rgb(255, 220, 244)',
    glowStyle={r:1,g:0.95,b:0.95,a:1}, // 'rgb(255, 244, 244)',
    cable_dimStyle={r:0.96,g:0.32,b:0.57,a:1}, // 'rgb(247, 84, 146)',
    cable_glowStyle={r:0.96,g:0.76,b:0.84,a:1}, // 'rgb(247, 195, 215)',
    onchange=function(value){},
    onconnect=function(instigator){},
    ondisconnect=function(instigator){},
){
    //elements
        var object = interfacePart.builder('connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'signal',
            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
        });

    //circuitry
        var localValue = false;

        object._getLocalValue = function(){ return localValue; };
        object._update = function(){
            var val = object.read();
            if(val){ object.activate(); }
            else{ object.deactivate(); }
            onchange(val);
        }

        object.set = function(a){
            localValue = a;

            object._update();
            if(object.getForeignNode()!=undefined){ object.getForeignNode()._update(); }
        };
        object.read = function(){ return localValue || (object.getForeignNode() != undefined ? object.getForeignNode()._getLocalValue() : false); };

        object.onconnect = function(instigator){
            if(onconnect){onconnect(instigator);}
            object._update();
        };
        object.ondisconnect = function(instigator){
            if(ondisconnect){ondisconnect(instigator);}
            object._update();
        };

    return object;
};