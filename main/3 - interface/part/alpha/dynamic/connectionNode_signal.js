this.connectionNode_signal = function(
    name='connectionNode_signal',
    x, y, angle=0, width=20, height=20,
    dimStyle='rgb(255, 220, 244)',
    glowStyle='rgb(255, 244, 244)',
    cable_dimStyle='rgb(247, 84, 146)',
    cable_glowStyle='rgb(247, 195, 215)',
    onchange=function(value){},
    onconnect=function(instigator){},
    ondisconnect=function(instigator){},
){
    //elements
        var object = interfacePart.builder('connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, type:'signal',
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