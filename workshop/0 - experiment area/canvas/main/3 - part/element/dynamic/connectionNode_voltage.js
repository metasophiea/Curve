this.connectionNode_voltage = function(
    name='connectionNode_voltage',
    x, y, angle=0, width=20, height=20,
    dimStyle='rgb(222, 255, 220)',
    glowStyle='rgb(240, 252, 239)',
    cable_dimStyle='rgb(84, 247, 111)',
    cable_glowStyle='rgb(159, 252, 174)',
    onchange=function(value){},
    onconnect=function(instigator){},
    ondisconnect=function(instigator){},
){
    //elements
        var object = canvas.part.builder('connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, type:'voltage',
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