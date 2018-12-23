this.connectionNode_data = function(
    name='connectionNode_data',
    x, y, angle=0, width=20, height=20,
    dimStyle='rgba(220, 244, 255,1)',
    glowStyle='rgba(244, 244, 255, 1)',
    cable_dimStyle='rgb(84, 146, 247)',
    cable_glowStyle='rgb(123, 168, 242)',
    onreceivedata=function(address, data){},
    ongivedata=function(address){},
    onconnect=function(){},
    ondisconnect=function(){},
){
    //elements
        var object = canvas.part.builder('connectionNode',name,{
            x:x, y:y, angle:angle, width:width, height:height, type:'data',
            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
            onconnect, ondisconnect
        });

    //circuitry
        function flash(obj){
            obj.activate();
            setTimeout(function(){ if(obj==undefined){return;} obj.deactivate(); },100);
            if(obj.getForeignNode()!=undefined){
                obj.getForeignNode().activate();
                setTimeout(function(){ if(obj==undefined){return;} obj.getForeignNode().deactivate(); },100);
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